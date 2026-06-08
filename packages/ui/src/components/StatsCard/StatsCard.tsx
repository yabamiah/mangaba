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
      'relative p-4 rounded-xl border transition-all duration-300',
      highlighted
        ? 'bg-card border-primary/30 shadow-sm dark:bg-card dark:border-primary/40'
        : 'bg-card border-border/60 shadow-sm hover:bg-secondary dark:bg-card dark:border-border/40 dark:hover:bg-secondary',
      className
    )}
  >
    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 font-mono">
      {title}
    </h3>
    <div className="flex items-baseline gap-2">
      <span
        className={cn(
          'text-2xl font-serif font-bold',
          highlighted ? 'text-primary' : 'text-foreground'
        )}
      >
        {value}
      </span>
      {subtext && (
        <span className="text-xs text-muted-foreground">{subtext}</span>
      )}
    </div>
  </div>
);
