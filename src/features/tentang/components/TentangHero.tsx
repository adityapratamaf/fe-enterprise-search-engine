import { Link } from "react-router-dom";
import { Icon } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { TENTANG_BACKGROUND } from "../data";

/** Same backdrop treatment as `SearchHero`: a masked photo fading into the
 * tinted ground on its left edge, rather than a second overlay div — a mask
 * reaches zero at the element's own edge, so there is no visible seam. */
const FADE_MASK = "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)";

export function TentangHero() {
  return (
    <section
      aria-labelledby="tentang-heading"
      className="relative overflow-hidden border-b border-line-200 bg-surface-accent"
    >
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 hidden w-[46%] bg-cover bg-right opacity-90 md:block"
        style={{
          backgroundImage: `url(${TENTANG_BACKGROUND})`,
          maskImage: FADE_MASK,
          WebkitMaskImage: FADE_MASK,
        }}
      />

      <div className="relative mx-auto max-w-[1540px] px-4 py-10 sm:px-5 lg:px-7">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">
          Tentang Aplikasi
        </p>
        <h1 id="tentang-heading" className="mt-1.5 text-[32px] font-extrabold text-ink-900">
          SPBU Search
        </h1>
        <p className="mt-2 text-[15px] font-medium text-ink-700 md:max-w-2xl">
          Akses informasi SPBU Pertamina di seluruh Indonesia dengan cepat, akurat, dan mudah.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-600 md:max-w-2xl">
          SPBU Search merupakan aplikasi pencarian dan visualisasi lokasi SPBU Pertamina yang
          menggabungkan teknologi pencarian modern (Elasticsearch) dengan data resmi Pertamina untuk
          memberikan pengalaman pencarian yang lebih baik, lengkap, dan interaktif.
        </p>

        <Link
          to={ROUTES.search}
          className="mt-5 inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <Icon name="search-line" />
          Mulai Pencarian
        </Link>
      </div>
    </section>
  );
}
