import { MAP_LEGEND } from "../data";

export function MapLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-600">
      {MAP_LEGEND.map((entry) => (
        <li key={entry.status} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: entry.color }}
          />
          {entry.status}
        </li>
      ))}
    </ul>
  );
}
