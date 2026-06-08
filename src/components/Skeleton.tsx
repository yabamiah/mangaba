import { cn } from "@pequiplan/ui";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn("skeleton h-4 w-full", className)} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          className={cn("skeleton h-3.5", i === lines - 1 ? "w-3/4" : "w-full")}
          key={i}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cn("card-paper overflow-hidden p-0", className)}>
      <div className="grid gap-4 p-3 sm:grid-cols-[92px_1fr_auto] sm:items-center">
        <div className="skeleton h-32 rounded-md sm:h-32" />
        <div className="min-w-0 space-y-3">
          <div className="skeleton h-5 w-2/3" />
          <div className="space-y-2">
            <div className="skeleton h-3.5 w-full" />
            <div className="skeleton h-3.5 w-4/5" />
          </div>
          <div className="skeleton h-3 w-1/2" />
        </div>
        <div className="flex gap-2 sm:flex-col">
          <div className="skeleton h-8 w-28" />
          <div className="skeleton h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCover({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn("skeleton h-full w-full rounded-md", className)} />;
}

export function SkeletonDetail({ className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cn("card-paper overflow-hidden p-0", className)}>
      <div className="grid gap-5 p-4 md:grid-cols-[180px_1fr]">
        <div className="skeleton h-64 rounded-md" />
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="skeleton h-6 w-20 rounded-sm" />
              <div className="skeleton h-6 w-12 rounded-sm" />
            </div>
            <div className="skeleton h-9 w-3/4" />
            <div className="skeleton h-4 w-1/3" />
            <div className="space-y-2 pt-2">
              <div className="skeleton h-3.5 w-full" />
              <div className="skeleton h-3.5 w-full" />
              <div className="skeleton h-3.5 w-2/3" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-9 w-32" />
            <div className="skeleton h-9 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonChapterList({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("space-y-5", className)}>
      <div className="skeleton mb-2 h-4 w-24" />
      <div className="card-paper overflow-hidden p-0">
        <div className="divide-y divide-border p-0">
          {Array.from({ length: count }).map((_, i) => (
            <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center" key={i}>
              <div className="space-y-2">
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
              <div className="flex gap-2">
                <div className="skeleton h-8 w-16" />
                <div className="skeleton h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
