// ═══════════════════════════════════════════════════════════════
// @pequiplan/ui - Main Entry Point
// MeriHari Design System - React Component Library
// ═══════════════════════════════════════════════════════════════

// === Core UI Components ===
export { Button, buttonVariants } from "./components/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button";

export {
  SelectionButton,
  RadioButton,
  ToggleButton,
  IconButton,
  ButtonGroup,
  useButtonGroup,
} from "./components/buttons";
export type {
  ButtonGroupProps,
  ButtonType,
  ButtonValue,
  IconButtonProps,
  IconButtonSize,
  Orientation,
  RadioButtonProps,
  SelectionButtonProps,
  SelectionType,
  ToggleButtonProps,
  UseButtonGroupOptions,
} from "./components/buttons";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/Card";
export type { CardTitleProps } from "./components/Card";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";

export { Select } from "./components/Select";
export type { SelectProps, SelectOption } from "./components/Select";

export { Progress } from "./components/Progress";
export type { ProgressProps } from "./components/Progress";

// === Custom Components ===
export { Divider } from "./components/Divider";
export type { DividerProps, DividerType, DividerSize } from "./components/Divider";

export { StatsCard } from "./components/StatsCard";
export type { StatsCardProps } from "./components/StatsCard";

export { MoodIcon } from "./components/MoodIcon";
export type { MoodIconProps } from "./components/MoodIcon";

export { HandDrawnTracker } from "./components/HandDrawnTracker";
export type { HandDrawnTrackerProps, Habit } from "./components/HandDrawnTracker";

// === Interactive Components ===
export { PageNavigator } from "./components/PageNavigator";
export type { PageNavigatorProps } from "./components/PageNavigator";

export { FloatingBackground } from "./components/FloatingBackground";
export type { FloatingBackgroundProps, ShapeTheme } from "./components/FloatingBackground";

export { DateBadge } from "./components/DateBadge";
export type { DateBadgeProps } from "./components/DateBadge";

export { MiniCalendar } from "./components/MiniCalendar";
export type { MiniCalendarProps, CalendarDay } from "./components/MiniCalendar";

export { CalendarWidget } from "./components/CalendarWidget";
export type { CalendarWidgetProps } from "./components/CalendarWidget";

export { AppTopbar } from "./components/AppTopbar";
export type { AppTopbarProps } from "./components/AppTopbar";

export { Dashboard } from "./components/Dashboard";
export type {
  DashboardLabels,
  DashboardProps,
  LastRead,
  ReadingStats,
  SyncState,
  UnreadManga,
} from "./components/Dashboard";

// === Utilities ===
export { cn, getMoonPhase } from "./utils";

// === Hooks ===
export { useClickOutside } from "./hooks";
export { useToggle } from "./hooks";
