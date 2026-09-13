import { lazy, Suspense, useMemo } from "react";
import type { SpbuSearchItem } from "@/api";
import { Card, Skeleton } from "@/components/ui";
import { MapControls } from "@/features/map/components/MapControls";
import { toMarker } from "@/features/map/types";
import type { MapBounds } from "@/types/map";
import { googleMapsUrl } from "@/utils/format";

/**
 * Leaflet and its clustering plugin are ~190 kB, and the map is a side panel —
 * the result list is what the page is for. Loading it after first paint keeps
 * that weight off the critical path; the container has a fixed height, so the
 * fallback does not shift anything around it.
 */
const SpbuMap = lazy(() =>
  import("@/features/map/components/SpbuMap").then((module) => ({ default: module.SpbuMap })),
);

type Props = {
  items: SpbuSearchItem[];
  selected: SpbuSearchItem | null;
  /** Only set once the user picks a result, so the map opens on an overview. */
  focusKode: string | null;
  onSelect: (kode: string) => void;
  /** Reflects whether the viewport filter is on; drives the overlay checkbox. */
  searchInArea: boolean;
  onSearchInAreaChange: (next: boolean) => void;
  /** Latest viewport, reported after the user stops panning. */
  onBoundsChange: (bounds: MapBounds) => void;
};

/**
 * The map beside the search results. Shows every station on the current page so
 * the list and the map describe the same set, with the selected one highlighted.
 */
export function MapPanel({
  items,
  selected,
  focusKode,
  onSelect,
  searchInArea,
  onSearchInAreaChange,
  onBoundsChange,
}: Props) {
  const markers = useMemo(() => items.map(toMarker), [items]);

  return (
    <Card className="overflow-hidden">
      <div className="h-[268px]">
        <Suspense fallback={<Skeleton className="h-full w-full rounded-none" />}>
          <SpbuMap
            markers={markers}
            selectedKode={selected?.kodeSpbu ?? null}
            focusKode={focusKode}
            onSelect={onSelect}
            fitToMarkers
            onBoundsChange={onBoundsChange}
            renderOverlay={({ zoomIn, zoomOut, recenter }) => (
              <MapControls
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onRecenter={recenter}
                searchInArea={searchInArea}
                onSearchInAreaChange={onSearchInAreaChange}
                googleMapsUrl={
                  selected ? googleMapsUrl(selected.latitude, selected.longitude) : undefined
                }
              />
            )}
          />
        </Suspense>
      </div>
    </Card>
  );
}
