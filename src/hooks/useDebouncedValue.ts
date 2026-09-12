import { useEffect, useState } from "react";

/**
 * Delays a rapidly changing value, so per-keystroke work (a suggestion request,
 * a filter pass) runs once the user pauses instead of on every character.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
