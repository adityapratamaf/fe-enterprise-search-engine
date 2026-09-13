import { BRAND_LOGO } from "@/config/branding";
import { cn } from "@/lib/utils";

/**
 * Decorative skyline closing a page. The artwork is a transparent PNG of the
 * silhouette only, so the wordmark and the strapline are real text layered over
 * it rather than being baked into the image — they stay selectable, translatable
 * and legible to screen readers.
 */
export function BrandFooter({ artwork, className }: { artwork: string; className?: string }) {
  return (
    <footer className={cn("relative mt-10 overflow-hidden", className)}>
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
        className="pointer-events-none w-full select-none opacity-90"
      />

      {/* Scrim: the artwork's foreground varies across the width, so the strapline
          needs its own ground rather than relying on whatever sits behind it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-base via-surface-base/85 to-transparent pb-3 pt-10">
        <div className="mx-auto flex max-w-[1540px] items-end justify-between gap-6 px-5 lg:px-10">
          <div className="flex items-center gap-3">
            <img
              src={BRAND_LOGO}
              alt="Pertamina"
              width={132}
              height={32}
              className="h-8 w-[132px] object-contain object-left opacity-60"
            />
            <span className="hidden text-[12px] font-medium text-brand-600/70 sm:block">
              untuk Indonesia yang Lebih Baik
            </span>
          </div>

          <p className="text-right text-[12px] font-medium leading-tight text-brand-600/70">
            Energi Menggerakkan
            <br />
            Masa Depan
          </p>
        </div>
      </div>
    </footer>
  );
}
