import { Button } from "@pequiplan/ui";
import { ArrowLeft, Bell, BellRing, BookOpen, CheckCheck, Heart, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChapterList } from "../components/ChapterList";
import { EmptyState } from "../components/EmptyState";
import { MangaCover } from "../components/MangaCover";
import { SkeletonDetail, SkeletonChapterList } from "../components/Skeleton";
import { useToast } from "../components/Toast";
import { api } from "../lib/api";
import type { Chapter, Manga } from "../lib/bindings";

interface MangaPageProps {
  mangaId: string;
  onBack: () => void;
  onOpenReader: (chapterId: string) => void;
  onTitleLoaded?: (title: string) => void;
}

export function MangaPage({ mangaId, onBack, onOpenReader, onTitleLoaded }: MangaPageProps) {
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [preferredLanguage, setPreferredLanguage] = useState("pt-br");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  async function load(sync = false) {
    setLoading(true);
    setError(null);
    try {
      if (sync) await api.syncMangaChapters(mangaId);
      const settings = await api.getSettings().catch(() => ({ default_language: "pt-br" }));
      setPreferredLanguage(settings.default_language);
      const [nextManga, loadedChapters] = await Promise.all([api.getManga(mangaId), api.getChapters(mangaId, settings.default_language)]);
      let nextChapters = loadedChapters;

      if (!sync && nextChapters.length === 0) {
        await api.syncMangaChapters(mangaId);
        nextChapters = await api.getChapters(mangaId, settings.default_language);
      }

      setManga(nextManga);
      setChapters(nextChapters);
      if (nextManga.followed) {
        const followedManga = await api.getFollowedManga(mangaId).catch(() => null);
        setNotifyEnabled(followedManga?.notify_enabled ?? false);
      } else {
        setNotifyEnabled(false);
      }
      if (nextManga.title) onTitleLoaded?.(nextManga.title);
      if (sync) toast(t("manga.chapters_synced"), "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [mangaId]);

  async function markRead(chapterId: string) {
    await api.markChapterRead(chapterId);
    setChapters((items) => items.map((item) => (item.id === chapterId ? { ...item, read: true } : item)));
  }

  async function markUnread(chapterId: string) {
    await api.markChapterUnread(chapterId);
    setChapters((items) => items.map((item) => (item.id === chapterId ? { ...item, read: false } : item)));
  }

  async function markAllRead() {
    setLoading(true);
    try {
      const unreadIds = chapters.filter((c) => !c.read).map((c) => c.id);
      await Promise.all(unreadIds.map((id) => api.markChapterRead(id)));
      setChapters((items) => items.map((item) => ({ ...item, read: true })));
    } finally {
      setLoading(false);
    }
  }

  async function follow() {
    try {
      if (manga?.followed) {
        await api.unfollowManga(mangaId);
        setManga(m => m ? { ...m, followed: false } : null);
        setNotifyEnabled(false);
        toast(t("manga.unfollow_success"), "success");
      } else {
        await api.followManga(mangaId, preferredLanguage);
        setManga(m => m ? { ...m, followed: true } : null);
        setNotifyEnabled(true);
        toast(t("manga.follow_success"), "success");
      }
    } catch {
      toast(t("manga.follow_error"), "error");
    }
  }

  async function openChapter(chapter: Chapter) {
    if (chapter.external_url) {
      window.open(chapter.external_url, "_blank", "noopener,noreferrer");
      return;
    }
    onOpenReader(chapter.id);
  }

  async function toggleNotify() {
    const nextValue = !notifyEnabled;
    try {
      if (!manga?.followed && nextValue) {
        await api.followManga(mangaId, preferredLanguage);
        setManga((m) => (m ? { ...m, followed: true } : null));
      }
      await api.setMangaNotifications(mangaId, nextValue);
      setNotifyEnabled(nextValue);
      toast(nextValue ? t("manga.notifications_on") : t("manga.notifications_off"), "success");
    } catch {
      toast(t("manga.notifications_off"), "error");
    }
  }

  if (error) {
    return (
      <section className="mangaba-screen">
        <div className="mangaba-topline">
          <Button onClick={onBack} size="sm" variant="outline">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>
        </div>
        <EmptyState action={{ label: t("common.retry"), onClick: () => void load() }} description={error} title={t("manga.open_error")} variant="error" />
      </section>
    );
  }

  const unreadCount = chapters.filter((chapter) => !chapter.read).length;
  const nextUnread = chapters.find((chapter) => !chapter.read);

  return (
    <section className="mangaba-screen">
      <div className="mangaba-topline">
        <Button onClick={onBack} size="sm" variant="outline">
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
        <h1 className="mangaba-screen-title min-w-0 flex-1 truncate">{manga?.title ?? t("manga.details")}</h1>
        <div className="mangaba-toolbar-actions">
          <Button disabled={loading} onClick={() => load(true)} size="sm" variant="secondary">
            <RefreshCw className="h-4 w-4" />
            {t("manga.sync_chapters_short")}
          </Button>
          <Button onClick={follow} size="sm" variant={manga?.followed ? "default" : "outline"}>
            <Heart className="h-4 w-4" />
            {manga?.followed ? t("search.following") : t("search.follow")}
          </Button>
        </div>
      </div>

      {loading && !manga ? (
        <SkeletonDetail />
      ) : (
        <div className="mangaba-detail-hero">
          <div className="mangaba-detail-cover">
            <MangaCover src={manga?.cover_url} title={manga?.title ?? t("common.app_name")} />
          </div>
          <div className="mangaba-detail-info">
            <h2 className="mangaba-detail-title">{manga?.title ?? t("common.loading")}</h2>
            <p className="mangaba-detail-author">{manga?.author ?? t("common.unknown_author")} · MangaDex</p>
            <div className="mangaba-chip-row">
              <span className="mangaba-chip">{manga?.original_language ?? t("common.unknown")}</span>
              <span className="mangaba-chip">{manga?.status ?? t("common.loading")}</span>
              <span className="mangaba-chip">{chapters[0]?.translated_language ?? preferredLanguage}</span>
            </div>
            <div className="mangaba-detail-stats">
              <span><strong>{chapters.length}</strong><small>{t("manga.chapters")}</small></span>
              <span><strong className="text-primary">{unreadCount}</strong><small>{t("manga.unread")}</small></span>
              <span><strong>{nextUnread?.chapter ? t("chapters.chapter_short", { chapter: nextUnread.chapter }) : t("manga.up_to_date")}</strong><small>{t("manga.progress")}</small></span>
            </div>
            <div className="mangaba-toolbar-actions">
              <Button disabled={!chapters[0]} onClick={() => chapters[0] && openChapter(chapters[0])} size="sm">
                <BookOpen className="h-4 w-4" />
                {t("manga.continue")}
              </Button>
              <Button size="sm" variant={notifyEnabled ? "default" : "outline"} onClick={toggleNotify}>
                {notifyEnabled ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                {notifyEnabled ? t("manga.notifying") : t("manga.notify")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <p className="mangaba-desc-block">{manga?.description ?? t("manga.metadata_loading")}</p>

      <div className="mangaba-section-toolbar">
        <span>{t("manga.chapters_in_language", { count: chapters.length, language: preferredLanguage })}</span>
        <div className="mangaba-toolbar-actions">
          <Button disabled={loading} onClick={markAllRead} size="sm" variant="outline">
            <CheckCheck className="h-4 w-4" />
            {t("manga.mark_all")}
          </Button>
          <Button disabled={loading} onClick={() => load(true)} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4" />
            {t("manga.sort")}
          </Button>
        </div>
      </div>

      {loading && !manga ? (
        <SkeletonChapterList />
      ) : chapters.length === 0 ? (
        <EmptyState action={{ label: t("manga.sync_chapters"), onClick: () => void load(true) }} description={t("manga.sync_empty_description")} title={loading ? t("manga.loading_chapters") : t("manga.no_chapters_language", { language: preferredLanguage })} />
      ) : (
        <ChapterList chapters={chapters} onMarkRead={markRead} onMarkUnread={markUnread} onOpen={openChapter} />
      )}
    </section>
  );
}
