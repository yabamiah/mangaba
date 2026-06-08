import type { ReactNode } from "react";

interface PageTransitionProps {
  pageKey: string;
  children: ReactNode;
}

export function PageTransition({ pageKey, children }: PageTransitionProps) {
  return (
    <div className="soft-enter" key={pageKey}>
      {children}
    </div>
  );
}
