import { Button } from "@pequiplan/ui";
import { BookOpen, CheckCircle2, Clock3, Trash2, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../components/EmptyState";
import { MangaCover } from "../components/MangaCover";
import { SkeletonCard } from "../components/Skeleton";
import { api } from "../lib/api";
import type { HistoryEntry } from "../lib/bindings";

export function HistoryPage({ date }: { date?: string }) {
  const [allRead, setAllRead] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setError(null);
      try {
        const history = await api.getHistory();
        setAllRead(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    void loadHistory();
  }, []);

  const [activeDate, setActiveDate] = useState<string | undefined>(date);

  useEffect(() => {
    setActiveDate(date);
  }, [date]);

  const read = useMemo(() => {
    if (!activeDate) return allRead;
    return allRead.filter((item) => {
      const raw = item.accessed_at;
      if (!raw) return false;
      return new Date(raw).toISOString().slice(0, 10) === activeDate;
    });
  }, [allRead, activeDate]);

  return (
    <section className="mangaba-screen">
      <div className="mangaba-topline">
        <div>
          <h1 className="mangaba-screen-title">{t("history.title")}</h1>
          <p className="mangaba-screen-subtitle">
            {activeDate ? `Exibindo leituras de ${activeDate}` : t("history.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          {activeDate && (
            <Button size="sm" variant="outline" onClick={() => setActiveDate(undefined)}>
              <X className="h-4 w-4" />
              Limpar Filtro
            </Button>
          )}
          <Button size="sm" variant="outline">
            <Trash2 className="h-4 w-4" />
            {t("history.clear")}
          </Button>
        </div>
      </div>

      <div className="mangaba-scroll-area">
        {loading && (
          <div className="grid gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}
        {error && (
          <EmptyState
            description={error}
            title={t("history.error_title")}
            variant="error"
          />
        )}
        {!error && !loading && read.length === 0 && (
          <EmptyState
            description={t("history.empty_description")}
            icon={BookOpen}
            title={t("history.empty_title")}
          />
        )}

        {!loading && !error && read.length > 0 && (
          <div className="p-0">
            <h2 className="mangaba-section-label px-4">{t("history.recent")}</h2>
              {read.map((item) => (
                <div
                  className="mangaba-result-row px-4"
                  key={item.entry_type === "read" && item.chapter ? `c-${item.chapter.id}` : `m-${item.manga.id}-${item.accessed_at}`}
                >
                  <span className="mangaba-result-cover">
                    <MangaCover src={item.manga.cover_url} title={item.manga.title} />
                  </span>
                  <div className="mangaba-result-body">
                    <p className="mangaba-result-title">{item.manga.title}</p>
                    {item.entry_type === "read" && item.chapter ? (
                      <>
                        <p className="mangaba-result-meta flex items-center gap-1.5 mt-1">
                          <Clock3 aria-hidden="true" className="h-3 w-3 text-primary" />
                          <span>{t("history.chapter", { chapter: item.chapter.chapter })} {item.chapter.title ? `- ${item.chapter.title}` : ""}</span>
                        </p>
                        <p className="mangaba-result-meta">{item.chapter.scanlator_group ? `${item.chapter.scanlator_group} · ` : ""}{t("history.pages", { count: item.chapter.pages ?? 0 })}</p>
                      </>
                    ) : (
                      <p className="mangaba-result-meta flex items-center gap-1.5 mt-1">
                        <Clock3 aria-hidden="true" className="h-3 w-3 text-muted-foreground" />
                        <span>{t("history.accessed", "Acessado")}</span>
                      </p>
                    )}
                  </div>
                  {item.entry_type === "read" && item.chapter && (
                    <div className="text-xs font-medium text-primary flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {t("common.read")}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
