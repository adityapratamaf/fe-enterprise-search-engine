import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MapBounds } from "@/types/map";
import { FilterSidebar } from "./components/FilterSidebar";
import { MapPanel } from "./components/MapPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { SearchHero } from "./components/SearchHero";
import { SpbuDetailPanel } from "./components/SpbuDetailPanel";
import { useSearchState } from "./hooks/useSearchState";
import { useSpbuSearch } from "./hooks/useSpbuSearch";
import { buildLabelMap } from "./utils";

/**
 * Orchestration only: URL state in, query out, three columns rendered. The page
 * it replaced held a hardcoded result array, a fake pagination widget, invented
 * timings, and the detail panel's contents inline.
 */
export function SearchPage() {
  const {
    state,
    request,
    activeFilterCount,
    submitKeyword,
    setSort,
    setPage,
    toggleFilter,
    clearFilter,
    resetFilters,
    setBounds,
  } = useSearchState();

  const { data, error, isLoading, isFetching, refetch } = useSpbuSearch(request);

  const [selectedKode, setSelectedKode] = useState<string | null>(null);

  /**
   * Separate from `selectedKode` on purpose: the panel defaults to the first
   * result, so clearing the code would only re-select it. This records that the
   * user explicitly dismissed the panel, and any new pick revives it.
   */
  const [dismissed, setDismissed] = useState(false);

  const selectStation = useCallback((kode: string) => {
    setSelectedKode(kode);
    setDismissed(false);
  }, []);

  // Memoised so the derived selection and label map do not recompute every render.
  const items = useMemo(() => data?.items ?? [], [data]);

  /**
   * Falls back to the first result whenever the pinned station is not on the
   * current page, which keeps the detail panel in step with paging and filtering.
   */
  const selected = useMemo(() => {
    if (dismissed) return null;
    return items.find((item) => item.kodeSpbu === selectedKode) ?? items[0] ?? null;
  }, [items, selectedKode, dismissed]);

  /**
   * The map reports its viewport on every pan, but that must only become a filter
   * while "Cari di area peta ini" is on — otherwise simply looking around would
   * silently narrow the results.
   */
  const latestBounds = useRef<MapBounds | null>(null);
  const searchInArea = state.bounds !== null;

  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      latestBounds.current = bounds;
      if (searchInArea) setBounds(bounds);
    },
    [searchInArea, setBounds],
  );

  const handleSearchInAreaChange = useCallback(
    (next: boolean) => {
      setBounds(next ? latestBounds.current : null);
    },
    [setBounds],
  );

  // Scroll back to the top of the list on page change; long pages otherwise leave
  // the user halfway down the next set of results.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.page]);

  const labels = useMemo(() => buildLabelMap(items), [items]);

  return (
    <div className="min-h-[calc(100vh-58px)]">
      <SearchHero keyword={state.keyword} engine={state.engine} onSubmit={submitKeyword} />

      <div className="mx-auto grid max-w-[1540px] grid-cols-1 items-start gap-3.5 px-4 py-3.5 sm:px-5 lg:grid-cols-[268px_minmax(0,1fr)_410px] lg:px-7">
        <FilterSidebar
          facets={data?.facets ?? null}
          capabilities={data?.kemampuan}
          selected={state.filters}
          activeCount={activeFilterCount}
          labels={labels}
          isLoading={isLoading}
          onToggle={toggleFilter}
          onClear={clearFilter}
          onReset={resetFilters}
        />

        <ResultsPanel
          data={data}
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          page={state.page}
          sortBy={state.sortBy}
          isDescending={state.isDescending}
          selectedKode={selected?.kodeSpbu ?? null}
          onSelect={(item) => selectStation(item.kodeSpbu)}
          onSortChange={setSort}
          onPageChange={setPage}
          onRetry={() => void refetch()}
        />

        <div className="space-y-3.5 lg:sticky lg:top-[70px]">
          <MapPanel
            items={items}
            selected={selected}
            focusKode={dismissed ? null : selectedKode}
            onSelect={selectStation}
            searchInArea={searchInArea}
            onSearchInAreaChange={handleSearchInAreaChange}
            onBoundsChange={handleBoundsChange}
          />
          <SpbuDetailPanel
            item={selected}
            isLoading={isLoading}
            onClear={() => setDismissed(true)}
          />
        </div>
      </div>
    </div>
  );
}
