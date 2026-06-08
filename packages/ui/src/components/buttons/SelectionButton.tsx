"use client";

import React, { memo, useId } from "react";
import { cn } from "../../utils";
import type { SelectionButtonProps } from "./types";
import "./buttons.css";

export const SelectionButton = memo(function SelectionButton({
  value,
  checked = false,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  className,
  id,
}: SelectionButtonProps) {
  const generatedId = useId();
  const inputId = id ?? `mh-selection-${generatedId}`;

  return (
    <label
      className={cn("mh-choice mh-choice--selection", className)}
      htmlFor={inputId}
      data-checked={checked || indeterminate || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        id={inputId}
        className="mh-choice__input"
        type="checkbox"
        value={value}
        checked={checked}
        disabled={disabled}
        aria-checked={indeterminate ? "mixed" : checked}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
      />
      <span className="mh-choice__box" data-indeterminate={indeterminate || undefined} aria-hidden="true" />
      <span className="mh-choice__label">{label}</span>
    </label>
  );
});
