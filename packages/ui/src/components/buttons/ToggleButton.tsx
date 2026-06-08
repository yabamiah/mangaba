"use client";

import React, { memo, useId } from "react";
import { cn } from "../../utils";
import type { ToggleButtonProps } from "./types";
import "./buttons.css";

export const ToggleButton = memo(function ToggleButton({
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  id,
}: ToggleButtonProps) {
  const generatedId = useId();
  const inputId = id ?? `mh-toggle-${generatedId}`;

  return (
    <label
      className={cn("mh-toggle", className)}
      htmlFor={inputId}
      data-checked={checked || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        id={inputId}
        className="mh-toggle__input"
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-checked={checked}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
      />
      <span className="mh-toggle__track" aria-hidden="true">
        <span className="mh-toggle__thumb" />
      </span>
      {label && <span className="mh-toggle__label">{label}</span>}
    </label>
  );
});
