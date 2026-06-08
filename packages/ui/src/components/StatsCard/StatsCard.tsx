import React from 'react';
import { cn } from '../../utils';

export interface StatsCardProps {
  title: string;
  value: string | number;
  highlighted?: boolean;
  subtext?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  highlighted = false,
  subtext = '',
  className,
}) => (
  <div
    className={cn(
      'relative p-5 rounded-2xl border transition-all duration-300 min-w-fit',
      highlighted
        ? 'bg-card border-primary/40 shadow-sm dark:bg-card dark:border-primary/50'
        : 'bg-card border-border/40 shadow-sm hover:bg-secondary/50 dark:bg-card dark:border-border/20 dark:hover:bg-secondary/50',
      className
    )}
  >
    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 font-mono leading-relaxed">
      {title}
    </h3>
    <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden">
      <span
        className={cn(
          'text-2xl font-serif font-bold tracking-tight',
          highlighted ? 'text-primary' : 'text-stone-800 dark:text-stone-200'
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
