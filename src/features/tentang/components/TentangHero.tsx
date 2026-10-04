import { Link } from "react-router-dom";
import { Icon } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { HERO_IMAGE } from "@/features/search/data";

/**
 * Full-bleed photo behind the text, not a side panel. No scrim: the photo's
 * own left side is sky, light enough on its own for the same dark text the
 * rest of the app uses — a dark overlay here just dimmed the station for no
 * contrast benefit on that side.
 */
export function TentangHero() {
  return (
    <section
      aria-labelledby="tentang-heading"
      className="relative overflow-hidden border-b border-line-200"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-right"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />

      <div className="relative mx-auto max-w-[1540px] px-4 py-16 sm:px-5 lg:px-7">
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
