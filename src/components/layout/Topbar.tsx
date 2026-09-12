import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";
import { ROUTES } from "../../config/routes";
import { useAuth } from "../../contexts/AuthContext";

const nav = [
  { label: "SPBU Search", to: ROUTES.search },
  { label: "Peta", to: ROUTES.map },
  { label: "Benchmark", to: ROUTES.benchmark },
  { label: "Analitik", to: ROUTES.analytics },
  { label: "Tentang", to: ROUTES.about },
];

export function Topbar() {
  const location = useLocation();
  const { open } = useSidebar();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 h-[58px] border-b border-[#e6edf6] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1540px] items-center px-4 lg:px-7">
        <button className="mr-3 rounded-lg p-2 text-[#123363] lg:hidden" onClick={open} aria-label="Open menu">
          <i className="ri-menu-line text-xl" />
        </button>
        <Link to={ROUTES.search} className="flex min-w-[178px] items-center">
          <img src="/pertamina-logo.png" alt="Pertamina" className="h-10 w-[165px] object-contain object-left" />
        </Link>

        <nav className="hidden h-full items-center gap-2 lg:flex">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className={`relative flex h-full items-center px-4 text-[13px] font-medium ${active ? "text-[#0758d4]" : "text-[#24426c] hover:text-[#0758d4]"}`}>
                {item.label}
                {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#176fff]" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button className="relative hidden rounded-full p-2 text-[#24426c] sm:block" aria-label="Notifications">
            <i className="ri-notification-3-line text-xl" />
            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#df3434] px-1 text-[9px] font-bold text-white">3</span>
          </button>
          <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#315b8c] text-xs font-semibold text-white sm:flex">AP</div>
          <div className="hidden text-right sm:block">
            <div className="text-[12px] font-semibold text-[#1b345d]">{user?.name ?? "Guest"}</div>
            <div className="text-[10px] text-[#7890af]">{user?.email ?? "Guest session"}</div>
          </div>
          <button className="rounded-lg p-1 text-[#47658b]" aria-label="Account menu">
            <i className="ri-arrow-down-s-line" />
          </button>
        </div>
      </div>
    </header>
  );
}
