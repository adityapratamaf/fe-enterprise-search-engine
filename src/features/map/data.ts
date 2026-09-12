import type { LatLng } from "@/types/map";

/** Roughly Jakarta, the densest part of the dataset. */
export const DEFAULT_CENTER: LatLng = [-6.2088, 106.8456];
export const DEFAULT_ZOOM = 11;

/** Zoom used when flying to a single station. */
export const FOCUS_ZOOM = 15;

/** Indonesia, so the map cannot be panned off into empty ocean forever. */
export const MAX_BOUNDS: [LatLng, LatLng] = [
  [-11.5, 94.5],
  [6.5, 141.5],
];

/**
 * OpenStreetMap raster tiles: no API key, and the attribution below satisfies
 * their usage policy. Swap both fields together if a paid provider is adopted.
 */
export const TILE_LAYER = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
};

/** Marker colour per operational status, matching the app's semantic palette. */
export const STATUS_COLORS: Record<string, string> = {
  aktif: "#1268ee",
  tidakaktif: "#8397b1",
  maintenance: "#ffb400",
  tutup: "#d92d20",
};

export const FALLBACK_STATUS_COLOR = "#8397b1";

/** Cluster bubble sizes, by how many stations they contain. */
export const CLUSTER_TIERS = [
  { max: 9, size: 34, className: "cluster-sm" },
  { max: 49, size: 40, className: "cluster-md" },
  { max: Infinity, size: 48, className: "cluster-lg" },
];

export const MAP_LEGEND = [
  { status: "Aktif", color: STATUS_COLORS.aktif },
  { status: "Maintenance", color: STATUS_COLORS.maintenance },
  { status: "Tidak Aktif", color: STATUS_COLORS.tidakaktif },
  { status: "Tutup", color: STATUS_COLORS.tutup },
];
