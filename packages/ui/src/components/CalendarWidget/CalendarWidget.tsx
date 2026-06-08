"use client";
import React, { useState, useMemo } from "react";
import { cn } from "../../utils";
import styles from "./CalendarWidget.module.css";

export interface CalendarWidgetProps {
  isOpen?: boolean;
  selectedDate?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];

// Inline arrow icons
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  isOpen = false,
  selectedDate: initialDate = new Date(),
  onSelect,
  className,
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [displayDate, setDisplayDate] = useState(new Date(initialDate));

  const year = displayDate.getFullYear();
  const monthIndex = displayDate.getMonth();
  const monthLabel = `${months[monthIndex]} ${year}`;

  const calendarGrid = useMemo(() => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startDay = new Date(year, monthIndex, 1).getDay();
    const prevTotal = new Date(year, monthIndex, 0).getDate();
    const today = new Date();
    const grid: Array<{
      day: number;
      type: string;
      isToday?: boolean;
      isSelected?: boolean;
      date: Date;
    }> = [];

    for (let i = startDay - 1; i >= 0; i--) {
      grid.push({
        day: prevTotal - i,
        type: "other-month",
        date: new Date(year, monthIndex - 1, prevTotal - i),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      grid.push({
        day,
        type: "curr-month",
        isToday:
          day === today.getDate() &&
          monthIndex === today.getMonth() &&
          year === today.getFullYear(),
        isSelected:
          day === selectedDate.getDate() &&
          monthIndex === selectedDate.getMonth() &&
          year === selectedDate.getFullYear(),
        date,
      });
    }

    const remaining = 42 - grid.length;
    for (let day = 1; day <= remaining; day++) {
      grid.push({
        day,
        type: "other-month",
        date: new Date(year, monthIndex + 1, day),
      });
    }

    return grid;
  }, [year, monthIndex, selectedDate]);

  const changeMonth = (delta: number) => {
    setDisplayDate(
      new Date(displayDate.getFullYear(), displayDate.getMonth() + delta, 1)
    );
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
    onSelect?.(date);
  };

  if (!isOpen) return null;

  return (
    <div className={cn(styles.miniCalendar, className)}>
      <div className={styles.calendarHeader}>
        <button
          className={styles.calendarNavBtn}
          onClick={(e) => {
            e.stopPropagation();
            changeMonth(-1);
          }}
        >
          <ArrowLeft />
        </button>
        <div className={styles.calendarTitle}>{monthLabel}</div>
        <button
          className={styles.calendarNavBtn}
          onClick={(e) => {
            e.stopPropagation();
            changeMonth(1);
          }}
        >
          <ArrowRight />
        </button>
      </div>

      <div className={styles.calendarWashi} />

      <div className={styles.calendarDaysHeader}>
        {dayLabels.map((day, i) => (
          <div key={i} className={styles.calendarDayLabel}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {calendarGrid.map((cell, i) => (
          <button
            key={i}
            className={cn(
              styles.calendarDay,
              cell.type === "other-month" && styles.otherMonth,
              cell.isToday && styles.today,
              cell.isSelected && styles.selected
            )}
            onClick={(e) => {
              e.stopPropagation();
              selectDay(cell.date);
            }}
          >
            {cell.day}
          </button>
        ))}
      </div>

      <div className={styles.calendarFooter}>Clique na data para selecionar</div>
    </div>
  );
};
