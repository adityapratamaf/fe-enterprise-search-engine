import { Card, Icon } from "@/components/ui";
import { FEATURES } from "../data";

export function TentangFeatureList() {
  return (
    <Card className="p-4">
      <h2 className="flex items-center gap-2 text-[14px] font-bold text-ink-900">
        <Icon name="apps-2-line" className="text-tile-blue-strong" />
        Fitur Utama
      </h2>

      <ul className="mt-3.5 space-y-3.5">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-tile-blue-soft text-tile-blue-strong">
              <Icon name={feature.icon} />
            </span>
            <div className="min-w-0">
              <h3 className="text-[13px] font-bold text-ink-900">{feature.title}</h3>
              <p className="mt-0.5 text-[12px] leading-relaxed text-ink-600">{feature.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
