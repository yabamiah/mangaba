import { Dashboard } from "@pequiplan/ui";
import type {
  CalendarDay,
  Habit,
  LastRead,
  ReadingStats,
  SyncState,
  UnreadManga,
} from "@pequiplan/ui";
import { RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import { useToast } from "../components/Toast";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import type { Chapter, FollowedManga, Manga, SyncStatus } from "../lib/bindings";

interface DashboardPageProps {
  onOpenManga: (mangaId: string) => void;
  onSearch: (prefill?: string) => void;
  onOpenHistory: (date: string) => void;
}

interface ChapterWithManga {
  chapter: Chapter;
  manga: Manga;
}

interface DashboardData {
  calendarDays: CalendarDay[];
  lastRead?: LastRead;
  stats: ReadingStats;
  syncStatus?: SyncStatus;
  unreadMangas: UnreadManga[];
  weeklyActivity: Habit[];
  malUser?: { name: string; avatarUrl: string };
  suggestions?: Array<{ id: number | string; title: string; score?: number; coverUrl?: string; genres?: string[] }>;
  malStats?: { volumesRead: number; planToRead: number };
}

const DAY_MS = 86_400_000;
const FALLBACK_ACCENTS = [
  "bg-orange-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-red-500",
  "bg-blue-400",
  "bg-green-500",
  "bg-stone-400",
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function chapterDate(chapter: Chapter) {
  const raw = chapter.readable_at ?? chapter.publish_at;
  return raw ? new Date(raw) : undefined;
}

function buildCalendarDays(readDates: Set<string>, today = new Date()): CalendarDay[] {
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const active = readDates.has(dateKey(date));

    return {
      day: date.getDate(),
      currentMonth: date.getMonth() === month,
      isToday: dateKey(date) === dateKey(today),
      active,
      hasEvent: active,
      completionRate: active ? 100 : undefined,
      date: dateKey(date),
    };
  });
}

function computeStreak(readDates: Set<string>, today = new Date()) {
  let cursor = startOfDay(today);

  if (!readDates.has(dateKey(cursor))) {
    cursor = new Date(cursor.getTime() - DAY_MS);
  }

  let streak = 0;
  while (readDates.has(dateKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }

  return streak;
}

function buildWeeklyActivity(items: ChapterWithManga[], today = new Date()): Habit[] {
  const weekStart = startOfDay(new Date(today.getTime() - DAY_MS * 6));
  const byManga = new Map<string, { manga: Manga; days: Set<string>; latest: number }>();

  for (const item of items) {
    const date = chapterDate(item.chapter);
    if (!date || date < weekStart) continue;

    const entry = byManga.get(item.manga.id) ?? {
      manga: item.manga,
      days: new Set<string>(),
      latest: 0,
    };
    entry.days.add(dateKey(date));
    entry.latest = Math.max(entry.latest, date.getTime());
    byManga.set(item.manga.id, entry);
  }

  return [...byManga.values()]
    .sort((a, b) => b.latest - a.latest)
    .slice(0, 7)
    .map((entry, index) => ({
      name: entry.manga.title,
      important: index === 0,
      history: Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + dayIndex);
        return entry.days.has(dateKey(date));
      }),
    }));
}

async function loadDashboardData(): Promise<DashboardData> {
  const [followed, syncStatus, malAuth] = await Promise.all([
    api.listFollowedManga(),
    api.getSyncStatus().catch(() => undefined),
    api.getMalAuthStatus().catch(() => ({ connected: false })),
  ]);

  let malUser;
  let suggestions;
  let malStats;

  if (malAuth?.connected) {
    const [userRes, rankRes, listRes] = await Promise.all([
      api.getMalUser().catch(() => undefined),
      api.getMalRanking().catch(() => undefined),
      api.getMalUserMangalist().catch(() => undefined)
    ]);

    if (userRes) {
      malUser = {
        name: userRes.name,
        avatarUrl: userRes.picture,
      };
    }

    if (rankRes) {
      suggestions = rankRes.map(m => ({
        id: m.id,
        title: m.title,
        score: m.mean ?? undefined,
        coverUrl: m.main_picture?.large || m.main_picture?.medium,
        genres: m.genres?.map(g => g.name)
      }));
    }

    if (listRes) {
      malStats = {
        volumesRead: listRes.reduce((acc, curr) => acc + (curr.list_status.num_volumes_read || 0), 0),
        planToRead: listRes.filter(curr => curr.list_status.status === 'plan_to_read').length,
      };
    }
  }

  const chapterGroups = await Promise.all(
    followed.map(async (item) => {
      const chapters = await api.getChapters(item.manga.id, item.preferred_language);
      return chapters.map((chapter) => ({ chapter, manga: item.manga }));
    })
  );

  const allChapters = chapterGroups.flat();
  const readChapters = allChapters.filter((item) => item.chapter.read);
  const readDates = new Set(
    readChapters
      .map((item) => chapterDate(item.chapter))
      .filter((date): date is Date => Boolean(date))
      .map(dateKey)
  );
  const lastReadItem = [...readChapters].sort((a, b) => {
    const aDate = chapterDate(a.chapter)?.getTime() ?? 0;
    const bDate = chapterDate(b.chapter)?.getTime() ?? 0;
    return bDate - aDate;
  })[0];

  return {
    calendarDays: buildCalendarDays(readDates),
    lastRead: lastReadItem
      ? {
          mangaTitle: lastReadItem.manga.title,
          chapterNumber: lastReadItem.chapter.chapter ?? "especial",
          coverUrl: lastReadItem.manga.cover_url,
        }
      : undefined,
    stats: {
      chaptersRead: readChapters.length,
      chaptersTotal: allChapters.length,
      mangasFollowing: followed.length,
      streak: computeStreak(readDates),
    },
    syncStatus,
    unreadMangas: buildUnreadMangas(followed),
    weeklyActivity: buildWeeklyActivity(readChapters),
    malUser,
    suggestions,
    malStats,
  };
}

function buildUnreadMangas(followed: FollowedManga[]): UnreadManga[] {
  return followed
    .filter((item) => item.unread_count > 0)
    .sort((a, b) => b.unread_count - a.unread_count)
    .map((item, index) => ({
      id: item.manga.id,
      title: item.manga.title,
      unreadCount: item.unread_count,
      accentColor: FALLBACK_ACCENTS[index % FALLBACK_ACCENTS.length],
      coverUrl: item.manga.cover_url ?? undefined,
      malScore: item.manga.mal_score ?? undefined,
      malStatus: item.manga.mal_status ?? undefined,
      chapterNumbers: item.unread_chapters ?? undefined,
    }));
}

function toSyncState(status: SyncStatus | undefined, syncing: boolean): SyncState {
  if (syncing || status?.is_syncing) return { status: "syncing", lastSyncedAt: parseSyncDate(status?.last_sync) };
  if (status?.errors.length) return { status: "error", lastSyncedAt: parseSyncDate(status.last_sync) };
  return {
    status: status?.last_sync ? "done" : "idle",
    lastSyncedAt: parseSyncDate(status?.last_sync),
  };
}

function parseSyncDate(value?: string) {
  return value ? new Date(value) : undefined;
}

export function DashboardPage({ onOpenManga, onSearch, onOpenHistory }: DashboardPageProps) {
  const { data, error, loading, reload } = useAsync(loadDashboardData, []);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const syncState = useMemo(
    () => toSyncState(data?.syncStatus, syncing),
    [data?.syncStatus, syncing]
  );

  async function syncLibrary() {
    setSyncing(true);
    try {
      await api.syncAllFollowed();
      await reload();
      toast(t("dashboard.sync_success"), "success");
    } catch {
      toast(t("dashboard.sync_error"), "error");
    } finally {
      setSyncing(false);
    }
  }

  if (loading && !data) {
    return (
      <section className="mangaba-screen">
        <div className="mangaba-topline">
          <div>
            <h1 className="mangaba-screen-title">{t("dashboard.title")}</h1>
            <p className="mangaba-screen-subtitle">{t("dashboard.loading_subtitle")}</p>
          </div>
        </div>
        <div className="mangaba-scroll-area p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="mangaba-screen">
        <div className="mangaba-topline">
          <div>
            <h1 className="mangaba-screen-title">{t("dashboard.title")}</h1>
            <p className="mangaba-screen-subtitle">{t("dashboard.subtitle")}</p>
          </div>
        </div>
        <div className="mangaba-scroll-area">
          <EmptyState
            action={{ label: t("common.retry"), onClick: reload }}
            description={error}
            icon={RefreshCw}
            title={t("dashboard.error_title")}
            variant="error"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="mangaba-screen">
      <div className="mangaba-scroll-area !p-0 overflow-x-hidden">
        <Dashboard
          calendarDays={data?.calendarDays}
          lastRead={data?.lastRead}
          onMangaClick={(manga) => onOpenManga(String(manga.id))}
          onSearch={onSearch}
          onDateClick={onOpenHistory}
          onSync={syncLibrary}
          labels={{
            allCaughtUp: t("dashboard.all_caught_up"),
            btnSearch: t("dashboard.search_button"),
            calendarTitle: t("dashboard.calendar_title"),
            chapterContinue: (chapter) => t("dashboard.chapter_continue", { chapter }),
            chaptersUnit: t("dashboard.chapters"),
            daysAgo: (count) => t("dashboard.days_ago", { count }),
            fallbackQuote: {
              text: t("dashboard.subtitle"),
              author: t("common.app_name"),
            },
            hoursAgo: (count) => t("dashboard.hours_ago", { count }),
            justNow: t("dashboard.just_now"),
            mangasUnit: t("dashboard.mangas"),
            minutesAgo: (count) => t("dashboard.minutes_ago", { count }),
            neverSynced: t("dashboard.never_synced"),
            newChaptersTitle: t("dashboard.new_chapters_title"),
            noWeeklyActivity: t("dashboard.no_weekly_activity"),
            overviewTitle: t("dashboard.overview_title"),
            statChapters: t("dashboard.stat_chapters"),
            statDays: t("dashboard.stat_days"),
            statFollowing: t("dashboard.stat_following"),
            statRead: t("dashboard.stat_read"),
            statStreak: t("dashboard.stat_streak"),
            syncError: t("dashboard.sync_error_short"),
            syncFailure: t("dashboard.sync_failure"),
            syncing: t("dashboard.syncing"),
            trackerTitle: t("dashboard.tracker_title"),
            unreadCount: (count) => t("dashboard.unread_count", { count }),
            stat_mal_volumes: t("dashboard.stat_mal_volumes"),
            stat_mal_plan_to_read: t("dashboard.stat_mal_plan_to_read"),
            volumes: t("dashboard.volumes"),
          }}
          stats={data?.stats}
          syncState={syncState}
          unreadMangas={data?.unreadMangas}
          weeklyActivity={data?.weeklyActivity}
          malUser={data?.malUser}
          suggestions={data?.suggestions}
          malStats={data?.malStats}
        />
      </div>
    </section>
  );
}
