import { BRAND_TAGLINE } from "@/config/branding";
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
    body: "Dukung pengambilan keputusan yang lebih tepat.",
  },
  {
    icon: "leaf-line",
    title: "Masa Depan Lebih Berkelanjutan",
    body: "Bersama menjaga energi untuk Indonesia yang lebih baik.",
  },
];

/** Same line as the header panel; kept in one place so they cannot drift. */
export const LOGIN_TAGLINE = BRAND_TAGLINE;
export const LOGIN_SUBTITLE = "Masuk untuk melakukan pencarian dan analitik data SPBU Pertamina";

/** Short note above the submit button's result, framing what the platform is for. */
export const LOGIN_NOTE =
  "Satu platform untuk data SPBU yang lebih terintegrasi, akurat, dan berdampak bagi Indonesia.";

export const LOGIN_SPLASH_IMAGE = "/spbu-login.png";
/** Faded into the form panel's backdrop as a watermark, not shown at full size. */
export const LOGIN_WATERMARK = "/pertamina-icon.png";
