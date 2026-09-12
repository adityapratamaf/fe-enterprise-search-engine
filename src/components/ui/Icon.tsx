import { cn } from "@/lib/utils";

type Props = {
  /** Remixicon class name without the `ri-` prefix, e.g. `search-line`. */
  name: string;
  className?: string;
  /**
   * Accessible label. Omit for decorative icons — those are hidden from
   * assistive tech, which is what nearly every icon in this UI wants.
   */
  label?: string;
};

/**
 * Single place where icon-font glyphs enter the DOM, so decorative ones stay
 * out of the accessibility tree instead of being read out as junk characters.
 */
export function Icon({ name, className, label }: Props) {
  return (
    <i
      className={cn(`ri-${name}`, className)}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    />
  );
}
