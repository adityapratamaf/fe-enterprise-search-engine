import { BaseResource } from "../base";

export type SearchEngine = "Elasticsearch" | "Sql";

export type SearchSpbuParams = {
  Engine?: SearchEngine;
  Regional?: string[];
  Provinsi?: string[];
  Kota?: string[];
  Produk?: string[];
  Fasilitas?: string[];
  Status?: string[];
  TipeKepemilikan?: string[];
  Lat?: number;
  Lon?: number;
  RadiusKm?: number;
  IncludeFacets?: boolean;
  PageNumber?: number;
  PageSize?: number;
  Search?: string;
  SortBy?: string;
  IsDescending?: boolean;
};

class SpbuResource extends BaseResource {
  search(params: SearchSpbuParams) {
    return this.get("/search/spbu", params as unknown as Record<string, unknown>);
  }

  suggestion(q: string) {
    return this.get("/search/spbu/suggestion", { q });
  }

  detail(kode: string) {
    return this.get(`/search/spbu/${encodeURIComponent(kode)}`);
  }

  benchmark(params?: { search?: string; pageSize?: number }) {
    return this.get("/search/spbu/benchmark", params);
  }
}

export const spbuResource = new SpbuResource();
