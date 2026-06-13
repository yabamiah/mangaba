import React from "react";
import { cn } from "../../utils";

export interface IconPickerProps {
  icons: { id: string; icon: React.ReactNode }[];
  selectedIconId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function IconPicker({ icons, selectedIconId, onSelect, className }: IconPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {icons.map(({ id, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-all",
            selectedIconId === id
              ? "border-primary bg-secondary text-primary"
              : "border-transparent hover:border-border hover:bg-secondary"
          )}
          aria-label={`Selecionar ícone ${id}`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
