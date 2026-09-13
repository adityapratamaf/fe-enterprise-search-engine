import type {
  BenchmarkParams,
  BenchmarkResponse,
  SearchEngineKind,
  SearchSpbuParams,
} from "@/api";
import { RESULT_PAGE_SIZE } from "./data";
import type { BenchmarkFormState, BenchmarkQuery, EnginePanelState } from "./types";

function toPositiveNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * "Lokasi" only understands a "latitude, longitude" pair — there is no offline
 * geocoder to turn a city name into coordinates here, so free text such as
 * "Jakarta" parses to nothing and simply has no effect on the query, the same
 * as leaving the field empty.
 */
function parseCoordinates(raw: string): { lat: number; lon: number } | null {
  const match = raw.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const lat = Number(match[1]);
  const lon = Number(match[2]);
  return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
}

/** Turns the raw form strings into the typed, validated values a run commits to. */
export function toBenchmarkQuery(form: BenchmarkFormState): BenchmarkQuery {
  const coords = parseCoordinates(form.location);

  return {
    search: form.keyword.trim(),
    lat: coords?.lat,
    lon: coords?.lon,
    radiusKm: coords ? toPositiveNumber(form.radiusKm) : undefined,
    ratingMin: toPositiveNumber(form.ratingMin),
    ulasanMin: toPositiveNumber(form.ulasanMin),
    iterasi: toPositiveNumber(form.iterasi),
    warmup: form.warmup,
  };
}

/** Maps a committed query onto the one-shot `/benchmark` request. */
export function toBenchmarkParams(query: BenchmarkQuery): BenchmarkParams {
  const params: BenchmarkParams = {
    pageNumber: 1,
    pageSize: RESULT_PAGE_SIZE,
    warmup: query.warmup,
  };

  if (query.search) params.search = query.search;
  if (query.iterasi !== undefined) params.iterasi = query.iterasi;
  if (query.ratingMin !== undefined) params.ratingMin = query.ratingMin;
  if (query.ulasanMin !== undefined) params.ulasanMin = query.ulasanMin;
  if (query.lat !== undefined && query.lon !== undefined) {
    params.lat = query.lat;
    params.lon = query.lon;
    if (query.radiusKm !== undefined) params.radiusKm = query.radiusKm;
  }

  return params;
}

/**
 * Maps a committed query onto a normal engine-scoped search request. Browsing
 * a panel after the run (paging, re-sorting) reuses the regular search
 * endpoint instead of re-running the benchmark measurement itself.
 */
export function toEngineSearchParams(
  query: BenchmarkQuery,
  engine: SearchEngineKind,
  panel: EnginePanelState,
): SearchSpbuParams {
  const params: SearchSpbuParams = {
    engine,
    pageNumber: panel.page,
    pageSize: RESULT_PAGE_SIZE,
    includeFacets: false,
  };

  if (query.search) params.search = query.search;
  if (query.ratingMin !== undefined) params.ratingMin = query.ratingMin;
  if (query.ulasanMin !== undefined) params.ulasanMin = query.ulasanMin;
  if (query.lat !== undefined && query.lon !== undefined) {
    params.lat = query.lat;
    params.lon = query.lon;
    if (query.radiusKm !== undefined) params.radiusKm = query.radiusKm;
  }
  if (panel.sortBy) {
    params.sortBy = panel.sortBy;
    params.isDescending = panel.isDescending;
  }

  return params;
}

function csvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[",\n]/.test(value) ? `"${escaped}"` : escaped;
}

/**
 * Exports the first page each engine returned during the run — the snapshot
 * that produced the timing numbers on screen — as a CSV a spreadsheet can
 * open directly. A BOM is prepended so Excel reads the UTF-8 accents correctly.
 */
export function exportBenchmarkCsv(benchmark: BenchmarkResponse): void {
  const header = [
    "Mesin",
    "Peringkat",
    "Kode SPBU",
    "Nama",
    "Alamat",
    "Kota",
    "Provinsi",
    "Rating",
    "Waktu (ms)",
  ];

  const rows = [benchmark.elasticsearch, benchmark.sql].flatMap((result) =>
    result.items.map((item, index) => [
      result.engine,
      String(index + 1),
      item.kodeSpbu,
      item.nama,
      item.alamat,
      item.kota,
      item.provinsi,
      item.rating === null ? "" : String(item.rating),
      String(Math.round(result.waktuMs)),
    ]),
  );

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `benchmark-spbu-${Date.now()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
