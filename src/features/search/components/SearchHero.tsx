import type { SearchEngineKind } from "@/api";
import { EXAMPLE_QUERIES, HERO_IMAGE } from "../data";
import { SearchBar } from "./SearchBar";

/** Fades the hero photograph out towards the heading; opaque on its right half. */
const FADE_MASK = "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)";

type Props = {
  keyword: string;
  engine: SearchEngineKind;
  onSubmit: (keyword: string, engine?: SearchEngineKind) => void;
  onNearMe: (lat: number, lon: number) => void;
};

export function SearchHero({ keyword, engine, onSubmit, onNearMe }: Props) {
  return (
    <section
      aria-labelledby="search-heading"
      className="relative border-b border-line-200 bg-surface-accent"
    >
      {/*
        Decorative backdrop: the photograph masked into the tinted ground rather
        than covered by a second gradient div. An overlay can only approach full
        opacity, so it left a visible step exactly where the photo began; a mask
        reaches zero at the element's own edge, so there is nothing to step from.
      */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 hidden w-[46%] bg-cover bg-right opacity-90 md:block"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          maskImage: FADE_MASK,
          WebkitMaskImage: FADE_MASK,
        }}
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
            <SearchBar keyword={keyword} engine={engine} onSubmit={onSubmit} onNearMe={onNearMe} />
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
