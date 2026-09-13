import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
  secondary: "border border-line-500 bg-white text-ink-800 hover:bg-brand-50",
  ghost: "bg-transparent text-brand-800 hover:bg-brand-50",
  outline: "border border-line-400 bg-white text-brand-800 hover:bg-brand-50",
  danger: "bg-danger-500 text-white hover:bg-danger-600",
  /** White chip that floats over imagery or a map, where borders read poorly. */
  floating: "bg-white/95 text-ink-700 shadow-md backdrop-blur hover:bg-white",
} as const;

const SIZES = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-5 text-sm",
  /** Square, for icon-only buttons. Always pass an aria-label with this. */
  icon: "h-8 w-8 justify-center p-0 text-base",
  /** Slightly larger square, for controls layered over a map. */
  "icon-lg": "h-9 w-9 justify-center p-0 text-lg",
  /** Compact pill used for map overlays and inline links. */
  pill: "h-7 gap-1.5 px-3 text-[11px]",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
