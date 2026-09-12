import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-md bg-[#edf3fa] px-2.5 py-1 text-xs font-medium text-[#26476f]", className)}>{children}</span>;
}
