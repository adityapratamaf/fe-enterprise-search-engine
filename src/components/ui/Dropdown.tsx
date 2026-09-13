import { useCallback, useId, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type DropdownOption = {
  value: string;
  label: string;
};

const SIZES = {
  sm: { control: "h-8 px-2.5 text-[12px]", option: "px-2.5 py-1.5 text-[12px]" },
  md: { control: "h-10 px-3 text-sm", option: "px-3 py-2 text-sm" },
} as const;

type Props = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  size?: keyof typeof SIZES;
  className?: string;
  "aria-label"?: string;
};

/**
 * A single-select dropdown styled to match the rest of the UI. The browser's
 * native `<select>` popup cannot be restyled by CSS at all — it renders as a
 * plain OS list with no rounded corners, no brand colours, system font — so
 * this reimplements the same combobox pattern already used for search
 * suggestions (trigger button + `role="listbox"` popup) instead of wrapping
 * a `<select>`.
 */
export function Dropdown({ value, options, onChange, size = "sm", className, ...aria }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  useClickOutside(
    containerRef,
    useCallback(() => setOpen(false), []),
  );

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        return;
      }
      setActiveIndex((current) => {
        const base = current >= 0 ? current : selectedIndex;
        const delta = event.key === "ArrowDown" ? 1 : -1;
        return (base + delta + options.length) % options.length;
      });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) commit(activeIndex >= 0 ? activeIndex : selectedIndex);
      else setOpen(true);
      return;
    }

    if (event.key === "Escape") {
      close();
    }
  };

  const sizes = SIZES[size];

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={aria["aria-label"]}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-line-300 bg-white text-left text-ink-700 outline-none transition",
          "hover:border-line-400",
          sizes.control,
        )}
      >
        <span className="truncate">{selected?.label ?? ""}</span>
        <Icon
          name="arrow-down-s-line"
          className={cn("shrink-0 text-ink-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={aria["aria-label"]}
          className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-full overflow-hidden rounded-xl border border-line-200 bg-white p-1 shadow-overlay"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-lg text-left transition",
                    sizes.option,
                    isActive && "bg-brand-50",
                    isSelected ? "font-semibold text-brand-600" : "text-ink-700",
                  )}
                >
                  {option.label}
                  {isSelected && <Icon name="check-line" className="text-brand-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
