/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the SearchEngine Web API, including the `/api` prefix. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
