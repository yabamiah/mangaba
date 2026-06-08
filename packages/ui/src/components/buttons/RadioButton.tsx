"use client";

import React, { memo, useId } from "react";
import { cn } from "../../utils";
import type { RadioButtonProps } from "./types";
import "./buttons.css";

export const RadioButton = memo(function RadioButton({
  name,
  value,
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  id,
}: RadioButtonProps) {
  const generatedId = useId();
  const inputId = id ?? `mh-radio-${generatedId}`;

  return (
    <label
      className={cn("mh-choice mh-choice--radio", className)}
      htmlFor={inputId}
      data-checked={checked || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        id={inputId}
        className="mh-choice__input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        aria-checked={checked}
        onChange={() => onChange?.(value)}
      />
      <span className="mh-choice__radio" aria-hidden="true" />
      <span className="mh-choice__label">{label}</span>
    </label>
  );
});
