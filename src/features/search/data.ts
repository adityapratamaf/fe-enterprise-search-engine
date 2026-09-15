import type { FacetKey, SearchCapabilities, SearchEngineKind } from "@/api";
import type { SortOption } from "./types";

// ---------------------------------------------------------------------------
// URL contract
// ---------------------------------------------------------------------------

/** Query-string keys for the non-facet part of the search state. */
export const QUERY_KEYS = {
  keyword: "q",
  engine: "engine",
  page: "page",
  size: "size",
  sort: "sort",
  desc: "desc",
  ratingMin: "rating",
  ulasanMin: "ulasan",
  /** "latMin,lonMin,latMax,lonMax" — one key keeps the URL readable. */
  bounds: "area",
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_ENGINE: SearchEngineKind = "Elasticsearch";

/** Provinsi and kota need the full list so the panel can filter client-side. */
export const FACET_SIZE = 600;

// ---------------------------------------------------------------------------
// Search bar
// ---------------------------------------------------------------------------

/** Example queries offered under the search box. Each one returns results. */
export const EXAMPLE_QUERIES = [
  "Pertamax",
  "SPBU Jakarta Selatan",
  "Jl Sudirman",
  "Pertalite",
  "Musholla",
];

/** The backend returns nothing below this length, so there is no point asking. */
export const SUGGESTION_MIN_LENGTH = 2;
export const SUGGESTION_DEBOUNCE_MS = 250;
export const SUGGESTION_LIMIT = 8;

/** Limits for the OCR upload, mirroring the backend's own validation. */
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const IMAGE_ACCEPTED_TYPES = ["image/png", "image/jpeg"];

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/** `value` encodes field and direction together so one select drives both. */
export const SORT_OPTIONS: SortOption[] = [
  { value: "", label: "Relevansi" },
  { value: "nama:asc", label: "Nama A - Z" },
  { value: "nama:desc", label: "Nama Z - A" },
  { value: "rating:desc", label: "Rating tertinggi" },
  { value: "jarak:asc", label: "Jarak terdekat" },
  { value: "nozzle:desc", label: "Nozzle terbanyak" },
  { value: "kode:asc", label: "Kode menaik" },
];

/** How many products and facilities a result card shows before collapsing. */
export const PRODUCT_LIMIT = 4;
export const FACILITY_LIMIT = 5;

/** Per-item delay for the results fade-in. */
export const RESULT_STAGGER_SECONDS = 0.04;

/** Numbered page buttons rendered either side of the current page. */
export const PAGINATION_WINDOW = 2;

// ---------------------------------------------------------------------------
// Filter panel
// ---------------------------------------------------------------------------

/** Values shown per facet group before "Tampilkan lainnya". */
export const FACET_COLLAPSED_LIMIT = 6;

/** Below this many values, a per-group search box is more noise than help. */
export const FACET_SEARCHABLE_THRESHOLD = 8;

/** Display titles for each facet bucket the backend returns. */
export const FACET_LABELS: Record<FacetKey, string> = {
  regional: "Regional",
  provinsi: "Provinsi",
  kota: "Kota / Kabupaten",
  produk: "Produk Tersedia",
  fasilitas: "Fasilitas",
  status: "Status",
  tipeKepemilikan: "Tipe Kepemilikan",
};

/** Capability flags, in the order the engine notice lists them. */
export const CAPABILITY_LABELS: { key: keyof SearchCapabilities; label: string }[] = [
  { key: "fuzzy", label: "Toleransi salah ketik" },
  { key: "relevansi", label: "Peringkat relevansi" },
  { key: "highlight", label: "Penyorotan kata" },
  { key: "sinonim", label: "Sinonim alamat" },
  { key: "facet", label: "Hitungan filter" },
  { key: "geo", label: "Filter jarak" },
];

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

/** Regional codes and names, matching the backend's `RegionalSeeder`. */
export const REGIONAL_NAMES: Record<string, string> = {
  SUMBAGUT: "Sumatera Bagian Utara",
  SUMBAGSEL: "Sumatera Bagian Selatan",
  JBB: "Jawa Bagian Barat",
  JBT: "Jawa Bagian Tengah",
  JATIMBALINUS: "Jawa Timur, Bali & Nusa Tenggara",
  KALIMANTAN: "Kalimantan",
  SULAWESI: "Sulawesi",
  PAPUAMALUKU: "Papua & Maluku",
};

/** Facility codes seeded by the backend's `FasilitasSeeder`. */
export const FACILITY_ICONS: Record<string, string> = {
  TOILET: "men-line",
  MUSHOLLA: "home-4-line",
  ATM: "bank-card-line",
  MINIMARKET: "store-2-line",
  ISI_ANGIN: "compasses-line",
  NITROGEN: "blaze-line",
  CUCI_MOBIL: "drop-line",
  BENGKEL: "tools-line",
  RUMAH_MAKAN: "restaurant-line",
  CHARGING_EV: "charging-pile-2-line",
  BUKA_24_JAM: "time-line",
};

export const FALLBACK_FACILITY_ICON = "checkbox-circle-line";

/** "Buka 24 jam" is a facility in the data model, not a status. */
export const OPEN_24H_CODE = "BUKA_24_JAM";

/** Shared station photo in `public/`, used until the API carries real images. */
export const SPBU_IMAGE_FALLBACK = "/spbu-default.png";

/** Wide photograph behind the search hero. */
export const HERO_IMAGE = "/hero-background.png";

/** Illustration on the pre-search landing screen. */
export const LANDING_ILLUSTRATION = "/search-spbu.png";

/** Skyline artwork closing the landing screen. */
export const LANDING_FOOTER_ARTWORK = "/footer.png";

/**
 * Capability tiles on the landing screen. Icon colours are written as whole
 * class names because Tailwind scans source text — a template such as
 * `bg-tile-${tone}-soft` would never be generated.
 */
export const LANDING_FEATURES = [
  {
    icon: "search-2-line",
    tone: "bg-tile-blue-soft text-tile-blue-strong",
    title: "Cari apa saja",
    body: "Nama SPBU, alamat, kota, provinsi, produk, atau fasilitas.",
  },
  {
    icon: "character-recognition-line",
    tone: "bg-tile-violet-soft text-tile-violet-strong",
    title: "Toleransi salah ketik",
    body: "Elasticsearch tetap menemukan hasil meski kata kunci tidak tepat.",
  },
  {
    icon: "image-line",
    tone: "bg-tile-green-soft text-tile-green-strong",
    title: "Cari lewat foto",
    body: "Unggah foto papan SPBU; teksnya dibaca menjadi kata kunci.",
  },
];

/** Popular queries on the landing screen. Each one returns results. */
export const POPULAR_QUERIES = [
  "SPBU Jakarta Selatan",
  "Pertalite",
  "Jl Sudirman",
  "Pom Bensin Jogjakarta",
  "SPBU dengan Pertamax Turbo",
];
