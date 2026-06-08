import { Button, Progress } from "@pequiplan/ui";
import { ArrowLeft, BookOpen, Check, Keyboard, Settings } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../components/EmptyState";
import { Skeleton } from "../components/Skeleton";
import { api } from "../lib/api";
import type { Chapter, ReaderMode } from "../lib/bindings";

interface ReaderPageProps {
  chapterId: string;
  mangaId?: string;
  onBack: () => void;
  onOpenChapter: (chapterId: string) => void;
}

function isChapterReadable(chapter: Chapter) {
  if (chapter.external_url) return false;
  return chapter.readable_at ? new Date(chapter.readable_at) <= new Date() : true;
}

export function ReaderPage({ chapterId, mangaId, onBack, onOpenChapter }: ReaderPageProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [mode, setMode] = useState<ReaderMode>("scroll");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const readerModeOptions = [
    { value: "scroll", label: t("reader.mode_scroll") },
    { value: "single", label: t("reader.mode_single") },
    { value: "rtl", label: t("reader.mode_rtl") },
  ] satisfies Array<{ value: ReaderMode; label: string }>;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const settings = await api.getSettings();
        const [urls, saved, mangaChapters] = await Promise.all([
          api.getChapterPages(chapterId),
          api.getReadingProgress(chapterId),
          mangaId ? api.getChapters(mangaId, settings.default_language) : Promise.resolve([]),
        ]);
        setMode(settings.reader_mode);
        setPages(urls);
        setChapters(mangaChapters);
        setPageIndex(saved.page_index);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [chapterId, mangaId]);

  useEffect(() => {
    if (!pages.length) return;
    void api.saveReadingProgress(chapterId, pageIndex);
    if (pageIndex >= pages.length - 1) void api.markChapterRead(chapterId);

    pages.slice(pageIndex + 1, pageIndex + 4).forEach((src) => {
      if (src.startsWith("http")) {
        const image = new Image();
        image.src = src;
      }
    });
  }, [chapterId, pageIndex, pages]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (mode !== "single" && mode !== "rtl") return;
      const isRtl = mode === "rtl";
      if (event.key === "ArrowRight") {
        setPageIndex((i) => Math.min(i + (isRtl ? -1 : 1), pages.length - 1));
      } else if (event.key === "ArrowLeft") {
        setPageIndex((i) => Math.max(i + (isRtl ? 1 : -1), 0));
      } else if (event.key === "Escape") {
        onBack();
      }
    },
    [mode, pages.length, onBack]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const visiblePages = useMemo(() => {
    if (mode === "single" || mode === "rtl") return pages.slice(pageIndex, pageIndex + 1);
    return pages;
  }, [mode, pageIndex, pages]);

  const nextChapter = useMemo(() => {
    const currentIndex = chapters.findIndex((chapter) => chapter.id === chapterId);
    if (currentIndex === -1) return undefined;
    return chapters.slice(currentIndex + 1).find(isChapterReadable);
  }, [chapterId, chapters]);

  return (
    <section className="mangaba-reader-screen">
      <div className="mangaba-reader-topbar">
        <Button onClick={onBack} size="icon" variant="outline" aria-label={t("common.back")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="mangaba-reader-title">{t("reader.current_chapter")}</div>
        <div className="mangaba-mode-pills">
          {readerModeOptions.map((option) => (
            <button
              className={`mangaba-mode-pill focus-ring ${mode === option.value ? "is-active" : ""}`}
              key={option.value}
              onClick={() => setMode(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <Button size="icon" variant="outline" aria-label={t("reader.settings_label")}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="mangaba-reader-body">
        {loading && <Skeleton className="mx-auto h-[600px] w-full max-w-3xl rounded-md" />}
        {error && <EmptyState description={error} title={t("reader.load_error")} variant="error" />}
        {!loading && !error && pages.length === 0 && <EmptyState description={t("reader.empty_description")} title={t("reader.empty_title")} />}
        {visiblePages.map((src, index) => {
          const actualIndex = (mode === "single" || mode === "rtl") ? pageIndex : index;
          return (
            <button
              aria-label={t("reader.page_label", { page: actualIndex + 1, total: pages.length })}
              className="mangaba-reader-page focus-ring"
              key={`${src}-${actualIndex}`}
              onClick={() => setPageIndex(Math.min(actualIndex + 1, pages.length - 1))}
              type="button"
            >
              <img alt={t("reader.page_alt", { page: actualIndex + 1 })} loading="lazy" src={src} />
              <span>{actualIndex + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="mangaba-reader-bottombar">
        <span className="mangaba-ann-label"><Keyboard aria-hidden="true" className="h-3.5 w-3.5" />{t("reader.keyboard_hint")}</span>
        <span className="mangaba-page-counter">{pages.length ? `${pageIndex + 1} / ${pages.length}` : "0 / 0"}</span>
        <Progress max={Math.max(pages.length, 1)} value={pages.length ? pageIndex + 1 : 0} />
        <Button size="sm" variant="outline">
          <Check className="h-4 w-4" />
          {t("reader.mark_read")}
        </Button>
        <Button disabled={!nextChapter} onClick={() => nextChapter && onOpenChapter(nextChapter.id)} size="sm" variant="outline">
          <BookOpen className="h-4 w-4" />
          {t("reader.next_chapter")}
        </Button>
      </div>
    </section>
  );
}
