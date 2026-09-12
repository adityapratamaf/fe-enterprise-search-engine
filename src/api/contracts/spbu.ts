import type { PaginationParams } from "./common";

/**
 * The backend accepts `"es"`/`"elastic"` too, but emits the canonical names,
 * so those are the only two values worth modelling here.
 */
export type SearchEngineKind = "Elasticsearch" | "Sql";

/** Facet keys the backend fills in `SearchSpbuResponse.facets`. */
export const FACET_KEYS = [
  "regional",
  "provinsi",
  "kota",
  "produk",
  "fasilitas",
  "status",
  "tipeKepemilikan",
] as const;

export type FacetKey = (typeof FACET_KEYS)[number];

/** Values `sortBy` understands; anything else falls back to name ordering. */
export const SORT_FIELDS = ["nama", "kode", "nozzle", "rating", "jarak"] as const;

export type SortField = (typeof SORT_FIELDS)[number];

/** Mirror of `SearchSpbuRequest`. Array filters take the exact facet values. */
export type SearchSpbuParams = PaginationParams & {
  engine?: SearchEngineKind;
  regional?: string[];
  provinsi?: string[];
  kota?: string[];
  produk?: string[];
  fasilitas?: string[];
  status?: string[];
  tipeKepemilikan?: string[];
  ratingMin?: number;
  ulasanMin?: number;
  /** Radius filter; all three are required together. */
  lat?: number;
  lon?: number;
  radiusKm?: number;
  /** Map-viewport filter ("search this area"); all four are required together. */
  latMin?: number;
  lonMin?: number;
  latMax?: number;
  lonMax?: number;
  /** Top-N size for the provinsi and kota facets. Raise it for client-side filtering. */
  facetSize?: number;
  includeFacets?: boolean;
};

export type FacetBucket = {
  nilai: string;
  jumlah: number;
};

/**
 * What the engine actually did for this request. Lets the UI say "this engine
 * cannot do that" instead of silently showing an empty panel.
 */
export type SearchCapabilities = {
  highlight: boolean;
  facet: boolean;
  fuzzy: boolean;
  relevansi: boolean;
  sinonim: boolean;
  geo: boolean;
};

/**
 * Mirror of `SpbuSearchItem`. Carries the whole document — the backend has no
 * per-SPBU detail endpoint precisely because a detail view needs no second call.
 */
export type SpbuSearchItem = {
  id: string;
  kodeSpbu: string;
  nama: string;
  alamat: string;
  kodePos: string | null;
  kota: string;
  provinsi: string;
  regional: string;
  regionalNama: string;
  tipeKepemilikan: string;
  status: string;
  jumlahDispenser: number;
  jumlahNozzle: number;
  /** ISO 8601, or null when the station has no recorded start of operations. */
  tanggalOperasi: string | null;
  nomorTelepon: string | null;
  /** null means "not yet reviewed", which is not the same as a low score. */
  rating: number | null;
  jumlahUlasan: number;
  latitude: number;
  longitude: number;
  produk: string[];
  produkNama: string[];
  fasilitas: string[];
  fasilitasNama: string[];
  score: number | null;
  /** Field name → snippets containing `<mark>`; null when unsupported. */
  highlight: Record<string, string[]> | null;
  /** Only filled when the query carried coordinates. */
  jarakKm: number | null;
};

export type SearchSpbuResponse = {
  items: SpbuSearchItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  /** Engine-side execution time; this is the "(0,23 detik)" number. */
  tookMs: number;
  engine: SearchEngineKind;
  /** Ordering actually applied, e.g. "Relevansi" or "Nama A - Z". */
  urutan: string;
  /** null when the engine cannot produce facets — not the same as "no results". */
  facets: Partial<Record<FacetKey, FacetBucket[]>> | null;
  kemampuan: SearchCapabilities;
  /** Parts of the request that could not be honoured, in plain Indonesian. */
  catatan: string[];
};

export type SpbuSuggestionItem = {
  kodeSpbu: string;
  nama: string;
  kota: string;
  provinsi: string;
};

export type SpbuSuggestionResponse = {
  items: SpbuSuggestionItem[];
  tookMs: number;
};

export type OcrResult = {
  teks: string;
  /** 0..1; low values usually mean a blurry, skewed or dim photo. */
  keyakinan: number;
  bahasa: string;
  durasiMs: number;
};

export type SearchByImageResponse = {
  ocr: OcrResult;
  kataKunci: string;
  kodeSpbuTerdeteksi: string | null;
  hasil: SearchSpbuResponse;
};

/** Mirror of `BenchmarkRequest`; deliberately not a subtype of the search params. */
export type BenchmarkParams = {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  regional?: string[];
  provinsi?: string[];
  kota?: string[];
  produk?: string[];
  fasilitas?: string[];
  status?: string[];
  tipeKepemilikan?: string[];
  ratingMin?: number;
  ulasanMin?: number;
  lat?: number;
  lon?: number;
  radiusKm?: number;
  latMin?: number;
  lonMin?: number;
  latMax?: number;
  lonMax?: number;
  /** Measurements per engine. Send 1 when the user is only paging. */
  iterasi?: number;
  /** Discard one untimed run first, so query compilation is not counted. */
  warmup?: boolean;
};

export type BenchmarkEngineResult = {
  engine: SearchEngineKind;
  waktuMs: number;
  totalHasil: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  urutan: string;
  items: SpbuSearchItem[];
};

export type BenchmarkResponse = {
  kueri: string | null;
  iterasi: number;
  /** Whole indexed corpus, not just the matches. */
  totalDokumen: number;
  pemenang: SearchEngineKind;
  kaliLebihCepat: number;
  elasticsearch: BenchmarkEngineResult;
  sql: BenchmarkEngineResult;
};

export type ReindexResponse = {
  jobId: string;
  dashboard: string;
};
