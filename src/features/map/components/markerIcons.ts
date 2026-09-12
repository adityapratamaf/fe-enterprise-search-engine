import L from "leaflet";
import { CLUSTER_TIERS, FALLBACK_STATUS_COLOR, STATUS_COLORS } from "../data";

function colorFor(status: string): string {
  return STATUS_COLORS[status.trim().toLowerCase()] ?? FALLBACK_STATUS_COLOR;
}

/**
 * Markers are `divIcon`s rather than Leaflet's default image pins. That avoids
 * the usual bundler breakage — Leaflet resolves `marker-icon.png` relative to
 * the CSS, which Vite rewrites — and lets the pin take its colour from the
 * station's status without shipping one image per state.
 */
export function createStationIcon(status: string, selected: boolean): L.DivIcon {
  const color = colorFor(status);
  const size = selected ? 34 : 26;

  return L.divIcon({
    className: "spbu-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
    html: `
      <span class="spbu-marker__pin${selected ? " spbu-marker__pin--selected" : ""}"
            style="--pin-color:${color};width:${size}px;height:${size}px"></span>
    `,
  });
}

/** Cluster bubble whose size grows with the number of stations inside it. */
export function createClusterIcon(count: number): L.DivIcon {
  const tier = CLUSTER_TIERS.find((entry) => count <= entry.max) ?? CLUSTER_TIERS.at(-1)!;

  return L.divIcon({
    className: "spbu-cluster",
    iconSize: L.point(tier.size, tier.size),
    html: `<span class="spbu-cluster__bubble ${tier.className}">${count}</span>`,
  });
}
