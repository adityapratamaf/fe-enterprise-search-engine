import type { BenchmarkFormState, EnginePanelState } from "./types";

export const DEFAULT_RADIUS_KM = 10;
export const DEFAULT_ITERASI = 3;
export const RESULT_PAGE_SIZE = 10;

export const INITIAL_FORM_STATE: BenchmarkFormState = {
  keyword: "",
  location: "",
  radiusKm: String(DEFAULT_RADIUS_KM),
  ratingMin: "",
  ulasanMin: "",
  iterasi: String(DEFAULT_ITERASI),
  warmup: true,
};

/**
 * SQL has no relevance scoring (`kemampuan.relevansi` is false for it), so
 * defaulting its panel to "Relevansi" would silently just be name order under a
 * misleading label. Elasticsearch keeps the usual relevance-first default.
 */
export const INITIAL_ES_PANEL: EnginePanelState = { page: 1, sortBy: "", isDescending: false };
export const INITIAL_SQL_PANEL: EnginePanelState = {
  page: 1,
  sortBy: "nama",
  isDescending: false,
};

/** Hides the native number-input spinner so the field matches the plain boxes in the design. */
export const NUMBER_INPUT_CLASS =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
