import { Card, Icon, Skeleton } from "@/components/ui";
import { EMPTY_VALUE, formatCount } from "@/utils/format";
import { useTentangStats } from "../hooks/useTentangStats";

/**
 * Numbers come straight from the search index (see `useTentangStats`), so
 * this reads correctly whether `VITE_SPBU_API_MODE` is "mock" (the small
 * fixture set) or "live" (the real backend) — there is nothing hardcoded here.
 */
export function TentangDataset() {
  const { totalSpbu, totalProvinsi, totalKota, isLoading, error } = useTentangStats();

  return (
    <Card className="p-4">
      <h2 className="flex items-center gap-2 text-[14px] font-bold text-ink-900">
        <Icon name="database-2-line" className="text-tile-blue-strong" />
        Dataset
      </h2>

      {error ? (
        <p className="mt-3 text-[12px] text-ink-500">Data tidak dapat dimuat saat ini.</p>
      ) : (
        <>
          {isLoading ? (
            <Skeleton className="mt-3 h-8 w-28" />
          ) : (
            <p className="mt-2 text-[28px] font-extrabold leading-tight text-ink-900">
              {formatCount(totalSpbu ?? 0)}
            </p>
          )}
          <p className="text-[11.5px] text-ink-500">Data SPBU</p>
        </>
      )}

      <dl className="mt-4 space-y-2 border-t border-line-100 pt-3">
        <div className="flex items-center justify-between gap-2 text-[12px]">
          <dt className="flex items-center gap-1.5 text-ink-600">
            <Icon name="flag-line" className="text-ink-400" />
            Provinsi
          </dt>
          <dd className="font-bold text-ink-900">
            {isLoading ? <Skeleton className="h-3.5 w-8" /> : (totalProvinsi ?? EMPTY_VALUE)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 text-[12px]">
          <dt className="flex items-center gap-1.5 text-ink-600">
            <Icon name="building-line" className="text-ink-400" />
            Kota/Kabupaten
          </dt>
          <dd className="font-bold text-ink-900">
            {isLoading ? <Skeleton className="h-3.5 w-8" /> : (totalKota ?? EMPTY_VALUE)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 text-[12px]">
          <dt className="flex items-center gap-1.5 text-ink-600">
            <Icon name="price-tag-3-line" className="text-ink-400" />
            Produk &amp; Fasilitas
          </dt>
          <dd className="font-bold text-ink-900">Beragam</dd>
        </div>
      </dl>
    </Card>
  );
}
