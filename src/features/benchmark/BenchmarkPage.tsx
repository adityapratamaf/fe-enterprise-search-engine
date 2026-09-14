import { useMemo, useState } from "react";
import type { SearchSpbuParams } from "@/api";
import { Icon } from "@/components/ui";
import { useSpbuSearch } from "@/features/search/hooks/useSpbuSearch";
import { BenchmarkEmptyState } from "./components/BenchmarkEmptyState";
import { BenchmarkForm } from "./components/BenchmarkForm";
import { BenchmarkSummary } from "./components/BenchmarkSummary";
import { EngineResultsPanel } from "./components/EngineResultsPanel";
import { InsightBar } from "./components/InsightBar";
import { INITIAL_ES_PANEL, INITIAL_FORM_STATE, INITIAL_SQL_PANEL } from "./data";
import { useBenchmarkRun } from "./hooks/useBenchmarkRun";
import type { BenchmarkFormState, BenchmarkQuery, EnginePanelState } from "./types";
import { toBenchmarkParams, toBenchmarkQuery, toEngineSearchParams } from "./utils";

/**
 * Orchestration only, the same split `SearchPage` uses: form state in,
 * one-shot benchmark measurement out, two independently browsable result
 * panels rendered from it. The `/benchmark` call only ever happens on submit —
 * paging or re-sorting a panel afterwards goes through the normal search
 * endpoint instead of re-measuring anything.
 */
export function BenchmarkPage() {
  const [form, setForm] = useState<BenchmarkFormState>(INITIAL_FORM_STATE);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [query, setQuery] = useState<BenchmarkQuery | null>(null);
  const [esPanel, setEsPanel] = useState<EnginePanelState>(INITIAL_ES_PANEL);
  const [sqlPanel, setSqlPanel] = useState<EnginePanelState>(INITIAL_SQL_PANEL);

  const runBenchmark = useBenchmarkRun();
  const benchmark = runBenchmark.data;
  const hasRun = benchmark !== undefined;

  const patchForm = (patch: Partial<BenchmarkFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = () => {
    const nextQuery = toBenchmarkQuery(form);
    setQuery(nextQuery);
    setEsPanel(INITIAL_ES_PANEL);
    setSqlPanel(INITIAL_SQL_PANEL);
    runBenchmark.mutate(toBenchmarkParams(nextQuery));
  };

  const esParams: SearchSpbuParams | null = useMemo(
    () => (query ? toEngineSearchParams(query, "Elasticsearch", esPanel) : null),
    [query, esPanel],
  );
  const sqlParams: SearchSpbuParams | null = useMemo(
    () => (query ? toEngineSearchParams(query, "Sql", sqlPanel) : null),
    [query, sqlPanel],
  );

  const esSearch = useSpbuSearch(esParams ?? {}, hasRun && esParams !== null);
  const sqlSearch = useSpbuSearch(sqlParams ?? {}, hasRun && sqlParams !== null);

  return (
    <div className="mx-auto max-w-[1540px] px-4 py-6 sm:px-5 lg:px-7">
      <h1 className="text-[26px] font-bold text-ink-900">Benchmark Pencarian SPBU</h1>
      <p className="mt-1 text-sm text-ink-500">
        Bandingkan performa pencarian antara Elasticsearch dan SQL Server dengan query yang sama.
      </p>

      <div className="mt-4">
        <BenchmarkForm
          form={form}
          onChange={patchForm}
          advancedOpen={advancedOpen}
          onToggleAdvanced={() => setAdvancedOpen((value) => !value)}
          onSubmit={handleSubmit}
          isRunning={runBenchmark.isPending}
        />
      </div>

      {runBenchmark.isError && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-danger-500">
          <Icon name="error-warning-line" />
          {runBenchmark.error instanceof Error
            ? runBenchmark.error.message
            : "Benchmark gagal dijalankan."}
        </p>
      )}

      {!hasRun && !runBenchmark.isPending && !runBenchmark.isError && (
        <BenchmarkEmptyState onRun={handleSubmit} />
      )}

      {benchmark && (
        <>
          <BenchmarkSummary benchmark={benchmark} />

          <div className="mt-3.5 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            <EngineResultsPanel
              title="Hasil Pencarian - Elasticsearch"
              description="Full-text search, fuzzy, relevansi, highlight, dan facet tersedia."
              icon="search-line"
              tone="blue"
              waktuMs={benchmark.elasticsearch.waktuMs}
              waktuTone={benchmark.pemenang === "Elasticsearch" ? "success" : "danger"}
              data={esSearch.data}
              error={esSearch.error}
              isLoading={esSearch.isLoading}
              isFetching={esSearch.isFetching}
              page={esPanel.page}
              sortBy={esPanel.sortBy}
              isDescending={esPanel.isDescending}
              onSortChange={(sortBy, isDescending) =>
                setEsPanel((prev) => ({ ...prev, page: 1, sortBy, isDescending }))
              }
              onPageChange={(page) => setEsPanel((prev) => ({ ...prev, page }))}
              onRetry={() => void esSearch.refetch()}
            />

            <EngineResultsPanel
              title="Hasil Pencarian - SQL Server"
              description="Pencarian standar (LIKE), tanpa fuzzy, tanpa highlight, tanpa facet."
              icon="database-2-line"
              tone="amber"
              waktuMs={benchmark.sql.waktuMs}
              waktuTone={benchmark.pemenang === "Sql" ? "success" : "danger"}
              data={sqlSearch.data}
              error={sqlSearch.error}
              isLoading={sqlSearch.isLoading}
              isFetching={sqlSearch.isFetching}
              page={sqlPanel.page}
              sortBy={sqlPanel.sortBy}
              isDescending={sqlPanel.isDescending}
              onSortChange={(sortBy, isDescending) =>
                setSqlPanel((prev) => ({ ...prev, page: 1, sortBy, isDescending }))
              }
              onPageChange={(page) => setSqlPanel((prev) => ({ ...prev, page }))}
              onRetry={() => void sqlSearch.refetch()}
            />
          </div>

          <InsightBar benchmark={benchmark} />
        </>
      )}
    </div>
  );
}
