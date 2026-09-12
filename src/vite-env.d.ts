/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `mock` (default) uses in-browser fixtures; `live` calls SearchEngine-BE. */
  readonly VITE_API_MODE?: "mock" | "live";
  /** Base URL of the SearchEngine Web API, including the `/api` prefix. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
