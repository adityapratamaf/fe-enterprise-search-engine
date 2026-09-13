import { useCallback, useEffect, useMemo, useState } from "react";
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
 * The project's only real map. Leaflet's built-in zoom control is switched off
 * so the overlay chrome in `MapControls` can own that corner; `renderOverlay`
 * receives imperative handles bound to this map instance.
 */
export function SpbuMap({
  markers,
  selectedKode = null,
  focusKode = null,
  onSelect,
  onBoundsChange,
  rememberView = false,
  fitToMarkers = false,
  className,
  renderOverlay,
}: SpbuMapProps) {
  /**
   * Selected one field at a time. zustand v5 compares snapshots with Object.is
   * and has no built-in shallow equality, so a selector returning a fresh object
   * (`{ center, zoom }`) makes every render look like a state change and loops
   * until React throws "Maximum update depth exceeded".
   */
  const storedCenter = useMapViewStore((state) => state.center);
  const storedZoom = useMapViewStore((state) => state.zoom);

  const [map, setMap] = useState<L.Map | null>(null);

  const selected = markers.find((marker) => marker.kodeSpbu === selectedKode) ?? null;
  const focused = markers.find((marker) => marker.kodeSpbu === focusKode) ?? null;

  /** Fit the whole set until the user picks a station to look at. */
  const shouldFit = fitToMarkers && focusKode === null;

  const fitBounds = useMemo(() => {
    if (!shouldFit || markers.length === 0) return null;
    return L.latLngBounds(markers.map((marker) => marker.position));
  }, [shouldFit, markers]);

  const initial = rememberView
    ? { center: storedCenter, zoom: storedZoom }
    : { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };

  const zoomIn = useCallback(() => map?.zoomIn(), [map]);
  const zoomOut = useCallback(() => map?.zoomOut(), [map]);
  const recenter = useCallback(() => {
    if (!map) return;
    if (selected) map.flyTo(selected.position, FOCUS_ZOOM, { duration: 0.6 });
    else if (fitBounds) map.fitBounds(fitBounds, { padding: [40, 40], maxZoom: FOCUS_ZOOM });
  }, [map, selected, fitBounds]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <MapContainer
        ref={setMap}
        // `center`/`zoom` are only read on mount; later moves go through ViewController.
        center={initial.center}
        zoom={initial.zoom}
        maxBounds={MAX_BOUNDS}
        maxBoundsViscosity={0.6}
        scrollWheelZoom
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url={TILE_LAYER.url}
          attribution={TILE_LAYER.attribution}
          maxZoom={TILE_LAYER.maxZoom}
        />
        <ClusterLayer markers={markers} selectedKode={selectedKode} onSelect={onSelect} />
        <ViewController
          selectedPosition={focused ? focused.position : null}
          fitBounds={fitBounds}
        />
        <ViewReporter onBoundsChange={onBoundsChange} rememberView={rememberView} />
      </MapContainer>

      {renderOverlay?.({ zoomIn, zoomOut, recenter })}

      {/* Attribution still has to appear; the default control is off so it can
          sit unobtrusively rather than under the overlay chrome. */}
      <span className="pointer-events-none absolute bottom-0 left-0 z-[450] bg-white/70 px-1 text-[8px] leading-tight text-ink-400">
        © OpenStreetMap
      </span>
    </div>
  );
}
