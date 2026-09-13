import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLElement> & {
  /**
   * Element to render. Defaults to `div` — a bare `section` would create a
   * landmark with no accessible name, which is what the first version did and
   * why it nested landmarks inside each other. Pass `aside`/`section` only
   * together with an `aria-label`.
   */
  as?: ElementType;
};

export function Card({ as: Tag = "div", className, ...props }: CardProps) {
  return (
    <Tag
      className={cn("rounded-xl2 border border-line-200 bg-white shadow-card", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-line-100 px-4 py-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
