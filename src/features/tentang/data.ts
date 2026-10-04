/**
 * Facet truncation safety margin for the "Dataset" stats query — large enough
 * that a live backend's full provinsi/kota breakdown is never cut short by
 * the facet limit (mirrors the same margin `FACET_SIZE` gives the search
 * filter panel, kept as its own constant so this feature stays self-contained).
 */
export const STATS_FACET_SIZE = 1000;

export const APP_VERSION = "v1.0.0";

/**
 * The four pillar tiles under the hero. `tone` is a whole literal class string
 * rather than built from a template — Tailwind only picks up class names it
 * can see as text in the source, so `bg-tile-${tone}-soft` would never match.
 */
export const PILLARS = [
  {
    icon: "target-line",
    tone: "bg-tile-blue-soft text-tile-blue-strong",
    title: "Tujuan",
    body: "Memudahkan masyarakat dalam mencari lokasi SPBU Pertamina beserta informasi lengkapnya, serta menjadi acuan dalam pengambilan keputusan berbasis data.",
  },
  {
    icon: "team-line",
    tone: "bg-tile-green-soft text-tile-green-strong",
    title: "Manfaat",
    body: "Akses informasi SPBU lebih cepat, akurat, dan interaktif untuk mendukung kebutuhan operasional, mobilitas, dan layanan kepada masyarakat.",
  },
  {
    icon: "bar-chart-2-line",
    tone: "bg-tile-amber-soft text-tile-amber-strong",
    title: "Inovasi",
    body: "Menggunakan teknologi Elasticsearch untuk pencarian yang lebih cepat, fuzzy search, autocomplete, highlight, serta dilengkapi visualisasi peta dan analitik data.",
  },
  {
    icon: "shield-check-line",
    tone: "bg-tile-violet-soft text-tile-violet-strong",
    title: "Komitmen",
    body: "Mendukung transformasi digital Pertamina dalam memberikan layanan berkualitas, transparan, dan berkelanjutan bagi masyarakat Indonesia.",
  },
];

export const FEATURES = [
  {
    icon: "search-2-line",
    title: "Pencarian SPBU",
    body: "Pencarian cepat dengan toleransi salah ketik, sinonim alamat, dan hasil relevan.",
  },
  {
    icon: "map-pin-line",
    title: "Peta Interaktif",
    body: "Lihat lokasi SPBU di peta interaktif langsung dari halaman pencarian.",
  },
  {
    icon: "speed-up-line",
    title: "Benchmark",
    body: "Bandingkan performa pencarian antara Elasticsearch dan SQL Server.",
  },
  {
    icon: "pie-chart-line",
    title: "Statistik",
    body: "Lihat ringkasan data dan visualisasi sebaran SPBU.",
  },
  {
    icon: "file-text-line",
    title: "Informasi Lengkap",
    body: "Detail SPBU, produk, fasilitas, jam operasional, dan rute lokasi.",
  },
];

/** Real brand marks (not the icon font) — supplied as static assets under `public/tech/`. */
export const TECH_STACK = [
  {
    logo: "/tech/react.png",
    title: "React",
    body: "Frontend framework untuk antarmuka pengguna yang modern dan responsif.",
  },
  {
    logo: "/tech/net.png",
    title: ".NET",
    body: "Backend API dengan arsitektur yang scalable dan secure.",
  },
  {
    logo: "/tech/elasticsearch.png",
    title: "Elasticsearch",
    body: "Mesin pencari untuk full-text search, fuzzy search, dan analitik.",
  },
  {
    logo: "/tech/sql_server.png",
    title: "SQL Server",
    body: "Database relasional sebagai sumber data utama dan pembanding.",
  },
];
