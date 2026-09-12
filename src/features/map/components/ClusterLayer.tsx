import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import { useMap } from "react-leaflet";
import type { SpbuMarker } from "../types";
import { createClusterIcon, createStationIcon } from "./markerIcons";

type Props = {
  markers: SpbuMarker[];
  selectedKode: string | null;
  onSelect?: (kode: string) => void;
};

/**
 * Renders stations through `leaflet.markercluster`. There is no React wrapper
 * for it in this project's dependencies, and rendering thousands of `<Marker>`
 * elements would not cluster anyway — so the layer is driven imperatively and
 * rebuilt whenever the marker set changes.
 */
export function ClusterLayer({ markers, selectedKode, onSelect }: Props) {
  const map = useMap();

  /**
   * Latest-ref pattern: the rebuild effect below tears down and recreates every
   * marker, so it must not re-run just because the parent passed a new callback
   * identity. Synced in its own effect rather than during render.
   */
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 56,
      iconCreateFunction: (cluster) => createClusterIcon(cluster.getChildCount()),
    });

    for (const station of markers) {
      const marker = L.marker(station.position, {
        icon: createStationIcon(station.status, station.kodeSpbu === selectedKode),
        title: station.nama,
        alt: station.nama,
        // Keeps the selected pin above its neighbours.
        zIndexOffset: station.kodeSpbu === selectedKode ? 1000 : 0,
      });

      marker.bindPopup(
        `<strong>${escapeHtml(station.nama)}</strong><br/>` +
          `<span>${escapeHtml(station.kodeSpbu)} &middot; ${escapeHtml(station.kota)}</span><br/>` +
          `<span>${escapeHtml(station.alamat)}</span>`,
      );

      marker.on("click", () => onSelectRef.current?.(station.kodeSpbu));
      group.addLayer(marker);
    }

    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [map, markers, selectedKode]);

  return null;
}

/** Popup content is built as an HTML string, so station text must be escaped. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
