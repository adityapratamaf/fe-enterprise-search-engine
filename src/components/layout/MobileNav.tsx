import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { useSidebar } from "../../contexts/SidebarContext";

const links = [
  ["SPBU Search", ROUTES.search],
  ["Peta", ROUTES.map],
  ["Benchmark", ROUTES.benchmark],
  ["Analitik", ROUTES.analytics],
  ["Tentang", ROUTES.about],
] as const;

export function MobileNav() {
  const { isOpen, close } = useSidebar();
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-slate-950/30 backdrop-blur-sm lg:hidden" />
        <Dialog.Content className="fixed left-0 top-0 z-[70] h-full w-[290px] bg-white p-5 shadow-2xl lg:hidden">
          <div className="mb-8 flex items-center justify-between">
            <img src="/pertamina-logo.png" alt="Pertamina" className="h-9 w-[155px] object-contain object-left" />
            <Dialog.Close asChild><button className="rounded-lg p-2 text-slate-600"><i className="ri-close-line text-xl" /></button></Dialog.Close>
          </div>
          <nav className="space-y-1">
            {links.map(([label, to]) => (
              <Link key={to} to={to} onClick={close} className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-[#24426c] hover:bg-[#eef6ff]">{label}</Link>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
