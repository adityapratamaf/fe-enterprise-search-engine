import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cn("rounded-xl2 border border-[#e1eaf5] bg-white shadow-card", className)} {...props}>{children}</section>;
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("flex items-center justify-between border-b border-[#edf2f8] px-4 py-3", className)}>{children}</div>;
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
