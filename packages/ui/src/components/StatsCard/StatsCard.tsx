import React from 'react';
import { cn } from '../../utils';

export interface StatsCardProps {
  title: string;
  value: string | number;
  highlighted?: boolean;
  subtext?: string;
  badge?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  highlighted = false,
  subtext = '',
  badge,
  className,
}) => (
  <div
    className={cn(
      'relative p-5 rounded-2xl border transition-all duration-300 min-w-fit min-h-[100px] flex flex-col justify-between',
      highlighted
        ? 'bg-card border-primary/40 shadow-sm dark:bg-card dark:border-primary/50'
        : 'bg-card border-border/40 shadow-sm hover:bg-secondary/50 dark:bg-card dark:border-border/20 dark:hover:bg-secondary/50',
      className
    )}
  >
    {badge ? (
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[9px] font-semibold px-1.5 py-[1px] rounded-full bg-[#2E51A220] text-[#2E51A2] dark:bg-[#2E51A240] dark:text-[#a0c0ff]">
          {badge}
        </span>
        <h3 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      </div>
    ) : (
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
        {title}
      </h3>
    )}
    <div className="flex items-baseline gap-1.5 mt-auto whitespace-nowrap overflow-hidden">
      <span
        className={cn(
          'text-2xl font-serif font-semibold tracking-tight transition-colors',
          value === 0
            ? 'text-foreground/25'
            : highlighted
            ? 'text-primary'
            : 'text-foreground'
        )}
      >
        {value}
      </span>
      {subtext && (
        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium truncate">{subtext}</span>
      )}
    </div>
  </div>
);
