/** Draft values bound to the form inputs; strings so every field stays freely editable. */
export type BenchmarkFormState = {
  keyword: string;
  location: string;
  radiusKm: string;
  ratingMin: string;
  ulasanMin: string;
  iterasi: string;
  warmup: boolean;
};

/** The parsed, committed values a benchmark run was actually made with. */
export type BenchmarkQuery = {
  search: string;
  lat: number | undefined;
  lon: number | undefined;
  radiusKm: number | undefined;
  ratingMin: number | undefined;
  ulasanMin: number | undefined;
  iterasi: number | undefined;
  warmup: boolean;
};

/** Independent paging/sorting kept per engine panel once a run has results. */
export type EnginePanelState = {
  page: number;
  sortBy: string;
  isDescending: boolean;
};
