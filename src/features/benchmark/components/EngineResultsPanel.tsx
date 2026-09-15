import { ApiError, type SearchSpbuResponse } from "@/api";
import { Card, Dropdown, Icon, Skeleton, Spinner } from "@/components/ui";
import { Pagination } from "@/features/search/components/Pagination";
import { SORT_OPTIONS } from "@/features/search/data";
import { parseSortValue, toSortValue } from "@/features/search/utils";
import { cn } from "@/lib/utils";
import { formatCount, formatMs } from "@/utils/format";
import { BenchmarkResultCard } from "./BenchmarkResultCard";

type Props = {
  title: string;
  description: string;
  icon: string;
  tone: "blue" | "amber";
  waktuMs: number;
  waktuTone: "success" | "danger";
  data: SearchSpbuResponse | undefined;
  error: unknown;
  isLoading: boolean;
  isFetching: boolean;
  page: number;
  sortBy: string;
  isDescending: boolean;
  onSortChange: (sortBy: string, isDescending: boolean) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
};

const TILE_TONE = {
  blue: "bg-tile-blue-soft text-tile-blue-strong",
  amber: "bg-tile-amber-soft text-tile-amber-strong",
} as const;

const TIME_TONE = {
  success: "bg-success-50 text-success-500",
  danger: "bg-danger-50 text-danger-500",
} as const;

/** One side of the benchmark comparison — an engine-scoped, independently
 * paged and sorted relative of `ResultsPanel`. The header's timing badge
 * carries the fixed measurement from the `/benchmark` run; the list itself is
 * browsed through the normal search endpoint, so paging or re-sorting one
 * side never re-runs the benchmark. */
export function EngineResultsPanel({
  title,
  description,
  icon,
  tone,
  waktuMs,
  waktuTone,
  data,
  error,
  isLoading,
  isFetching,
  page,
  sortBy,
  isDescending,
  onSortChange,
  onPageChange,
  onRetry,
}: Props) {
  const sortValue = toSortValue(sortBy, isDescending);
  const from = data && data.totalCount > 0 ? (data.pageNumber - 1) * data.pageSize + 1 : 0;
  const to = data ? Math.min(data.pageNumber * data.pageSize, data.totalCount) : 0;

  return (
    <Card className="min-w-0 overflow-hidden shadow-none">
      <div className="border-b border-line-100 px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <div
              className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", TILE_TONE[tone])}
            >
              <Icon name={icon} className="text-lg" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-[14.5px] font-bold text-ink-900">{title}</h3>
              <p className="mt-0.5 text-[11px] leading-tight text-ink-500">{description}</p>
            </div>
          </div>

          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
              TIME_TONE[waktuTone],
            )}
          >
            <Icon name="flashlight-line" />
            {formatMs(waktuMs)}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="flex items-center gap-2 text-[11.5px] text-ink-600">
            {isLoading ? (
              <Skeleton className="h-3 w-40" />
            ) : data ? (
              <>
                <span>
                  Menampilkan {formatCount(from)} - {formatCount(to)} dari{" "}
                  <b className="font-semibold text-ink-900">{formatCount(data.totalCount)}</b> hasil
                </span>
                {isFetching && <Spinner size="sm" className="text-brand-600" />}
              </>
            ) : null}
          </p>

          <div className="flex shrink-0 items-center gap-2 text-[11.5px] text-ink-600">
            Urutkan:
            <Dropdown
              value={sortValue}
              options={SORT_OPTIONS}
              onChange={(next) => {
                const parsed = parseSortValue(next);
                onSortChange(parsed.sortBy, parsed.isDescending);
              }}
              className="min-w-[136px]"
              aria-label={`Urutkan hasil ${title}`}
            />
          </div>
        </div>
      </div>

      {error ? (
        <div className="grid min-h-[240px] place-items-center px-6 text-center">
          <div>
            <Icon name="cloud-off-line" className="text-3xl text-ink-300" />
            <h4 className="mt-2 text-sm font-bold text-ink-800">
              {error instanceof ApiError && error.isNetwork
                ? "Tidak dapat menghubungi server"
                : "Pencarian gagal"}
            </h4>
            <p className="mx-auto mt-1 max-w-xs text-xs text-ink-500">
              {error instanceof Error ? error.message : "Terjadi kesalahan tak terduga."}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Coba lagi
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <ul className="divide-y divide-line-100">
          {[0, 1, 2].map((row) => (
            <li key={row} className="flex gap-3 px-4 py-3">
              <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </li>
          ))}
        </ul>
      ) : data && data.items.length > 0 ? (
        <div>
          {data.items.map((item, index) => (
            <BenchmarkResultCard
              key={item.id}
              item={item}
              rank={(data.pageNumber - 1) * data.pageSize + index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="grid min-h-[240px] place-items-center px-6 text-center">
          <div>
            <Icon name="search-eye-line" className="text-3xl text-ink-300" />
            <h4 className="mt-2 text-sm font-bold text-ink-800">SPBU tidak ditemukan</h4>
            <p className="mt-1 text-xs text-ink-500">Coba kata kunci atau filter lainnya.</p>
          </div>
        </div>
      )}

      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={onPageChange}
          disabled={isFetching}
        />
      )}
    </Card>
  );
}
