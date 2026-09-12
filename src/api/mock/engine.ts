import { FACET_KEYS, type FacetKey } from "../contracts/spbu";
import type {
  FacetBucket,
  SearchCapabilities,
  SearchEngineKind,
  SearchSpbuParams,
  SearchSpbuResponse,
  SpbuSearchItem,
} from "../contracts/spbu";
import { SPBU_FIXTURES, type SpbuFixture } from "./dataset";

/**
 * A local stand-in for the two backend search engines, faithful to the
 * *behavioural* differences the real API reports through `kemampuan`:
 * Elasticsearch ranks by relevance, tolerates typos, highlights matches and
 * produces facets; SQL does a plain substring match over name and address only,
 * orders alphabetically, and can do none of the rest. That contrast is the whole
 * point of the product, so the preview has to show it rather than fake it.
 */

const ES_CAPABILITIES: SearchCapabilities = {
  highlight: true,
  facet: true,
  fuzzy: true,
  relevansi: true,
  sinonim: true,
  geo: true,
};

const SQL_CAPABILITIES: SearchCapabilities = {
  highlight: false,
  facet: false,
  fuzzy: false,
  relevansi: false,
  sinonim: false,
  geo: false,
};

/** Address synonyms the Elasticsearch analyser is configured with. */
const SYNONYMS: Record<string, string[]> = {
  jl: ["jalan"],
  jalan: ["jl"],
  jend: ["jenderal"],
  jenderal: ["jend"],
  kab: ["kabupaten"],
  kabupaten: ["kab"],
};

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9.]+/i)
    .filter(Boolean);
}

/** Levenshtein distance capped at 2, which is the fuzziness the backend allows. */
function withinEditDistance(a: string, b: string, max = 2): boolean {
  if (Math.abs(a.length - b.length) > max) return false;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        (current[j - 1] ?? 0) + 1,
        (previous[j] ?? 0) + 1,
        (previous[j - 1] ?? 0) + cost,
      );
    }
    previous = current;
    if (Math.min(...current) > max) return false;
  }

  return (previous[b.length] ?? max + 1) <= max;
}

type Match = { score: number; fields: Set<string> };

/**
 * Scores one station against one query token. Exact matches on the code or name
 * outrank a fuzzy hit deep in the address, which is what makes the ranking useful.
 */
function scoreToken(item: SpbuFixture, token: string, fuzzy: boolean): Match | null {
  const fields = new Set<string>();
  let score = 0;

  const expanded = [token, ...(SYNONYMS[token] ?? [])];

  const hit = (haystack: string, weight: number, field: string) => {
    const lower = haystack.toLowerCase();
    if (expanded.some((term) => lower.includes(term))) {
      score += weight;
      fields.add(field);
      return true;
    }
    return false;
  };

  if (item.kodeSpbu.toLowerCase().includes(token)) {
    score += 12;
    fields.add("kodeSpbu");
  }

  hit(item.nama, 6, "nama");
  hit(item.alamat, 3, "alamat");
  hit(item.kota, 2.5, "kota");
  hit(item.provinsi, 2, "provinsi");
  hit(item.regionalNama, 1.5, "regionalNama");
  item.produkNama.forEach((name) => hit(name, 2, "produkNama"));
  item.fasilitasNama.forEach((name) => hit(name, 1.5, "fasilitasNama"));

  if (score === 0 && fuzzy && token.length >= 4) {
    const candidates = [
      ...tokenize(item.nama).map((word) => ["nama", word] as const),
      ...tokenize(item.alamat).map((word) => ["alamat", word] as const),
      ...tokenize(item.kota).map((word) => ["kota", word] as const),
    ];

    for (const [field, word] of candidates) {
      if (withinEditDistance(token, word)) {
        // Deliberately below any exact hit: a typo match is a weaker signal.
        score += 1.5;
        fields.add(field);
        break;
      }
    }
  }

  return score > 0 ? { score, fields } : null;
}

function matchKeyword(item: SpbuFixture, keyword: string, engine: SearchEngineKind): Match | null {
  const tokens = tokenize(keyword);
  if (tokens.length === 0) return { score: 0, fields: new Set() };

  if (engine === "Sql") {
    // A LIKE '%term%' over name and address, nothing more.
    const needle = keyword.trim().toLowerCase();
    const matches =
      item.nama.toLowerCase().includes(needle) || item.alamat.toLowerCase().includes(needle);
    return matches ? { score: 0, fields: new Set() } : null;
  }

  let total = 0;
  const fields = new Set<string>();

  for (const token of tokens) {
    const match = scoreToken(item, token, true);
    if (!match) continue;
    total += match.score;
    match.fields.forEach((field) => fields.add(field));
  }

  // Reward stations that matched more of the query than others.
  return total > 0 ? { score: total, fields } : null;
}

/** Wraps each matched token in `<mark>`, the way the backend returns highlights. */
function buildHighlight(
  item: SpbuFixture,
  keyword: string,
  fields: Set<string>,
): Record<string, string[]> | null {
  const tokens = tokenize(keyword).filter((token) => token.length >= 2);
  if (tokens.length === 0) return null;

  const mark = (text: string): string | null => {
    const pattern = new RegExp(
      `(${tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi",
    );
    const marked = text.replace(pattern, "<mark>$1</mark>");
    return marked === text ? null : marked;
  };

  const highlight: Record<string, string[]> = {};
  if (fields.has("nama")) {
    const marked = mark(item.nama);
    if (marked) highlight.nama = [marked];
  }
  if (fields.has("alamat")) {
    const marked = mark(item.alamat);
    if (marked) highlight.alamat = [marked];
  }

  return Object.keys(highlight).length > 0 ? highlight : null;
}

const EARTH_RADIUS_KM = 6371;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/** Which fixture field backs each facet key. */
function facetValues(item: SpbuFixture, key: FacetKey): string[] {
  switch (key) {
    case "regional":
      return [item.regional];
    case "provinsi":
      return [item.provinsi];
    case "kota":
      return [item.kota];
    case "produk":
      return item.produk;
    case "fasilitas":
      return item.fasilitas;
    case "status":
      return [item.status];
    case "tipeKepemilikan":
      return [item.tipeKepemilikan];
  }
}

function passesFacet(item: SpbuFixture, key: FacetKey, selected: string[] | undefined): boolean {
  if (!selected || selected.length === 0) return true;
  const values = facetValues(item, key);
  // OR within a group, AND across groups — the same semantics as the facet panel.
  return selected.some((value) => values.includes(value));
}

function countFacet(items: SpbuFixture[], key: FacetKey, limit: number): FacetBucket[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const value of facetValues(item, key)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([nilai, jumlah]) => ({ nilai, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah || a.nilai.localeCompare(b.nilai, "id-ID"))
    .slice(0, limit);
}

function sortLabel(
  engine: SearchEngineKind,
  sortBy: string | undefined,
  isDescending: boolean,
  hasKeyword: boolean,
  hasCoordinates: boolean,
): string {
  const arah = isDescending ? "Z - A" : "A - Z";

  switch (sortBy?.trim().toLowerCase()) {
    case "nama":
      return `Nama ${arah}`;
    case "kode":
      return isDescending ? "Kode menurun" : "Kode menaik";
    case "nozzle":
      return isDescending ? "Nozzle terbanyak" : "Nozzle tersedikit";
    case "rating":
      return isDescending ? "Rating tertinggi" : "Rating terendah";
    case "jarak":
      if (engine === "Elasticsearch" && hasCoordinates) return "Jarak terdekat";
      break;
  }

  if (engine === "Elasticsearch" && hasKeyword) return "Relevansi";
  return `Nama ${arah}`;
}

type Scored = { item: SpbuFixture; score: number; fields: Set<string>; jarakKm: number | null };

function compare(a: Scored, b: Scored, sortBy: string, descending: boolean): number {
  const direction = descending ? -1 : 1;

  switch (sortBy) {
    case "nama":
      return direction * a.item.nama.localeCompare(b.item.nama, "id-ID");
    case "kode":
      return direction * a.item.kodeSpbu.localeCompare(b.item.kodeSpbu, "id-ID");
    case "nozzle":
      return direction * (a.item.jumlahNozzle - b.item.jumlahNozzle);
    case "rating":
      // Unrated stations sort last either way; "no rating" is not a low rating.
      if (a.item.rating === null) return 1;
      if (b.item.rating === null) return -1;
      return direction * (a.item.rating - b.item.rating);
    case "jarak":
      if (a.jarakKm === null) return 1;
      if (b.jarakKm === null) return -1;
      return direction * (a.jarakKm - b.jarakKm);
    default:
      return 0;
  }
}

export function runMockSearch(params: SearchSpbuParams): SearchSpbuResponse {
  const engine: SearchEngineKind = params.engine ?? "Elasticsearch";
  const capabilities = engine === "Sql" ? SQL_CAPABILITIES : ES_CAPABILITIES;
  const catatan: string[] = [];

  const keyword = params.search?.trim() ?? "";
  const pageSize = Math.max(1, params.pageSize ?? 10);
  const pageNumber = Math.max(1, params.pageNumber ?? 1);

  const hasCoordinates =
    params.lat !== undefined && params.lon !== undefined && params.radiusKm !== undefined;

  if (hasCoordinates && !capabilities.geo) {
    catatan.push("Penyaring jarak diabaikan: mesin SQL tidak mendukung pencarian radius.");
  }

  const geoActive = hasCoordinates && capabilities.geo;

  // --- keyword + filters ---
  const scored: Scored[] = [];

  for (const item of SPBU_FIXTURES) {
    const match = matchKeyword(item, keyword, engine);
    if (!match) continue;

    if (params.ratingMin !== undefined) {
      // Unreviewed stations meet no threshold at all, per the backend's rule.
      if (item.rating === null || item.rating < params.ratingMin) continue;
    }
    if (params.ulasanMin !== undefined && item.jumlahUlasan < params.ulasanMin) continue;

    const jarakKm = geoActive
      ? haversineKm(params.lat!, params.lon!, item.latitude, item.longitude)
      : null;

    if (geoActive && jarakKm !== null && jarakKm > params.radiusKm!) continue;

    scored.push({ item, score: match.score, fields: match.fields, jarakKm });
  }

  const selectedFilters: Partial<Record<FacetKey, string[]>> = {};
  for (const key of FACET_KEYS) {
    const selected = params[key];
    if (selected && selected.length > 0) selectedFilters[key] = selected;
  }

  if (engine === "Sql" && Object.keys(selectedFilters).length > 0) {
    catatan.push(
      "Penyaring tetap diterapkan, namun mesin SQL tidak dapat menghitung jumlah per nilai.",
    );
  }

  const passesAllExcept = (item: SpbuFixture, exclude: FacetKey | null) =>
    FACET_KEYS.every((key) =>
      key === exclude ? true : passesFacet(item, key, selectedFilters[key]),
    );

  const filtered = scored.filter((entry) => passesAllExcept(entry.item, null));

  // --- facets ---
  let facets: Partial<Record<FacetKey, FacetBucket[]>> | null = null;

  if (params.includeFacets !== false && capabilities.facet) {
    const limit = params.facetSize ?? 50;
    facets = {};
    for (const key of FACET_KEYS) {
      /**
       * A facet's own selection is excluded from its own counts, so the other
       * values in that group stay visible and selectable. Without this,
       * multi-select would show every sibling at zero.
       */
      const scope = scored.filter((entry) => passesAllExcept(entry.item, key));
      facets[key] = countFacet(
        scope.map((entry) => entry.item),
        key,
        limit,
      );
    }
  }

  // --- ordering ---
  const sortBy = params.sortBy?.trim().toLowerCase() ?? "";
  const descending = params.isDescending ?? false;
  const relevanceOrder = engine === "Elasticsearch" && keyword !== "" && sortBy === "";
  const geoSort = sortBy === "jarak" && geoActive;

  const ordered = [...filtered].sort((a, b) => {
    if (sortBy && (sortBy !== "jarak" || geoSort)) {
      const result = compare(a, b, sortBy, descending);
      if (result !== 0) return result;
    } else if (relevanceOrder) {
      if (b.score !== a.score) return b.score - a.score;
    }

    // Stable, predictable tiebreaker.
    return a.item.nama.localeCompare(b.item.nama, "id-ID");
  });

  if (sortBy === "jarak" && !geoActive) {
    catatan.push("Pengurutan jarak memerlukan koordinat; hasil diurutkan menurut nama.");
  }

  const totalCount = ordered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(pageNumber, totalPages);
  const start = (safePage - 1) * pageSize;

  const items: SpbuSearchItem[] = ordered.slice(start, start + pageSize).map((entry) => ({
    ...entry.item,
    score: relevanceOrder ? Math.round(entry.score * 100) / 100 : null,
    highlight:
      capabilities.highlight && keyword ? buildHighlight(entry.item, keyword, entry.fields) : null,
    jarakKm: entry.jarakKm === null ? null : Math.round(entry.jarakKm * 10) / 10,
  }));

  return {
    items,
    totalCount,
    pageNumber: safePage,
    pageSize,
    totalPages,
    // SQL is slower on the same corpus; the preview should not pretend otherwise.
    tookMs: engine === "Sql" ? 180 + totalCount * 3 : 12 + totalCount,
    engine,
    urutan: sortLabel(engine, sortBy, descending, keyword !== "", geoActive),
    facets,
    kemampuan: capabilities,
    catatan,
  };
}

export function runMockSuggestion(q: string, limit: number) {
  const needle = q.trim().toLowerCase();

  const items = SPBU_FIXTURES.filter((item) => {
    if (item.kodeSpbu.toLowerCase().includes(needle)) return true;
    // Per-word prefix matching, which is how the backend's suggester works.
    return tokenize(item.nama).some((word) => word.startsWith(needle));
  })
    .slice(0, limit)
    .map((item) => ({
      kodeSpbu: item.kodeSpbu,
      nama: item.nama,
      kota: item.kota,
      provinsi: item.provinsi,
    }));

  return { items, tookMs: 4 };
}

export const MOCK_TOTAL_DOCUMENTS = SPBU_FIXTURES.length;
