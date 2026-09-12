import { FACET_KEYS, type FacetKey, type SearchEngineKind, type SearchSpbuParams } from "@/api";

/**
 * URL is the source of truth for search state, so a result page is shareable,
 * survives a reload, and works with the browser's back button — none of which
 * held when this all lived in component `useState`.
 */
export const QUERY_KEYS = {
  keyword: "q",
  engine: "engine",
  page: "page",
  size: "size",
  sort: "sort",
  desc: "desc",
  ratingMin: "rating",
  ulasanMin: "ulasan",
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_ENGINE: SearchEngineKind = "Elasticsearch";
/** Provinsi and kota facets need the full list for client-side filtering. */
export const FACET_SIZE = 600;

export type SearchState = {
  keyword: string;
  engine: SearchEngineKind;
  page: number;
  pageSize: number;
  sortBy: string;
  isDescending: boolean;
  ratingMin: number | undefined;
  ulasanMin: number | undefined;
  filters: Record<FacetKey, string[]>;
};

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function emptyFilters(): Record<FacetKey, string[]> {
  const filters = {} as Record<FacetKey, string[]>;
  for (const key of FACET_KEYS) filters[key] = [];
  return filters;
}

export function readSearchState(params: URLSearchParams): SearchState {
  const engine = params.get(QUERY_KEYS.engine);

  const filters = emptyFilters();
  for (const key of FACET_KEYS) {
    filters[key] = params.getAll(key);
  }

  return {
    keyword: params.get(QUERY_KEYS.keyword) ?? "",
    engine: engine === "Sql" ? "Sql" : DEFAULT_ENGINE,
    page: parsePositiveInt(params.get(QUERY_KEYS.page), 1),
    pageSize: parsePositiveInt(params.get(QUERY_KEYS.size), DEFAULT_PAGE_SIZE),
    sortBy: params.get(QUERY_KEYS.sort) ?? "",
    isDescending: params.get(QUERY_KEYS.desc) === "1",
    ratingMin: parseNumber(params.get(QUERY_KEYS.ratingMin)),
    ulasanMin: parseNumber(params.get(QUERY_KEYS.ulasanMin)),
    filters,
  };
}

/** Serialises state back to a URL, omitting everything that is at its default. */
export function writeSearchState(state: SearchState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.keyword.trim()) params.set(QUERY_KEYS.keyword, state.keyword.trim());
  if (state.engine !== DEFAULT_ENGINE) params.set(QUERY_KEYS.engine, state.engine);
  if (state.page > 1) params.set(QUERY_KEYS.page, String(state.page));
  if (state.pageSize !== DEFAULT_PAGE_SIZE) params.set(QUERY_KEYS.size, String(state.pageSize));
  if (state.sortBy) params.set(QUERY_KEYS.sort, state.sortBy);
  if (state.isDescending) params.set(QUERY_KEYS.desc, "1");
  if (state.ratingMin !== undefined) params.set(QUERY_KEYS.ratingMin, String(state.ratingMin));
  if (state.ulasanMin !== undefined) params.set(QUERY_KEYS.ulasanMin, String(state.ulasanMin));

  for (const key of FACET_KEYS) {
    for (const value of state.filters[key]) params.append(key, value);
  }

  return params;
}

/** Maps UI state onto the backend's request shape. */
export function toSearchRequest(state: SearchState): SearchSpbuParams {
  const params: SearchSpbuParams = {
    engine: state.engine,
    pageNumber: state.page,
    pageSize: state.pageSize,
    /**
     * The backend suggests turning facets off while paging. Not done here: a
     * shared link can land directly on page 3, and that request still has to
     * populate the filter panel.
     */
    includeFacets: true,
    facetSize: FACET_SIZE,
  };

  const keyword = state.keyword.trim();
  if (keyword) params.search = keyword;
  if (state.sortBy) {
    params.sortBy = state.sortBy;
    params.isDescending = state.isDescending;
  }
  if (state.ratingMin !== undefined) params.ratingMin = state.ratingMin;
  if (state.ulasanMin !== undefined) params.ulasanMin = state.ulasanMin;

  for (const key of FACET_KEYS) {
    const values = state.filters[key];
    if (values.length > 0) params[key] = values;
  }

  return params;
}

export function countActiveFilters(state: SearchState): number {
  const facetCount = FACET_KEYS.reduce((total, key) => total + state.filters[key].length, 0);
  return (
    facetCount + (state.ratingMin === undefined ? 0 : 1) + (state.ulasanMin === undefined ? 0 : 1)
  );
}
