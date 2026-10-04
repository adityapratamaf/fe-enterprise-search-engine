import { Card, Icon } from "@/components/ui";
import { TECH_STACK } from "../data";

export function TentangTechStack() {
  return (
    <Card className="p-4">
      <h2 className="flex items-center gap-2 text-[14px] font-bold text-ink-900">
        <Icon name="stack-line" className="text-tile-violet-strong" />
        Teknologi
      </h2>

      <ul className="mt-3.5 space-y-2">
        {TECH_STACK.map((tech) => (
          <li
            key={tech.title}
            className="flex items-center gap-3 rounded-lg bg-surface-sunken px-3 py-2.5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line-100 bg-white p-1.5">
              <img src={tech.logo} alt="" className="h-full w-full object-contain" />
            </span>
            <div className="min-w-0">
              <h3 className="text-[13px] font-bold text-ink-900">{tech.title}</h3>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-600">{tech.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
