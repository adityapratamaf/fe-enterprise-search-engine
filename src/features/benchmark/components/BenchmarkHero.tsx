import type { ReactNode } from "react";
import { HERO_IMAGE } from "@/features/search/data";

/**
 * Same backdrop treatment as `SearchHero` — same asset, same right-aligned
 * photo faded into the tinted ground via a mask rather than a second overlay.
 * `children` (the query form) renders inside the hero itself, the way
 * `SearchHero` holds its own search bar, so the hero's height always matches
 * the card instead of a hardcoded number that drifts out of sync with it.
 */
const FADE_MASK = "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)";

export function BenchmarkHero({ children }: { children: ReactNode }) {
  return (
    <section
      aria-labelledby="benchmark-heading"
      className="relative overflow-hidden bg-surface-accent"
    >
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 hidden w-[46%] bg-cover opacity-90 md:block"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundPosition: "right 15%",
          maskImage: FADE_MASK,
          WebkitMaskImage: FADE_MASK,
        }}
      />

      {/* Fades the tinted ground into the app's own background at the hero's
          bottom edge, so the section underneath does not read as a hard cut. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-surface-base"
      />

      <div className="relative mx-auto max-w-[1540px] px-4 pb-4 pt-6 sm:px-5 lg:px-7">
        <h1 id="benchmark-heading" className="text-[26px] font-bold text-ink-900">
          Benchmark Pencarian SPBU
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Bandingkan performa pencarian antara Elasticsearch dan SQL Server dengan query yang sama.
        </p>

        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}
