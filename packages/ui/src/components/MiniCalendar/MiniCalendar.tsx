"use client";
import React from "react";
import { cn } from "../../utils";

export interface CalendarDay {
  day: number | string;
  date?: string;
  currentMonth: boolean;
  isToday?: boolean;
  active?: boolean;
  hasEvent?: boolean;
  completionRate?: number;
}

export interface MiniCalendarProps {
  days: CalendarDay[];
  title?: string;
  className?: string;
  onDayClick?: (day: CalendarDay) => void;
}

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  days = [],
  title = "Outubro 2023",
  className,
  onDayClick,
}) => (
  <div className={cn("w-full", className)}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-semibold text-muted-foreground font-serif">
        {title}
      </h3>
      <button className="text-muted-foreground/60 hover:text-muted-foreground">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
    </div>

    <div className="grid grid-cols-7 gap-1 mb-2 text-center">
      {weekDays.map((day, i) => (
        <span
          key={i}
          className={cn(
            "text-[10px] font-mono",
            i === 0 || i === 6 ? "text-primary" : "text-muted-foreground"
          )}
        >
          {day}
        </span>
      ))}
    </div>

    <div className="grid grid-cols-7 gap-1">
      {days.map((day, idx) => (
        <button
          key={idx}
          onClick={() => day.hasEvent && onDayClick?.(day)}
          disabled={!day.hasEvent}
          className={cn(
            "aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all cursor-default relative group",
            day.hasEvent ? "cursor-pointer hover:scale-105" : "",
            day.active
              ? "bg-foreground text-background shadow-md dark:bg-foreground dark:text-background"
              : day.isToday
                ? "border-2 border-primary text-primary"
                : "text-muted-foreground hover:bg-secondary dark:hover:bg-secondary/50",
            !day.currentMonth && "opacity-30"
          )}
        >
          {day.day}
          {day.hasEvent && !day.active && (
            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
          )}
          {day.completionRate && day.completionRate > 0 && (
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-md border border-border">
              {day.completionRate}% Concluído
            </div>
          )}
        </button>
      ))}
    </div>

    {/* Legend */}
    <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-dashed border-border/60">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-[2px] bg-foreground shadow-sm" />
        <span className="text-[9px] uppercase tracking-wide text-muted-foreground font-mono">
          Trabalhado
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-[2px] border border-border bg-card flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-primary" />
        </div>
        <span className="text-[9px] uppercase tracking-wide text-muted-foreground font-mono">
          Descanso
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-[2px] border border-border bg-secondary/50" />
        <span className="text-[9px] uppercase tracking-wide text-muted-foreground/70 font-mono">
          Inativo
        </span>
      </div>
    </div>
  </div>
);
