// src/hooks/useClickOutside.ts
import { useEffect, useRef } from "react";
function useClickOutside(callback) {
  const ref = useRef(null);
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target) && !event.defaultPrevented) {
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

// src/hooks/useToggle.ts
import { useCallback, useState } from "react";
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((value) => !value), []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);
  return [state, toggle, setTrue, setFalse];
}

export {
  useClickOutside,
  useToggle
};
//# sourceMappingURL=chunk-AHIKJ7U7.js.map