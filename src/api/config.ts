export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api",
};

export const STORAGE_KEYS = {
  accessToken: "spbu_access_token",
  refreshToken: "spbu_refresh_token",
};
