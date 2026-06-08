"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils";
import type { IconButtonProps } from "./types";
import "./buttons.css";

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = "md",
      variant = "secondary",
      tooltip,
      disabled,
      className,
      type = "button",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => (
    <span className="mh-icon-button-wrap" data-tooltip={tooltip || undefined}>
      <button
        ref={ref}
        type={type}
        className={cn(
          "mh-icon-button",
          `mh-icon-button--${size}`,
          `mh-icon-button--${variant === "default" ? "primary" : variant === "outline" ? "secondary" : variant}`,
          className
        )}
        disabled={disabled}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        {...props}
      >
        <span className="mh-icon-button__icon" aria-hidden="true">
          {icon}
        </span>
      </button>
      {tooltip && <span className="mh-icon-button__tooltip">{tooltip}</span>}
    </span>
  )
);

IconButton.displayName = "IconButton";
