import React from "react";
import { cn } from "../../utils";

export interface ColorPickerProps {
  colors: string[];
  selectedColor?: string;
  onSelect: (color: string) => void;
  className?: string;
}

export function ColorPicker({ colors, selectedColor, onSelect, className }: ColorPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onSelect(color)}
          style={{ backgroundColor: color }}
          className={cn(
            "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
            selectedColor === color ? "border-primary" : "border-transparent"
          )}
          aria-label={`Selecionar cor ${color}`}
        />
      ))}
    </div>
  );
}
