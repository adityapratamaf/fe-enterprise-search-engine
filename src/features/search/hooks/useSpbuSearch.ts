import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { spbuApi, type SearchSpbuParams } from "@/api";

export const spbuKeys = {
  all: ["spbu"] as const,
  search: (params: SearchSpbuParams) => [...spbuKeys.all, "search", params] as const,
  suggestion: (keyword: string) => [...spbuKeys.all, "suggestion", keyword] as const,
};

/**
 * `keepPreviousData` keeps the current page on screen while the next one loads,
 * so paging does not blank the list out and back in.
 */
export function useSpbuSearch(params: SearchSpbuParams) {
  return useQuery({
    queryKey: spbuKeys.search(params),
    queryFn: ({ signal }) => spbuApi.search(params, signal),
    placeholderData: keepPreviousData,
  });
}
