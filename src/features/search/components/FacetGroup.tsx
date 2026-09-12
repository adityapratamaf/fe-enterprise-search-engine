import { useMemo, useState } from "react";
import type { FacetBucket } from "@/api";
import { Checkbox, Icon, Input } from "@/components/ui";
import { formatCount } from "@/utils/format";
import { FACET_COLLAPSED_LIMIT, FACET_SEARCHABLE_THRESHOLD } from "../data";

type Props = {
  title: string;
  buckets: FacetBucket[];
  selected: string[];
  /** Maps a facet code to its display name, e.g. PERTAMAX_TURBO → Pertamax Turbo. */
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
    <div className="border-b border-line-100 py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="flex flex-1 items-center justify-between text-left text-[12px] font-bold text-ink-800"
        >
          <span>
            {title}
            {selected.length > 0 && (
              <span className="ml-1.5 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {selected.length}
              </span>
            )}
          </span>
          <Icon name={expanded ? "arrow-up-s-line" : "arrow-down-s-line"} />
        </button>
      </div>

      {expanded && (
        <div className="mt-2">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="mb-2 text-[11px] font-medium text-brand-600 hover:text-brand-700"
            >
              Hapus pilihan {title.toLowerCase()}
            </button>
          )}

          {searchable && (
            <Input
              inputSize="sm"
              frameClassName="mb-2 rounded-lg border-line-300"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Cari ${title.toLowerCase()}...`}
              aria-label={`Cari ${title}`}
              leading={<Icon name="search-line" className="text-ink-500" />}
            />
          )}

          {visible.length === 0 ? (
            <p className="py-1 text-[11px] text-ink-400">Tidak ada nilai yang cocok.</p>
          ) : (
            <ul className="space-y-1">
              {visible.map((bucket) => (
                <li key={bucket.nilai}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md py-0.5 text-[11px] text-ink-700 hover:bg-surface-sunken">
                    <Checkbox
                      checked={selected.includes(bucket.nilai)}
                      onChange={() => onToggle(bucket.nilai)}
                    />
                    <span className="min-w-0 flex-1 truncate">{labelOf(bucket.nilai)}</span>
                    <span className="shrink-0 text-ink-400">{formatCount(bucket.jumlah)}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {hidden > 0 && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-1 text-[11px] font-medium text-brand-600 hover:text-brand-700"
            >
              Tampilkan {formatCount(hidden)} lainnya
            </button>
          )}
          {showAll && matched.length > FACET_COLLAPSED_LIMIT && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="mt-1 text-[11px] font-medium text-brand-600 hover:text-brand-700"
            >
              Tampilkan lebih sedikit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
