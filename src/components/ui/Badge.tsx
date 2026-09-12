import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-surface-sunken text-ink-700",
  brand: "bg-brand-50 text-brand-800",
  success: "bg-success-50 text-success-500",
  danger: "bg-danger-50 text-danger-500",
  warning: "bg-warning-500/15 text-ink-800",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
