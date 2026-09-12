# SPBU Search Frontend

Frontend React + TypeScript untuk platform pencarian SPBU Pertamina: dua mesin
pencari (Elasticsearch / SQL), filter berbasis facet, pencarian lewat gambar
(OCR), dan panel detail SPBU.

## Requirements

- Node.js 18.20+ (Node 20/22 disarankan)
- npm 10+
- Backend `SearchEngine-BE` berjalan (lihat bagian [API](#api))

## Run

```bash
npm install
cp .env.example .env    # sesuaikan bila backend tidak di port 5152
npm run dev
```

Buka `http://localhost:5173`. Aplikasi memerlukan login — seluruh endpoint
pencarian di backend dilindungi `[Authorize]` dan permission `search.view`.

## Quality checks

```bash
npm run typecheck    # tsc -b --force
npm run lint         # eslint, --max-warnings 0
npm run format       # prettier --write .
npm run build        # typecheck + vite production build
```

## API

Base URL diatur lewat `.env`:

```env
VITE_API_BASE_URL=http://localhost:5152/api
```

`5152` adalah port `dotnet run` pada `launchSettings.json` backend, dan
`http://localhost:5173` sudah ada di daftar `Cors:AllowedOrigins`.

Endpoint yang dipakai frontend:

| Endpoint                      | Permission       | Dipakai untuk                               |
| ----------------------------- | ---------------- | ------------------------------------------- |
| `POST /auth/login`            | —                | Login, menyimpan token + daftar permission  |
| `POST /auth/refresh`          | —                | Perpanjangan sesi otomatis saat 401         |
| `POST /auth/logout`           | (login)          | Keluar                                      |
| `GET /search/spbu`            | `search.view`    | Hasil pencarian, facet, kemampuan mesin     |
| `GET /search/spbu/suggestion` | `search.view`    | Saran ketik-langsung                        |
| `POST /search/spbu/image`     | `search.view`    | Pencarian dari foto (OCR)                   |
| `GET /search/spbu/benchmark`  | `search.execute` | Tersedia di layer API, halaman belum dibuat |

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
    resources/          authApi, spbuApi
    http.ts             axios instance, interceptor, unwrap Result<T>
    tokenStore.ts       satu-satunya pemilik token di localStorage
    ApiError.ts         satu tipe error untuk semua mode kegagalan
  app/                  router, provider, error boundary rute
  components/
    ui/                 primitive lintas fitur (Button, Card, Input, Icon, ...)
    layout/             MainLayout, Topbar, MobileNav, UserMenu
    shared/             AppErrorBoundary, StatusBadge
  config/               routes.ts, navigation.ts
  features/
    auth/               AuthContext, RequireAuth, LoginPage, permissions
    search/             SearchPage + components/, hooks/, lib/
    misc/               halaman placeholder
  lib/                  utilitas umum (cn, formatter angka/tanggal/URL)
```

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

## Catatan dependency

- Vite **6.4.x**, ESLint **9 + flat config**, React **18.3.1**, React Router
  **major 6** (`createBrowserRouter`).
- `server.host` dibatasi ke `localhost` supaya dev server tidak otomatis
  terbuka ke jaringan lokal.
- Paket berikut **belum terpakai** dan menunggu keputusan produk: `leaflet`,
  `react-leaflet`, `leaflet.markercluster`, `recharts`,
  `@radix-ui/react-tabs`, `react-is`, `zustand`, `framer-motion`.
  `PreviewMap` masih pratinjau bergaya, bukan peta sungguhan.

## Responsive

Layout desktop memakai tiga kolom: filter, hasil pencarian, dan detail/peta.
Pada tablet/mobile kolom menjadi satu stack, dan navigasi berpindah ke drawer.
