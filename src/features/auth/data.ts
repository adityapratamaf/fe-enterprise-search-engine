import type { LoginHighlight } from "./types";

/** Permission codes this frontend actually depends on. */
export const PERMISSIONS = {
  searchView: { module: "search", action: "view" },
  searchExecute: { module: "search", action: "execute" },
} as const;

/** Marketing copy on the login showcase panel. */
export const LOGIN_HIGHLIGHTS: LoginHighlight[] = [
  {
    icon: "search-eye-line",
    title: "Akses Data Lebih Mudah",
    body: "Temukan informasi SPBU dengan cepat dan akurat.",
  },
  {
    icon: "bar-chart-grouped-line",
    title: "Analitik Lebih Dalam",
    body: "Dukung keputusan berbasis data.",
  },
  {
    icon: "leaf-line",
    title: "Masa Depan Berkelanjutan",
    body: "Energi untuk Indonesia yang lebih baik.",
  },
];

export const LOGIN_TAGLINE = "Energizing a Sustainable Tomorrow";
export const LOGIN_SPLASH_IMAGE = "/spbu-default.jpg";
