export { Button, ButtonGroup, ButtonGroupProps, ButtonProps, ButtonSize, ButtonType, ButtonValue, ButtonVariant, IconButton, IconButtonProps, IconButtonSize, Orientation, RadioButton, RadioButtonProps, SelectionButton, SelectionButtonProps, SelectionType, ToggleButton, ToggleButtonProps, UseButtonGroupOptions, buttonVariants, useButtonGroup } from './components/buttons/index.js';
import React__default from 'react';
import { ClassValue } from 'clsx';
export { useClickOutside, useToggle } from './hooks/index.js';

interface CardProps extends React__default.HTMLAttributes<HTMLDivElement> {
    washiTape?: 'none' | 'primary' | 'pink' | 'mint' | 'yellow' | 'lavender' | 'peach' | 'sky';
    washiTapePosition?: 'top' | 'top-left' | 'top-right';
    hasBindingHoles?: boolean;
    hasCornerFold?: boolean;
}
declare const Card: React__default.ForwardRefExoticComponent<CardProps & React__default.RefAttributes<HTMLDivElement>>;
declare const CardHeader: React__default.ForwardRefExoticComponent<React__default.HTMLAttributes<HTMLDivElement> & React__default.RefAttributes<HTMLDivElement>>;
interface CardTitleProps extends React__default.HTMLAttributes<HTMLDivElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}
declare const CardTitle: React__default.ForwardRefExoticComponent<CardTitleProps & React__default.RefAttributes<HTMLDivElement>>;
declare const CardDescription: React__default.ForwardRefExoticComponent<React__default.HTMLAttributes<HTMLParagraphElement> & React__default.RefAttributes<HTMLParagraphElement>>;
declare const CardContent: React__default.ForwardRefExoticComponent<React__default.HTMLAttributes<HTMLDivElement> & React__default.RefAttributes<HTMLDivElement>>;
declare const CardFooter: React__default.ForwardRefExoticComponent<React__default.HTMLAttributes<HTMLDivElement> & React__default.RefAttributes<HTMLDivElement>>;

interface InputProps extends React__default.InputHTMLAttributes<HTMLInputElement> {
}
declare const Input: React__default.ForwardRefExoticComponent<InputProps & React__default.RefAttributes<HTMLInputElement>>;

interface SelectOption {
    value: string;
    label: string;
}
interface SelectProps extends React__default.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    label?: string;
    error?: string;
}
declare const Select: React__default.ForwardRefExoticComponent<SelectProps & React__default.RefAttributes<HTMLSelectElement>>;

interface ProgressProps extends React__default.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
}
declare const Progress: React__default.ForwardRefExoticComponent<ProgressProps & React__default.RefAttributes<HTMLDivElement>>;

type DividerType = 'dashed' | 'dotted' | 'dots' | 'hairline' | 'hanko' | 'spacing';
type DividerSize = 'small' | 'normal' | 'large';
interface DividerProps {
    type?: DividerType;
    size?: DividerSize;
    className?: string;
}
declare const Divider: React__default.FC<DividerProps>;

interface StatsCardProps {
    title: string;
    value: string | number;
    highlighted?: boolean;
    subtext?: string;
    badge?: string;
    className?: string;
}
declare const StatsCard: React__default.FC<StatsCardProps>;

interface MoodIconProps {
    src: string;
    alt?: string;
    className?: string;
}
declare const MoodIcon: React__default.FC<MoodIconProps>;

interface Habit {
    name: string;
    subtitle?: string;
    important: boolean;
    history: boolean[];
}
interface HandDrawnTrackerProps {
    habits: Habit[];
    weekLabel?: string;
    className?: string;
}
declare const HandDrawnTracker: React__default.FC<HandDrawnTrackerProps>;

interface PageNavigatorProps {
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    className?: string;
}
declare const PageNavigator: React__default.FC<PageNavigatorProps>;

type ShapeType = "star" | "heart" | "circle" | "flower" | "sparkle" | "moon" | "cloud" | "diamond" | "triangle" | "pentagon";
interface ShapeTheme {
    colors: string[];
    shapes: ShapeType[];
    maxShapes?: number;
    spawnRate?: number;
    minSize?: number;
    maxSize?: number;
    minSpeed?: number;
    maxSpeed?: number;
    minOpacity?: number;
    maxOpacity?: number;
    blurEnabled?: boolean;
}
interface FloatingBackgroundProps {
    enabled?: boolean;
    theme?: string | ShapeTheme;
    customColors?: string[];
    customShapes?: ShapeType[];
}
declare const FloatingBackground: React__default.FC<FloatingBackgroundProps>;

interface DateBadgeProps {
    date?: Date;
    onDateSelect?: (date: Date) => void;
    className?: string;
    locale?: string;
}
declare const DateBadge: React__default.FC<DateBadgeProps>;

interface CalendarDay {
    day: number | string;
    date?: string;
    currentMonth: boolean;
    isToday?: boolean;
    active?: boolean;
    hasEvent?: boolean;
    completionRate?: number;
}
interface MiniCalendarProps {
    days: CalendarDay[];
    title?: string;
    className?: string;
    onDayClick?: (day: CalendarDay) => void;
}
declare const MiniCalendar: React__default.FC<MiniCalendarProps>;

interface CalendarWidgetProps {
    isOpen?: boolean;
    selectedDate?: Date;
    onSelect?: (date: Date) => void;
    className?: string;
}
declare const CalendarWidget: React__default.FC<CalendarWidgetProps>;

interface AppTopbarProps {
    sidebarOpen?: boolean;
    activeContext?: "cover" | "home" | "page";
    viewMode?: "single" | "double";
    plannerTitle?: string;
    pageTitle?: string;
    onToggleSidebar?: () => void;
    onSelectHome?: () => void;
    onViewModeChange?: (mode: "single" | "double") => void;
    className?: string;
}
declare const AppTopbar: React__default.FC<AppTopbarProps>;

/** Estatísticas de leitura do usuário */
interface ReadingStats {
    /** Total de capítulos marcados como lidos */
    chaptersRead: number;
    /** Total de capítulos em toda a biblioteca */
    chaptersTotal: number;
    /** Número de mangás sendo acompanhados */
    mangasFollowing: number;
    /** Dias consecutivos com pelo menos uma leitura */
    streak: number;
}
/** Um mangá com capítulos não lidos — exibido na seção de atalhos */
interface UnreadManga {
    id: string | number;
    /** Título do mangá */
    title: string;
    /** Quantidade de capítulos não lidos */
    unreadCount: number;
    /**
     * Classe Tailwind de cor de acento (bg-*).
     * Sugestão: mapear por gênero ou tag do MangaDex.
     * Ex: action → "bg-orange-400", romance → "bg-pink-400"
     */
    accentColor: string;
    /** URL da capa já cacheada localmente (opcional) */
    coverUrl?: string;
    /** Nota global do mangá no MAL */
    malScore?: number;
    /** Nota atribuída pelo usuário */
    myScore?: number;
    /** Status do mangá na lista do MAL do usuário */
    malStatus?: "reading" | "completed" | "on_hold" | "dropped" | "plan_to_read" | string;
    chapterNumbers?: string;
}
/** Informações sobre o último mangá/capítulo lido */
interface LastRead {
    mangaTitle: string;
    chapterNumber: number | string;
    /** URL da capa para o banner (opcional — fallback para gradiente) */
    coverUrl?: string;
}
/** Estado da sincronização com o MangaDex */
interface SyncState {
    /** "idle" | "syncing" | "done" | "error" */
    status: "idle" | "syncing" | "done" | "error";
    /** Timestamp da última sync bem-sucedida */
    lastSyncedAt?: Date;
}
interface DashboardLabels {
    overviewTitle?: string;
    trackerTitle?: string;
    newChaptersTitle?: string;
    calendarTitle?: string;
    btnSearch?: string;
    statChapters?: string;
    statRead?: string;
    statFollowing?: string;
    statStreak?: string;
    statDays?: string;
    chaptersUnit?: string;
    mangasUnit?: string;
    syncing?: string;
    syncError?: string;
    neverSynced?: string;
    justNow?: string;
    minutesAgo?: (count: number) => string;
    hoursAgo?: (count: number) => string;
    daysAgo?: (count: number) => string;
    syncFailure?: string;
    stat_mal_volumes?: string;
    stat_mal_plan_to_read?: string;
    volumes?: string;
    chapterContinue?: (chapter: string | number) => string;
    noWeeklyActivity?: string;
    unreadCount?: (count: number) => string;
    allCaughtUp?: string;
    fallbackQuote?: {
        text: string;
        author: string;
    };
}
interface DashboardProps {
    stats?: ReadingStats;
    calendarDays?: CalendarDay[];
    /** Mangás com atividade dos últimos 7 dias para o tracker */
    weeklyActivity?: Habit[];
    /** Mangás com capítulos não lidos (atalhos rápidos) */
    unreadMangas?: UnreadManga[];
    /** Último capítulo lido — define o banner e a citação */
    lastRead?: LastRead;
    /** Estado atual da sincronização */
    syncState?: SyncState;
    /** Informações do usuário do MAL (se conectado) */
    malUser?: {
        name: string;
        avatarUrl: string;
    };
    /** Sugestões de mangás do ranking do MAL */
    suggestions?: Array<{
        id: number | string;
        title: string;
        score?: number;
        coverUrl?: string;
        genres?: string[];
    }>;
    /** Estatísticas de leitura extraídas do MAL */
    malStats?: {
        volumesRead: number;
        planToRead: number;
    };
    labels?: DashboardLabels;
    /** Abre a tela de busca do MangaDex (opcional prefill) */
    onSearch?: (prefill?: string) => void;
    /** Navega para a tela de detalhes/leitor do mangá */
    onMangaClick?: (manga: UnreadManga) => void;
    /** Dispara sincronização manual */
    onSync?: () => void;
    /** Dispara clique num dia do calendário */
    onDateClick?: (date: string) => void;
    className?: string;
}
declare const Dashboard: React__default.FC<DashboardProps>;

/**
 * Merge class names with Tailwind CSS conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 */
declare function cn(...inputs: ClassValue[]): string;
/**
 * Calculate the moon phase for a given date.
 * Returns one of: "new", "waxing", "full", "waning"
 */
declare function getMoonPhase(date: Date): "new" | "waxing" | "full" | "waning";

export { AppTopbar, type AppTopbarProps, type CalendarDay, CalendarWidget, type CalendarWidgetProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type CardTitleProps, Dashboard, type DashboardLabels, type DashboardProps, DateBadge, type DateBadgeProps, Divider, type DividerProps, type DividerSize, type DividerType, FloatingBackground, type FloatingBackgroundProps, type Habit, HandDrawnTracker, type HandDrawnTrackerProps, Input, type InputProps, type LastRead, MiniCalendar, type MiniCalendarProps, MoodIcon, type MoodIconProps, PageNavigator, type PageNavigatorProps, Progress, type ProgressProps, type ReadingStats, Select, type SelectOption, type SelectProps, type ShapeTheme, StatsCard, type StatsCardProps, type SyncState, type UnreadManga, cn, getMoonPhase };
