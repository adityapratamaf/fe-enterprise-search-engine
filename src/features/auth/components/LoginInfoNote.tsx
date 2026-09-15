import { Icon } from "@/components/ui";
import { LOGIN_NOTE } from "../data";

/** Small framing note under the submit button, saying what the platform is for. */
export function LoginInfoNote() {
  return (
    <div className="mt-9 flex items-start gap-3 rounded-xl bg-surface-sunken p-4">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-brand-600">
        <Icon name="bar-chart-2-line" />
      </div>
      <p className="text-xs leading-5 text-ink-600">{LOGIN_NOTE}</p>
    </div>
  );
}
