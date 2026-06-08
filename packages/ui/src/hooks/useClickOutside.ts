import { useEffect, useRef } from "react";

/**
 * Hook that detects clicks outside of a referenced element.
 * Calls the provided callback when a click occurs outside.
 *
 * @example
 * ```tsx
 * const ref = useClickOutside(() => setIsOpen(false));
 * return <div ref={ref}>...</div>;
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !event.defaultPrevented
      ) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [callback]);

  return ref;
}
