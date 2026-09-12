import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useMapViewStore } from "@/stores/useMapViewStore";
import { cn } from "@/lib/utils";
import type { MapBounds } from "@/types/map";
import { DEFAULT_CENTER, DEFAULT_ZOOM, FOCUS_ZOOM, MAX_BOUNDS, TILE_LAYER } from "../data";
import type { SpbuMapProps } from "../types";
import { ClusterLayer } from "./ClusterLayer";

/** Reports the viewport after movement settles, and optionally remembers it. */
function ViewReporter({
  onBoundsChange,
  rememberView,
}: {
  onBoundsChange?: (bounds: MapBounds) => void;
  rememberView: boolean;
}) {
  const setView = useMapViewStore((state) => state.setView);

  const map = useMapEvents({
    moveend: () => {
      if (rememberView) {
        const center = map.getCenter();
        setView({ center: [center.lat, center.lng], zoom: map.getZoom() });
      }

      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange({
          latMin: bounds.getSouth(),
          lonMin: bounds.getWest(),
          latMax: bounds.getNorth(),
          lonMax: bounds.getEast(),
        });
      }
    },
  });

  return null;
}

/** Flies to the selected station, and fits all markers when asked to. */
function ViewController({
  selectedPosition,
  fitBounds,
}: {
  selectedPosition: [number, number] | null;
  fitBounds: L.LatLngBoundsExpression | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!fitBounds) return;
    map.fitBounds(fitBounds, { padding: [40, 40], maxZoom: FOCUS_ZOOM });
  }, [map, fitBounds]);

  useEffect(() => {
    if (!selectedPosition) return;
    map.flyTo(selectedPosition, Math.max(map.getZoom(), FOCUS_ZOOM), { duration: 0.6 });
  }, [map, selectedPosition]);

  return null;
}

/**
 * The project's only real map. `PreviewMap`, the CSS-gradient placeholder it
 * replaces, drew invented markers and city labels over a fake background.
 */
export function SpbuMap({
  markers,
  selectedKode = null,
  onSelect,
  onBoundsChange,
  rememberView = false,
  fitToMarkers = false,
  className,
}: SpbuMapProps) {
  /**
   * Selected one field at a time. zustand v5 compares snapshots with Object.is
   * and has no built-in shallow equality, so a selector returning a fresh object
   * (`{ center, zoom }`) makes every render look like a state change and loops
   * until React throws "Maximum update depth exceeded".
   */
  const storedCenter = useMapViewStore((state) => state.center);
  const storedZoom = useMapViewStore((state) => state.zoom);

  const selected = markers.find((marker) => marker.kodeSpbu === selectedKode) ?? null;

  const fitBounds = useMemo(() => {
    if (!fitToMarkers || markers.length === 0) return null;
    return L.latLngBounds(markers.map((marker) => marker.position));
  }, [fitToMarkers, markers]);

  const initial = rememberView
    ? { center: storedCenter, zoom: storedZoom }
    : { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };

  return (
    <MapContainer
      // `center`/`zoom` are only read on mount; later moves go through ViewController.
      center={initial.center}
      zoom={initial.zoom}
      maxBounds={MAX_BOUNDS}
      maxBoundsViscosity={0.6}
      scrollWheelZoom
      className={cn("h-full w-full", className)}
    >
      <TileLayer
        url={TILE_LAYER.url}
        attribution={TILE_LAYER.attribution}
        maxZoom={TILE_LAYER.maxZoom}
      />
      <ClusterLayer markers={markers} selectedKode={selectedKode} onSelect={onSelect} />
      <ViewController
        selectedPosition={selected ? selected.position : null}
        fitBounds={fitBounds}
      />
      <ViewReporter onBoundsChange={onBoundsChange} rememberView={rememberView} />
    </MapContainer>
  );
}
