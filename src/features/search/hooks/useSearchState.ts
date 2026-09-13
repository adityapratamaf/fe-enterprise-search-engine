import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { FacetKey, SearchEngineKind } from "@/api";
import type { MapBounds } from "@/types/map";
import {
  countActiveFilters,
  emptyFilters,
  readSearchState,
  toSearchRequest,
  writeSearchState,
} from "../utils";
import type { SearchState } from "../types";

/**
 * Reads and writes the whole search state through the URL. Every mutation that
 * changes the result set resets to page 1, which is the behaviour users expect
 * and what the old local-state version got wrong (`page` was never even applied).
 */
export function useSearchState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => readSearchState(searchParams), [searchParams]);

  const commit = useCallback(
    (next: SearchState, options?: { replace?: boolean }) => {
      setSearchParams(writeSearchState(next), { replace: options?.replace ?? false });
    },
    [setSearchParams],
  );

  const patch = useCallback(
    (changes: Partial<SearchState>, options?: { keepPage?: boolean; replace?: boolean }) => {
      const next: SearchState = {
        ...state,
        ...changes,
        page: options?.keepPage ? (changes.page ?? state.page) : (changes.page ?? 1),
      };
      commit(next, { replace: options?.replace });
    },
    [state, commit],
  );

  const submitKeyword = useCallback(
    (keyword: string, engine?: SearchEngineKind) => {
      patch(engine ? { keyword, engine } : { keyword });
    },
    [patch],
  );

  const toggleFilter = useCallback(
    (key: FacetKey, value: string) => {
      const current = state.filters[key];
      const next = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];

      patch({ filters: { ...state.filters, [key]: next } });
    },
    [state.filters, patch],
  );

  const clearFilter = useCallback(
    (key: FacetKey) => {
      patch({ filters: { ...state.filters, [key]: [] } });
    },
    [state.filters, patch],
  );

  const resetFilters = useCallback(() => {
    patch({
      filters: emptyFilters(),
      ratingMin: undefined,
      ulasanMin: undefined,
      bounds: null,
    });
  }, [patch]);

  /**
   * "Cari di area peta ini". Storing the viewport in the URL keeps the behaviour
   * consistent with every other filter: shareable, reload-safe, undoable with
   * the back button.
   */
  const setBounds = useCallback(
    (bounds: MapBounds | null) => {
      patch({ bounds });
    },
    [patch],
  );

  const setPage = useCallback(
    (page: number) => {
      patch({ page }, { keepPage: true });
    },
    [patch],
  );

  return {
    state,
    request: useMemo(() => toSearchRequest(state), [state]),
    activeFilterCount: countActiveFilters(state),
    patch,
    submitKeyword,
    setEngine: useCallback((engine: SearchEngineKind) => patch({ engine }), [patch]),
    setSort: useCallback(
      (sortBy: string, isDescending: boolean) => patch({ sortBy, isDescending }),
      [patch],
    ),
    setPage,
    toggleFilter,
    clearFilter,
    resetFilters,
    setBounds,
  };
}
