import { describe, expect, it } from "vitest";
import { runMockSearch, runMockSuggestion } from "./engine";
import { SPBU_FIXTURES } from "./dataset";

const TOTAL = SPBU_FIXTURES.length;

describe("runMockSearch — paging", () => {
  it("returns the whole corpus when no keyword is given", () => {
    const result = runMockSearch({ pageSize: 10 });
    expect(result.totalCount).toBe(TOTAL);
    expect(result.items).toHaveLength(10);
    expect(result.totalPages).toBe(Math.ceil(TOTAL / 10));
  });

  it("clamps an out-of-range page instead of returning nothing", () => {
    const result = runMockSearch({ pageSize: 10, pageNumber: 99 });
    expect(result.pageNumber).toBe(result.totalPages);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("keeps a zero-result response well formed", () => {
    const result = runMockSearch({ search: "zzzzzqqq" });
    expect(result.totalCount).toBe(0);
    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(1);
  });
});

describe("runMockSearch — engine differences", () => {
  it("matches product names on Elasticsearch but not on SQL", () => {
    expect(runMockSearch({ search: "pertamax turbo" }).totalCount).toBeGreaterThan(0);
    expect(runMockSearch({ search: "pertamax turbo", engine: "Sql" }).totalCount).toBe(0);
  });

  it("tolerates a typo on Elasticsearch but not on SQL", () => {
    expect(runMockSearch({ search: "sudirmen" }).totalCount).toBeGreaterThan(0);
    expect(runMockSearch({ search: "sudirmen", engine: "Sql" }).totalCount).toBe(0);
  });

  it("expands the jl/jalan address synonym", () => {
    expect(runMockSearch({ search: "jalan sudirman" }).totalCount).toBeGreaterThan(0);
  });

  it("reports capabilities that match what each engine actually did", () => {
    const es = runMockSearch({ search: "sudirman" });
    const sql = runMockSearch({ search: "sudirman", engine: "Sql" });

    expect(es.kemampuan).toMatchObject({ facet: true, highlight: true, fuzzy: true });
    expect(sql.kemampuan).toMatchObject({ facet: false, highlight: false, fuzzy: false });
    expect(sql.facets).toBeNull();
    expect(es.facets?.provinsi).toBeInstanceOf(Array);
  });

  it("reports SQL as slower than Elasticsearch on the same corpus", () => {
    const es = runMockSearch({ search: "sudirman" });
    const sql = runMockSearch({ search: "sudirman", engine: "Sql" });
    expect(sql.tookMs).toBeGreaterThan(es.tookMs);
  });
});

describe("runMockSearch — highlighting", () => {
  it("wraps matches in <mark> on Elasticsearch", () => {
    const result = runMockSearch({ search: "sudirman" });
    const highlighted = result.items.find((item) => item.highlight !== null);
    expect(JSON.stringify(highlighted?.highlight)).toContain("<mark>");
  });

  it("only ever highlights nama and alamat, the fields the backend highlights", () => {
    const result = runMockSearch({ search: "sudirman" });
    for (const item of result.items) {
      if (!item.highlight) continue;
      expect(Object.keys(item.highlight).every((key) => key === "nama" || key === "alamat")).toBe(
        true,
      );
    }
  });

  it("produces no highlight when the match came from a product name", () => {
    const result = runMockSearch({ search: "pertamax turbo" });
    expect(result.items.every((item) => item.highlight === null)).toBe(true);
  });

  it("never highlights on SQL", () => {
    const result = runMockSearch({ search: "sudirman", engine: "Sql" });
    expect(result.items.every((item) => item.highlight === null)).toBe(true);
  });
});

describe("runMockSearch — facets", () => {
  it("ORs values within a group and ANDs across groups", () => {
    const jakarta = runMockSearch({ provinsi: ["DKI Jakarta"] });
    const both = runMockSearch({ provinsi: ["DKI Jakarta", "Bali"] });
    const crossed = runMockSearch({ provinsi: ["DKI Jakarta"], produk: ["PERTAMAX_TURBO"] });

    expect(both.totalCount).toBeGreaterThan(jakarta.totalCount);
    expect(crossed.totalCount).toBeGreaterThan(0);
    expect(crossed.totalCount).toBeLessThan(jakarta.totalCount);
  });

  it("keeps a group's other values counted while some are selected", () => {
    // Without excluding a facet from its own counts, multi-select would show
    // every unselected sibling at zero and become unusable.
    const result = runMockSearch({ provinsi: ["DKI Jakarta", "Bali"] });
    const names = result.facets?.provinsi?.map((bucket) => bucket.nilai) ?? [];

    expect(names).toContain("Jawa Barat");
    expect(names.length).toBeGreaterThan(2);
  });

  it("omits facets when asked to", () => {
    expect(runMockSearch({ includeFacets: false }).facets).toBeNull();
  });
});

describe("runMockSearch — rating and reviews", () => {
  it("excludes unreviewed stations from a rating threshold", () => {
    // An unrated station is not a low-rated one, but it meets no threshold either.
    const result = runMockSearch({ ratingMin: 4.5, pageSize: 50 });
    expect(result.items.every((item) => item.rating !== null && item.rating >= 4.5)).toBe(true);
  });

  it("filters on a minimum review count", () => {
    const result = runMockSearch({ ulasanMin: 300, pageSize: 50 });
    expect(result.items.every((item) => item.jumlahUlasan >= 300)).toBe(true);
  });
});

describe("runMockSearch — ordering", () => {
  it("sorts by name ascending", () => {
    const result = runMockSearch({ sortBy: "nama", pageSize: 50 });
    const names = result.items.map((item) => item.nama);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "id-ID")));
  });

  it("puts unrated stations last when sorting by rating descending", () => {
    const result = runMockSearch({ sortBy: "rating", isDescending: true, pageSize: 50 });
    const ratings = result.items.map((item) => item.rating);
    const firstNull = ratings.indexOf(null);
    if (firstNull !== -1) {
      expect(ratings.slice(firstNull).every((rating) => rating === null)).toBe(true);
    }
  });

  it("labels the ordering the way the backend's LabelUrutan does", () => {
    expect(runMockSearch({ sortBy: "nama" }).urutan).toBe("Nama A - Z");
    expect(runMockSearch({ search: "sudirman" }).urutan).toBe("Relevansi");
    expect(runMockSearch({ search: "sudirman", engine: "Sql" }).urutan).toMatch(/^Nama/);
  });
});

describe("runMockSearch — geo", () => {
  const JAKARTA = { lat: -6.2251, lon: 106.8094 };

  it("filters by radius and reports the distance", () => {
    const result = runMockSearch({ ...JAKARTA, radiusKm: 15, pageSize: 50 });
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.totalCount).toBeLessThan(TOTAL);
    expect(result.items.every((item) => item.jarakKm !== null && item.jarakKm <= 15)).toBe(true);
  });

  it("ignores the radius on SQL and says so in catatan", () => {
    const result = runMockSearch({ ...JAKARTA, radiusKm: 15, engine: "Sql" });
    expect(result.totalCount).toBe(TOTAL);
    expect(result.catatan.join(" ")).toMatch(/jarak/i);
  });

  it("sorts nearest first", () => {
    const result = runMockSearch({ ...JAKARTA, radiusKm: 5000, sortBy: "jarak", pageSize: 50 });
    const distances = result.items.map((item) => item.jarakKm ?? Number.POSITIVE_INFINITY);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
  });

  it("warns when distance ordering is requested without coordinates", () => {
    expect(runMockSearch({ sortBy: "jarak" }).catatan.join(" ")).toMatch(/koordinat/i);
  });
});

describe("runMockSuggestion", () => {
  it("matches on a word prefix", () => {
    expect(runMockSuggestion("sudir", 8).items.length).toBeGreaterThan(0);
  });

  it("matches on an SPBU code", () => {
    expect(runMockSuggestion("31.", 8).items.length).toBeGreaterThan(0);
  });

  it("honours the limit", () => {
    expect(runMockSuggestion("spbu", 3).items.length).toBeLessThanOrEqual(3);
  });
});
