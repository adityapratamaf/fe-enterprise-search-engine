const integer = new Intl.NumberFormat("id-ID");
const oneDecimal = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const twoDecimals = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const EMPTY_VALUE = "—";

export function formatCount(value: number): string {
  return integer.format(value);
}

/** null means "not yet reviewed", which must not be shown as a zero score. */
export function formatRating(rating: number | null): string {
  return rating === null ? EMPTY_VALUE : oneDecimal.format(rating);
}

export function formatDistance(jarakKm: number | null): string | null {
  if (jarakKm === null) return null;
  return jarakKm < 1
    ? `${integer.format(Math.round(jarakKm * 1000))} m`
    : `${oneDecimal.format(jarakKm)} km`;
}

/** Engine timing, rendered the way the results header reads it: "(0,23 detik)". */
export function formatSeconds(tookMs: number): string {
  return `${twoDecimals.format(tookMs / 1000)} detik`;
}

export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return EMPTY_VALUE;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return EMPTY_VALUE;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

/** Splits a camel-ish backend enum name for display: "TidakAktif" → "Tidak Aktif". */
export function humanizeEnum(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function googleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

export function googleMapsDirectionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
