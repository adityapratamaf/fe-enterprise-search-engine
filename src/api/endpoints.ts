/** Paths are relative to `API_CONFIG.baseURL`, which already ends in `/api`. */
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    profile: "/auth/profile",
  },
  spbu: {
    search: "/search/spbu",
    suggestion: "/search/spbu/suggestion",
    image: "/search/spbu/image",
    benchmark: "/search/spbu/benchmark",
    reindex: "/search/spbu/reindex",
  },
} as const;
