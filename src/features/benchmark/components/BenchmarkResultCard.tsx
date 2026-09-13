import type { SpbuSearchItem } from "@/api";
import { Badge, Icon } from "@/components/ui";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PRODUCT_LIMIT } from "@/features/search/data";
import { highlightedField } from "@/features/search/highlight";
import { isOpen24Hours, spbuImageUrl } from "@/features/search/utils";
import { formatCount, formatDistance, formatRating } from "@/utils/format";

type Props = {
  item: SpbuSearchItem;
  rank: number;
};

/**
 * Compact ranked row for the side-by-side benchmark panels — a smaller
 * relative of `SpbuResultCard` with a rank badge and no facilities row, since
 * two half-width columns have less room and nothing here opens a detail view.
 */
export function BenchmarkResultCard({ item, rank }: Props) {
  const distance = formatDistance(item.jarakKm);
  const open24h = isOpen24Hours(item.fasilitas);

  return (
    <article className="flex gap-3 border-b border-line-100 px-4 py-3 last:border-b-0">
      <span className="grid h-6 w-6 shrink-0 place-items-center self-start rounded-md bg-brand-600 text-[11px] font-bold text-white">
        {rank}
      </span>

      <img
        src={spbuImageUrl(item)}
        alt=""
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="min-w-0 truncate text-[13px] font-bold leading-tight text-brand-600">
            {highlightedField(item.highlight, "nama", item.nama)}{" "}
            <span className="font-medium text-ink-400">({item.kodeSpbu})</span>
          </h4>
          {distance && (
            <span className="flex shrink-0 items-center gap-1 text-[11px] text-ink-600">
              <Icon name="map-pin-2-line" />
              {distance}
            </span>
          )}
        </div>

        <p className="mt-1 flex items-start gap-1.5 text-[11px] leading-4 text-ink-600">
          <Icon name="map-pin-line" className="mt-px shrink-0 text-ink-400" />
          <span className="truncate">
            {highlightedField(item.highlight, "alamat", item.alamat)}
            {item.provinsi ? `, ${item.provinsi}` : ""}
          </span>
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
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
          {open24h ? (
            <Badge tone="success" className="gap-1 px-2 py-0.5 text-[10px]">
              <Icon name="time-line" />
              Buka 24 jam
            </Badge>
          ) : (
            <StatusBadge status={item.status} />
          )}
        </div>

        {item.produk.length > 0 && (
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {item.produk.slice(0, PRODUCT_LIMIT).map((code, index) => (
              <li key={code}>
                <Badge className="px-2 py-[2px] text-[10px]">
                  {item.produkNama[index] ?? code}
                </Badge>
              </li>
            ))}
            {item.produk.length > PRODUCT_LIMIT && (
              <li>
                <Badge className="px-2 py-[2px] text-[10px]">
                  +{item.produk.length - PRODUCT_LIMIT}
                </Badge>
              </li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
}
