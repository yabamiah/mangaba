import React, { forwardRef } from "react";
import { cn } from "../../utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "bg-secondary relative h-4 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <div
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{
          transform: `translateX(-${100 - (100 * (value ?? 0)) / (max ?? 1)}%)`,
        }}
      />
    </div>
  )
);
Progress.displayName = "Progress";
