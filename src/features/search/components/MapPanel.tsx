import { lazy, Suspense, useMemo } from "react";
import type { SpbuSearchItem } from "@/api";
import { Icon, Skeleton } from "@/components/ui";
import { toMarker } from "@/features/map/types";
import { formatCoordinates, googleMapsUrl } from "@/utils/format";

/**
 * Leaflet and its clustering plugin are ~200 kB, and the map is a side panel —
 * the result list is what the page is for. Loading it after first paint keeps
 * that weight off the critical path; the container has a fixed height, so the
 * fallback does not shift anything around it.
 */
const SpbuMap = lazy(() =>
  import("@/features/map/components/SpbuMap").then((module) => ({ default: module.SpbuMap })),
);

/**
 * The map beside the search results. Shows every station on the current page so
 * the list and the map describe the same set, with the selected one highlighted.
 */
export function MapPanel({
  items,
  selected,
  onSelect,
}: {
  items: SpbuSearchItem[];
  selected: SpbuSearchItem | null;
  onSelect: (kode: string) => void;
}) {
  const markers = useMemo(() => items.map(toMarker), [items]);

  return (
    <div className="relative h-[260px] overflow-hidden rounded-xl border border-line-200">
      <Suspense fallback={<Skeleton className="h-full w-full rounded-none" />}>
        <SpbuMap
          markers={markers}
          selectedKode={selected?.kodeSpbu ?? null}
          onSelect={onSelect}
          fitToMarkers={selected === null}
        />
      </Suspense>

      {selected && (
        <a
          href={googleMapsUrl(selected.latitude, selected.longitude)}
          target="_blank"
          rel="noreferrer noopener"
          className="absolute bottom-2 left-2 z-[500] rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-medium text-brand-700 shadow transition hover:bg-white"
        >
          <Icon name="map-pin-2-line" className="mr-1" />
          {formatCoordinates(selected.latitude, selected.longitude)}
          <Icon name="external-link-line" className="ml-1" />
        </a>
      )}
    </div>
  );
}
