import { ApiError, SORT_FIELDS, type SearchSpbuResponse, type SpbuSearchItem } from "@/api";
import { Button, Card, CardBody, Icon, Select, Skeleton, Spinner } from "@/components/ui";
import { formatCount, formatSeconds } from "@/lib/format";
import { EngineNotice } from "./EngineNotice";
import { Pagination } from "./Pagination";
import { SpbuResultCard } from "./SpbuResultCard";

/** `value` encodes both the field and the direction as one select option. */
const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Relevansi" },
  { value: "nama:asc", label: "Nama A - Z" },
  { value: "nama:desc", label: "Nama Z - A" },
  { value: "rating:desc", label: "Rating tertinggi" },
  { value: "jarak:asc", label: "Jarak terdekat" },
  { value: "nozzle:desc", label: "Nozzle terbanyak" },
  { value: "kode:asc", label: "Kode menaik" },
];

function parseSortValue(value: string): { sortBy: string; isDescending: boolean } {
  const [field = "", direction] = value.split(":");
  const isKnown = (SORT_FIELDS as readonly string[]).includes(field);
  return { sortBy: isKnown ? field : "", isDescending: direction === "desc" };
}

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
  const sortValue = sortBy ? `${sortBy}:${isDescending ? "desc" : "asc"}` : "";
  const from = data && data.totalCount > 0 ? (data.pageNumber - 1) * data.pageSize + 1 : 0;
  const to = data ? Math.min(data.pageNumber * data.pageSize, data.totalCount) : 0;

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardBody className="p-0">
        <div className="flex flex-col gap-2 border-b border-line-100 px-4 py-2.5 text-[11px] text-ink-600 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-3 w-52" />
            ) : data ? (
              <>
                <span>
                  Menampilkan {formatCount(from)} - {formatCount(to)} dari{" "}
                  <b className="text-ink-800">{formatCount(data.totalCount)}</b> hasil (
                  {formatSeconds(data.tookMs)}, {data.engine})
                </span>
                {isFetching && <Spinner size="sm" className="text-brand-600" />}
              </>
            ) : null}
          </p>

          <label className="flex items-center gap-2">
            Urutkan:
            <Select
              value={sortValue}
              onChange={(event) => {
                const next = parseSortValue(event.target.value);
                onSortChange(next.sortBy, next.isDescending);
              }}
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

        {data && data.urutan && (
          <p className="border-b border-line-100 px-4 py-1.5 text-[10px] text-ink-400">
            Diurutkan menurut: {data.urutan}
          </p>
        )}

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
          <ul className="divide-y divide-line-100 px-3">
            {[0, 1, 2, 3, 4].map((row) => (
              <li key={row} className="space-y-2 py-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-1.5 pt-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </li>
            ))}
          </ul>
        ) : data && data.items.length > 0 ? (
          <div className="px-3">
            {data.items.map((item) => (
              <SpbuResultCard
                key={item.id}
                item={item}
                selected={item.kodeSpbu === selectedKode}
                onSelect={onSelect}
              />
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
      </CardBody>
    </Card>
  );
}
