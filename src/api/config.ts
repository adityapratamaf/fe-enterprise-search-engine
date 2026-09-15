/**
 * `dotnet run` serves SearchEngine-BE on http://localhost:5152 (see
 * launchSettings.json), and its CORS policy allows http://localhost:5173.
 */
const DEFAULT_BASE_URL = "http://localhost:5152/api";

/**
 * Selalu mock saat dijalankan lewat Vitest — supaya `.env` milik developer
 * (mis. untuk pakai backend asli) tidak ikut memanggil jaringan sungguhan
 * saat `npm test`.
 */
function resolveMode(envValue: string | undefined): "mock" | "live" {
  return !import.meta.env.VITEST && envValue === "live" ? "live" : "mock";
}

/**
 * Auth dan SPBU search punya sumber data masing-masing, bukan satu saklar
 * gabungan — login bisa jalan ke backend asli sementara pencarian/peta/
 * benchmark tetap pakai fixture, atau sebaliknya. Set `VITE_AUTH_API_MODE`
 * dan/atau `VITE_SPBU_API_MODE` ke `live` di `.env` untuk mengaktifkan.
 */
const AUTH_MODE = resolveMode(import.meta.env.VITE_AUTH_API_MODE);
const SPBU_MODE = resolveMode(import.meta.env.VITE_SPBU_API_MODE);

export const API_CONFIG = {
  authMode: AUTH_MODE,
  spbuMode: SPBU_MODE,
  useMockAuth: AUTH_MODE === "mock",
  useMockSpbu: SPBU_MODE === "mock",
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
  timeoutMs: 20_000,
} as const;

export const STORAGE_KEYS = {
  accessToken: "spbu.access_token",
  refreshToken: "spbu.refresh_token",
  session: "spbu.session",
} as const;
