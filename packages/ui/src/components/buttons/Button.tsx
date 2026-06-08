"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./types";
import "./buttons.css";

const variantAliases: Record<ButtonVariant, string> = {
  primary: "primary",
  secondary: "secondary",
  ghost: "ghost",
  success: "success",
  warning: "warning",
  default: "primary",
  outline: "secondary",
  destructive: "warning",
  link: "ghost",
  "section-stamp": "section-stamp",
};

const sizeAliases: Record<ButtonSize, string> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  default: "md",
  icon: "icon",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
}: {
  variant?: ButtonVariant | null;
  size?: ButtonSize | null;
} = {}) {
  return cn(
    "mh-button",
    `mh-button--${variantAliases[variant ?? "primary"]}`,
    `mh-button--${sizeAliases[size ?? "md"]}`
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      icon,
      iconPosition = "left",
      children,
      href,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const hasText = React.Children.count(children) > 0;
    const content = (
      <>
        {loading && <span className="mh-button__spinner" aria-hidden="true" />}
        {!loading && icon && iconPosition === "left" && (
          <span className="mh-button__icon" aria-hidden={!hasText}>
            {icon}
          </span>
        )}
        {hasText && children}
        {!loading && icon && iconPosition === "right" && (
          <span className="mh-button__icon" aria-hidden={!hasText}>
            {icon}
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <a
          className={cn(buttonVariants({ variant, size }), className)}
          href={isDisabled ? undefined : href}
          aria-disabled={isDisabled}
          data-loading={loading || undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-loading={loading || undefined}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
