import { useCallback, useState } from "react";
import type { UseButtonGroupOptions } from "./types";

export function useButtonGroup({
  type,
  defaultValue,
  onChange,
}: UseButtonGroupOptions) {
  const initialValue =
    defaultValue ?? (type === "checkbox" ? [] : "");
  const [selected, setSelected] = useState<string | string[]>(initialValue);

  const isSelected = useCallback(
    (value: string) =>
      Array.isArray(selected) ? selected.includes(value) : selected === value,
    [selected]
  );

  const toggle = useCallback(
    (value: string) => {
      setSelected((current) => {
        const next =
          type === "radio"
            ? value
            : Array.isArray(current)
              ? current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
              : [value];
        onChange?.(next);
        return next;
      });
    },
    [onChange, type]
  );

  const reset = useCallback(() => {
    setSelected(initialValue);
    onChange?.(initialValue);
  }, [initialValue, onChange]);

  return {
    selected,
    isSelected,
    toggle,
    reset,
  };
}
