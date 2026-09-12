import type { SpbuSearchItem } from "@/api";
import { Badge, Card, CardBody, Icon, Skeleton } from "@/components/ui";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  EMPTY_VALUE,
  formatCoordinates,
  formatCount,
  formatDate,
  formatDistance,
  formatRating,
  googleMapsDirectionsUrl,
  humanizeEnum,
} from "@/lib/format";
import { facilityIcon, isOpen24Hours } from "../lib/taxonomy";
import { PreviewMap } from "./PreviewMap";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-semibold text-ink-800">{value}</dd>
    </>
  );
}

/**
 * Every field here comes from the search result document. The old panel hardcoded
 * provinsi, regional, ownership and coordinates, and guessed the city by testing
 * whether the address string contained the word "Timur".
 */
export function SpbuDetailPanel({
  item,
  isLoading,
}: {
  item: SpbuSearchItem | null;
  isLoading: boolean;
}) {
  if (isLoading && !item) {
    return (
      <Card className="overflow-hidden">
        <CardBody className="space-y-3 p-2">
          <Skeleton className="h-[260px] w-full rounded-xl" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </CardBody>
      </Card>
    );
  }

  if (!item) {
    return (
      <Card>
        <CardBody className="grid min-h-[320px] place-items-center text-center">
          <div>
            <Icon name="gas-station-line" className="text-4xl text-ink-300" />
            <h2 className="mt-3 text-sm font-bold text-ink-800">Belum ada SPBU dipilih</h2>
            <p className="mt-1 text-xs text-ink-500">
              Pilih salah satu hasil untuk melihat rinciannya di sini.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const distance = formatDistance(item.jarakKm);

  return (
    <Card className="overflow-hidden lg:sticky lg:top-[70px]">
      <CardBody className="p-2">
        <PreviewMap latitude={item.latitude} longitude={item.longitude} nama={item.nama} />

        <div className="mt-2 rounded-lg border border-line-200 p-3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[15px] font-bold text-brand-600">{item.nama}</h2>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <StatusBadge status={item.status} />
              {isOpen24Hours(item.fasilitas) && <Badge tone="brand">Buka 24 jam</Badge>}
            </div>
          </div>

          <p className="mt-1 text-[11px] text-ink-600">
            {item.rating === null ? (
              <span className="text-ink-400">Belum ada ulasan</span>
            ) : (
              <>
                <Icon name="star-fill" className="mr-1 text-warning-500" />
                {formatRating(item.rating)} ({formatCount(item.jumlahUlasan)} ulasan)
              </>
            )}
            {distance && <span className="ml-2">· {distance} dari titik acuan</span>}
          </p>

          <p className="mt-2 flex items-start gap-1 text-[11px] leading-4 text-ink-600">
            <Icon name="map-pin-line" className="mt-0.5 shrink-0" />
            <span>
              {item.alamat}
              {item.kodePos ? ` ${item.kodePos}` : ""}
            </span>
          </p>

          <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-[10px]">
            <DetailRow label="Kode SPBU" value={item.kodeSpbu} />
            <DetailRow label="Provinsi" value={item.provinsi} />
            <DetailRow label="Kota / Kabupaten" value={item.kota} />
            <DetailRow label="Regional" value={`${item.regionalNama} (${item.regional})`} />
            <DetailRow label="Tipe Kepemilikan" value={humanizeEnum(item.tipeKepemilikan)} />
            <DetailRow
              label="Dispenser / Nozzle"
              value={`${formatCount(item.jumlahDispenser)} / ${formatCount(item.jumlahNozzle)}`}
            />
            <DetailRow label="Mulai Operasi" value={formatDate(item.tanggalOperasi)} />
            <DetailRow label="Telepon" value={item.nomorTelepon ?? EMPTY_VALUE} />
            <DetailRow label="Koordinat" value={formatCoordinates(item.latitude, item.longitude)} />
          </dl>

          {item.produk.length > 0 && (
            <>
              <h3 className="mt-3 text-[11px] font-bold text-ink-800">Produk Tersedia</h3>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {item.produk.map((code, index) => (
                  <li key={code}>
                    <Badge>{item.produkNama[index] ?? code}</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}

          {item.fasilitas.length > 0 && (
            <>
              <h3 className="mt-3 text-[11px] font-bold text-ink-800">Fasilitas</h3>
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-ink-600">
                {item.fasilitas.map((code, index) => (
                  <li key={code} className="flex items-center gap-1">
                    <Icon name={facilityIcon(code)} className="text-[13px]" />
                    {item.fasilitasNama[index] ?? code}
                  </li>
                ))}
              </ul>
            </>
          )}

          <a
            href={googleMapsDirectionsUrl(item.latitude, item.longitude)}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 text-[11px] font-semibold text-white transition hover:bg-brand-700"
          >
            <Icon name="navigation-line" />
            Rute ke SPBU ini
          </a>
        </div>
      </CardBody>
    </Card>
  );
}
