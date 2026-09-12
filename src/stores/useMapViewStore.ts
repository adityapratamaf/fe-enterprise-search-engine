import { create } from "zustand";
import type { LatLng, MapView } from "@/types/map";

/** Roughly Jakarta, the densest part of the dataset. */
export const DEFAULT_CENTER: LatLng = [-6.2088, 106.8456];
export const DEFAULT_ZOOM = 11;

type MapViewState = MapView & {
  setView: (view: MapView) => void;
  reset: () => void;
};

/**
 * Where the map is looking, kept outside the component tree so the standalone
 * map page and the map panel inside search do not reset each other's position
 * when the user moves between them.
 */
export const useMapViewStore = create<MapViewState>((set) => ({
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  setView: (view) => set(view),
  reset: () => set({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM }),
}));
