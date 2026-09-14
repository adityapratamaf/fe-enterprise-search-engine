import { Button, Card, Icon } from "@/components/ui";
import { BENCHMARK_FEATURES, BENCHMARK_ILLUSTRATION } from "../data";

/**
 * What the page shows before a benchmark has run — the `SearchLanding`
 * equivalent for this page. Reuses the shared `Button` rather than a one-off
 * styled element, so the CTA here always matches the form's own submit button.
 */
export function BenchmarkEmptyState({
  onRun,
  disabled,
}: {
  onRun: () => void;
  disabled: boolean;
}) {
  return (
    <Card className="relative mt-3.5 overflow-hidden px-6 py-10 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-100/70 blur-3xl" />
        <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-tile-violet-soft/70 blur-3xl" />
        <div className="absolute left-10 top-24 h-56 w-56 rounded-full bg-tile-blue-soft/70 blur-3xl" />
      </div>

      <div className="relative">
        <img
          src={BENCHMARK_ILLUSTRATION}
          alt=""
          aria-hidden
          width={700}
          height={356}
          decoding="async"
          className="mx-auto h-auto w-full max-w-[600px]"
        />

        <h2 className="mt-4 text-[26px] font-bold text-ink-900">
          Siap untuk membandingkan pencarian?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[13.5px] leading-6 text-ink-500">
          Masukkan kata kunci pencarian lalu klik &quot;Jalankan Benchmark&quot; untuk melihat
          perbandingan performa antara Elasticsearch dan SQL Server.
        </p>

        <ul className="mx-auto mt-8 grid max-w-3xl gap-3.5 text-left sm:grid-cols-3">
          {BENCHMARK_FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="rounded-xl border border-line-200 bg-white p-4 shadow-soft"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-full ${feature.tone}`}>
                <Icon name={feature.icon} className="text-lg" />
              </span>
              <h3 className="mt-3 text-[13.5px] font-bold text-ink-900">{feature.title}</h3>
              <p className="mt-1 text-[11.5px] leading-[1.35] text-ink-500">{feature.body}</p>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-8 flex max-w-sm items-center gap-3">
          <span className="h-px flex-1 bg-line-300" />
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-ink-400">
            Mulai Sekarang
          </span>
          <span className="h-px flex-1 bg-line-300" />
        </div>

        <Button size="lg" onClick={onRun} disabled={disabled} className="mx-auto mt-5">
          <Icon name="play-line" />
          Jalankan Benchmark
        </Button>

        <p className="mx-auto mt-4 flex max-w-lg items-center justify-center gap-1.5 text-[12px] text-ink-500">
          <Icon name="lightbulb-line" className="shrink-0 text-brand-600" />
          <span>
            <b className="font-semibold text-ink-700">Tips:</b> Anda juga bisa menggunakan filter
            lanjutan untuk hasil yang lebih spesifik.
          </span>
        </p>
      </div>
    </Card>
  );
}
