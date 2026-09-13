import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const FRAME =
  "flex items-center rounded-xl border border-line-400 bg-white transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10";

const FIELD_SIZES = {
  sm: { frame: "px-2.5", control: "h-8 text-[11px]" },
  md: { frame: "px-3", control: "h-10 text-sm" },
  lg: { frame: "px-3", control: "h-12 text-sm" },
} as const;

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  inputSize?: keyof typeof FIELD_SIZES;
  /** Rendered inside the frame, before the control. Usually an `<Icon />`. */
  leading?: ReactNode;
  /** Rendered inside the frame, after the control. Usually a clear button. */
  trailing?: ReactNode;
  frameClassName?: string;
};

/**
 * Replaces the three separate hand-rolled "input with an icon in a bordered
 * box" implementations that SearchBar, FilterSidebar and LoginPage each had.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = "md", leading, trailing, className, frameClassName, ...props },
  ref,
) {
  const size = FIELD_SIZES[inputSize];
  return (
    <div className={cn(FRAME, size.frame, frameClassName)}>
      {leading}
      <input
        ref={ref}
        className={cn(
          "min-w-0 flex-1 bg-transparent px-2 text-ink-900 outline-none placeholder:text-ink-300",
          size.control,
          className,
        )}
        {...props}
      />
      {trailing}
    </div>
  );
});

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn("h-3.5 w-3.5 shrink-0 accent-brand-500", className)}
      {...props}
    />
  );
});
