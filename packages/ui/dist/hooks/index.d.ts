import * as React from 'react';

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
declare function useClickOutside<T extends HTMLElement = HTMLElement>(callback: () => void): React.RefObject<T | null>;

declare function useToggle(initialState?: boolean): readonly [boolean, () => void, () => void, () => void];

export { useClickOutside, useToggle };
