import { describe, expect, it } from "vitest";
import {
  buildLabelMap,
  countActiveFilters,
  emptyFilters,
  facilityIcon,
  isOpen24Hours,
  parseSortValue,
  prettifyCode,
  readSearchState,
  toSearchRequest,
  toSortValue,
  writeSearchState,
} from "./utils";
import { DEFAULT_ENGINE, DEFAULT_PAGE_SIZE } from "./data";
import type { SearchState } from "./types";
import type { SpbuSearchItem } from "@/api";

function baseState(overrides: Partial<SearchState> = {}): SearchState {
  return {
    keyword: "",
    engine: DEFAULT_ENGINE,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "",
    isDescending: false,
    ratingMin: undefined,
    ulasanMin: undefined,
    filters: emptyFilters(),
    bounds: null,
    near: null,
    ...overrides,
  };
}

describe("readSearchState", () => {
  it("falls back to defaults for an empty URL", () => {
    expect(readSearchState(new URLSearchParams())).toEqual(baseState());
  });

  it("reads repeated facet keys as arrays", () => {
    const state = readSearchState(new URLSearchParams("provinsi=Bali&provinsi=DKI+Jakarta"));
    expect(state.filters.provinsi).toEqual(["Bali", "DKI Jakarta"]);
  });

  it("only accepts the two known engines", () => {
    expect(readSearchState(new URLSearchParams("engine=Sql")).engine).toBe("Sql");
    expect(readSearchState(new URLSearchParams("engine=nonsense")).engine).toBe(DEFAULT_ENGINE);
  });

  it("rejects non-positive and malformed numbers", () => {
    const state = readSearchState(new URLSearchParams("page=0&size=abc&rating=xyz"));
    expect(state.page).toBe(1);
    expect(state.pageSize).toBe(DEFAULT_PAGE_SIZE);
    expect(state.ratingMin).toBeUndefined();
  });
});

describe("writeSearchState", () => {
  it("omits everything that is at its default", () => {
    expect(writeSearchState(baseState()).toString()).toBe("");
  });

  it("round-trips a fully populated state", () => {
    const state = baseState({
      keyword: "pertamax",
      engine: "Sql",
      page: 3,
      pageSize: 25,
      sortBy: "rating",
      isDescending: true,
      ratingMin: 4,
      ulasanMin: 100,
      filters: { ...emptyFilters(), provinsi: ["Bali"], produk: ["PERTAMAX", "DEXLITE"] },
    });

    expect(readSearchState(writeSearchState(state))).toEqual(state);
  });

  it("trims the keyword", () => {
    expect(writeSearchState(baseState({ keyword: "  pertamax  " })).get("q")).toBe("pertamax");
  });
});

describe("toSearchRequest", () => {
  it("always asks for facets, because a shared link can land on page 3", () => {
    expect(toSearchRequest(baseState({ page: 3 })).includeFacets).toBe(true);
  });

  it("omits an empty keyword rather than sending a blank search", () => {
    expect(toSearchRequest(baseState({ keyword: "   " })).search).toBeUndefined();
  });

  it("sends the sort direction only alongside a sort field", () => {
    expect(toSearchRequest(baseState({ isDescending: true })).isDescending).toBeUndefined();
    expect(toSearchRequest(baseState({ sortBy: "nama", isDescending: true }))).toMatchObject({
      sortBy: "nama",
      isDescending: true,
    });
  });

  it("omits facet keys that have no selection", () => {
    const request = toSearchRequest(
      baseState({ filters: { ...emptyFilters(), kota: ["Kota Denpasar"] } }),
    );
    expect(request.kota).toEqual(["Kota Denpasar"]);
    expect(request.provinsi).toBeUndefined();
  });
});

describe("countActiveFilters", () => {
  it("counts facet values and the two numeric thresholds", () => {
    expect(countActiveFilters(baseState())).toBe(0);
    expect(
      countActiveFilters(
        baseState({
          filters: { ...emptyFilters(), provinsi: ["Bali", "DKI Jakarta"] },
          ratingMin: 4,
        }),
      ),
    ).toBe(3);
  });
});

describe("sort value round-trip", () => {
  it("parses field and direction", () => {
    expect(parseSortValue("nama:desc")).toEqual({ sortBy: "nama", isDescending: true });
    expect(parseSortValue("")).toEqual({ sortBy: "", isDescending: false });
  });

  it("drops a field the backend does not understand", () => {
    expect(parseSortValue("nonsense:asc").sortBy).toBe("");
  });

  it("round-trips through toSortValue", () => {
    expect(toSortValue("rating", true)).toBe("rating:desc");
    expect(parseSortValue(toSortValue("rating", true))).toEqual({
      sortBy: "rating",
      isDescending: true,
    });
  });
});

describe("taxonomy helpers", () => {
  it("maps known facility codes to icons and falls back for unknown ones", () => {
    expect(facilityIcon("ATM")).toBe("bank-card-line");
    expect(facilityIcon("SOMETHING_NEW")).toBe("checkbox-circle-line");
  });

  it("treats 24-hour opening as a facility, not a status", () => {
    expect(isOpen24Hours(["TOILET", "BUKA_24_JAM"])).toBe(true);
    expect(isOpen24Hours(["TOILET"])).toBe(false);
  });

  it("prettifies codes for values the result page never showed", () => {
    expect(prettifyCode("PERTAMAX_TURBO")).toBe("Pertamax Turbo");
    expect(prettifyCode("ATM")).toBe("ATM");
  });
});

describe("buildLabelMap", () => {
  it("learns code to name pairs from the items on screen", () => {
    const item = {
      produk: ["PERTAMAX_TURBO"],
      produkNama: ["Pertamax Turbo"],
      fasilitas: ["ATM"],
      fasilitasNama: ["ATM"],
      regional: "JBB",
      regionalNama: "Jawa Bagian Barat",
    } as SpbuSearchItem;

    expect(buildLabelMap([item])).toEqual({
      PERTAMAX_TURBO: "Pertamax Turbo",
      ATM: "ATM",
      JBB: "Jawa Bagian Barat",
    });
  });
});
