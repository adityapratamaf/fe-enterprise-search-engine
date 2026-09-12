import {
  FACET_KEYS,
  SORT_FIELDS,
  type FacetKey,
  type SearchSpbuParams,
  type SpbuSearchItem,
} from "@/api";
import {
  DEFAULT_ENGINE,
  DEFAULT_PAGE_SIZE,
  FACET_SIZE,
  FACILITY_ICONS,
  FALLBACK_FACILITY_ICON,
  OPEN_24H_CODE,
  QUERY_KEYS,
  SPBU_IMAGE_FALLBACK,
} from "./data";
import type { SearchFilters, SearchState, SortSelection } from "./types";

// ---------------------------------------------------------------------------
// URL state
// ---------------------------------------------------------------------------

export function emptyFilters(): SearchFilters {
  const filters = {} as SearchFilters;
  for (const key of FACET_KEYS) filters[key] = [];
  return filters;
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function readSearchState(params: URLSearchParams): SearchState {
  const engine = params.get(QUERY_KEYS.engine);

  const filters = emptyFilters();
  for (const key of FACET_KEYS) filters[key] = params.getAll(key);

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
  const facetCount = FACET_KEYS.reduce(
    (total, key: FacetKey) => total + state.filters[key].length,
    0,
  );
  return (
    facetCount + (state.ratingMin === undefined ? 0 : 1) + (state.ulasanMin === undefined ? 0 : 1)
  );
}

/** Splits a `SortOption.value` such as `"nama:desc"` into its two parts. */
export function parseSortValue(value: string): SortSelection {
  const [field = "", direction] = value.split(":");
  const isKnown = (SORT_FIELDS as readonly string[]).includes(field);
  return { sortBy: isKnown ? field : "", isDescending: direction === "desc" };
}

export function toSortValue(sortBy: string, isDescending: boolean): string {
  return sortBy ? `${sortBy}:${isDescending ? "desc" : "asc"}` : "";
}

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

export function facilityIcon(code: string): string {
  return FACILITY_ICONS[code] ?? FALLBACK_FACILITY_ICON;
}

/** The old UI printed this badge on every card regardless of the station. */
export function isOpen24Hours(fasilitas: string[]): boolean {
  return fasilitas.includes(OPEN_24H_CODE);
}

/**
 * Facet values arrive as codes (`PERTAMAX_TURBO`). Items carry a parallel `*Nama`
 * array with display names, so the result list learns the names of whatever is on
 * screen and this covers the rest.
 */
export function prettifyCode(code: string): string {
  return code
    .split("_")
    .map((part) => (part.length > 3 ? part[0] + part.slice(1).toLowerCase() : part))
    .join(" ");
}

/**
 * Builds a facet-code to display-name map from the result items, since facet
 * buckets carry codes only.
 */
export function buildLabelMap(items: SpbuSearchItem[]): Record<string, string> {
  const labels: Record<string, string> = {};

  for (const item of items) {
    item.produk.forEach((code, index) => {
      const name = item.produkNama[index];
      if (name) labels[code] = name;
    });
    item.fasilitas.forEach((code, index) => {
      const name = item.fasilitasNama[index];
      if (name) labels[code] = name;
    });
    if (item.regional && item.regionalNama) labels[item.regional] = item.regionalNama;
  }

  return labels;
}

/**
 * Single source for a station's photo. The API has no image field yet, so every
 * station renders the shared asset — when that field arrives, this is the only
 * place that has to change.
 */
export function spbuImageUrl(_item: Pick<SpbuSearchItem, "kodeSpbu">): string {
  return SPBU_IMAGE_FALLBACK;
}
