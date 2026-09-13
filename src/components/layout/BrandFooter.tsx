import { cn } from "@/lib/utils";

/**
 * Decorative skyline closing a page. Purely an illustration, washed down to a
 * faint tint rather than the artwork's own saturated blue — it reads as
 * background texture instead of competing with the content above it.
 *
 * `block` + no default line-height gap: an inline `<img>` leaves a few pixels
 * of whitespace under itself (the space reserved for a descender), which read
 * as a thin white line between the artwork and the bottom of the page.
 */
export function BrandFooter({ artwork, className }: { artwork: string; className?: string }) {
  return (
    <footer className={cn("overflow-hidden", className)}>
      {/* Rendered at its natural ratio: the artwork is trimmed to its content,
          so there is no empty band to crop away and no fixed height to tune. */}
      <img
        src={artwork}
        alt=""
        aria-hidden
        width={2172}
        height={283}
        loading="lazy"
        decoding="async"
        className="pointer-events-none block w-full select-none opacity-25"
      />
    </footer>
  );
}
