import type { SpbuSearchItem } from "@/api";
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

export type SpbuMapProps = {
  markers: SpbuMarker[];
  /** Station to highlight and centre on, by code. */
  selectedKode?: string | null;
  onSelect?: (kode: string) => void;
  /** Fired after the user stops panning or zooming, for "search this area". */
  onBoundsChange?: (bounds: MapBounds) => void;
  /** Persist the view to the shared store, so other screens resume where this left off. */
  rememberView?: boolean;
  className?: string;
  /** Fit the viewport to all markers once they arrive. */
  fitToMarkers?: boolean;
};
