import { Badge, Card, Icon } from "@/components/ui";
import { COVERAGE_ITEMS } from "../data";

export function TentangCoverage() {
  return (
    <Card className="p-4">
      <h2 className="flex items-center gap-2 text-[14px] font-bold text-ink-900">
        <Icon name="database-2-line" className="text-tile-blue-strong" />
        Cakupan Informasi
      </h2>
      <p className="mt-3.5 text-[12px] leading-relaxed text-ink-600">
        Informasi SPBU yang tersedia dalam SPBU Search mencakup berbagai data penting untuk
        mendukung pencarian dan analisis.
      </p>

      <ul className="mt-4 space-y-3">
        {COVERAGE_ITEMS.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[12.5px] font-medium text-ink-800">
              <Icon name={item.icon} className="text-tile-blue-strong" />
              {item.label}
            </span>
            <Badge tone={item.tone}>{item.badge}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
