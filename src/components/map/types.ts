import type { SpbuSearchItem } from "@/api";
import type { ReactNode } from "react";
import type { LatLng, MapBounds } from "@/types/map";

/** Only what the map needs from a station, so markers do not carry whole documents. */
export type SpbuMarker = {
  kodeSpbu: string;
  nama: string;
  alamat: string;
  kota: string;
  status: string;
  position: LatLng;
};

export function toMarker(item: SpbuSearchItem): SpbuMarker {
  return {
    kodeSpbu: item.kodeSpbu,
    nama: item.nama,
    alamat: item.alamat,
    kota: item.kota,
    status: item.status,
    position: [item.latitude, item.longitude],
  };
}

/** Imperative handles the map hands to its overlay chrome. */
export type MapHandles = {
  zoomIn: () => void;
  zoomOut: () => void;
  recenter: () => void;
};

export type SpbuMapProps = {
  markers: SpbuMarker[];
  /** Station drawn as the active pin, by code. */
  selectedKode?: string | null;
  /**
   * Station to fly to. Separate from `selectedKode` because the panel
   * highlights the first result by default, and flying there on load would
   * zoom past the overview the design shows.
   */
  focusKode?: string | null;
  onSelect?: (kode: string) => void;
  /** Fired after the user stops panning or zooming, for "search this area". */
  onBoundsChange?: (bounds: MapBounds) => void;
  /** Persist the view to the shared store, so other screens resume where this left off. */
  rememberView?: boolean;
  className?: string;
  /** Fit the viewport to all markers once they arrive. */
  fitToMarkers?: boolean;
  /** Chrome drawn over the map, wired to the live Leaflet instance. */
  renderOverlay?: (handles: MapHandles) => ReactNode;
};
