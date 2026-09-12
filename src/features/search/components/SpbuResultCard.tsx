import type { SpbuSearchItem } from "@/api";
import { Badge, Icon } from "@/components/ui";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import { formatCount, formatDistance, formatRating } from "@/lib/format";
import { highlightedField } from "../lib/highlight";
import { spbuImageUrl } from "../lib/spbuImage";
import { facilityIcon, isOpen24Hours } from "../lib/taxonomy";

const PRODUCT_LIMIT = 4;
const FACILITY_LIMIT = 5;

type Props = {
  item: SpbuSearchItem;
  selected: boolean;
  onSelect: (item: SpbuSearchItem) => void;
};

export function SpbuResultCard({ item, selected, onSelect }: Props) {
  const distance = formatDistance(item.jarakKm);
  const open24h = isOpen24Hours(item.fasilitas);

  return (
    <article
      className={cn(
        "flex gap-3 border-b border-line-100 px-2 py-3.5 transition last:border-b-0",
        selected && "bg-brand-50/40",
      )}
    >
      {/* Clicking the photo selects the station, same as clicking its name. Kept
          out of the tab order and the a11y tree so keyboard and screen-reader
          users get one control per result instead of two identical ones. */}
      <button
        type="button"
        onClick={() => onSelect(item)}
        tabIndex={-1}
        aria-hidden
        className="h-[120px] w-[148px] shrink-0 overflow-hidden rounded-lg bg-line-100"
      >
        <img
          src={spbuImageUrl(item)}
          alt=""
          width={148}
          height={120}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-[15px] font-bold">
            <button
              type="button"
              onClick={() => onSelect(item)}
              aria-current={selected ? "true" : undefined}
              className="truncate text-left text-brand-600 hover:underline"
            >
              {highlightedField(item.highlight, "nama", item.nama)}
            </button>
          </h3>
          {distance && (
            <span className="shrink-0 text-[11px] text-ink-600">
              <Icon name="map-pin-2-line" className="mr-1" />
              {distance}
            </span>
          )}
        </div>

        <p className="mt-1 flex items-start gap-1 text-[11px] leading-4 text-ink-600">
          <Icon name="map-pin-line" className="mt-0.5 shrink-0" />
          <span>{highlightedField(item.highlight, "alamat", item.alamat)}</span>
        </p>

        <p className="mt-1 text-[11px] text-ink-500">
          <span className="font-semibold text-ink-700">{item.kodeSpbu}</span>
          {" · "}
          {item.kota}, {item.provinsi}
          {" · "}
          {item.regionalNama}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
          {item.rating === null ? (
            <span className="text-ink-400">Belum ada ulasan</span>
          ) : (
            <>
              <span className="font-bold text-ink-700">
                <Icon name="star-fill" className="mr-1 text-warning-500" />
                {formatRating(item.rating)}
              </span>
              <span className="text-ink-400">({formatCount(item.jumlahUlasan)} ulasan)</span>
            </>
          )}
          <StatusBadge status={item.status} />
          {open24h && <Badge tone="brand">Buka 24 jam</Badge>}
        </div>

        {item.produk.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {item.produk.slice(0, PRODUCT_LIMIT).map((code, index) => (
              <li key={code}>
                <Badge>{item.produkNama[index] ?? code}</Badge>
              </li>
            ))}
            {item.produk.length > PRODUCT_LIMIT && (
              <li>
                <Badge tone="neutral">+{item.produk.length - PRODUCT_LIMIT}</Badge>
              </li>
            )}
          </ul>
        )}

        {item.fasilitas.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-ink-600">
            {item.fasilitas.slice(0, FACILITY_LIMIT).map((code, index) => (
              <li key={code} className="flex items-center gap-1">
                <Icon name={facilityIcon(code)} className="text-[13px]" />
                {item.fasilitasNama[index] ?? code}
              </li>
            ))}
            {item.fasilitas.length > FACILITY_LIMIT && (
              <li className="text-ink-400">+{item.fasilitas.length - FACILITY_LIMIT} lainnya</li>
            )}
          </ul>
        )}

        {item.jumlahNozzle > 0 && (
          <p className="mt-2 text-[10px] text-ink-400">
            {formatCount(item.jumlahDispenser)} dispenser · {formatCount(item.jumlahNozzle)} nozzle
          </p>
        )}
      </div>
    </article>
  );
}
