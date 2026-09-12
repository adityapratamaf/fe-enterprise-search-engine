import type { SearchCapabilities } from "@/api";
import { Icon } from "@/components/ui";

const CAPABILITY_LABELS: { key: keyof SearchCapabilities; label: string }[] = [
  { key: "fuzzy", label: "Toleransi salah ketik" },
  { key: "relevansi", label: "Peringkat relevansi" },
  { key: "highlight", label: "Penyorotan kata" },
  { key: "sinonim", label: "Sinonim alamat" },
  { key: "facet", label: "Hitungan filter" },
  { key: "geo", label: "Filter jarak" },
];

/**
 * Surfaces `kemampuan` and `catatan`, which the backend sends precisely so the UI
 * can tell "this engine cannot do that" apart from "there are no results".
 * Neither field was read anywhere before.
 */
export function EngineNotice({
  capabilities,
  notes,
}: {
  capabilities: SearchCapabilities;
  notes: string[];
}) {
  const unavailable = CAPABILITY_LABELS.filter(({ key }) => !capabilities[key]);

  if (unavailable.length === 0 && notes.length === 0) return null;

  return (
    <div className="border-b border-line-100 bg-brand-50/60 px-4 py-2.5">
      {unavailable.length > 0 && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-600">
          <Icon name="information-line" className="text-brand-600" />
          <span className="font-semibold">Tidak tersedia pada mesin ini:</span>
          {unavailable.map(({ key, label }) => (
            <span key={key} className="rounded bg-white px-1.5 py-0.5 text-ink-500">
              {label}
            </span>
          ))}
        </p>
      )}

      {notes.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-1.5 text-[11px] text-ink-600">
              <Icon name="alert-line" className="mt-0.5 shrink-0 text-warning-500" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
