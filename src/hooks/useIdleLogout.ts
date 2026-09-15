import { useEffect, useRef } from "react";

/** Cukup luas supaya gerakan mouse, ketikan, scroll, atau sentuhan semuanya
 * dianggap aktivitas — bukan cuma klik. */
const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "wheel",
] as const;

/**
 * Memanggil `onIdle` setelah `timeoutMs` tanpa aktivitas pengguna. Timer dan
 * listener hanya terpasang saat `enabled`, jadi tidak berjalan sebelum login.
 */
export function useIdleLogout(timeoutMs: number, onIdle: () => void, enabled: boolean) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!enabled) return;

    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onIdle, timeoutMs);
    };

    resetTimer();
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      clearTimeout(timerRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [enabled, timeoutMs, onIdle]);
}
