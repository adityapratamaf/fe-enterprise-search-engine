import { ApiError, type SearchSpbuResponse, type SpbuSearchItem } from "@/api";
import { Button, Card, Icon, Select, Skeleton, Spinner } from "@/components/ui";
import { formatCount, formatSeconds } from "@/utils/format";
import { RESULT_STAGGER_SECONDS, SORT_OPTIONS } from "../data";
import { parseSortValue, toSortValue } from "../utils";
import { EngineNotice } from "./EngineNotice";
import { Pagination } from "./Pagination";
import { SpbuResultCard } from "./SpbuResultCard";

type Props = {
  data: SearchSpbuResponse | undefined;
  error: unknown;
  isLoading: boolean;
  isFetching: boolean;
  page: number;
  sortBy: string;
  isDescending: boolean;
  selectedKode: string | null;
  onSelect: (item: SpbuSearchItem) => void;
  onSortChange: (sortBy: string, isDescending: boolean) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
};

export function ResultsPanel({
  data,
  error,
  isLoading,
  isFetching,
  page,
  sortBy,
  isDescending,
  selectedKode,
  onSelect,
  onSortChange,
  onPageChange,
  onRetry,
}: Props) {
  const sortValue = toSortValue(sortBy, isDescending);
  const from = data && data.totalCount > 0 ? (data.pageNumber - 1) * data.pageSize + 1 : 0;
  const to = data ? Math.min(data.pageNumber * data.pageSize, data.totalCount) : 0;

  return (
    <Card className="min-w-0 overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-line-100 px-4 py-2.5 text-[12px] text-ink-600 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-3 w-52" />
          ) : data ? (
            <>
              <span>
                Menampilkan {formatCount(from)} - {formatCount(to)} dari{" "}
                <b className="font-semibold text-ink-900">{formatCount(data.totalCount)}</b> hasil (
                {formatSeconds(data.tookMs)})
              </span>
              {isFetching && <Spinner size="sm" className="text-brand-600" />}
            </>
          ) : null}
        </p>

        <label className="flex shrink-0 items-center gap-2 text-[12px] text-ink-600">
          Urutkan:
          <Select
            value={sortValue}
            onChange={(event) => {
              const next = parseSortValue(event.target.value);
              onSortChange(next.sortBy, next.isDescending);
            }}
            className="h-8 min-w-[128px] text-[12px]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      {data && <EngineNotice capabilities={data.kemampuan} notes={data.catatan} />}

      {error ? (
        <div className="grid min-h-[420px] place-items-center px-6 text-center">
          <div>
            <Icon name="cloud-off-line" className="text-4xl text-ink-300" />
            <h2 className="mt-3 text-base font-bold text-ink-800">
              {error instanceof ApiError && error.isNetwork
                ? "Tidak dapat menghubungi server"
                : "Pencarian gagal"}
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">
              {error instanceof Error ? error.message : "Terjadi kesalahan tak terduga."}
            </p>
            <Button className="mt-4" onClick={onRetry}>
              <Icon name="refresh-line" />
              Coba lagi
            </Button>
          </div>
        </div>
      ) : isLoading ? (
        <ul className="divide-y divide-line-100">
          {[0, 1, 2, 3, 4].map((row) => (
            <li key={row} className="flex gap-3.5 px-3.5 py-3.5">
              <Skeleton className="h-[100px] w-[148px] shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-1.5 pt-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : data && data.items.length > 0 ? (
        <div>
          {data.items.map((item, index) => (
            <div
              key={item.id}
              className="result-enter"
              style={{ animationDelay: `${index * RESULT_STAGGER_SECONDS}s` }}
            >
              <SpbuResultCard
                item={item}
                selected={item.kodeSpbu === selectedKode}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid min-h-[420px] place-items-center px-6 text-center">
          <div>
            <Icon name="search-eye-line" className="text-4xl text-ink-300" />
            <h2 className="mt-3 text-base font-bold text-ink-800">SPBU tidak ditemukan</h2>
            <p className="mt-1 text-sm text-ink-500">
              Coba kata kunci atau filter pencarian lainnya.
            </p>
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
