import type React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "success"
  | "warning"
  | "default"
  | "outline"
  | "destructive"
  | "link"
  | "section-stamp";

export type ButtonSize = "sm" | "md" | "lg" | "default" | "icon";
export type IconButtonSize = "sm" | "md" | "lg" | "xl";
export type ButtonType = "button" | "submit" | "reset";
export type Orientation = "horizontal" | "vertical";
export type SelectionType = "radio" | "checkbox";
export type ButtonValue = string | number;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

export interface SelectionButtonProps {
  value?: ButtonValue;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
  id?: string;
}

export interface RadioButtonProps {
  name: string;
  value: ButtonValue;
  checked?: boolean;
  onChange?: (value: ButtonValue) => void;
  label: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export interface ToggleButtonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: IconButtonSize;
  variant?: Extract<ButtonVariant, "primary" | "secondary" | "ghost" | "default" | "outline">;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
  "aria-label": string;
}

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  orientation?: Orientation;
  children: React.ReactNode;
  className?: string;
  role?: React.AriaRole;
}

export interface UseButtonGroupOptions {
  type: SelectionType;
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
}
