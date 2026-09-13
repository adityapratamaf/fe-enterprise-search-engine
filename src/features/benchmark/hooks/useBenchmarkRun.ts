import { useMutation } from "@tanstack/react-query";
import { spbuApi, type BenchmarkParams } from "@/api";

/**
 * A benchmark run is a one-shot, explicitly-triggered measurement — not
 * something derivable from state to keep in sync — so it is a mutation rather
 * than a `useQuery`, the same distinction `useImageSearch` draws for the OCR
 * upload. `data` from the last run stays in place until the next call settles,
 * which is what lets the page keep showing the previous results while a new
 * run is in flight.
 */
export function useBenchmarkRun() {
  return useMutation({
    mutationFn: (params: BenchmarkParams) => spbuApi.benchmark(params),
  });
}
