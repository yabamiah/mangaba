import React__default from 'react';

type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "warning" | "default" | "outline" | "destructive" | "link" | "section-stamp";
type ButtonSize = "sm" | "md" | "lg" | "default" | "icon";
type IconButtonSize = "sm" | "md" | "lg" | "xl";
type ButtonType = "button" | "submit" | "reset";
type Orientation = "horizontal" | "vertical";
type SelectionType = "radio" | "checkbox";
type ButtonValue = string | number;
interface ButtonProps extends React__default.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React__default.ReactNode;
    iconPosition?: "left" | "right";
    className?: string;
    children?: React__default.ReactNode;
    href?: string;
}
interface SelectionButtonProps {
    value?: ButtonValue;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label: string;
    disabled?: boolean;
    indeterminate?: boolean;
    className?: string;
    id?: string;
}
interface RadioButtonProps {
    name: string;
    value: ButtonValue;
    checked?: boolean;
    onChange?: (value: ButtonValue) => void;
    label: string;
    disabled?: boolean;
    className?: string;
    id?: string;
}
interface ToggleButtonProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
}
interface IconButtonProps extends React__default.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React__default.ReactNode;
    size?: IconButtonSize;
    variant?: Extract<ButtonVariant, "primary" | "secondary" | "ghost" | "default" | "outline">;
    tooltip?: string;
    disabled?: boolean;
    className?: string;
    "aria-label": string;
}
interface ButtonGroupProps extends React__default.HTMLAttributes<HTMLDivElement> {
    label?: string;
    orientation?: Orientation;
    children: React__default.ReactNode;
    className?: string;
    role?: React__default.AriaRole;
}
interface UseButtonGroupOptions {
    type: SelectionType;
    defaultValue?: string | string[];
    onChange?: (value: string | string[]) => void;
}

declare function buttonVariants({ variant, size, }?: {
    variant?: ButtonVariant | null;
    size?: ButtonSize | null;
}): string;
declare const Button: React__default.ForwardRefExoticComponent<ButtonProps & React__default.RefAttributes<HTMLButtonElement>>;

declare const SelectionButton: React__default.NamedExoticComponent<SelectionButtonProps>;

declare const RadioButton: React__default.NamedExoticComponent<RadioButtonProps>;

declare const ToggleButton: React__default.NamedExoticComponent<ToggleButtonProps>;

declare const IconButton: React__default.ForwardRefExoticComponent<IconButtonProps & React__default.RefAttributes<HTMLButtonElement>>;

declare const ButtonGroup: React__default.NamedExoticComponent<ButtonGroupProps>;

declare function useButtonGroup({ type, defaultValue, onChange, }: UseButtonGroupOptions): {
    selected: string | string[];
    isSelected: (value: string) => boolean;
    toggle: (value: string) => void;
    reset: () => void;
};

export { Button, ButtonGroup, type ButtonGroupProps, type ButtonProps, type ButtonSize, type ButtonType, type ButtonValue, type ButtonVariant, IconButton, type IconButtonProps, type IconButtonSize, type Orientation, RadioButton, type RadioButtonProps, SelectionButton, type SelectionButtonProps, type SelectionType, ToggleButton, type ToggleButtonProps, type UseButtonGroupOptions, buttonVariants, useButtonGroup };
