import { useEffect, type RefObject } from "react";

/**
 * Calls `onOutside` when a pointer goes down anywhere outside `ref`. Used to
 * dismiss popovers that are not built on a focus-trapping primitive.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onOutside();
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [ref, onOutside, enabled]);
}
