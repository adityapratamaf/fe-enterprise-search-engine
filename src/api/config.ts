/**
 * `dotnet run` serves SearchEngine-BE on http://localhost:5152 (see
 * launchSettings.json), and its CORS policy allows http://localhost:5173.
 */
const DEFAULT_BASE_URL = "http://localhost:5152/api";

/**
 * Data source. `mock` runs entirely in the browser against local fixtures, so
 * the UI is previewable with no backend and no real login; `live` talks to
 * SearchEngine-BE. Set `VITE_API_MODE=live` in `.env` to switch.
 *
 * Selalu mock saat dijalankan lewat Vitest — supaya `.env` milik developer
 * (mis. `VITE_API_MODE=live` untuk pakai backend asli) tidak ikut memanggil
 * jaringan sungguhan saat `npm test`.
 */
const MODE = !import.meta.env.VITEST && import.meta.env.VITE_API_MODE === "live" ? "live" : "mock";

export const API_CONFIG = {
  mode: MODE,
  useMock: MODE === "mock",
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
  timeoutMs: 20_000,
} as const;

export const STORAGE_KEYS = {
  accessToken: "spbu.access_token",
  refreshToken: "spbu.refresh_token",
  session: "spbu.session",
} as const;
