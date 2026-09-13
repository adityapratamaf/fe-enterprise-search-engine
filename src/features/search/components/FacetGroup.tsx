import { useMemo, useState } from "react";
import type { FacetBucket } from "@/api";
import { Checkbox, Icon, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatCount } from "@/utils/format";
import { FACET_COLLAPSED_LIMIT, FACET_SEARCHABLE_THRESHOLD } from "../data";

type Props = {
  title: string;
  buckets: FacetBucket[];
  selected: string[];
  /** Maps a facet code to its display name, e.g. PERTAMAX_TURBO -> Pertamax Turbo. */
  labelOf: (code: string) => string;
  onToggle: (value: string) => void;
  onClear: () => void;
  defaultExpanded?: boolean;
};

export function FacetGroup({
  title,
  buckets,
  selected,
  labelOf,
  onToggle,
  onClear,
  defaultExpanded = true,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");

  const searchable = buckets.length >= FACET_SEARCHABLE_THRESHOLD;

  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return buckets;
    return buckets.filter((bucket) => labelOf(bucket.nilai).toLowerCase().includes(needle));
  }, [buckets, query, labelOf]);

  /**
   * Selected values stay visible even when they fall outside the top slice or the
   * current filter text, so a checked box never disappears from view.
   */
  const visible = useMemo(() => {
    if (showAll) return matched;
    const head = matched.slice(0, FACET_COLLAPSED_LIMIT);
    const missingSelected = matched.filter(
      (bucket) => selected.includes(bucket.nilai) && !head.includes(bucket),
    );
    return [...head, ...missingSelected];
  }, [matched, showAll, selected]);

  const hidden = matched.length - visible.length;

  if (buckets.length === 0) return null;

  return (
    <div className="border-b border-line-100 px-3.5 py-3 last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 text-left text-[12.5px] font-semibold text-ink-900"
      >
        <span className="flex items-center gap-1.5">
          {title}
          {selected.length > 0 && (
            <span className="grid h-[15px] min-w-[15px] place-items-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
              {selected.length}
            </span>
          )}
        </span>
        {/* Rotating one chevron reads as a single control; swapping two icons does not. */}
        <Icon
          name="arrow-down-s-line"
          className={cn(
            "shrink-0 text-base text-ink-500 transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="mt-2.5">
          {searchable && (
            <Input
              inputSize="sm"
              frameClassName="mb-2 rounded-lg border-line-300"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Cari ${title.toLowerCase()}...`}
              aria-label={`Cari ${title}`}
              leading={<Icon name="search-line" className="text-ink-400" />}
            />
          )}

          {visible.length === 0 ? (
            <p className="py-1 text-[11px] text-ink-400">Tidak ada nilai yang cocok.</p>
          ) : (
            <ul className="space-y-[3px]">
              {visible.map((bucket) => (
                <li key={bucket.nilai}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md py-1 text-[12px] text-ink-700 transition hover:bg-surface-sunken">
                    <Checkbox
                      checked={selected.includes(bucket.nilai)}
                      onChange={() => onToggle(bucket.nilai)}
                      className="h-[15px] w-[15px] rounded"
                    />
                    <span className="min-w-0 flex-1 truncate">{labelOf(bucket.nilai)}</span>
                    <span className="shrink-0 text-[11px] text-ink-400">
                      {formatCount(bucket.jumlah)}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-1.5 flex items-center justify-between gap-2">
            {hidden > 0 && !showAll ? (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="text-[11.5px] font-medium text-brand-600 hover:text-brand-700"
              >
                Tampilkan lainnya
              </button>
            ) : showAll && matched.length > FACET_COLLAPSED_LIMIT ? (
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="text-[11.5px] font-medium text-brand-600 hover:text-brand-700"
              >
                Tampilkan lebih sedikit
              </button>
            ) : (
              <span />
            )}

            {selected.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="text-[11px] text-ink-400 transition hover:text-danger-500"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
