import type { FacetKey, SearchEngineKind } from "@/api";
import type { MapBounds } from "@/types/map";

/**
 * The whole search screen's state. It is serialised into the URL, so a result
 * page is shareable, survives a reload, and works with the back button.
 */
export type SearchState = {
  keyword: string;
  engine: SearchEngineKind;
  page: number;
  pageSize: number;
  sortBy: string;
  isDescending: boolean;
  ratingMin: number | undefined;
  ulasanMin: number | undefined;
  filters: SearchFilters;
  /** Viewport filter behind "Cari di area peta ini"; null when switched off. */
  bounds: MapBounds | null;
};

/** Selected facet values, keyed by facet. OR within a key, AND across keys. */
export type SearchFilters = Record<FacetKey, string[]>;

/** One entry in the "Urutkan" control; `value` carries field and direction. */
export type SortOption = {
  value: string;
  label: string;
};

/** Parsed form of a `SortOption.value`. */
export type SortSelection = {
  sortBy: string;
  isDescending: boolean;
};
