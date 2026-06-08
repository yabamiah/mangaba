"use client";
import React from 'react';
import { cn } from '../../utils';

export interface Habit {
  name: string;
  important: boolean;
  history: boolean[];
}

export interface HandDrawnTrackerProps {
  habits: Habit[];
  weekLabel?: string;
  className?: string;
}

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const HandDrawnTracker: React.FC<HandDrawnTrackerProps> = ({
  habits = [],
  weekLabel = 'Week 42',
  className,
}) => (
  <div className={cn('w-full font-mono text-sm bg-secondary/30 dark:bg-secondary/20 p-4 rounded-lg border-2 border-dashed border-border relative overflow-hidden', className)}>
    {/* Tape decoration */}
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-100/50 dark:bg-yellow-900/30 rotate-1 border border-yellow-200/50 dark:border-yellow-700/30 shadow-sm backdrop-blur-[1px]" />

    <div className="flex justify-between items-end mb-4 border-b-2 border-foreground dark:border-foreground/80 pb-1">
      <span className="font-bold uppercase tracking-widest text-muted-foreground text-xs">Rastreador Semanal</span>
      <span className="text-[10px] text-muted-foreground/70">{weekLabel}</span>
    </div>

    {/* Table header */}
    <div className="grid grid-cols-[1fr_repeat(7,24px)] gap-2 mb-2 items-center">
      <div className="text-[10px] text-muted-foreground/70 italic text-right pr-2">Hábitos</div>
      {weekDays.map((day, i) => (
        <div key={i} className="text-center font-bold text-muted-foreground text-xs">{day}</div>
      ))}
    </div>

    {/* Habit rows */}
    <div className="space-y-1">
      {habits.map((habit, habitIdx) => (
        <div key={habitIdx} className="group relative">
          <div className="absolute bottom-1 left-0 right-0 border-b border-border/50 pointer-events-none" />
          <div className="grid grid-cols-[1fr_repeat(7,24px)] gap-2 items-center relative z-10 py-1">
            <div className="flex items-center gap-2 truncate pr-2">
              {habit.important && <span className="text-primary font-bold text-lg leading-none mt-1">*</span>}
              <span className={cn('truncate text-foreground/80 font-serif', habit.important && 'font-semibold')}>
                {habit.name}
              </span>
            </div>
            {habit.history.map((completed, i) => (
              <div key={i} className="h-6 flex items-center justify-center">
                {completed ? (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary dark:text-primary mx-auto" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" className="opacity-80" />
                  </svg>
                ) : (
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30 group-hover:bg-muted-foreground/50 transition-colors" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-4 text-[10px] text-muted-foreground/70 text-right font-serif italic">
      * atividades prioritárias
    </div>
  </div>
);
