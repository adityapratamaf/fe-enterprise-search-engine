import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { BrandFooter } from "@/components/layout/BrandFooter";
import {
  LANDING_FEATURES,
  LANDING_FOOTER_ARTWORK,
  LANDING_ILLUSTRATION,
  POPULAR_QUERIES,
} from "../data";

/**
 * What the page shows before anyone has searched. Results, filters, map and the
 * detail card all stay out of the way until there is a query — opening on the
 * whole dataset is noise rather than a starting point.
 *
 * The example chips live in the hero above, so only the longer "popular
 * searches" list appears here; repeating the hero's five buttons would put the
 * same controls on screen twice.
 */
export function SearchLanding({
  onPick,
  className,
}: {
  onPick: (keyword: string) => void;
  className?: string;
}) {
  return (
    <section aria-labelledby="landing-heading" className={cn("flex flex-col pt-8", className)}>
      <div className="mx-auto max-w-[1240px] px-5 text-center lg:px-8">
        <img
          src={LANDING_ILLUSTRATION}
          alt=""
          aria-hidden
          width={560}
          height={280}
          decoding="async"
          className="mx-auto h-auto w-full max-w-[560px]"
        />

        <h2 id="landing-heading" className="mt-2 text-[26px] font-bold text-ink-900">
          Mulai pencarian SPBU
        </h2>
        <p className="mx-auto mt-2 max-w-[560px] text-[13.5px] leading-6 text-ink-500">
          Masukkan kata kunci pada kolom pencarian di atas. Hasil pencarian, filter, peta, dan
          detail SPBU akan muncul setelah pencarian dijalankan.
        </p>

        <ul className="mt-6 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="rounded-xl border border-line-200 bg-white p-3 shadow-soft"
            >
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${feature.tone}`}>
                <Icon name={feature.icon} className="text-base" />
              </span>
              <h3 className="mt-2 text-[13px] font-bold text-ink-900">{feature.title}</h3>
              <p className="mt-1 text-[11.5px] leading-[1.35] text-ink-500">{feature.body}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 text-[14px] font-bold text-ink-900">Contoh Pencarian Populer</h3>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {POPULAR_QUERIES.map((query) => (
            <button
              type="button"
              key={query}
              onClick={() => onPick(query)}
              className="inline-flex items-center gap-2 rounded-full border border-line-200 bg-white px-4 py-2 text-[12.5px] text-ink-700 shadow-soft transition hover:border-brand-300 hover:text-brand-700"
            >
              <Icon name="search-line" className="text-ink-400" />
              {query}
            </button>
          ))}
        </div>
      </div>

      {/*
        A growing spacer, not `mt-auto` on the footer: `cn` resolves conflicting
        margin utilities by keeping only the last one, so a margin set inside
        `BrandFooter` itself would be silently discarded by an `mt-auto` passed
        in from here. The spacer keeps the two concerns — "how far below the
        content" and "how the footer looks" — in the components that actually
        own them, and its minimum height guarantees a small gap even when the
        page is short enough to scroll rather than leaving the footer flush
        against the content above it.
      */}
      <div className="min-h-12 flex-1" />
      <BrandFooter artwork={LANDING_FOOTER_ARTWORK} />
    </section>
  );
}
