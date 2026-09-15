import { describe, expect, it } from "vitest";
import {
  EMPTY_VALUE,
  formatCoordinates,
  formatCount,
  formatDate,
  formatDistance,
  formatMs,
  formatRating,
  googleMapsUrl,
  humanizeEnum,
} from "./format";

describe("formatCount", () => {
  it("groups thousands the Indonesian way", () => {
    expect(formatCount(1234)).toBe("1.234");
  });
});

describe("formatRating", () => {
  it("shows one decimal with a comma", () => {
    expect(formatRating(4.5)).toBe("4,5");
  });

  it("does not render an unreviewed station as a zero score", () => {
    expect(formatRating(null)).toBe(EMPTY_VALUE);
  });
});

describe("formatDistance", () => {
  it("switches to metres below one kilometre", () => {
    expect(formatDistance(0.4)).toBe("400 m");
  });

  it("uses kilometres above one", () => {
    expect(formatDistance(2.14)).toBe("2,1 km");
  });

  it("returns null when there is no distance to show", () => {
    expect(formatDistance(null)).toBeNull();
  });
});

describe("formatMs", () => {
  it("renders engine timing rounded to the nearest millisecond", () => {
    expect(formatMs(38.11)).toBe("38 ms");
  });

  it("groups thousands the Indonesian way for slow queries", () => {
    expect(formatMs(1930.97)).toBe("1.931 ms");
  });
});

describe("formatDate", () => {
  it("returns a placeholder for null and for unparseable input", () => {
    expect(formatDate(null)).toBe(EMPTY_VALUE);
    expect(formatDate("not-a-date")).toBe(EMPTY_VALUE);
  });

  it("formats an ISO date in Indonesian", () => {
    expect(formatDate("2008-04-17T00:00:00")).toContain("2008");
  });
});

describe("humanizeEnum", () => {
  it("splits the backend's camel-cased enum names", () => {
    expect(humanizeEnum("TidakAktif")).toBe("Tidak Aktif");
    expect(humanizeEnum("Aktif")).toBe("Aktif");
  });
});

describe("coordinates", () => {
  it("formats to four decimals", () => {
    expect(formatCoordinates(-6.20881, 106.84563)).toBe("-6.2088, 106.8456");
  });

  it("builds a Google Maps link", () => {
    expect(googleMapsUrl(-6.2088, 106.8456)).toContain("query=-6.2088,106.8456");
  });
});
