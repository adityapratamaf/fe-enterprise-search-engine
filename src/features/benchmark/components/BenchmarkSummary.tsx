import type { BenchmarkResponse } from "@/api";
import { Card, Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatCount, formatMs } from "@/utils/format";

function StatCard({
  label,
  icon,
  engineLabel,
  value,
  valueTone,
  caption,
}: {
  label: string;
  icon: string;
  engineLabel?: string;
  value: string;
  valueTone?: "success" | "danger" | "neutral";
  caption?: string;
}) {
  return (
    <Card className="min-w-0 flex-1 border-line-100 bg-surface-sunken px-4 py-3.5 shadow-none">
      <p className="text-[11.5px] text-ink-500">{label}</p>
      {engineLabel && (
        <p className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-ink-600">
          <Icon name={icon} className="text-brand-600" />
          {engineLabel}
        </p>
      )}
      <p
        className={cn(
          "mt-1 text-[19px] font-bold leading-tight",
          valueTone === "success" && "text-success-500",
          valueTone === "danger" && "text-danger-500",
          (valueTone === undefined || valueTone === "neutral") && "text-ink-900",
        )}
      >
        {value}
      </p>
      {caption && <p className="mt-0.5 text-[11px] text-ink-400">{caption}</p>}
    </Card>
  );
}

export function BenchmarkSummary({ benchmark }: { benchmark: BenchmarkResponse }) {
  const { elasticsearch, sql, pemenang, totalDokumen } = benchmark;
  const esFaster = pemenang === "Elasticsearch";
  const winnerLabel = esFaster ? "Elasticsearch" : "SQL Server";

  return (
    <Card className="mt-3.5 flex flex-col gap-3 p-3 sm:flex-row sm:items-stretch">
      <Card className="min-w-0 flex-1 border-success-500/30 bg-success-50 px-4 py-3.5 sm:flex-[1.4]">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success-500/15 text-success-500">
            <Icon name="trophy-line" className="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-success-700">
              Pemenang Benchmark
            </p>
            <p className="text-[15px] font-bold leading-tight text-ink-900">{winnerLabel}</p>
          </div>
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-ink-600">
          {winnerLabel} memberikan hasil lebih cepat
          {esFaster ? " dengan relevansi yang lebih baik." : " untuk kueri ini."}
        </p>
      </Card>

      <StatCard
        label="Waktu Pencarian"
        icon="search-line"
        engineLabel="Elasticsearch"
        value={formatMs(elasticsearch.waktuMs)}
        valueTone={esFaster ? "success" : "danger"}
      />
      <StatCard
        label="Waktu Pencarian"
        icon="database-2-line"
        engineLabel="SQL Server"
        value={formatMs(sql.waktuMs)}
        valueTone={esFaster ? "danger" : "success"}
      />
      <StatCard
        label="Total Hasil"
        icon="search-line"
        engineLabel="Elasticsearch"
        value={formatCount(elasticsearch.totalHasil)}
      />
      <StatCard
        label="Total Hasil"
        icon="database-2-line"
        engineLabel="SQL Server"
        value={formatCount(sql.totalHasil)}
      />
      <StatCard
        label="Dataset"
        icon="stack-line"
        value={formatCount(totalDokumen)}
        caption="dokumen SPBU"
      />
    </Card>
  );
}
