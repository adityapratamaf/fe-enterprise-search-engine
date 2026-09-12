import { ApiError } from "../ApiError";
import type {
  BenchmarkParams,
  BenchmarkResponse,
  ReindexResponse,
  SearchByImageResponse,
  SearchSpbuParams,
  SearchSpbuResponse,
  SpbuSuggestionResponse,
} from "../contracts/spbu";
import type { spbuApi as LiveSpbuApi } from "../resources/spbu";
import { MOCK_TOTAL_DOCUMENTS, runMockSearch, runMockSuggestion } from "./engine";
import { SPBU_FIXTURES } from "./dataset";

/** Enough delay that loading skeletons are actually visible while developing. */
const LATENCY_MS = { search: 260, suggestion: 90, image: 900, benchmark: 700 };

function delay<T>(value: T, ms: number, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ApiError("Permintaan dibatalkan.", { isNetwork: true }));
      return;
    }

    const timer = setTimeout(() => resolve(value), ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new ApiError("Permintaan dibatalkan.", { isNetwork: true }));
      },
      { once: true },
    );
  });
}

/**
 * Offline stand-in for `spbuApi`, resolving the same contract types so switching
 * to the real backend is a flag change and nothing more. `satisfies` below keeps
 * the two surfaces from drifting apart.
 */
export const spbuMockApi = {
  search: (params: SearchSpbuParams, signal?: AbortSignal): Promise<SearchSpbuResponse> =>
    delay(runMockSearch(params), LATENCY_MS.search, signal),

  suggestion: (q: string, limit = 10, signal?: AbortSignal): Promise<SpbuSuggestionResponse> =>
    delay(runMockSuggestion(q, limit), LATENCY_MS.suggestion, signal),

  /**
   * There is no OCR offline, so the "reading" is simulated: it reports the code
   * of a known station and routes through the normal search, which is exactly the
   * shape the real endpoint returns.
   */
  searchByImage: async (
    file: File,
    pageNumber = 1,
    pageSize = 10,
    signal?: AbortSignal,
  ): Promise<SearchByImageResponse> => {
    const sample = SPBU_FIXTURES[0]!;
    const kataKunci = sample.kodeSpbu;

    const hasil = runMockSearch({ search: kataKunci, pageNumber, pageSize, includeFacets: true });

    return delay(
      {
        ocr: {
          teks: `PERTAMINA\n${sample.kodeSpbu}\n${sample.nama}\n${sample.alamat}`,
          keyakinan: 0.82,
          bahasa: "ind+eng",
          durasiMs: 640,
        },
        kataKunci,
        kodeSpbuTerdeteksi: sample.kodeSpbu,
        hasil,
      },
      LATENCY_MS.image,
      signal,
    ).then((response) => {
      if (file.size === 0) {
        throw new ApiError("Berkas gambar kosong.", { status: 400 });
      }
      return response;
    });
  },

  benchmark: (params: BenchmarkParams, signal?: AbortSignal): Promise<BenchmarkResponse> => {
    const shared = {
      search: params.search,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    };

    const es = runMockSearch({ ...shared, engine: "Elasticsearch", includeFacets: false });
    const sql = runMockSearch({ ...shared, engine: "Sql", includeFacets: false });

    const esFaster = es.tookMs <= sql.tookMs;
    const slower = Math.max(es.tookMs, sql.tookMs);
    const faster = Math.max(1, Math.min(es.tookMs, sql.tookMs));

    const toEngineResult = (result: SearchSpbuResponse) => ({
      engine: result.engine,
      waktuMs: result.tookMs,
      totalHasil: result.totalCount,
      pageNumber: result.pageNumber,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      urutan: result.urutan,
      items: result.items,
    });

    return delay(
      {
        kueri: params.search ?? null,
        iterasi: params.iterasi ?? 3,
        totalDokumen: MOCK_TOTAL_DOCUMENTS,
        pemenang: esFaster ? ("Elasticsearch" as const) : ("Sql" as const),
        kaliLebihCepat: Math.round((slower / faster) * 10) / 10,
        elasticsearch: toEngineResult(es),
        sql: toEngineResult(sql),
      },
      LATENCY_MS.benchmark,
      signal,
    );
  },

  reindex: (): Promise<ReindexResponse> =>
    Promise.reject(
      new ApiError("Indexing ulang hanya tersedia bila terhubung ke backend.", { status: 501 }),
    ),
} satisfies typeof LiveSpbuApi;
