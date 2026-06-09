import { Button, Progress, cn } from "@pequiplan/ui";
import { ArrowLeft, BookOpen, Check, Keyboard, Settings } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../components/EmptyState";
import { Skeleton } from "../components/Skeleton";
import { api } from "../lib/api";
import type { Chapter } from "../lib/bindings";

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

  const [layout, setLayout] = useState<"single" | "double" | "scroll">("single");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [fit, setFit] = useState<"auto" | "width" | "height">("auto");
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

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
        
        setLayout((settings.reader_layout as "single" | "double" | "scroll") || "single");
        setFit((settings.reader_fit as "auto" | "width" | "height") || "auto");
        setDirection(settings.reader_mode === "rtl" ? "rtl" : "ltr");
        
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

  const updateSetting = async (key: string, value: string) => {
    try {
      await api.updateSettings({ [key]: value });
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (layout === "scroll") return;
      const isRtl = direction === "rtl";
      
      const stepForward = () => {
        setPageIndex(i => {
           if (layout === "double") {
             if (i === 0) return 1;
             return Math.min(i + 2, pages.length - 1);
           }
           return Math.min(i + 1, pages.length - 1);
        });
      };
      
      const stepBackward = () => {
         setPageIndex(i => {
           if (layout === "double") {
             if (i <= 1) return 0;
             if (i === 2) return 0; // Se de alguma forma estiver no 2, volta pro cover
             return i - 2;
           }
           return Math.max(i - 1, 0);
         });
      };

      if (event.key === "ArrowRight") {
        isRtl ? stepBackward() : stepForward();
      } else if (event.key === "ArrowLeft") {
        isRtl ? stepForward() : stepBackward();
      } else if (event.key === "Escape") {
        onBack();
      }
    },
    [layout, direction, pages.length, onBack]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  const visiblePages = useMemo(() => {
    if (layout === "scroll") {
      return pages.map((src, i) => ({ src, actualIndex: i }));
    }
    
    if (layout === "single") {
      return [{ src: pages[pageIndex], actualIndex: pageIndex }];
    }

    if (layout === "double") {
      if (pageIndex === 0) {
        return [{ src: pages[0], actualIndex: 0 }];
      }
      
      const p = [];
      if (pageIndex < pages.length) p.push({ src: pages[pageIndex], actualIndex: pageIndex });
      if (pageIndex + 1 < pages.length) p.push({ src: pages[pageIndex + 1], actualIndex: pageIndex + 1 });
      
      if (direction === "rtl" && p.length === 2) {
        return [p[1], p[0]];
      }
      return p;
    }
    return [];
  }, [layout, direction, pageIndex, pages]);

  const nextChapter = useMemo(() => {
    const currentIndex = chapters.findIndex((chapter) => chapter.id === chapterId);
    if (currentIndex === -1) return undefined;
    return chapters.slice(currentIndex + 1).find(isChapterReadable);
  }, [chapterId, chapters]);

  // Aplicação das classes baseadas no modo de exibição solicitado
  const getContainerStyles = () => {
    if (layout === "scroll") return "w-full max-w-3xl";
    if (layout === "double") {
      return fit === "height" || fit === "auto" 
        ? "w-1/2 h-full flex items-center justify-center" 
        : "w-1/2 h-auto flex items-start justify-center";
    }
    return fit === "height" || fit === "auto" 
      ? "w-full h-full flex items-center justify-center" 
      : "w-full h-auto flex items-start justify-center";
  };

  const getImgStyles = () => {
    if (layout === "scroll") return "w-full h-auto";
    switch (fit) {
      case "auto": return "w-full h-full object-contain max-h-screen";
      case "width": return "w-full h-auto";
      case "height": return "h-screen w-auto object-contain";
      default: return "";
    }
  };

  return (
    <section className="mangaba-reader-screen flex flex-col h-screen overflow-hidden relative">
      <div className="mangaba-reader-topbar flex-shrink-0 z-50">
        <Button onClick={onBack} size="icon" variant="outline" aria-label={t("common.back")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="mangaba-reader-title flex-1 truncate text-center">{t("reader.current_chapter")}</div>
        
        <div className="relative" ref={settingsRef}>
          <Button 
            size="icon" 
            variant={showSettings ? "default" : "outline"} 
            aria-label={t("reader.settings_label")}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          {showSettings && (
             <div className="absolute right-0 top-12 w-64 bg-card border border-border/50 shadow-xl rounded-xl p-4 z-50 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Layout</span>
                   <select 
                      className="bg-secondary/50 rounded-lg p-2 text-sm border border-border/50 outline-none focus:ring-1 focus:ring-primary" 
                      value={layout} 
                      onChange={(e) => { 
                        setLayout(e.target.value as any); 
                        updateSetting("reader_layout", e.target.value); 
                      }}
                    >
                     <option value="single">{t("reader.layout_single")}</option>
                     <option value="double">{t("reader.layout_double")}</option>
                     <option value="scroll">{t("reader.mode_scroll")}</option>
                   </select>
                </div>
                
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Direção</span>
                   <select 
                      className="bg-secondary/50 rounded-lg p-2 text-sm border border-border/50 outline-none focus:ring-1 focus:ring-primary" 
                      value={direction} 
                      onChange={(e) => { 
                        setDirection(e.target.value as any); 
                        updateSetting("reader_mode", e.target.value); 
                      }}
                    >
                     <option value="ltr">{t("reader.direction_ltr")}</option>
                     <option value="rtl">{t("reader.direction_rtl")}</option>
                   </select>
                </div>
                
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ajuste de Imagem</span>
                   <select 
                      className="bg-secondary/50 rounded-lg p-2 text-sm border border-border/50 outline-none focus:ring-1 focus:ring-primary" 
                      value={fit} 
                      onChange={(e) => { 
                        setFit(e.target.value as any); 
                        updateSetting("reader_fit", e.target.value); 
                      }}
                    >
                     <option value="auto">{t("reader.fit_auto")}</option>
                     <option value="width">{t("reader.fit_width")}</option>
                     <option value="height">{t("reader.fit_height")}</option>
                   </select>
                </div>
             </div>
          )}
        </div>
      </div>

      <div className={cn(
          "mangaba-reader-body flex-1 overflow-y-auto overflow-x-hidden p-4 relative",
          layout === "double" ? "flex flex-row justify-center items-center gap-0 w-full" : "flex flex-col items-center gap-4 w-full"
      )}>
        {loading && <Skeleton className="mx-auto h-[600px] w-full max-w-3xl rounded-md" />}
        {error && <EmptyState description={error} title={t("reader.load_error")} variant="error" />}
        {!loading && !error && pages.length === 0 && <EmptyState description={t("reader.empty_description")} title={t("reader.empty_title")} />}
        
        {visiblePages.map(({ src, actualIndex }) => {
          return (
            <button
              aria-label={t("reader.page_label", { page: actualIndex + 1, total: pages.length })}
              className={cn(
                "relative group focus-ring p-1 transition-colors rounded-lg",
                getContainerStyles()
              )}
              key={`${src}-${actualIndex}`}
              onClick={() => {
                if (layout === "scroll") return;
                setPageIndex(i => {
                  if (layout === "double") {
                    if (i === 0) return 1;
                    return Math.min(i + 2, pages.length - 1);
                  }
                  return Math.min(i + 1, pages.length - 1);
                });
              }}
              type="button"
            >
              <img 
                alt={t("reader.page_alt", { page: actualIndex + 1 })} 
                loading={layout === "scroll" ? "lazy" : "eager"} 
                src={src} 
                className={getImgStyles()} 
              />
              <span className="absolute right-4 bottom-4 border border-border bg-card/80 backdrop-blur text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {actualIndex + 1}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mangaba-reader-bottombar flex-shrink-0 z-50">
        <span className="mangaba-ann-label"><Keyboard aria-hidden="true" className="h-3.5 w-3.5" />{t("reader.keyboard_hint")}</span>
        <span className="mangaba-page-counter">{pages.length ? `${pageIndex + 1} / ${pages.length}` : "0 / 0"}</span>
        <Progress max={Math.max(pages.length, 1)} value={pages.length ? pageIndex + 1 : 0} />
        <Button size="sm" variant="outline" onClick={() => api.markChapterRead(chapterId)}>
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

