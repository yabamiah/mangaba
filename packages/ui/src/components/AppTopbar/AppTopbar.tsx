"use client";
import React from "react";
import { cn } from "../../utils";

// Inline SVG icons replacing @solar-icons/svelte
const SidebarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 4h18v16H3V4zm2 2v12h4V6H5zm6 0v12h8V6h-8z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

const SinglePageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
  </svg>
);

const DoublePageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h9v-2H3v2zm0-5h12v-2H3v2zm0-7v2h18V6H3zm14 9.18V12l4 3.5-4 3.5v-3.32H15v-2.5h2z" />
  </svg>
);

export interface AppTopbarProps {
  sidebarOpen?: boolean;
  activeContext?: "cover" | "home" | "page";
  viewMode?: "single" | "double";
  plannerTitle?: string;
  pageTitle?: string;
  onToggleSidebar?: () => void;
  onSelectHome?: () => void;
  onViewModeChange?: (mode: "single" | "double") => void;
  className?: string;
}

export const AppTopbar: React.FC<AppTopbarProps> = ({
  sidebarOpen = true,
  activeContext = "home",
  viewMode = "double",
  plannerTitle = "",
  pageTitle = "",
  onToggleSidebar,
  onSelectHome,
  onViewModeChange,
  className,
}) => (
  <header
    className={cn(
      "h-16 border-b border-border/60 glass z-10 flex items-center justify-between px-6 shrink-0",
      className
    )}
  >
    <div className="flex items-center gap-4 overflow-hidden">
      {!sidebarOpen && (
        <button
          onClick={onToggleSidebar}
          className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
          aria-label="Abrir sidebar"
          title="Abrir sidebar"
        >
          <SidebarIcon />
        </button>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground whitespace-nowrap overflow-hidden">
        <button
          className="hover:underline cursor-pointer hover:text-foreground transition-colors font-medium"
          onClick={onSelectHome}
        >
          {plannerTitle}
        </button>
        {activeContext === "page" && (
          <>
            <span className="mx-2 text-border">
              <ChevronRightIcon />
            </span>
            <span className="font-semibold text-foreground">{pageTitle}</span>
          </>
        )}
      </nav>
    </div>

    <div className="flex items-center gap-4">
      {activeContext === "page" && (
        <div
          className="flex items-center bg-secondary/50 p-1 rounded-2xl border-2 border-border/50"
          role="tablist"
          aria-label="Modo de visualização"
        >
          <button
            onClick={() => onViewModeChange?.("single")}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
              viewMode === "single"
                ? "bg-card shadow-paper-sm text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
            role="tab"
            aria-selected={viewMode === "single"}
            aria-label="Página simples"
            title="Página simples"
          >
            <SinglePageIcon />
          </button>
          <button
            onClick={() => onViewModeChange?.("double")}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
              viewMode === "double"
                ? "bg-card shadow-paper-sm text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
            role="tab"
            aria-selected={viewMode === "double"}
            aria-label="Página dupla"
            title="Página dupla"
          >
            <DoublePageIcon />
          </button>
        </div>
      )}
    </div>
  </header>
);
