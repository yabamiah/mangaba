"use client";

import React, { useState } from "react";
import { cn } from "../../utils";
import styles from "./PageNavigator.module.css";

export interface PageNavigatorProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

export const PageNavigator: React.FC<PageNavigatorProps> = ({
  currentPage: controlledPage,
  totalPages = 12,
  onPageChange,
  className,
}) => {
  const [internalPage, setInternalPage] = useState(controlledPage ?? 1);
  const [showJumpModal, setShowJumpModal] = useState(false);

  const page = controlledPage ?? internalPage;
  const setPage = (p: number) => {
    setInternalPage(p);
    onPageChange?.(p);
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const jumpToPage = (p: number) => {
    setPage(p);
    setShowJumpModal(false);
  };

  return (
    <div className={cn("relative flex flex-col items-center gap-2", className)}>
      {/* Jump modal */}
      {showJumpModal && (
        <>
          <div className="absolute bottom-full mb-2 w-64 bg-[#F9F8F4] dark:bg-[#2C2C2C] rounded-xl shadow-xl border-2 border-stone-200 dark:border-stone-700 p-4 z-50 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="flex items-center justify-between mb-3 px-1 relative z-10">
              <span className="font-handwritten text-lg text-stone-600 dark:text-stone-300">
                Índice
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                Páginas
              </span>
            </div>
            <div
              className={cn(
                "grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 relative z-10",
                styles.customScrollbar
              )}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => jumpToPage(pageNum)}
                    className={cn(
                      "aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-rounded font-bold transition-all",
                      page === pageNum
                        ? "border-orange-400 bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                        : "border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-600 text-stone-500 hover:border-orange-200 hover:scale-105"
                    )}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>
          </div>
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowJumpModal(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowJumpModal(false)}
            role="button"
            tabIndex={0}
            aria-label="Fechar índice"
          />
        </>
      )}

      {/* Navigator bar */}
      <div
        className={cn(
          "bg-[#F9F8F4] dark:bg-[#1e1e1e] px-2 py-2 rounded-2xl border border-stone-200/60 dark:border-stone-700 flex items-center gap-1 transition-transform hover:-translate-y-0.5",
          styles.shadowPaperFloat
        )}
      >
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors dark:text-stone-400 dark:hover:bg-stone-800"
          aria-label="Página anterior"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => setShowJumpModal(!showJumpModal)}
          className="flex h-11 flex-col items-center justify-center rounded-xl border border-transparent px-4 transition-colors hover:border-orange-100 hover:bg-orange-50 dark:hover:border-orange-900/30 dark:hover:bg-orange-900/10 group"
        >
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold group-hover:text-orange-400 transition-colors">
            Página
          </span>
          <div className="flex items-baseline gap-1 leading-none">
            <span className="font-handwritten text-xl font-bold text-stone-700 dark:text-stone-200 group-hover:text-orange-600 transition-colors">
              {page}
            </span>
            <span className="text-[10px] text-stone-400">/ {totalPages}</span>
          </div>
        </button>
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors dark:text-stone-400 dark:hover:bg-stone-800"
          aria-label="Próxima página"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
