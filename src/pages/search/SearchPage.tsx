import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, CardBody, Badge } from "../../components/ui";
import { SearchBar } from "../../components/search/SearchBar";
import { FilterSidebar } from "../../components/search/FilterSidebar";
import { SpbuResultCard, type Spbu } from "../../components/search/SpbuResultCard";
import { PreviewMap } from "../../components/map/PreviewMap";
import type { SearchEngine } from "../../api/resources/spbu";

const image = "/spbu-default.jpg";

const data: Spbu[] = [
  { kode: "31.12802", name: "SPBU 31.12802 - Pertamina", address: "Jl. Jenderal Sudirman No. 45, Jakarta Selatan, DKI Jakarta", distance: "2.1 km", rating: "4.5", reviews: "328", image, products: ["Pertamax", "Pertamax Turbo", "Pertalite", "Dexlite"], facilities: ["Mushola", "Toilet", "Minimarket", "ATM", "SPKLU"] },
  { kode: "31.12705", name: "SPBU 31.12705 - Pertamina", address: "Jl. Gatot Subroto No. 12, Jakarta Selatan, DKI Jakarta", distance: "3.5 km", rating: "4.3", reviews: "210", image, products: ["Pertamax", "Pertalite", "Dexlite"], facilities: ["Mushola", "Toilet", "Minimarket", "ATM"] },
  { kode: "31.12988", name: "SPBU 31.12988 - Pertamina", address: "Jl. MT Haryono No. 78, Jakarta Timur, DKI Jakarta", distance: "4.2 km", rating: "4.2", reviews: "180", image, products: ["Pertamax", "Pertamax Turbo", "Pertalite"], facilities: ["Mushola", "Toilet", "Minimarket", "ATM", "SPKLU"] },
  { kode: "31.12123", name: "SPBU 31.12123 - Pertamina", address: "Jl. Ahmad Yani No. 1, Jakarta Pusat, DKI Jakarta", distance: "5.8 km", rating: "4.1", reviews: "164", image, products: ["Pertamax", "Pertalite", "Dexlite"], facilities: ["Mushola", "Toilet", "ATM"] },
  { kode: "31.13045", name: "SPBU 31.13045 - Pertamina", address: "Jl. Daan Mogot No. 99, Jakarta Barat, DKI Jakarta", distance: "6.1 km", rating: "4.0", reviews: "112", image, products: ["Pertamax", "Pertamax Turbo", "Pertalite"], facilities: ["Mushola", "Minimarket", "ATM"] },
];

const suggestions = ["Pertamax", "SPBU Jakarta Selatan", "Jl Sudirman", "SPBU 31.12802", "Pertalite terdekat"];

export function SearchPage() {
  const [search, setSearch] = useState("pertamax jakarta");
  const [engine, setEngine] = useState<SearchEngine>("Elasticsearch");
  const [selected, setSelected] = useState<Spbu>(data[0]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || q === "pertamax jakarta") return data;
    const terms = q.split(/\s+/).filter(Boolean);
    return data.filter((item) => terms.some((term) => `${item.name} ${item.address} ${item.products.join(" ")}`.toLowerCase().includes(term)));
  }, [search]);

  const handleSearch = (nextSearch = search) => {
    setSearch(nextSearch);
    setPage(1);
    const q = nextSearch.trim().toLowerCase();
    const first = q === "pertamax jakarta" || !q ? data[0] : data.find((item) => `${item.name} ${item.address} ${item.products.join(" ")}`.toLowerCase().includes(q.split(/\s+/)[0] ?? ""));
    if (first) setSelected(first);
  };

  return (
    <div className="min-h-[calc(100vh-58px)]">
      <section className="relative overflow-hidden border-b border-[#dce8f5] bg-[#edf7ff]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#edf7ff] via-[#edf7ff]/92 to-[#edf7ff]/20" />
        <div className="absolute inset-y-0 right-0 hidden w-[48%] bg-cover bg-center opacity-70 md:block" style={{ backgroundImage: `url(${image})` }} />
        <div className="absolute inset-y-0 right-0 hidden w-[58%] bg-gradient-to-l from-transparent via-[#edf7ff]/25 to-[#edf7ff] md:block" />
        <div className="relative mx-auto max-w-[1540px] px-4 pb-5 pt-5 sm:px-6 lg:px-8 lg:pb-6 lg:pt-4">
          <div className="mx-auto max-w-[930px] text-center">
            <h1 className="text-[24px] font-bold tracking-[-0.6px] text-[#0b1f46] sm:text-[27px]">Temukan SPBU di Seluruh Indonesia</h1>
            <p className="mt-1 text-sm text-[#47668e]">Cari berdasarkan nama, alamat, kota, provinsi, produk, fasilitas dan lainnya</p>
            <div className="mt-4">
              <SearchBar value={search} engine={engine} onChange={setSearch} onEngineChange={setEngine} onSearch={() => handleSearch()} />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-[#536b8b]">
              <span className="mr-1">Contoh pencarian:</span>
              {suggestions.map((item) => <button type="button" key={item} onClick={() => handleSearch(item)} className="rounded-full border border-[#dce7f2] bg-white/90 px-2.5 py-1 text-[#245082] shadow-sm hover:border-[#9fc5f3]">{item}</button>)}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1540px] grid-cols-1 gap-3 px-4 py-3 sm:px-5 lg:grid-cols-[268px_minmax(0,1fr)_410px] lg:px-7">
        <FilterSidebar />

        <Card className="min-w-0 overflow-hidden">
          <CardBody className="p-0">
            <div className="flex flex-col gap-2 border-b border-[#e6edf5] px-4 py-2.5 text-[11px] text-[#526e94] sm:flex-row sm:items-center sm:justify-between">
              <span>Menampilkan {filtered.length ? 1 : 0} - {filtered.length} dari <b>1.234</b> hasil ({engine === "Elasticsearch" ? "0,23" : "0,47"} detik)</span>
              <label className="flex items-center gap-2">Urutkan:
                <select className="rounded-lg border border-[#d4e0ee] bg-white px-2.5 py-1.5 text-[11px] text-[#28476d] outline-none"><option>Relevansi</option><option>Jarak</option><option>Nama A-Z</option></select>
              </label>
            </div>
            <div className="px-3">
              {filtered.length ? filtered.map((item, index) => (
                <motion.div key={item.kode} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                  <SpbuResultCard item={item} onSelect={setSelected} />
                </motion.div>
              )) : <div className="grid min-h-[420px] place-items-center px-6 text-center"><div><i className="ri-search-eye-line text-4xl text-[#9bb1cb]" /><h2 className="mt-3 text-base font-bold text-[#213d64]">SPBU tidak ditemukan</h2><p className="mt-1 text-sm text-[#7890ad]">Coba kata kunci atau filter pencarian lainnya.</p></div></div>}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-[#e7edf5] px-4 py-2.5">
              <Button variant="icon" className="h-8 w-8 p-0" onClick={() => setPage(Math.max(1, page - 1))}><i className="ri-arrow-left-s-line" /></Button>
              {[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} onClick={() => setPage(n)} className={`h-8 min-w-8 rounded-lg px-2 text-xs ${page === n ? "bg-[#1268ee] font-bold text-white" : "text-[#35557e] hover:bg-[#eef5fd]"}`}>{n}</button>)}
              <span className="px-1 text-xs text-[#7990ad]">...</span><span className="text-xs text-[#35557e]">124</span>
              <Button variant="icon" className="h-8 w-8 p-0" onClick={() => setPage(Math.min(124, page + 1))}><i className="ri-arrow-right-s-line" /></Button>
            </div>
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardBody className="p-2">
            <PreviewMap />
            <div className="mt-2 overflow-hidden rounded-lg border border-[#e4ebf4]">
              <img src={selected.image} alt={selected.name} className="h-[126px] w-full object-cover" />
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-[15px] font-bold text-[#0065e9]">{selected.name}</h2>
                  <Badge className="bg-[#e7fbef] text-[#15935a]">Buka 24 jam</Badge>
                </div>
                <div className="mt-1 text-[11px] text-[#567194]"><i className="ri-star-fill mr-1 text-[#ffb400]" />{selected.rating} ({selected.reviews} ulasan)</div>
                <div className="mt-2 text-[11px] leading-4 text-[#587296]"><i className="ri-map-pin-line mr-1" />{selected.address}</div>
                <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-[10px] text-[#627b9b]">
                  <span>Provinsi</span><b className="text-[#304e76]">DKI Jakarta</b><span>Kota</span><b className="text-[#304e76]">{selected.address.includes("Timur") ? "Jakarta Timur" : "Jakarta Selatan"}</b><span>Regional</span><b className="text-[#304e76]">Regional III</b><span>Status</span><b className="text-[#15935a]">Aktif</b><span>Tipe Kepemilikan</span><b className="text-[#304e76]">Pertamina</b><span>Koordinat</span><b className="text-[#304e76]">-6.2088, 106.8456</b>
                </div>
                <h3 className="mt-3 text-[11px] font-bold text-[#1a355e]">Produk Tersedia</h3>
                <div className="mt-1 flex flex-wrap gap-1.5">{selected.products.map((product) => <Badge key={product}>{product}</Badge>)}</div>
                <h3 className="mt-3 text-[11px] font-bold text-[#1a355e]">Fasilitas</h3>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-[#557092]">{selected.facilities.map((facility) => <span key={facility}><i className="ri-checkbox-circle-line mr-1" />{facility}</span>)}</div>
                <div className="mt-4 grid grid-cols-2 gap-2"><Button className="text-[11px]"><i className="ri-information-line" /> Detail Lengkap</Button><Button variant="secondary" className="text-[11px]"><i className="ri-navigation-line" /> Rute</Button></div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
