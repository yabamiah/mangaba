import { ChevronRight } from "lucide-react";
import type { RouteState } from "../app/navigation";

interface BreadcrumbProps {
  route: RouteState;
  mangaTitle?: string;
  onNavigate: (route: RouteState) => void;
}

export function Breadcrumb({ route, mangaTitle, onNavigate }: BreadcrumbProps) {
  if (route.page !== "manga" && route.page !== "reader") return null;

  const crumbs: Array<{ label: string; route?: RouteState }> = [];

  crumbs.push({ label: "Busca", route: { page: "search" } });

  if (route.page === "manga" || route.page === "reader") {
    crumbs.push({
      label: mangaTitle ?? "Mangá",
      route: route.mangaId ? { page: "manga", mangaId: route.mangaId } : undefined,
    });
  }

  if (route.page === "reader") {
    crumbs.push({ label: "Leitor" });
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li className="flex items-center gap-1" key={index}>
              {index > 0 && <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />}
              {isLast || !crumb.route ? (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "font-medium text-foreground" : ""}>
                  {crumb.label}
                </span>
              ) : (
                <button
                  className="rounded-sm px-1 py-0.5 hover:bg-secondary hover:text-secondary-foreground focus-ring"
                  onClick={() => crumb.route && onNavigate(crumb.route)}
                  type="button"
                >
                  {crumb.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
