import { useMemo, useState } from "react";

type FilterItem = { label: string; count: number };
type FilterGroupConfig = { title: string; items: FilterItem[]; defaultSelected?: string[] };

const groups: FilterGroupConfig[] = [
  { title: "Regional", items: [{ label: "Regional I", count: 120 }, { label: "Regional II", count: 98 }, { label: "Regional III", count: 156 }, { label: "Regional IV", count: 87 }] },
  { title: "Provinsi", defaultSelected: ["DKI Jakarta"], items: [{ label: "DKI Jakarta", count: 342 }, { label: "Jawa Barat", count: 298 }, { label: "Banten", count: 124 }, { label: "Jawa Tengah", count: 87 }, { label: "Jawa Timur", count: 76 }] },
  { title: "Kota", defaultSelected: ["Jakarta Selatan"], items: [{ label: "Jakarta Selatan", count: 120 }, { label: "Jakarta Timur", count: 98 }, { label: "Jakarta Barat", count: 86 }, { label: "Jakarta Utara", count: 72 }, { label: "Jakarta Pusat", count: 66 }] },
];

function FilterGroup({ config, onChange }: { config: FilterGroupConfig; onChange?: (values: string[]) => void }) {
  const [expanded, setExpanded] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(config.defaultSelected ?? []);

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? config.items.filter((item) => item.label.toLowerCase().includes(normalized)) : config.items;
  }, [config.items, query]);

  const toggle = (label: string) => {
    setSelected((current) => {
      const next = current.includes(label) ? current.filter((item) => item !== label) : [...current, label];
      onChange?.(next);
      return next;
    });
  };

  return (
    <div className="border-b border-[#e8eef6] py-3 last:border-b-0">
      <button type="button" className="flex w-full items-center justify-between text-left text-[12px] font-bold text-[#17345e]" onClick={() => setExpanded((value) => !value)}>
        {config.title}<i className={expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
      </button>
      {expanded && (
        <div className="mt-2">
          <div className="mb-2 flex items-center rounded-lg border border-[#d5e1ef] bg-white px-2.5 focus-within:border-[#6aa8ff] focus-within:ring-2 focus-within:ring-[#1677ff]/10">
            <i className="ri-search-line text-[#6f89a9]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Cari ${config.title.toLowerCase()}...`} className="h-8 w-full bg-transparent px-2 text-[11px] outline-none" />
          </div>
          <div className="space-y-1">
            {visibleItems.map((item) => (
              <label key={item.label} className="flex cursor-pointer items-center gap-2 rounded-md py-0.5 text-[11px] text-[#35547b] hover:bg-[#f5f8fc]">
                <input type="checkbox" checked={selected.includes(item.label)} onChange={() => toggle(item.label)} className="h-3.5 w-3.5 accent-[#1677ff]" />
                <span className="flex-1">{item.label}</span><span className="text-[#7d95b3]">{item.count}</span>
              </label>
            ))}
          </div>
          <button type="button" className="mt-1 text-[11px] font-medium text-[#0765de]">Tampilkan lainnya</button>
        </div>
      )}
    </div>
  );
}

export function FilterSidebar() {
  const [revision, setRevision] = useState(0);
  return (
    <aside className="rounded-xl2 border border-[#e1eaf5] bg-white p-3 shadow-soft lg:sticky lg:top-[70px] lg:max-h-[calc(100vh-84px)] lg:overflow-y-auto">
      <div className="flex items-center justify-between border-b border-[#e8eef6] pb-3">
        <h2 className="text-sm font-bold text-[#152f58]">Filter Pencarian</h2>
        <button type="button" onClick={() => setRevision((value) => value + 1)} className="text-xs font-semibold text-[#1268ee]"><i className="ri-refresh-line mr-1" /> Reset</button>
      </div>
      {groups.map((group) => <FilterGroup key={`${group.title}-${revision}`} config={group} />)}
      {["Produk Tersedia", "Fasilitas", "Status", "Tipe Kepemilikan", "Lokasi Terdekat"].map((title) => (
        <button type="button" key={title} className="flex w-full items-center justify-between border-b border-[#e8eef6] py-3 text-left text-[12px] font-medium text-[#17345e]">
          {title}<i className="ri-arrow-down-s-line" />
        </button>
      ))}
    </aside>
  );
}
