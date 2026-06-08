"use client";

import React, { memo, useId } from "react";
import { cn } from "../../utils";
import type { ButtonGroupProps } from "./types";
import "./buttons.css";

export const ButtonGroup = memo(function ButtonGroup({
  label,
  orientation = "vertical",
  children,
  className,
  role = "group",
  ...props
}: ButtonGroupProps) {
  const generatedId = useId();
  const labelId = label ? `mh-button-group-${generatedId}` : undefined;

  return (
    <div
      className={cn("mh-button-group", `mh-button-group--${orientation}`, className)}
      role={role}
      aria-labelledby={labelId}
      data-orientation={orientation}
      {...props}
    >
      {label && (
        <div id={labelId} className="mh-button-group__label">
          {label}
        </div>
      )}
      <div className="mh-button-group__items">{children}</div>
    </div>
  );
});
