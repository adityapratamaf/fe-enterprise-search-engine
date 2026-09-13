import type { BenchmarkResponse } from "@/api";
import { Button, Card, Icon } from "@/components/ui";
import { exportBenchmarkCsv } from "../utils";

export function InsightBar({ benchmark }: { benchmark: BenchmarkResponse }) {
  const esFaster = benchmark.pemenang === "Elasticsearch";
  const winnerLabel = esFaster ? "Elasticsearch" : "SQL Server";
  const loserLabel = esFaster ? "SQL Server" : "Elasticsearch";

  const insight = esFaster
    ? `${winnerLabel} ${benchmark.kaliLebihCepat}x lebih cepat daripada ${loserLabel} untuk kueri ini. Selain itu, Elasticsearch mendukung fuzzy search, highlighting, dan facet yang memberikan pengalaman pencarian lebih baik.`
    : `${winnerLabel} ${benchmark.kaliLebihCepat}x lebih cepat daripada ${loserLabel} untuk kueri ini.`;

  return (
    <Card className="mt-3.5 flex flex-col gap-3 border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5">
        <Icon name="lightbulb-line" className="mt-0.5 shrink-0 text-lg text-brand-600" />
        <div>
          <span className="text-[12px] font-bold text-ink-900">Insight</span>
          <p className="mt-0.5 text-[12.5px] leading-snug text-ink-700">{insight}</p>
        </div>
      </div>

      <Button
        variant="secondary"
        size="md"
        className="shrink-0"
        onClick={() => exportBenchmarkCsv(benchmark)}
      >
        <Icon name="download-2-line" />
        Ekspor Hasil
      </Button>
    </Card>
  );
}
