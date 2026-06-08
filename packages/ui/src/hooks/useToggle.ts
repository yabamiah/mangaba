import { useCallback, useState } from "react";

export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((value) => !value), []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);

  return [state, toggle, setTrue, setFalse] as const;
}
