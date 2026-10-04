import { Link, NavLink } from "react-router-dom";
import { Icon } from "@/components/ui";
import { NAV_ITEMS } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { BRAND_LOGO } from "@/config/branding";
import { TopLoadingBar } from "./TopLoadingBar";
import { UserMenu } from "./UserMenu";

/**
 * Header layout follows the supplied design: logo, then navigation, then the
 * account cluster.
 */
export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const { displayName, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 h-[58px] border-b border-line-200 bg-white">
      <div className="flex h-full items-center">
        <button
          type="button"
          className="ml-2 rounded-lg p-2 text-ink-800 lg:hidden"
          onClick={onOpenNav}
          aria-label="Buka menu navigasi"
        >
          <Icon name="menu-line" className="text-xl" />
        </button>

        <Link to={ROUTES.search} className="ml-2 flex shrink-0 items-center lg:ml-7">
          <img
            src={BRAND_LOGO}
            alt="Pertamina"
            width={158}
            height={38}
            className="h-[38px] w-[158px] object-contain object-left"
          />
        </Link>

        <nav aria-label="Navigasi utama" className="ml-8 hidden h-full items-center lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative flex h-full items-center px-4 text-[13.5px] transition-colors",
                  isActive
                    ? "font-semibold text-brand-600"
                    : "font-medium text-ink-700 hover:text-brand-600",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-brand-600"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 pr-3 sm:gap-2">
          <UserMenu displayName={displayName} email={user?.email ?? ""} />
        </div>
      </div>

      <TopLoadingBar />
    </header>
  );
}
