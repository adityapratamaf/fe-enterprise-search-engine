# SPBU Search Frontend

Frontend React + TypeScript untuk platform pencarian SPBU Pertamina: dua mesin
pencari (Elasticsearch / SQL), filter berbasis facet, pencarian lewat gambar
(OCR), dan panel detail SPBU.

## Requirements

- Node.js 18.20+ (Node 20/22 disarankan)
- npm 10+

Backend **tidak diperlukan**. Secara bawaan aplikasi berjalan pada data mock di
dalam browser (lihat [Mode data](#mode-data)).

## Run

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Tidak perlu login: seluruh halaman terbuka dan
data diambil dari fixture lokal. Halaman login tetap dapat dibuka di `/login`
untuk dipratinjau, dan menerima kredensial apa pun.

## Quality checks

```bash
npm run typecheck      # tsc -b --force
npm run lint           # eslint, --max-warnings 0
npm run format:check   # prettier --check .
npm run test           # vitest run
npm run test:coverage  # vitest run --coverage
npm run build          # typecheck + vite production build
```

Kelimanya dijalankan di CI (`.github/workflows/ci.yml`) pada setiap push dan PR.

## Mode data

`VITE_AUTH_API_MODE` dan `VITE_SPBU_API_MODE` masing-masing menentukan sumber
data auth dan SPBU search secara independen, bawaannya `mock` untuk keduanya —
login bisa `live` sementara search/map/benchmark tetap `mock`, atau sebaliknya:

| Mode   | Perilaku                                                                       |
| ------ | ------------------------------------------------------------------------------ |
| `mock` | Fixture di `src/api/mock/`, dijalankan di browser. Tanpa backend, tanpa login. |
| `live` | Memanggil `SearchEngine-BE` sungguhan.                                         |

Kedua implementasi memenuhi tipe kontrak yang sama — `spbuMockApi` dan
`authMockApi` dideklarasikan dengan `satisfies typeof spbuApi` / `typeof authApi`
— sehingga keduanya tidak bisa menyimpang tanpa membuat typecheck gagal. Sisa
aplikasi mengimpor `spbuApi`/`authApi` dari `@/api` dan tidak pernah tahu
implementasi mana yang dipakai.

Mock-nya bukan data diam: `src/api/mock/engine.ts` benar-benar menjalankan
pencocokan kata kunci, toleransi salah ketik, sinonim alamat, penyorotan
`<mark>`, hitungan facet, penyaring radius (haversine), pengurutan, dan
paginasi. Perbedaan kemampuan kedua mesin juga ditiru: `Sql` hanya mencocokkan
nama dan alamat dengan `LIKE`, tidak menghasilkan facet maupun penyorotan, dan
melaporkan keterbatasan itu lewat `kemampuan` serta `catatan` — persis seperti
backend. 26 SPBU dipakai sebagai fixture, memakai kode regional, produk, dan
fasilitas yang sama dengan seeder backend.

Pencarian lewat foto (tombol kamera di sebelah kolom pencarian) memanggil
`POST /search/spbu/image` dengan `file` sebagai `FormData`, lalu memakai
`kodeSpbuTerdeteksi` (atau `kataKunci` bila kode tidak terbaca) dari hasil OCR
sebagai kata kunci pencarian berikutnya — hasil OCR-nya sendiri tidak
ditampilkan, hanya kata kuncinya yang mengisi kolom pencarian dan langsung
menjalankan pencarian seperti biasa. Mock-nya tidak melakukan OCR sungguhan:
foto apa pun akan selalu "membaca" kode SPBU pertama di fixture, sekadar
supaya alurnya bisa dicoba tanpa backend.

### Mengaktifkan backend

```bash
cp .env.example .env
# lalu set salah satu atau keduanya:
#   VITE_AUTH_API_MODE=live
#   VITE_SPBU_API_MODE=live
#   VITE_API_BASE_URL=http://localhost:5152/api
```

`5152` adalah port `dotnet run` pada `launchSettings.json` backend, dan
`http://localhost:5173` sudah ada di daftar `Cors:AllowedOrigins`.

Semua halaman di bawah `MainLayout` sudah diproteksi `RequireAuth` (belum
login → dilempar ke `/login`), dan `/login` sendiri diproteksi
`RedirectIfAuthenticated` (sudah login → dilempar ke `/search`).

Endpoint yang dipetakan di layer API:

| Endpoint                      | Permission       | Dipakai untuk                               |
| ----------------------------- | ---------------- | ------------------------------------------- |
| `POST /auth/login`            | —                | Login, menyimpan token + daftar permission  |
| `POST /auth/refresh`          | —                | Perpanjangan sesi otomatis saat 401         |
| `POST /auth/logout`           | (login)          | Keluar                                      |
| `GET /search/spbu`            | `search.view`    | Hasil pencarian, facet, kemampuan mesin     |
| `GET /search/spbu/suggestion` | `search.view`    | Saran ketik-langsung                        |
| `POST /search/spbu/image`     | `search.view`    | Pencarian dari foto (OCR)                   |
| `GET /search/spbu/benchmark`  | `search.execute` | Halaman `/benchmark`: adu cepat ES vs SQL   |

**Tidak ada** endpoint `GET /search/spbu/{kode}`. Backend sengaja mengirim
dokumen SPBU secara utuh di setiap hasil pencarian, sehingga panel detail tidak
memerlukan permintaan kedua.

Semua respons dibungkus `Result<T>` (`{ success, message, data, errors }`).
Envelope itu dibuka di satu tempat — `src/api/http.ts` — sehingga pemanggil
selalu menerima `T` dan kegagalan menjadi `ApiError` yang dilempar.

## Struktur

```text
src/
  api/                  transport + kontrak backend
    contracts/          tipe yang mirror DTO backend (auth, common, spbu)
    resources/          implementasi live: authApi, spbuApi
    mock/               implementasi offline: fixture + mesin pencari lokal
    http.ts             axios instance, interceptor, unwrap Result<T>
    tokenStore.ts       satu-satunya pemilik token di localStorage
    ApiError.ts         satu tipe error untuk semua mode kegagalan
    index.ts            memilih implementasi berdasarkan VITE_AUTH_API_MODE / VITE_SPBU_API_MODE
  app/                  router, provider, error boundary rute
  components/
    ui/                 primitive lintas fitur (Button, Card, Input, Icon, ...)
    layout/             MainLayout, Topbar, MobileNav, UserMenu
    shared/             AppErrorBoundary, StatusBadge
  config/               routes.ts, navigation.ts
  contexts/             AuthContext (sesi, dipakai lintas fitur)
  features/
    auth/               components/ · data.ts · types.ts · utils.ts · LoginPage.tsx
    search/             components/ · hooks/ · data.ts · types.ts · utils.ts · SearchPage.tsx
    map/                components/ · data.ts · types.ts · MapPage.tsx
    misc/               halaman placeholder
  hooks/                hook lintas fitur (useDebouncedValue, useClickOutside)
  lib/                  utils.ts (cn)
  stores/               zustand: useMapViewStore
  test/                 setup Vitest
  types/                tipe UI lintas fitur (map.ts)
  utils/                formatter angka/tanggal/koordinat/URL
  App.tsx
  index.css
  main.tsx
  vite-env.d.ts
```

Tiap fitur memakai pola yang sama: `components/` untuk komponen milik halaman itu,
`data.ts` untuk konstanta dan copy, `types.ts` untuk tipe, `utils.ts` untuk logika
murni, dan file halaman di akarnya. Konstanta tidak ditulis ulang di dalam
komponen — semuanya berasal dari `data.ts` fitur yang bersangkutan.

Import memakai alias `@/` (dikonfigurasi di `vite.config.ts` dan
`tsconfig.app.json`), bukan path relatif berantai.

### Warna dan primitive

Palet didefinisikan sebagai skala semantik di `tailwind.config.ts`: `brand`,
`ink` (teks), `line` (border), `surface`, `success`, `danger`, `warning`.
Komponen tidak menulis nilai hex langsung — satu-satunya pengecualian adalah
tekstur peta placeholder di `PreviewMap`.

Ikon selalu lewat komponen `<Icon />` agar glyph dekoratif tidak ikut dibaca
screen reader.

### State

- **URL adalah sumber kebenaran** untuk state pencarian: kata kunci, mesin,
  halaman, urutan, dan seluruh filter facet (`src/features/search/lib/searchParams.ts`).
  Hasil pencarian karena itu bisa dibagikan, tahan reload, dan tombol back jalan.
- **TanStack Query** menangani server state: cache, dedup, retry, dan
  `keepPreviousData` supaya pindah halaman tidak mengosongkan daftar.
- **Context** hanya untuk sesi (`AuthContext`). State drawer mobile dipegang
  lokal oleh `MainLayout`.
- **Zustand** hanya untuk posisi peta (`stores/useMapViewStore`), supaya halaman
  peta dan panel peta di pencarian tidak saling mereset sudut pandang.
- Pada mode mock, `AuthContext` memulai dengan sesi pratinjau sehingga tidak ada
  gerbang login di depan aplikasi.

## Catatan dependency

- Vite **6.4.x**, ESLint **9 + flat config**, React **18.3.1**, React Router
  **major 6** (`createBrowserRouter`).
- `server.host` dibatasi ke `localhost` supaya dev server tidak otomatis
  terbuka ke jaringan lokal.
- Peta memakai **Leaflet + leaflet.markercluster** sungguhan (`features/map`).
  Marker berupa `divIcon` berwarna menurut status, sehingga tidak bergantung pada
  aset gambar Leaflet yang biasa pecah saat di-bundle. Bundle Leaflet (~191 kB)
  dimuat terpisah: panel peta di halaman pencarian memakai `React.lazy`, jadi
  bobotnya tidak masuk ke muatan awal.
- `recharts`, `@radix-ui/react-tabs`, `react-is`, dan `framer-motion` sudah
  dihapus karena tidak terpakai. Animasi masuk hasil pencarian kini memakai
  keyframe CSS — tampilannya sama, tanpa 100 kB pustaka, dan menghormati
  `prefers-reduced-motion`.

## Responsive

Layout desktop memakai tiga kolom: filter, hasil pencarian, dan detail/peta.
Pada tablet/mobile kolom menjadi satu stack, dan navigasi berpindah ke drawer.
