import { Button, Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatCount } from "@/utils/format";
import { PAGINATION_WINDOW } from "../data";

/**
 * Builds a page window with ellipsis markers, driven by the real `totalPages`
 * from the backend. The previous pagination rendered a fixed `[1,2,3,4,5] … 124`
 * and its state never reached the query at all.
 */
function buildPages(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set<number>([1, total, current]);
  for (let offset = 1; offset <= PAGINATION_WINDOW; offset += 1) {
    if (current - offset > 1) pages.add(current - offset);
    if (current + offset < total) pages.add(current + offset);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) result.push("gap");
    result.push(page);
  });

  return result;
}

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
};

export function Pagination({ page, totalPages, onChange, disabled }: Props) {
  if (totalPages <= 1) return null;

  const current = Math.min(page, totalPages);

  return (
    <nav
      aria-label="Navigasi halaman hasil"
      className="flex flex-wrap items-center justify-center gap-1.5 border-t border-line-100 px-4 py-2.5"
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="Halaman sebelumnya"
        disabled={disabled || current <= 1}
        onClick={() => onChange(current - 1)}
      >
        <Icon name="arrow-left-s-line" />
      </Button>

      {buildPages(current, totalPages).map((entry, index) =>
        entry === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-xs text-ink-400" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            disabled={disabled}
            onClick={() => onChange(entry)}
            aria-current={entry === current ? "page" : undefined}
            aria-label={`Halaman ${entry}`}
            className={cn(
              "h-8 min-w-8 rounded-lg px-2 text-xs transition",
              entry === current
                ? "bg-brand-600 font-bold text-white"
                : "text-ink-700 hover:bg-brand-50",
            )}
          >
            {formatCount(entry)}
          </button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        aria-label="Halaman berikutnya"
        disabled={disabled || current >= totalPages}
        onClick={() => onChange(current + 1)}
      >
        <Icon name="arrow-right-s-line" />
      </Button>
    </nav>
  );
}
