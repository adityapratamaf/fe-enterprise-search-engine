import type { SpbuSearchItem } from "@/api";
import { Badge, Icon } from "@/components/ui";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import { formatCount, formatDistance, formatRating } from "@/utils/format";
import { FACILITY_LIMIT, PRODUCT_LIMIT } from "../data";
import { highlightedField } from "../highlight";
import { facilityIcon, isOpen24Hours, spbuImageUrl } from "../utils";

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
        "flex gap-3.5 border-b border-line-100 px-3.5 py-3.5 transition last:border-b-0",
        selected ? "bg-brand-50/50" : "hover:bg-surface-sunken/60",
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
        className="h-[100px] w-[148px] shrink-0 overflow-hidden rounded-lg bg-line-100"
      >
        <img
          src={spbuImageUrl(item)}
          alt=""
          width={148}
          height={100}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-[15px] font-bold leading-tight">
            <button
              type="button"
              onClick={() => onSelect(item)}
              aria-current={selected ? "true" : undefined}
              className="truncate text-left text-brand-600 hover:underline"
            >
              {highlightedField(item.highlight, "nama", item.nama)}{" "}
              <span className="font-medium text-ink-400">({item.kodeSpbu})</span>
            </button>
          </h3>
          {distance && (
            <span className="flex shrink-0 items-center gap-1 text-[11.5px] text-ink-600">
              <Icon name="map-pin-2-line" />
              {distance}
            </span>
          )}
        </div>

        <p className="mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-4 text-ink-600">
          <Icon name="map-pin-line" className="mt-px shrink-0 text-ink-400" />
          <span className="truncate">
            {/* The address already ends with the city, so only the province is
                appended — otherwise it read "Jakarta Barat, Jakarta Barat". */}
            {highlightedField(item.highlight, "alamat", item.alamat)}
            {item.provinsi ? `, ${item.provinsi}` : ""}
          </span>
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px]">
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
            <Badge tone="success" className="gap-1 px-2 py-0.5 text-[10.5px]">
              <Icon name="time-line" />
              Buka 24 jam
            </Badge>
          ) : (
            <StatusBadge status={item.status} />
          )}
        </div>

        {item.produk.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {item.produk.slice(0, PRODUCT_LIMIT).map((code, index) => (
              <li key={code}>
                <Badge className="px-2.5 py-[3px] text-[10.5px]">
                  {item.produkNama[index] ?? code}
                </Badge>
              </li>
            ))}
            {item.produk.length > PRODUCT_LIMIT && (
              <li>
                <Badge className="px-2.5 py-[3px] text-[10.5px]">
                  +{item.produk.length - PRODUCT_LIMIT}
                </Badge>
              </li>
            )}
          </ul>
        )}

        {item.fasilitas.length > 0 && (
          <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10.5px] text-ink-600">
            {item.fasilitas.slice(0, FACILITY_LIMIT).map((code, index) => (
              <li key={code} className="flex items-center gap-1">
                <Icon name={facilityIcon(code)} className="text-[13px] text-ink-500" />
                {item.fasilitasNama[index] ?? code}
              </li>
            ))}
            {item.fasilitas.length > FACILITY_LIMIT && (
              <li className="text-ink-400">+{item.fasilitas.length - FACILITY_LIMIT} lainnya</li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
}
