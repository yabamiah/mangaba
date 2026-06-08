import { Button } from "@pequiplan/ui";
import { Circle, CircleDot, ExternalLink, FileText, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Chapter } from "../lib/bindings";

interface ChapterListProps {
  chapters: Chapter[];
  onOpen: (chapter: Chapter) => void;
  onMarkRead: (chapterId: string) => void;
  onMarkUnread: (chapterId: string) => void;
}

export function ChapterList({ chapters, onOpen, onMarkRead, onMarkUnread }: ChapterListProps) {
  const { t } = useTranslation();
  const grouped = chapters.reduce<Record<string, Chapter[]>>((acc, chapter) => {
    const key = chapter.volume ? t("chapters.volume", { volume: chapter.volume }) : t("chapters.no_volume");
    acc[key] = [...(acc[key] ?? []), chapter];
    return acc;
  }, {});

  return (
    <div className="mangaba-chapter-list">
      {Object.entries(grouped).map(([volume, items]) => (
        <section aria-label={volume} key={volume} className="mangaba-chapter-group">
          <h3 className="mangaba-section-label">{volume}</h3>
          {items.map((chapter) => {
            const locked = chapter.readable_at ? new Date(chapter.readable_at) > new Date() : false;
            const chapterLabel = `${t("chapters.chapter", { chapter: chapter.chapter ?? "?" })}${chapter.title ? ` - ${chapter.title}` : ""}`;
            return (
              <div className={`mangaba-chapter-row ${chapter.read ? "is-read" : ""}`} key={chapter.id}>
                {chapter.read ? (
                  <Circle aria-hidden="true" className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <CircleDot aria-hidden="true" className="h-3 w-3 text-primary" />
                )}
                <button
                  className="mangaba-chapter-main focus-ring"
                  disabled={locked}
                  onClick={() => onOpen(chapter)}
                  type="button"
                >
                  <span className="mangaba-chapter-num">{t("chapters.chapter_short", { chapter: chapter.chapter ?? "?" })}</span>
                  <span className="mangaba-chapter-date">{chapter.scanlator_group ?? t("chapters.no_group")} · {t("chapters.pages", { count: chapter.pages ?? 0 })}</span>
                  <span className={`mangaba-status-pill ${chapter.read ? "is-muted" : "is-new"}`}>
                    {chapter.read ? t("common.read") : chapter.is_new ? t("common.new") : t("common.available")}
                  </span>
                </button>
                <div className="mangaba-chapter-actions">
                  <Button
                    aria-label={chapter.read ? t("chapters.mark_unread_label", { chapter: chapterLabel }) : t("chapters.mark_read_label", { chapter: chapterLabel })}
                    onClick={() => chapter.read ? onMarkUnread(chapter.id) : onMarkRead(chapter.id)}
                    size="sm"
                    variant={chapter.read ? "ghost" : "outline"}
                  >
                    {chapter.read ? t("common.unread") : t("common.read")}
                  </Button>
                  <Button
                    aria-label={locked ? t("chapters.unavailable_label", { chapter: chapterLabel }) : t("chapters.read_label", { chapter: chapterLabel })}
                    disabled={locked}
                    onClick={() => onOpen(chapter)}
                    size="sm"
                  >
                    {locked ? <Lock className="h-4 w-4" /> : chapter.external_url ? <ExternalLink className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    {locked ? t("common.unavailable") : chapter.external_url ? t("common.external") : t("common.read")}
                  </Button>
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
