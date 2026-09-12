import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  children: ReactNode;
};

export function Button({ variant = "primary", className, children, ...props }: Props) {
  const styles = {
    primary: "bg-[#1268ee] text-white hover:bg-[#0758d4] shadow-sm",
    secondary: "border border-[#b9cbe5] bg-white text-[#123363] hover:bg-[#f3f8ff]",
    ghost: "bg-transparent text-[#1555ad] hover:bg-[#eef6ff]",
    icon: "border border-[#cbd9eb] bg-white text-[#1555ad] hover:bg-[#eef6ff]",
  };
  return (
    <button className={cn("inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition", styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
