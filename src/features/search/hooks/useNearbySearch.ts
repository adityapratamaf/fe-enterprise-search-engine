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
