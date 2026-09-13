import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small uppercase-ish label that introduces a group inside a card — used for
 * "Produk Tersedia" and "Fasilitas" in the detail panel and anywhere similar.
 */
export function SectionHeading({
  children,
  className,
  as: Tag = "h3",
}: {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}) {
  return <Tag className={cn("text-[11px] font-bold text-ink-800", className)}>{children}</Tag>;
}
