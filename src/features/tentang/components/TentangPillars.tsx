import { Card, Icon } from "@/components/ui";
import { PILLARS } from "../data";

/** "Tujuan / Manfaat / Inovasi / Komitmen" — four standalone cards under the hero. */
export function TentangPillars() {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {PILLARS.map((pillar) => (
        <Card key={pillar.title} className="p-4">
          <span className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${pillar.tone}`}>
            <Icon name={pillar.icon} />
          </span>
          <h2 className="mt-3 text-[15px] font-bold text-ink-900">{pillar.title}</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">{pillar.body}</p>
        </Card>
      ))}
    </div>
  );
}
