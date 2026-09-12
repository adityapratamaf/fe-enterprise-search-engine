import { useEffect, useRef, useState } from "react";
import { Button } from "../ui";
import type { SearchEngine } from "../../api/resources/spbu";

type Props = {
  value: string;
  engine: SearchEngine;
  onChange: (value: string) => void;
  onEngineChange: (engine: SearchEngine) => void;
  onSearch: () => void;
};

const suggestions = ["Pertamax", "SPBU Jakarta Selatan", "Jl Sudirman", "SPBU 31.12802", "Pertalite terdekat"];

export function SearchBar({ value, engine, onChange, onEngineChange, onSearch }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const runSearch = () => {
    setOpen(false);
    onSearch();
  };

  return (
    <div className="relative flex w-full flex-col gap-2 md:flex-row md:items-stretch" ref={ref}>
      <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#cbd9eb] bg-white shadow-sm transition focus-within:border-[#6aa8ff] focus-within:ring-4 focus-within:ring-[#1677ff]/10">
        <i className="ri-search-line ml-4 text-xl text-[#53729a]" />
        <input value={value} onChange={(e) => { onChange(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }} placeholder="Cari nama SPBU, alamat, kota, produk..." className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-[#162f58] outline-none placeholder:text-[#91a5bf]" aria-label="Search SPBU" />
        {value && <button type="button" onClick={() => onChange("")} className="mr-1 rounded-lg p-2 text-[#66809f] hover:bg-[#f0f5fa]" aria-label="Hapus pencarian"><i className="ri-close-line" /></button>}
      </div>

      <label className="flex h-11 w-full shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#b9d2f7] bg-white text-[#1268ee] shadow-sm transition hover:border-[#78aef5] hover:bg-[#f5f9ff] md:w-12" aria-label="Cari berdasarkan gambar">
        <i className="ri-camera-3-line text-xl" />
        <input type="file" accept="image/*" className="sr-only" onChange={(event) => { if (event.target.files?.[0]) setOpen(false); }} />
      </label>

      <button type="button" onClick={() => { onEngineChange("Elasticsearch"); runSearch(); }} className={`h-11 w-full shrink-0 rounded-xl px-4 text-sm font-bold shadow-sm transition md:w-[230px] ${engine === "Elasticsearch" ? "bg-[#1268ee] text-white hover:bg-[#0758d4]" : "border border-[#b9d2f7] bg-white text-[#1268ee] hover:bg-[#f5f9ff]"}`}>
        <i className="ri-search-line mr-2" /> Cari dengan Elasticsearch
        <span className="mt-0.5 block text-[9px] font-normal opacity-85">Pencarian cerdas, toleransi salah ketik</span>
      </button>
      <Button type="button" variant="secondary" onClick={() => { onEngineChange("Sql"); runSearch(); }} className={`h-11 w-full shrink-0 justify-center text-[12px] md:w-[184px] ${engine === "Sql" ? "border-[#1268ee] bg-[#eef5ff] text-[#1268ee]" : ""}`}>
        <i className="ri-database-2-line text-lg" /> Cari dengan SQL
        <span className="hidden xl:inline text-[9px] font-normal text-[#6b83a4]">Pencarian standar (LIKE)</span>
      </Button>

      {open && value.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-[#dbe6f3] bg-white p-1 shadow-xl md:right-[430px]">
          {suggestions.filter((item) => item.toLowerCase().includes(value.toLowerCase())).slice(0, 5).map((item) => (
            <button type="button" key={item} onClick={() => { onChange(item); runSearch(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#25466f] hover:bg-[#f2f7fd]"><i className="ri-search-line text-[#6c88a9]" /> {item}</button>
          ))}
        </div>
      )}
    </div>
  );
}
