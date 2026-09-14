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

/** Illustration shown before a benchmark has been run. */
export const BENCHMARK_ILLUSTRATION = "/benchmark.png";

/**
 * Capability tiles on the empty state. Same soft-ground/strong-foreground
 * tile tokens the search landing screen uses, just rendered as circles here —
 * only the shape differs between the two designs, not the palette.
 */
export const BENCHMARK_FEATURES = [
  {
    icon: "flashlight-line",
    tone: "bg-tile-blue-soft text-tile-blue-strong",
    title: "Pencarian Cepat",
    body: "Lihat kecepatan pencarian dari kedua engine",
  },
  {
    icon: "bar-chart-2-line",
    tone: "bg-tile-green-soft text-tile-green-strong",
    title: "Perbandingan Akurat",
    body: "Hasil yang sama, performa yang berbeda",
  },
  {
    icon: "booklet-line",
    tone: "bg-tile-violet-soft text-tile-violet-strong",
    title: "Insight Lebih Dalam",
    body: "Bantu pilih engine yang sesuai dengan kebutuhan",
  },
];
