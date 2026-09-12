import { FACET_KEYS, type FacetBucket, type FacetKey, type SearchCapabilities } from "@/api";
import { Icon, Skeleton } from "@/components/ui";
import { FACET_LABELS } from "../data";
import { prettifyCode } from "../utils";
import { FacetGroup } from "./FacetGroup";

type Props = {
  facets: Partial<Record<FacetKey, FacetBucket[]>> | null;
  capabilities: SearchCapabilities | undefined;
  selected: Record<FacetKey, string[]>;
  activeCount: number;
  /** Code → display name, built from the result items' parallel `*Nama` arrays. */
  labels: Record<string, string>;
  isLoading: boolean;
  onToggle: (key: FacetKey, value: string) => void;
  onClear: (key: FacetKey) => void;
  onReset: () => void;
};

/**
 * Driven entirely by the facet counts the backend returns. The previous version
 * had no props at all: hardcoded groups, a remount hack for reset, and five dead
 * buttons for the groups it never implemented.
 */
export function FilterSidebar({
  facets,
  capabilities,
  selected,
  activeCount,
  labels,
  isLoading,
  onToggle,
  onClear,
  onReset,
}: Props) {
  const labelOf = (code: string) => labels[code] ?? prettifyCode(code);
  const facetsUnsupported = capabilities !== undefined && !capabilities.facet;

  return (
    <aside
      aria-label="Filter pencarian"
      className="rounded-xl2 border border-line-200 bg-white p-3 shadow-soft lg:sticky lg:top-[70px] lg:max-h-[calc(100vh-84px)] lg:overflow-y-auto"
    >
      <div className="flex items-center justify-between gap-2 border-b border-line-100 pb-3">
        <h2 className="text-sm font-bold text-ink-900">
          Filter Pencarian
          {activeCount > 0 && (
            <span className="ml-1.5 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className="text-xs font-semibold text-brand-600 disabled:opacity-40"
        >
          <Icon name="refresh-line" className="mr-1" />
          Reset
        </button>
      </div>

      {facetsUnsupported ? (
        <p className="flex gap-2 py-4 text-[11px] leading-5 text-ink-500">
          <Icon name="information-line" className="mt-0.5 shrink-0 text-brand-600" />
          <span>
            Mesin SQL tidak menghasilkan hitungan filter. Beralih ke Elasticsearch untuk memakai
            panel ini.
          </span>
        </p>
      ) : isLoading && !facets ? (
        <div className="space-y-4 py-3">
          {[0, 1, 2].map((group) => (
            <div key={group} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              {[0, 1, 2, 3].map((row) => (
                <Skeleton key={row} className="h-3 w-full" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        FACET_KEYS.map((key, index) => (
          <FacetGroup
            key={key}
            title={FACET_LABELS[key]}
            buckets={facets?.[key] ?? []}
            selected={selected[key]}
            labelOf={labelOf}
            onToggle={(value) => onToggle(key, value)}
            onClear={() => onClear(key)}
            // Only the first few groups start open; the rest would fill the column.
            defaultExpanded={index < 3 || selected[key].length > 0}
          />
        ))
      )}
    </aside>
  );
}
