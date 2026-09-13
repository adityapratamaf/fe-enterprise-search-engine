import { cn } from "@/lib/utils";

/** Hairline rule. `role="presentation"` keeps it out of the a11y tree. */
export function Divider({ className }: { className?: string }) {
  return <div role="presentation" className={cn("h-px w-full bg-line-100", className)} />;
}
