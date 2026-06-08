import { Button } from "@pequiplan/ui";
import { Bell, Filter, RefreshCw, Search } from "lucide-react";
import { useAsync } from "../hooks/useAsync";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { EmptyState } from "../components/EmptyState";
import { MangaCover } from "../components/MangaCover";
import { SkeletonCard } from "../components/Skeleton";
import { useToast } from "../components/Toast";

interface LibraryPageProps {
  onOpenManga: (mangaId: string) => void;
  onSearch: () => void;
}

export function LibraryPage({ onOpenManga, onSearch }: LibraryPageProps) {
  const { data, error, loading, reload } = useAsync(() => api.listFollowedManga(), []);
  const followed = data ?? [];
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "unread" | "ongoing" | "completed">("all");

  async function sync() {
    try {
      await api.syncAllFollowed();
      await reload();
      toast(t("library.sync_success"), "success");
    } catch {
      toast(t("library.sync_error"), "error");
    }
  }

  const filtered = followed.filter(item => {
    if (filterType === "unread") return item.unread_count > 0;
    if (filterType === "ongoing") return item.manga.status === "ongoing";
    if (filterType === "completed") return item.manga.status === "completed";
    return true;
  });

  return (
    <section className="mangaba-screen">
      <div className="mangaba-topline">
        <div>
          <h1 className="mangaba-screen-title">{t("library.title")}</h1>
          <p className="mangaba-screen-subtitle">{t("library.subtitle")}</p>
        </div>
        <div className="mangaba-toolbar-actions">
          <Button disabled={loading} onClick={sync} size="sm" variant="secondary">
            <RefreshCw className="h-4 w-4" />
            {t("library.sync")}
          </Button>
          <Button size="sm" variant={showFilters ? "secondary" : "outline"} onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            {t("library.filter")}
          </Button>
        </div>
      </div>

      {!loading && !error && showFilters && (
        <div className="mangaba-filter-row" aria-label="Filtros da biblioteca">
          <button type="button" className={`mangaba-chip ${filterType === "all" ? "is-active" : ""}`} onClick={() => setFilterType("all")}>
            <Filter aria-hidden="true" className="h-3.5 w-3.5" />{t("library.filters.all")}
          </button>
          <button type="button" className={`mangaba-chip ${filterType === "unread" ? "is-active" : ""}`} onClick={() => setFilterType("unread")}>{t("library.filters.unread")}</button>
          <button type="button" className={`mangaba-chip ${filterType === "ongoing" ? "is-active" : ""}`} onClick={() => setFilterType("ongoing")}>{t("library.filters.ongoing")}</button>
          <button type="button" className={`mangaba-chip ${filterType === "completed" ? "is-active" : ""}`} onClick={() => setFilterType("completed")}>{t("library.filters.completed")}</button>
          <span className="mangaba-sync-note">{t("library.showing", { count: filtered.length, unread: filtered.reduce((sum, item) => sum + item.unread_count, 0) })}</span>
        </div>
      )} 

      <div className="mangaba-scroll-area">
        {loading && (
          <div className="grid gap-3 md:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}
      {error && (
        <EmptyState
          action={{ label: t("common.retry"), onClick: reload }}
          description={error}
          title={t("library.error_title")}
          variant="error"
        />
      )}
      {!error && !loading && followed.length === 0 && (
        <EmptyState
          action={{ label: t("library.go_to_search"), onClick: onSearch }}
          description={t("library.empty_description")}
          icon={Search}
          title={t("library.empty_title")}
        />
      )}
      {!loading && !error && followed.length > 0 && (
        <>
          {filtered.length === 0 ? (
            <EmptyState description={t("library.filter_empty_description")} title={t("library.filter_empty_title")} />
          ) : (
            <div className="mangaba-library-grid">
              {filtered.map((item) => (
                <button
                  className="mangaba-manga-tile focus-ring"
                  key={item.manga.id}
                  onClick={() => onOpenManga(item.manga.id)}
                  type="button"
                >
                  <span className="mangaba-manga-tile-cover">
                    <MangaCover src={item.manga.cover_url} title={item.manga.title} />
                    {item.unread_count > 0 && <span className="mangaba-unread-dot">{item.unread_count}</span>}
                  </span>
                  <span className="mangaba-manga-tile-info">
                    <span className="mangaba-manga-tile-title">{item.manga.title}</span>
                    <span className="mangaba-manga-tile-sub">{item.preferred_language} · {t("library.unread_count", { count: item.unread_count })}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="mangaba-announcement">
            <span>{t("library.last_sync", { date: followed[0]?.last_checked_at ? new Date(followed[0].last_checked_at).toLocaleString(i18n.language) : t("library.no_sync") })}</span>
            <span className="mangaba-ann-label"><Bell aria-hidden="true" className="h-3.5 w-3.5" />{t("library.notifications_active", { count: followed.filter((item) => item.notify_enabled).length })}</span>
          </div>
        </>
      )}
      </div>
    </section>
  );
}
