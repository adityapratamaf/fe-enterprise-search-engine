import { Icon } from "@/components/ui";
import { formatCoordinates, googleMapsUrl } from "@/lib/format";

/**
 * Still a stylised placeholder rather than a real map — Leaflet is installed but
 * unused, and wiring it up is a product decision, not part of this refactor.
 * What changed: it no longer draws invented markers and city labels. It shows the
 * selected station's real coordinates and links out to them.
 */
export function PreviewMap({
  latitude,
  longitude,
  nama,
}: {
  latitude: number;
  longitude: number;
  nama: string;
}) {
  return (
    <div className="relative h-[260px] overflow-hidden rounded-xl bg-[#e9f1e8]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "linear-gradient(30deg, rgba(255,255,255,.8) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.8) 87.5%, rgba(255,255,255,.8)), linear-gradient(150deg, rgba(255,255,255,.7) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.7) 87.5%, rgba(255,255,255,.7)), linear-gradient(60deg, #d8ead2 25%, #cfe4cc 25%, #cfe4cc 75%, #d8ead2 75%)",
          backgroundSize: "80px 140px",
        }}
      />

      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-brand-600 text-white shadow">
            <Icon name="gas-station-fill" label={`Lokasi ${nama}`} />
          </span>
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium text-ink-700 shadow-sm">
            {formatCoordinates(latitude, longitude)}
          </span>
        </div>
      </div>

      <a
        href={googleMapsUrl(latitude, longitude)}
        target="_blank"
        rel="noreferrer noopener"
        className="absolute bottom-2 left-2 rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-medium text-brand-700 shadow transition hover:bg-white"
      >
        <Icon name="map-pin-2-line" className="mr-1" />
        Buka di Google Maps
        <Icon name="external-link-line" className="ml-1" />
      </a>

      <p className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[9px] font-medium text-ink-500 shadow-sm">
        Pratinjau lokasi
      </p>
    </div>
  );
}
