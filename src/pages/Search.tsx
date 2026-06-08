import {
  Button,
  Input,
} from "@pequiplan/ui";
import { Heart, Link2, Plus, Search as SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MangaFilters, MangaResult } from "../lib/bindings";
import { api, extractMangaDexId } from "../lib/api";
import { EmptyState } from "../components/EmptyState";
import { MangaCover } from "../components/MangaCover";
import { SkeletonCard } from "../components/Skeleton";
import { useToast } from "../components/Toast";

interface SearchPageProps {
  onOpenManga: (mangaId: string) => void;
}

const defaultFilters: MangaFilters = {
  original_language: "",
  status: "any",
  content_ratings: ["safe", "suggestive"],
};

export function SearchPage({ onOpenManga }: SearchPageProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [results, setResults] = useState<MangaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState("pt-br");
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    void api.getSettings().then((settings) => setPreferredLanguage(settings.default_language)).catch(() => {});
  }, []);

  const originalLanguageOptions = [
    { value: "", label: t("search.language.all") },
    { value: "ja", label: t("search.language.ja") },
    { value: "ko", label: t("search.language.ko") },
    { value: "zh", label: t("search.language.zh") },
    { value: "en", label: t("search.language.en") },
  ];

  const translatedLanguageOptions = [
    { value: "pt-br", label: "Brazilian Portuguese" },
    { value: "en", label: "English" },
    { value: "zh", label: "Simplified Chinese" },
    { value: "zh-hk", label: "Traditional Chinese" },
    { value: "es", label: "Castilian Spanish" },
    { value: "es-la", label: "Latin American Spanish" },
    { value: "ja-ro", label: "Romanized Japanese" },
    { value: "ko-ro", label: "Romanized Korean" },
    { value: "zh-ro", label: "Romanized Chinese" },
  ];

  const statusOptions = [
    { value: "any", label: t("search.status.any") },
    { value: "ongoing", label: t("search.status.ongoing") },
    { value: "completed", label: t("search.status.completed") },
    { value: "hiatus", label: t("search.status.hiatus") },
    { value: "cancelled", label: t("search.status.cancelled") },
  ] satisfies Array<{ value: NonNullable<MangaFilters["status"]>; label: string }>;

  async function runSearch() {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const directId = extractMangaDexId(query);
      if (directId) {
        const manga = query.includes("mangadex.org") ? await api.getMangaByUrl(query) : await api.getManga(directId);
        setResults([manga]);
      } else {
        setResults(await api.searchManga(query, { ...filters, available_translated_language: preferredLanguage }, 0, 20));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function follow(mangaId: string) {
    try {
      await api.followManga(mangaId, preferredLanguage);
      setResults((items) => items.map((item) => (item.id === mangaId ? { ...item, followed: true } : item)));
      toast(t("search.follow_success"), "success");
    } catch (err) {
      toast(t("search.follow_error"), "error");
    }
  }

  return (
    <section className="mangaba-screen">
      <div className="mangaba-topline">
        <div className="mangaba-search-wrap">
          <SearchIcon aria-hidden="true" className="h-4 w-4" />
          <Input
            id="query"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void runSearch();
            }}
            placeholder={t("search.placeholder")}
            value={query}
          />
        </div>
        <Button disabled={loading} onClick={runSearch} size="sm">
          {extractMangaDexId(query) ? <Link2 className="h-4 w-4" /> : <SearchIcon className="h-4 w-4" />}
          {loading ? t("search.searching") : t("search.search")}
        </Button>
      </div>

      <div className="mangaba-filter-bar">
        <span className="mangaba-filter-label">{t("search.filters")}</span>
        <select
          className="mangaba-select"
          onChange={(event) => {
            const lang = event.target.value;
            setPreferredLanguage(lang);
            void api.updateSettings({ default_language: lang as any });
          }}
          value={preferredLanguage}
        >
          {translatedLanguageOptions.map((option) => <option key={option.value} value={option.value}>Ler em: {option.label}</option>)}
        </select>
        <select
          className="mangaba-select"
          onChange={(event) => setFilters((current) => ({ ...current, original_language: event.target.value }))}
          value={filters.original_language ?? ""}
        >
          {originalLanguageOptions.map((option) => <option key={option.value || "all"} value={option.value}>Origem: {option.label}</option>)}
        </select>
        <select
          className="mangaba-select"
          onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as MangaFilters["status"] }))}
          value={filters.status}
        >
          {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <select
          className="mangaba-select"
          onChange={(event) => setFilters((current) => ({ ...current, content_ratings: [event.target.value as MangaFilters["content_ratings"][number]] }))}
          value={filters.content_ratings[0]}
        >
          {(["safe", "suggestive", "erotica", "pornographic"] as const).map((rating) => <option key={rating} value={rating}>{t(`search.content.${rating}`)}</option>)}
        </select>
        <Button
          className="ml-auto"
          onClick={() => {
            setFilters(defaultFilters);
            setQuery("");
          }}
          size="sm"
          variant="outline"
        >
          <X className="h-4 w-4" />
          {t("common.clear")}
        </Button>
      </div>

      <div aria-live="polite" aria-relevant="additions removals" className="mangaba-scroll-area">
        {hasSearched && !loading && !error && (
          <p className="mangaba-result-count">
            {t(results.length === 1 ? "search.result_count" : "search.result_count_plural", {
              count: results.length,
              query: query || t("search.all_query"),
            })}
          </p>
        )}
        {loading && (
          <div className="grid gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}
        {error && <EmptyState description={error} title={t("search.error_title")} variant="error" />}
        {!error && !loading && hasSearched && results.length === 0 && (
          <EmptyState description={t("search.empty_description")} title={t("search.empty_title")} />
        )}
        {!error && !loading && !hasSearched && (
          <EmptyState  description={t("search.idle_description")} title={t("search.idle_title")} />
        )}
        {!loading && results.map((manga) => (
          <button className="mangaba-result-row focus-ring" key={manga.id} onClick={() => onOpenManga(manga.id)} type="button">
            <span className="mangaba-result-cover"><MangaCover src={manga.cover_url} title={manga.title} /></span>
            <span className="mangaba-result-body">
              <span className="mangaba-result-title">{manga.title}</span>
              <span className="mangaba-result-meta">
                {manga.author ?? t("common.unknown_author")} · {manga.original_language ?? t("common.unknown")}<br />
                {t("search.status_label", { status: manga.status })}
              </span>
            </span>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                void follow(manga.id);
              }}
              size="sm"
              variant={manga.followed ? "secondary" : "outline"}
            >
              {manga.followed ? <Heart className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {manga.followed ? t("search.following") : t("search.follow")}
            </Button>
          </button>
        ))}
        </div>
    </section>
  );
}
