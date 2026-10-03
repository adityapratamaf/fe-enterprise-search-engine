import { useMutation } from "@tanstack/react-query";

export class GeolocationError extends Error {}

/** Translates the three real `GeolocationPositionError` codes into Indonesian copy. */
function describeGeolocationError(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Izin lokasi ditolak. Aktifkan akses lokasi di browser untuk mencari SPBU terdekat.";
    case error.POSITION_UNAVAILABLE:
      return "Lokasi tidak dapat dideteksi. Pastikan GPS/lokasi perangkat aktif.";
    case error.TIMEOUT:
      return "Waktu deteksi lokasi habis. Coba lagi.";
    default:
      return "Gagal mendapatkan lokasi.";
  }
}

/**
 * Wraps the browser Geolocation API in a mutation, the same one-shot
 * pending/error shape `useImageSearch` gives the upload button.
 */
export function useNearbySearch() {
  return useMutation({
    mutationFn: () =>
      new Promise<GeolocationCoordinates>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new GeolocationError("Perangkat atau browser ini tidak mendukung lokasi."));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (error) => reject(new GeolocationError(describeGeolocationError(error))),
          { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
        );
      }),
  });
}

/**
 * Checks whether geolocation access was already granted, without risking a
 * prompt of its own. Safari has no Permissions API at all, so an unsupported
 * query reads as "not granted" rather than throwing — the caller falls back
 * to asking only once the backend says it actually needs a location.
 */
export async function hasGrantedGeolocationPermission(): Promise<boolean> {
  if (!navigator.permissions?.query) return false;
  try {
    const status = await navigator.permissions.query({ name: "geolocation" as PermissionName });
    return status.state === "granted";
  } catch {
    return false;
  }
}

/**
 * Resolves coordinates or `null` — never throws. Used both to attach a
 * location to an "Ai" search speculatively (permission already granted, so
 * this does not prompt) and to ask for one once the backend says a sentence
 * needed it (permission still "prompt", so this does). Either way, a failure
 * here is "best effort" rather than something to surface as an error: the
 * response's own `catatan` already explains the consequence in plain words.
 */
export function requestCurrentPosition(): Promise<GeolocationCoordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  });
}
