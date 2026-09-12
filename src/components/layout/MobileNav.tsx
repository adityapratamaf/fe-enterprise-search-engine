import * as Dialog from "@radix-ui/react-dialog";
import { NavLink } from "react-router-dom";
import { Icon } from "@/components/ui";
import { NAV_ITEMS } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-surface-inverse/30 backdrop-blur-sm lg:hidden" />
        <Dialog.Content className="fixed left-0 top-0 z-[70] h-full w-[290px] bg-white p-5 shadow-2xl lg:hidden">
          <Dialog.Title className="sr-only">Navigasi</Dialog.Title>
          <div className="mb-8 flex items-center justify-between">
            <img
              src="/pertamina-logo.png"
              alt="Pertamina"
              width={155}
              height={36}
              className="h-9 w-[155px] object-contain object-left"
            />
            <Dialog.Close asChild>
              <button type="button" className="rounded-lg p-2 text-ink-600" aria-label="Tutup menu">
                <Icon name="close-line" className="text-xl" />
              </button>
            </Dialog.Close>
          </div>
          <nav aria-label="Navigasi utama" className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.search}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                    isActive ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-brand-50",
                  )
                }
              >
                <Icon name={item.icon} className="text-lg" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
