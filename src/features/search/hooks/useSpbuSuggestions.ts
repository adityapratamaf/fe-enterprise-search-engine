import { useQuery } from "@tanstack/react-query";
import { spbuApi } from "@/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { SUGGESTION_DEBOUNCE_MS, SUGGESTION_LIMIT, SUGGESTION_MIN_LENGTH } from "../data";
import { spbuKeys } from "./useSpbuSearch";

/**
 * Suggestions fire per keystroke, so the term is debounced and results are cached
 * per term — the original UI filtered a hardcoded array of five strings.
 */
export function useSpbuSuggestions(keyword: string, enabled: boolean) {
  const debounced = useDebouncedValue(keyword.trim(), SUGGESTION_DEBOUNCE_MS);
  const active = enabled && debounced.length >= SUGGESTION_MIN_LENGTH;

  const query = useQuery({
    queryKey: spbuKeys.suggestion(debounced),
    queryFn: ({ signal }) => spbuApi.suggestion(debounced, SUGGESTION_LIMIT, signal),
    enabled: active,
    staleTime: 5 * 60_000,
  });

  return {
    items: active ? (query.data?.items ?? []) : [],
    isLoading: active && query.isLoading,
  };
}
