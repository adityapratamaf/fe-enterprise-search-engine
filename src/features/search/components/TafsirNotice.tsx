import type { TafsirAi } from "@/api";
import { Icon } from "@/components/ui";
import { formatMs } from "@/utils/format";

function listChip(label: string, values: string[] | null): string | null {
  if (!values || values.length === 0) return null;
  return `${label}: ${values.join(", ")}`;
}

/**
 * Surfaces what the LLM understood from a natural-language query in "Ai" mode.
 * `tafsir` is read-only: the backend already applied it before `items` ever
 * reached the frontend, so this is transparency, not another filter to wire up.
 */
export function TafsirNotice({ tafsir }: { tafsir: TafsirAi }) {
  const chips = [
    listChip("Regional", tafsir.regional),
    listChip("Provinsi", tafsir.provinsi),
    listChip("Kota", tafsir.kota),
    listChip("Produk", tafsir.produk),
    listChip("Fasilitas", tafsir.fasilitas),
    listChip("Status", tafsir.status),
    listChip("Tipe Kepemilikan", tafsir.tipeKepemilikan),
    tafsir.ratingMin !== null ? `Rating ≥ ${tafsir.ratingMin}` : null,
    tafsir.ulasanMin !== null ? `Ulasan ≥ ${tafsir.ulasanMin}` : null,
    tafsir.radiusKm !== null ? `Radius ${tafsir.radiusKm} km` : null,
    tafsir.sortBy ? `Urut: ${tafsir.sortBy}${tafsir.isDescending ? " (menurun)" : ""}` : null,
  ].filter((chip): chip is string => chip !== null);

  return (
    <div className="border-b border-line-100 bg-tile-violet-soft/60 px-4 py-2.5">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-600">
        <Icon name="sparkling-2-line" className="text-tile-violet-strong" />
        <span className="font-semibold text-tile-violet-strong">
          Ditafsirkan {tafsir.provider} ({formatMs(tafsir.durasiMs)})
        </span>
        {tafsir.search && (
          <span className="rounded bg-white px-1.5 py-0.5 text-ink-700">"{tafsir.search}"</span>
        )}
      </p>

      {chips.length > 0 && (
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <li key={chip} className="rounded bg-white px-1.5 py-0.5 text-[11px] text-ink-600">
              {chip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
