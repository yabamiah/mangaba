import { Clock3, Home, Library, Moon, Search, Settings } from "lucide-react";
import { Button } from "@pequiplan/ui";
import { useTranslation } from "react-i18next";
import type { Page, RouteState } from "../app/navigation";
import logoUrl from "../../manga-icon.png";

const navItems: Array<{ page: Page; labelKey: string; icon: React.ComponentType<{ className?: string }> }> = [
  { page: "home", labelKey: "nav.home", icon: Home },
  { page: "library", labelKey: "nav.library", icon: Library },
  { page: "search", labelKey: "nav.search", icon: Search },
  { page: "history", labelKey: "nav.history", icon: Clock3 },
  { page: "settings", labelKey: "nav.settings", icon: Settings },
];

interface AppShellProps {
  route: RouteState;
  mangaTitle?: string;
  onNavigate: (route: RouteState) => void;
  children: React.ReactNode;
}

export function AppShell({ route, onNavigate, children }: AppShellProps) {
  const activePage = route.page === "manga" || route.page === "reader" ? "library" : route.page;
  const { t } = useTranslation();

  return (
    <div className="mangaba-shell min-h-screen paper-grid-hobonichi">
      <div className={`mangaba-app-frame ${route.page === "reader" ? "is-reader" : ""}`}>
        <aside className="mangaba-sidebar">
          <button className="mangaba-brand focus-ring" onClick={() => onNavigate({ page: "home" })} type="button">
            <span className="mangaba-brand-mark">
              <img alt="Mangaba" src={logoUrl} />
            </span>
            <span className="min-w-0">
              <span className="mangaba-brand-title">{t("common.app_name")}</span>
              <span className="mangaba-brand-subtitle">{t("common.brand_subtitle")}</span>
            </span>
          </button>
          <nav aria-label="Navegação principal" className="mangaba-sidebar-nav">
            {navItems.map(({ page, labelKey, icon: Icon }) => (
              <Button
                aria-current={activePage === page ? "page" : undefined}
                className={activePage === page ? "is-active" : ""}
                key={page}
                onClick={() => onNavigate({ page })}
                variant="section-stamp"
                icon={<Icon className="h-5 w-5" />}
              >
                {t(labelKey)}
              </Button>
            ))}
          </nav>
          <div className="mangaba-sidebar-spacer" />
          <Button
            onClick={() => document.documentElement.classList.toggle("dark")}
            variant="section-stamp"
            icon={<Moon className="h-5 w-5" />}
          >
            {t("common.theme")}
          </Button>
        </aside>

        <main className="mangaba-main-shell">
          {children}
        </main>
      </div>
    </div>
  );
}
