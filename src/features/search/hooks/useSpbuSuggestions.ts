import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { spbuApi } from "@/api";
import { spbuKeys } from "./useSpbuSearch";

/** The backend itself ignores anything shorter, so there is no point asking. */
const MIN_LENGTH = 2;
const DEBOUNCE_MS = 250;

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

/**
 * Suggestions are fired per keystroke, so the input is debounced and results are
 * cached per term — the previous UI filtered a hardcoded array of five strings.
 */
export function useSpbuSuggestions(keyword: string, enabled: boolean) {
  const debounced = useDebounced(keyword.trim(), DEBOUNCE_MS);
  const active = enabled && debounced.length >= MIN_LENGTH;

  const query = useQuery({
    queryKey: spbuKeys.suggestion(debounced),
    queryFn: ({ signal }) => spbuApi.suggestion(debounced, 8, signal),
    enabled: active,
    staleTime: 5 * 60_000,
  });

  return {
    items: active ? (query.data?.items ?? []) : [],
    isLoading: active && query.isLoading,
  };
}
