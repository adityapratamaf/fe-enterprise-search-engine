import type { FacetKey } from "@/api";

/** Facility codes seeded by the backend (`FasilitasSeeder`). */
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

export function facilityIcon(code: string): string {
  return FACILITY_ICONS[code] ?? FALLBACK_FACILITY_ICON;
}

/**
 * "Buka 24 jam" is a facility in the data model, not a status. The old UI
 * printed that badge on every card regardless of the station.
 */
export const OPEN_24H_CODE = "BUKA_24_JAM";

export function isOpen24Hours(fasilitas: string[]): boolean {
  return fasilitas.includes(OPEN_24H_CODE);
}

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

/**
 * Facet values arrive as codes (`PERTAMAX_TURBO`). Items carry a parallel
 * `*Nama` array with display names, so the result list builds a code → name map
 * and the sidebar reads through here.
 */
export function prettifyCode(code: string): string {
  return code
    .split("_")
    .map((part) => (part.length > 3 ? part[0] + part.slice(1).toLowerCase() : part))
    .join(" ");
}
