import { useMemo, useState } from "react";
import { Badge, Card, CardBody, Icon, Spinner } from "@/components/ui";
import { spbuApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { formatCount } from "@/utils/format";
import { MapLegend, SpbuMap } from "./components";
import { toMarker } from "./types";

/** One page is enough to cover the whole preview dataset; clustering handles density. */
const MAP_PAGE_SIZE = 500;

export function MapPage() {
  const [selectedKode, setSelectedKode] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["spbu", "map", MAP_PAGE_SIZE],
    queryFn: ({ signal }) =>
      spbuApi.search({ pageNumber: 1, pageSize: MAP_PAGE_SIZE, includeFacets: false }, signal),
  });

  const items = useMemo(() => data?.items ?? [], [data]);
  const markers = useMemo(() => items.map(toMarker), [items]);
  const selected = items.find((item) => item.kodeSpbu === selectedKode) ?? null;

  return (
    <div className="mx-auto max-w-[1540px] px-4 py-4 sm:px-5 lg:px-7">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Peta SPBU</h1>
          <p className="mt-0.5 text-sm text-ink-600">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" /> Memuat lokasi...
              </span>
            ) : (
              `${formatCount(markers.length)} SPBU ditampilkan`
            )}
          </p>
        </div>
        <MapLegend />
      </div>

      <Card className="overflow-hidden">
        <CardBody className="p-0">
          {error ? (
            <div className="grid h-[70vh] place-items-center px-6 text-center">
              <div>
                <Icon name="cloud-off-line" className="text-4xl text-ink-300" />
                <h2 className="mt-3 text-base font-bold text-ink-800">Peta gagal dimuat</h2>
                <p className="mt-1 text-sm text-ink-500">
                  {error instanceof Error ? error.message : "Terjadi kesalahan tak terduga."}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-[70vh] min-h-[420px]">
              <SpbuMap
                markers={markers}
                selectedKode={selectedKode}
                onSelect={setSelectedKode}
                rememberView
              />
            </div>
          )}
        </CardBody>
      </Card>

      {selected && (
        <Card className="mt-3">
          <CardBody className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-brand-600">{selected.nama}</h2>
              <p className="mt-0.5 text-[11px] text-ink-600">
                {selected.kodeSpbu} · {selected.kota}, {selected.provinsi}
              </p>
              <p className="mt-1 text-[11px] text-ink-500">{selected.alamat}</p>
            </div>
            <Badge tone="brand">{selected.regionalNama}</Badge>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
