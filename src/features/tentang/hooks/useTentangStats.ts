import { useMemo } from "react";
import { useSpbuSearch } from "@/features/search/hooks/useSpbuSearch";
import { STATS_FACET_SIZE } from "../data";

/**
 * Pulls the "Dataset" numbers straight from the live search index rather than
 * hardcoding them, so the About page tells the truth in both "mock" (the
 * small fixture set) and "live" modes without a page-specific endpoint.
 *
 * `pageSize: 1` — only `totalCount` and `facets` are read, so there is no
 * reason to pull back actual result rows. SQL has no facet capability
 * (`kemampuan.facet` is false for it), so this always asks Elasticsearch.
 */
export function useTentangStats() {
  const request = useMemo(
    () => ({
      pageNumber: 1,
      pageSize: 1,
      includeFacets: true,
      facetSize: STATS_FACET_SIZE,
      engine: "Elasticsearch" as const,
    }),
    [],
  );

  const { data, isLoading, error } = useSpbuSearch(request);

  return {
    totalSpbu: data?.totalCount ?? null,
    totalProvinsi: data?.facets?.provinsi?.length ?? null,
    totalKota: data?.facets?.kota?.length ?? null,
    isLoading,
    error,
  };
}
