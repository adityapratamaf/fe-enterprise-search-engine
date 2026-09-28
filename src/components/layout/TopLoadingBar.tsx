import { useIsFetching, useIsMutating } from "@tanstack/react-query";

/** Everything under the "spbu" query key is a search except suggestions. */
function isSearchQuery(queryKey: readonly unknown[]): boolean {
  return queryKey[0] === "spbu" && queryKey[1] !== "suggestion";
}

/**
 * A thin animated line under the topbar, on whenever a search is in flight —
 * the main Elasticsearch/SQL search, the map's station load, an image search,
 * "SPBU terdekat", or a benchmark run all go through React Query, so this
 * needs no wiring in each feature.
 *
 * Suggestions are excluded on purpose: they fire on every keystroke, and
 * flickering the bar that often would read as broken rather than informative.
 */
export function TopLoadingBar() {
  const searching = useIsFetching({
    predicate: (query) => isSearchQuery(query.queryKey),
  });
  const mutating = useIsMutating();

  if (searching === 0 && mutating === 0) return null;

  return (
    <div
      aria-hidden
      className="top-loading-bar pointer-events-none absolute inset-x-0 bottom-0 h-[3px] overflow-hidden"
    >
      <span />
      <span />
    </div>
  );
}
