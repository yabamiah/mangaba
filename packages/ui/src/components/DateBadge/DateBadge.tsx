"use client";
import React, { useState, useEffect, useMemo } from "react";
import { cn } from "../../utils";
import { getMoonPhase } from "../../utils";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "./DateBadge.module.css";

// Inline icons replacing @solar-icons
const Sun = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 13h2a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm18 0h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM11 2v2a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0zm0 18v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-2 0zM5.99 4.58a1 1 0 1 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06zM19.42 5.99a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06z"/></svg>
);

const CloudRain = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11h-1.55A5.02 5.02 0 0 0 10 7a5.02 5.02 0 0 0-4.45 4H4a4 4 0 0 0 0 8h1.5l1.65-4.4a1 1 0 0 1 1.88.7l-1.42 3.8a.98.98 0 0 1-.93.6H4a6 6 0 0 1 0-12h.42A7.02 7.02 0 0 1 10 5a7.02 7.02 0 0 1 5.58 2.72A6.02 6.02 0 0 1 20 13a6 6 0 0 1-5.32 5.96.99.99 0 0 1-.2-1.98A4 4 0 0 0 20 13a4 4 0 0 0-4-4zm-5 5.5a1 1 0 0 0-1.88.68l-1.5 4a1 1 0 0 0 1.88.68l1.5-4a1 1 0 0 0-.38-1.36zm6 0a1 1 0 0 0-1.88.68l-1.5 4a1 1 0 0 0 1.88.68l1.5-4a1 1 0 0 0-.38-1.36z"/></svg>
);

const Clouds = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 10h-1.55A5.02 5.02 0 0 0 10 6a5.02 5.02 0 0 0-4.45 4H4a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8zm0 6H4a2 2 0 0 1 0-4h1.42A4.98 4.98 0 0 0 10 8a4.98 4.98 0 0 0 4.58 4H16a2 2 0 0 1 0 4z"/></svg>
);

export interface DateBadgeProps {
  date?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
  locale?: string;
}

export const DateBadge: React.FC<DateBadgeProps> = ({
  date = new Date(),
  onDateSelect,
  className,
  locale = 'pt-BR',
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);
  const [currentMonth, setCurrentMonth] = useState(date);
  const [weather, setWeather] = useState<"sunny" | "rainy" | "cloudy">("rainy");
  const [temperature, setTemperature] = useState<number | null>(null);

  // Update selectedDate if date prop changes
  useEffect(() => {
    setSelectedDate(date);
    setCurrentMonth(date);
  }, [date]);

  // Handle click outside to close calendar
  const wrapperRef = useClickOutside<HTMLDivElement>(() => setIsCalendarOpen(false));

  const moonPhase = getMoonPhase(selectedDate);
  const moonIcon = useMemo(() => {
    switch (moonPhase) {
      case "new": return "🌑";
      case "waxing": return "🌓";
      case "full": return "🌕";
      case "waning": return "🌗";
    }
  }, [moonPhase]);

  const WeatherIcon = useMemo(() => {
    switch (weather) {
      case "sunny": return Sun;
      case "rainy": return CloudRain;
      case "cloudy": return Clouds;
    }
  }, [weather]);

  useEffect(() => {
    // Simulating weather fetch since API key is needed
    // In a real app this would be driven by the actual API
    if (navigator.geolocation) {
      setTemperature(24);
      setWeather("cloudy");
    }
  }, []);

  const dayNumber = selectedDate.getDate();
  const monthName = selectedDate.toLocaleString(locale, { month: "long" });
  const year = selectedDate.getFullYear();
  const dayName = selectedDate.toLocaleString(locale, { weekday: "long" });

  const calendarDays = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();

    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    const prevMonthLastDay = new Date(y, m, 0);

    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevMonthLastDay.getDate();

    const days = [];

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        date: new Date(y, m - 1, day),
      });
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(y, m, day);
      days.push({
        day,
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === today.toDateString(),
        isSelected: dayDate.toDateString() === selectedDate.toDateString(),
        date: dayDate,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        date: new Date(y, m + 1, day),
      });
    }

    return days;
  }, [currentMonth, selectedDate]);

  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);

  const selectDate = (dayDate: Date) => {
    setSelectedDate(dayDate);
    setCurrentMonth(dayDate);
    onDateSelect?.(dayDate);
    setIsCalendarOpen(false);
  };

  const previousMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className={cn(styles.dateBadgeWrapper, className)} ref={wrapperRef}>
      <button
        className={cn(styles.dateBadge, isCalendarOpen && styles.open)}
        onClick={toggleCalendar}
      >
        <div className={styles.dayNumber}>{dayNumber}</div>
        <div className={styles.dateInfo}>
          <div className={styles.dateText}>
            {monthName} {year} <span className={styles.dayName}>({dayName.slice(0, 3)})</span>
          </div>
          <div className={styles.iconsRow}>
            <div className={styles.iconItem} title="Clima">
              <span className={styles.label}>Clima:</span>
              <WeatherIcon className="w-4 h-4" />
              {temperature !== null && (
                <span className="font-rounded text-[10px] ml-1">{temperature}°</span>
              )}
            </div>
            <div className={styles.iconItem} title="Lua">
              <span className={styles.label}>Lua:</span>
              <span className={styles.moonIcon}>{moonIcon}</span>
            </div>
          </div>
        </div>
      </button>

      {isCalendarOpen && (
        <div className={styles.calendarPopup}>
          <div className={styles.calendarHeader}>
            <button className={styles.navBtn} onClick={previousMonth} title="Mês anterior">‹</button>
            <div className={styles.calendarTitle}>
              {currentMonth.toLocaleString(locale, { month: "long", year: "numeric" })}
            </div>
            <button className={styles.navBtn} onClick={nextMonth} title="Próximo mês">›</button>
          </div>

          <div className={styles.weekdayLabels}>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
              <div key={day} className={styles.weekdayLabel}>{day}</div>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {calendarDays.map((day, i) => (
              <button
                key={i}
                className={cn(
                  styles.calendarDay,
                  day.isCurrentMonth && styles.currentMonth,
                  day.isToday && styles.today,
                  day.isSelected && styles.selected
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  selectDate(day.date);
                }}
              >
                {day.day}
              </button>
            ))}
          </div>

          <div className={styles.calendarFooter}>
            <button
              className={styles.quickAction}
              onClick={(e) => {
                e.stopPropagation();
                const now = new Date();
                setSelectedDate(now);
                setCurrentMonth(now);
                setIsCalendarOpen(false);
                onDateSelect?.(now);
              }}
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
