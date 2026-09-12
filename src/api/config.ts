/**
 * `dotnet run` serves SearchEngine-BE on http://localhost:5152 (see
 * launchSettings.json), and its CORS policy allows http://localhost:5173.
 */
const DEFAULT_BASE_URL = "http://localhost:5152/api";

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
  timeoutMs: 20_000,
} as const;

export const STORAGE_KEYS = {
  accessToken: "spbu.access_token",
  refreshToken: "spbu.refresh_token",
  session: "spbu.session",
} as const;
