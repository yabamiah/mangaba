import { useEffect, useState } from "react";
import { AppShell } from "../components/AppShell";
import { DashboardPage } from "../pages/Dashboard";
import { HistoryPage } from "../pages/History";
import { LibraryPage } from "../pages/Library";
import { MangaPage } from "../pages/Manga";
import { ReaderPage } from "../pages/Reader";
import { SearchPage } from "../pages/Search";
import { SettingsPage } from "../pages/Settings";
import type { RouteState } from "./navigation";
import { ApiTokenDialog } from "../components/ApiTokenDialog";
import { api } from "../lib/api";

export function App() {
  const [route, setRoute] = useState<RouteState>({ page: "home" });
  const [mangaTitle, setMangaTitle] = useState<string | undefined>();
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  // Initial check for API token
  useEffect(() => {
    async function checkToken() {
      try {
        const settings = await api.getSettings();
        if (!settings.api_token) {
          setShowTokenDialog(true);
        }
      } catch {
        setShowTokenDialog(true);
      } finally {
        setCheckingToken(false);
      }
    }
    void checkToken();
  }, []);

  // Theme initialization: apply dark class based on saved setting + system preference
  useEffect(() => {
    async function initTheme() {
      try {
        const settings = await api.getSettings();
        applyTheme(settings.theme);
      } catch {
        // Outside Tauri or settings not available — use system preference
        applyTheme("system");
      }
    }

    function applyTheme(theme: string) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        // system
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    }

    void initTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    function handleChange() {
      // Only react if theme is set to "system"
      void api.getSettings().then((s) => {
        if (s.theme === "system") {
          document.documentElement.classList.toggle("dark", mediaQuery.matches);
        }
      }).catch(() => {
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      });
    }
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const navigate = (next: RouteState) => {
    // Clear manga title when navigating away from manga/reader
    if (next.page !== "manga" && next.page !== "reader") {
      setMangaTitle(undefined);
    }
    setRoute(next);
  };

  const openManga = (mangaId: string) => navigate({ page: "manga", mangaId });
  const openReader = (chapterId: string) =>
    setRoute((current) => ({ ...current, page: "reader", chapterId }));

  const pageKey = route.page === "manga"
    ? `manga-${route.mangaId}`
    : route.page === "reader"
      ? `reader-${route.chapterId}`
      : route.page;

  return (
    <AppShell mangaTitle={mangaTitle} onNavigate={navigate} route={route}>
      <div className="soft-enter pb-24 md:pb-0" key={pageKey}>
        {route.page === "search" && <SearchPage initialQuery={route.searchQuery} onOpenManga={openManga} />}
        {route.page === "home" && (
          <DashboardPage
            onOpenManga={openManga}
            onSearch={(query) => setRoute({ page: "search", searchQuery: query })}
            onOpenHistory={(date) => setRoute({ page: "history", historyDate: date })}
          />
        )}
        {route.page === "library" && <LibraryPage onOpenManga={openManga} onSearch={() => setRoute({ page: "search" })} />}
        {route.page === "manga" && route.mangaId && (
          <MangaPage
            mangaId={route.mangaId}
            onBack={() => navigate({ page: "search" })}
            onOpenReader={openReader}
            onTitleLoaded={setMangaTitle}
          />
        )}
        {route.page === "reader" && route.chapterId && (
          <ReaderPage
            chapterId={route.chapterId}
            mangaId={route.mangaId}
            onBack={() =>
              route.mangaId
                ? navigate({ page: "manga", mangaId: route.mangaId })
                : navigate({ page: "library" })
            }
            onOpenChapter={openReader}
          />
        )}
        {route.page === "history" && <HistoryPage date={route.historyDate} />}
        {route.page === "settings" && <SettingsPage />}
      </div>
      {!checkingToken && showTokenDialog && (
        <ApiTokenDialog onSaved={() => setShowTokenDialog(false)} />
      )}
    </AppShell>
  );
}
