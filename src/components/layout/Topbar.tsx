import { Link, NavLink } from "react-router-dom";
import { Icon } from "@/components/ui";
import { NAV_ITEMS } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";

export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const { displayName, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 h-[58px] border-b border-line-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1540px] items-center px-4 lg:px-7">
        <button
          type="button"
          className="mr-3 rounded-lg p-2 text-ink-800 lg:hidden"
          onClick={onOpenNav}
          aria-label="Buka menu navigasi"
        >
          <Icon name="menu-line" className="text-xl" />
        </button>

        <Link to={ROUTES.search} className="flex min-w-[178px] items-center">
          <img
            src="/pertamina-logo.png"
            alt="Pertamina"
            width={165}
            height={40}
            className="h-10 w-[165px] object-contain object-left"
          />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden h-full items-center gap-2 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.search}
              className={({ isActive }) =>
                cn(
                  "relative flex h-full items-center px-4 text-[13px] font-medium transition",
                  isActive ? "text-brand-700" : "text-ink-700 hover:text-brand-700",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 bg-brand-500" aria-hidden />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <UserMenu displayName={displayName} email={user?.email ?? ""} />
        </div>
      </div>
    </header>
  );
}
