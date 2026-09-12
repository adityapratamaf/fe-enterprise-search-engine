import { useMutation } from "@tanstack/react-query";
import { spbuApi } from "@/api";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg"];

export class ImageValidationError extends Error {}

/**
 * Reads a photo through the backend's OCR endpoint and hands back the keyword it
 * derived. The caller then feeds that keyword into the normal search, which is
 * the flow the backend documents and lets the user correct it afterwards. The
 * camera button previously accepted a file and silently discarded it.
 */
export function useImageSearch() {
  return useMutation({
    mutationFn: async (file: File) => {
      if (!ACCEPTED.includes(file.type)) {
        throw new ImageValidationError("Hanya berkas PNG atau JPEG yang didukung.");
      }
      if (file.size > MAX_BYTES) {
        throw new ImageValidationError("Ukuran gambar melebihi batas 10 MB.");
      }

      return spbuApi.searchByImage(file);
    },
  });
}
