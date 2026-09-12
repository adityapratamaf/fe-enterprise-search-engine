import { PlaceholderPage } from "./PlaceholderPage";

export function BenchmarkPage() {
  return (
    <PlaceholderPage
      icon="speed-up-line"
      title="Benchmark"
      description="Perbandingan Elasticsearch vs SQL. Endpoint GET /search/spbu/benchmark sudah tersedia dan mengembalikan pemenang, selisih kecepatan, waktu per mesin, dan jumlah hasil masing-masing."
    />
  );
}
