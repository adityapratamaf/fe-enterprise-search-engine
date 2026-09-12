# SPBU Search Frontend

Frontend React + TypeScript untuk platform pencarian SPBU Pertamina dengan UI search-engine, dua engine (Elasticsearch / SQL), filter, preview peta, dan detail SPBU.

## Requirements

- Node.js 18.20+ (Node 20/22 disarankan)
- npm 10+

## Run

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Quality checks

```bash
npm run build
npm run preview
npm run lint
```

`npm run build` menjalankan TypeScript check lalu Vite production build.

## Catatan dependency

- Vite dinaikkan ke **6.4.x** karena Vite 5 sudah tidak menjadi baseline yang baik untuk project baru dan security patch terbaru tidak lagi tersedia di Vite 5.
- Recharts menggunakan **3.x**, bukan 2.x yang sudah tidak aktif.
- ESLint menggunakan **9 + flat config**, sehingga tidak lagi bergantung pada ESLint 8 dan paket legacy `@humanwhocodes/*`.
- React tetap **18.3.1** dan React Router tetap pada **major 6** agar API `createBrowserRouter` yang dipakai project tetap stabil.
- `server.host` dibatasi ke `localhost` secara default supaya Vite dev server tidak otomatis terbuka ke network lokal.

## API

Set base URL melalui `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Endpoint SPBU yang sudah disiapkan di layer resource:

- `GET /search/spbu`
- `GET /search/spbu/suggestion`
- `GET /search/spbu/{kode}`
- `GET /search/spbu/benchmark`

UI saat ini menggunakan mock data supaya frontend dapat langsung dipreview tanpa backend.

## Arsitektur component-first

Komponen lintas halaman diletakkan di:

```text
src/components/ui
src/components/layout
src/components/navigation
src/components/search
src/components/map
src/components/shared
```

Halaman tidak membuat ulang komponen dasar seperti Button, Card, Badge, SearchBar, FilterSidebar, ResultCard, Topbar, dan PreviewMap.

## Responsive

Layout desktop memakai tiga kolom: filter, hasil pencarian, dan detail/peta. Pada tablet/mobile kolom akan berubah menjadi stack agar tetap usable.
