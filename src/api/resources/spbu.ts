import { api } from "../http";
import { ENDPOINTS } from "../endpoints";
import type {
  BenchmarkParams,
  BenchmarkResponse,
  ReindexResponse,
  SearchByImageResponse,
  SearchSpbuParams,
  SearchSpbuResponse,
  SpbuSuggestionResponse,
} from "../contracts/spbu";

export const spbuApi = {
  /** Pencarian SPBU utama — filter, geo, sort, dan paginasi lewat query string. */
  search: (params: SearchSpbuParams, signal?: AbortSignal) =>
    api.get<SearchSpbuResponse>(ENDPOINTS.spbu.search, { ...params }, { signal }),

  /** The backend returns an empty list for queries under two characters. */
  suggestion: (q: string, limit = 10, signal?: AbortSignal) =>
    api.get<SpbuSuggestionResponse>(ENDPOINTS.spbu.suggestion, { q, limit }, { signal }),

  /** PNG or JPEG, 10 MB max; OCR text is returned alongside the results. */
  searchByImage: (file: File, pageNumber = 1, pageSize = 10, signal?: AbortSignal) => {
    const body = new FormData();
    body.append("file", file);

    // No Content-Type here: the browser sets multipart with the boundary.
    return api.post<SearchByImageResponse>(ENDPOINTS.spbu.image, body, {
      params: { pageNumber, pageSize },
      signal,
    });
  },

  /** Jalankan kedua mesin sinkron di request yang sama — bisa beberapa detik,
   * karena satu kueri SQL di ratusan ribu baris memang selama itu. */
  benchmark: (params: BenchmarkParams, signal?: AbortSignal) =>
    api.get<BenchmarkResponse>(ENDPOINTS.spbu.benchmark, { ...params }, { signal }),

  /** Queues a Hangfire job and returns immediately. */
  reindex: () => api.post<ReindexResponse>(ENDPOINTS.spbu.reindex),
};
