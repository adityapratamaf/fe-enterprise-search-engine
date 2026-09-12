import { useEffect, useMemo, useState } from "react";
import { FilterSidebar } from "./components/FilterSidebar";
import { ResultsPanel } from "./components/ResultsPanel";
import { SearchHero } from "./components/SearchHero";
import { SpbuDetailPanel } from "./components/SpbuDetailPanel";
import { useSearchState } from "./hooks/useSearchState";
import { useSpbuSearch } from "./hooks/useSpbuSearch";
import { buildLabelMap } from "./utils";

/**
 * Orchestration only: URL state in, query out, three panels rendered. The page it
 * replaced held a hardcoded result array, a fake pagination widget, invented
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
  } = useSearchState();

  const { data, error, isLoading, isFetching, refetch } = useSpbuSearch(request);

  const [selectedKode, setSelectedKode] = useState<string | null>(null);

  // Memoised so the derived selection and label map do not recompute every render.
  const items = useMemo(() => data?.items ?? [], [data]);

  /**
   * Falls back to the first result whenever the pinned station is not on the
   * current page, which keeps the detail panel in step with paging and filtering.
   */
  const selected = useMemo(
    () => items.find((item) => item.kodeSpbu === selectedKode) ?? items[0] ?? null,
    [items, selectedKode],
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

      <div className="mx-auto grid max-w-[1540px] grid-cols-1 items-start gap-3 px-4 py-3 sm:px-5 lg:grid-cols-[268px_minmax(0,1fr)_410px] lg:px-7">
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
          onSelect={(item) => setSelectedKode(item.kodeSpbu)}
          onSortChange={setSort}
          onPageChange={setPage}
          onRetry={() => void refetch()}
        />

        <SpbuDetailPanel
          item={selected}
          items={items}
          isLoading={isLoading}
          onSelect={setSelectedKode}
        />
      </div>
    </div>
  );
}
