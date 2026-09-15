import { HERO_IMAGE } from "@/features/search/data";

/**
 * Same backdrop treatment as `SearchHero` — same asset, same right-aligned
 * photo faded into the tinted ground via a mask rather than a second overlay
 * — just without the search bar, since this page's own query form sits below
 * in its own card.
 */
const FADE_MASK = "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)";

export function BenchmarkHero() {
  return (
    <section
      aria-labelledby="benchmark-heading"
      className="relative overflow-hidden border-b border-line-200 bg-surface-accent"
    >
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 hidden w-[46%] bg-cover bg-right opacity-90 md:block"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          maskImage: FADE_MASK,
          WebkitMaskImage: FADE_MASK,
        }}
      />

      <div className="relative mx-auto max-w-[1540px] px-4 pb-5 pt-6 sm:px-5 lg:px-7">
        <h1 id="benchmark-heading" className="text-[26px] font-bold text-ink-900">
          Benchmark Pencarian SPBU
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Bandingkan performa pencarian antara Elasticsearch dan SQL Server dengan query yang sama.
        </p>
      </div>
    </section>
  );
}
