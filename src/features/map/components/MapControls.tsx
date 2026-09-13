import { useId } from "react";
import { Button, Checkbox, Icon } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Overlay chrome for the map. Rendered as a sibling of the Leaflet container
 * rather than inside it: controls placed inside the map's own panes let clicks
 * fall through to the map and start a drag, which needs Leaflet's
 * `disableClickPropagation` to suppress. Sitting outside avoids the problem.
 */
export function MapControls({
  onZoomIn,
  onZoomOut,
  onRecenter,
  googleMapsUrl,
  searchInArea,
  onSearchInAreaChange,
  className,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  /** Omitted when nothing is selected, so the link never points nowhere. */
  googleMapsUrl?: string;
  searchInArea: boolean;
  onSearchInAreaChange: (next: boolean) => void;
  className?: string;
}) {
  // Explicit id/htmlFor rather than relying on nesting: the checkbox is a custom
  // component, so static analysis cannot see a control inside the label.
  const checkboxId = useId();

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-[500]", className)}>
      <label
        htmlFor={checkboxId}
        className="pointer-events-auto absolute right-2 top-2 flex cursor-pointer items-center gap-2 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-medium text-ink-700 shadow-md backdrop-blur"
      >
        <Checkbox
          id={checkboxId}
          checked={searchInArea}
          onChange={(event) => onSearchInAreaChange(event.target.checked)}
        />
        Cari di area peta ini
      </label>

      <div className="pointer-events-auto absolute bottom-2 right-2 flex flex-col gap-1.5">
        <div className="flex flex-col overflow-hidden rounded-lg bg-white/95 shadow-md backdrop-blur">
          <Button
            variant="floating"
            size="icon-lg"
            aria-label="Perbesar peta"
            onClick={onZoomIn}
            className="rounded-none shadow-none"
          >
            <Icon name="add-line" />
          </Button>
          <div role="presentation" className="h-px bg-line-100" />
          <Button
            variant="floating"
            size="icon-lg"
            aria-label="Perkecil peta"
            onClick={onZoomOut}
            className="rounded-none shadow-none"
          >
            <Icon name="subtract-line" />
          </Button>
        </div>

        <Button
          variant="floating"
          size="icon-lg"
          aria-label="Pusatkan ke SPBU terpilih"
          onClick={onRecenter}
        >
          <Icon name="focus-3-line" />
        </Button>
      </div>

      {googleMapsUrl && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="pointer-events-auto absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-brand-600 shadow-md backdrop-blur transition hover:bg-white"
        >
          <Icon name="map-pin-2-line" />
          Buka di Google Maps
          <Icon name="external-link-line" />
        </a>
      )}
    </div>
  );
}
