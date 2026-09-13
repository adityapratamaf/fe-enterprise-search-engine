import type { SpbuSearchItem } from "@/api";
import { Badge, Button, Card, Icon, SectionHeading, Skeleton } from "@/components/ui";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  EMPTY_VALUE,
  formatCoordinates,
  formatCount,
  formatDistance,
  formatRating,
  googleMapsDirectionsUrl,
  humanizeEnum,
} from "@/utils/format";
import { facilityIcon, isOpen24Hours, spbuImageUrl } from "../utils";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[11px] text-ink-500">{label}</dt>
      <dd className="text-right text-[11px] font-semibold text-ink-800">{value}</dd>
    </>
  );
}

/**
 * Details for the selected station. Every field comes from the search result
 * document — the original panel hardcoded provinsi, regional, ownership and
 * coordinates, and guessed the city by testing the address for "Timur".
 */
export function SpbuDetailPanel({
  item,
  isLoading,
  onClear,
}: {
  item: SpbuSearchItem | null;
  isLoading: boolean;
  /** Clears the selection, matching the close control in the design. */
  onClear: () => void;
}) {
  if (isLoading && !item) {
    return (
      <Card className="overflow-hidden">
        <Skeleton className="h-[126px] w-full rounded-none" />
        <div className="space-y-3 p-3.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </Card>
    );
  }

  if (!item) {
    return (
      <Card>
        <div className="grid min-h-[260px] place-items-center px-6 text-center">
          <div>
            <Icon name="gas-station-line" className="text-4xl text-ink-300" />
            <h2 className="mt-3 text-sm font-bold text-ink-800">Belum ada SPBU dipilih</h2>
            <p className="mt-1 text-xs text-ink-500">
              Pilih salah satu hasil untuk melihat rinciannya di sini.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const distance = formatDistance(item.jarakKm);
  const open24h = isOpen24Hours(item.fasilitas);

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={spbuImageUrl(item)}
          alt={`Foto ${item.nama}`}
          width={410}
          height={126}
          loading="lazy"
          decoding="async"
          className="h-[126px] w-full object-cover"
        />
        <Button
          variant="floating"
          size="icon"
          aria-label="Tutup detail SPBU"
          onClick={onClear}
          className="absolute right-2 top-2 rounded-full"
        >
          <Icon name="close-line" />
        </Button>
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-[15px] font-bold leading-tight text-brand-600">{item.nama}</h2>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {open24h ? (
              <Badge tone="success" className="gap-1 px-2 py-0.5 text-[10.5px]">
                <Icon name="time-line" />
                Buka 24 jam
              </Badge>
            ) : (
              <StatusBadge status={item.status} />
            )}
          </div>
        </div>

        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[11.5px] text-ink-600">
          {item.rating === null ? (
            <span className="text-ink-400">Belum ada ulasan</span>
          ) : (
            <>
              <span className="flex items-center gap-1 font-bold text-ink-800">
                <Icon name="star-fill" className="text-warning-500" />
                {formatRating(item.rating)}
              </span>
              <span className="text-ink-400">({formatCount(item.jumlahUlasan)} ulasan)</span>
            </>
          )}
          {distance && <span className="text-ink-400">· {distance}</span>}
        </p>

        <p className="mt-2 flex items-start gap-1.5 text-[11.5px] leading-4 text-ink-600">
          <Icon name="map-pin-line" className="mt-px shrink-0 text-ink-400" />
          <span>
            {item.alamat}
            {item.kodePos ? ` ${item.kodePos}` : ""}
            <br />
            {item.provinsi}
          </span>
        </p>

        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          <DetailRow label="Kode SPBU" value={item.kodeSpbu} />
          <DetailRow label="Provinsi" value={item.provinsi} />
          <DetailRow label="Kota" value={item.kota} />
          <DetailRow label="Regional" value={item.regionalNama} />
          <DetailRow label="Status" value={humanizeEnum(item.status)} />
          <DetailRow label="Tipe Kepemilikan" value={humanizeEnum(item.tipeKepemilikan)} />
          <DetailRow
            label="Dispenser / Nozzle"
            value={`${formatCount(item.jumlahDispenser)} / ${formatCount(item.jumlahNozzle)}`}
          />
          <DetailRow label="Telepon" value={item.nomorTelepon ?? EMPTY_VALUE} />
          <DetailRow label="Koordinat" value={formatCoordinates(item.latitude, item.longitude)} />
        </dl>

        {item.produk.length > 0 && (
          <>
            <SectionHeading className="mt-3.5">Produk Tersedia</SectionHeading>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {item.produk.map((code, index) => (
                <li key={code}>
                  <Badge className="px-2.5 py-[3px] text-[10.5px]">
                    {item.produkNama[index] ?? code}
                  </Badge>
                </li>
              ))}
            </ul>
          </>
        )}

        {item.fasilitas.length > 0 && (
          <>
            <SectionHeading className="mt-3.5">Fasilitas</SectionHeading>
            <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[10.5px] text-ink-600">
              {item.fasilitas.map((code, index) => (
                <li key={code} className="flex items-center gap-1">
                  <Icon name={facilityIcon(code)} className="text-[13px] text-ink-500" />
                  {item.fasilitasNama[index] ?? code}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button size="lg" className="text-[11.5px]">
            <Icon name="information-line" />
            Lihat Detail Lengkap
          </Button>
          <a
            href={googleMapsDirectionsUrl(item.latitude, item.longitude)}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line-500 bg-white text-[11.5px] font-semibold text-ink-800 transition hover:bg-brand-50"
          >
            <Icon name="navigation-line" />
            Rute ke Lokasi
          </a>
        </div>
      </div>
    </Card>
  );
}
