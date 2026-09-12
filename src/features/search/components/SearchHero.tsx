import type { SearchEngineKind } from "@/api";
import { SearchBar } from "./SearchBar";

/** Example queries offered under the search box. */
const EXAMPLE_QUERIES = [
  "Pertamax",
  "SPBU Jakarta Selatan",
  "Jl Sudirman",
  "Pertalite",
  "Musholla",
];

type Props = {
  keyword: string;
  engine: SearchEngineKind;
  onSubmit: (keyword: string, engine?: SearchEngineKind) => void;
};

export function SearchHero({ keyword, engine, onSubmit }: Props) {
  return (
    <section
      aria-labelledby="search-heading"
      className="border-b border-line-200 bg-surface-accent"
    >
      <div className="mx-auto max-w-[1540px] px-4 pb-5 pt-5 sm:px-6 lg:px-8 lg:pb-6 lg:pt-4">
        <div className="mx-auto max-w-[930px] text-center">
          <h1
            id="search-heading"
            className="text-[24px] font-bold tracking-[-0.6px] text-ink-900 sm:text-[27px]"
          >
            Temukan SPBU di Seluruh Indonesia
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            Cari berdasarkan nama, alamat, kota, provinsi, produk, fasilitas dan lainnya
          </p>

          <div className="mt-4">
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
