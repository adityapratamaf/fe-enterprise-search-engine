import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * The two engine buttons in the search bar. They are not plain `Button`s: the
 * design pairs a leading icon with a two-line label (name over a short
 * explanation), which the shared button's single-line sizing cannot express.
 * Kept here rather than in `components/ui` because nothing else needs this shape.
 */
export function EngineButton({
  icon,
  label,
  hint,
  active,
  onClick,
  className,
}: {
  icon: string;
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-12 shrink-0 items-center gap-2.5 rounded-xl px-4 text-left transition",
        active
          ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700"
          : "border border-brand-200 bg-white text-brand-600 hover:border-brand-300 hover:bg-brand-50",
        className,
      )}
    >
      <Icon name={icon} className="shrink-0 text-lg" />
      <span className="min-w-0">
        <span className="block text-[13px] font-bold leading-tight">{label}</span>
        <span
          className={cn(
            "block text-[10px] leading-tight",
            active ? "text-white/85" : "text-ink-500",
          )}
        >
          {hint}
        </span>
      </span>
    </button>
  );
}
