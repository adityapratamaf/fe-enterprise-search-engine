/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `mock` (default) uses in-browser fixtures; `live` calls SearchEngine-BE.
   * Auth and SPBU search each switch independently — one can be live while
   * the other stays on fixtures. */
  readonly VITE_AUTH_API_MODE?: "mock" | "live";
  readonly VITE_SPBU_API_MODE?: "mock" | "live";
  /** Base URL of the SearchEngine Web API, including the `/api` prefix. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
