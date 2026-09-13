import type { SearchEngineKind } from "@/api";
import { EXAMPLE_QUERIES, SPBU_IMAGE_FALLBACK } from "../data";
import { SearchBar } from "./SearchBar";

type Props = {
  keyword: string;
  engine: SearchEngineKind;
  onSubmit: (keyword: string, engine?: SearchEngineKind) => void;
};

export function SearchHero({ keyword, engine, onSubmit }: Props) {
  return (
    <section
      aria-labelledby="search-heading"
      className="relative overflow-hidden border-b border-line-200 bg-surface-accent"
    >
      {/* Decorative backdrop. Order matters: the tinted ground is the section's
          own background, the photo sits on the right, and the wash above it is
          wider than the photo so its left edge dissolves completely instead of
          cutting off behind the heading. */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 hidden w-[44%] bg-cover bg-center opacity-80 md:block"
        style={{ backgroundImage: `url(${SPBU_IMAGE_FALLBACK})` }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 hidden w-[56%] bg-gradient-to-l from-transparent via-surface-accent/75 to-surface-accent md:block"
      />

      <div className="relative mx-auto max-w-[1540px] px-4 pb-6 pt-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[930px] text-center">
          <h1
            id="search-heading"
            className="text-[26px] font-bold tracking-[-0.6px] text-ink-900 sm:text-[29px]"
          >
            Temukan SPBU di Seluruh Indonesia
          </h1>
          <p className="mt-1.5 text-[13.5px] text-ink-600">
            Cari berdasarkan nama, alamat, kota, provinsi, produk, fasilitas dan lainnya
          </p>

          <div className="mt-5">
            <SearchBar keyword={keyword} engine={engine} onSubmit={onSubmit} />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-ink-600">
            <span className="mr-1">Contoh pencarian:</span>
            {EXAMPLE_QUERIES.map((example) => (
              <button
                type="button"
                key={example}
                onClick={() => onSubmit(example)}
                className="rounded-full border border-line-200 bg-white/90 px-2.5 py-1 text-ink-700 shadow-sm transition hover:border-brand-300"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
