import type { SpbuSearchItem } from "@/api";

/** Shared station photo in `public/`, used until the API carries real images. */
export const SPBU_IMAGE_FALLBACK = "/spbu-default.jpg";

/**
 * Single source for a station's photo. The API has no image field yet, so every
 * station renders the shared asset — when that field arrives, this is the only
 * place that has to change.
 */
export function spbuImageUrl(_item: Pick<SpbuSearchItem, "kodeSpbu">): string {
  return SPBU_IMAGE_FALLBACK;
}
