import { Link, NavLink } from "react-router-dom";
import { Icon } from "@/components/ui";
import { NAV_ITEMS } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { BRAND_TAGLINE } from "@/config/branding";
import { UserMenu } from "./UserMenu";

/**
 * Header layout follows the supplied design: logo, then navigation, then the
 * account cluster, then a tagline panel bleeding to the right edge of the
 * viewport. The panel sits outside the padded content row on purpose — it is
 * flush with the screen edge rather than with the page container.
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
            src="/pertamina-logo.png"
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
              end={item.to === ROUTES.search}
              className={({ isActive }) =>
                cn(
                  "flex h-full items-center px-4 text-[13.5px] transition-colors",
                  isActive
                    ? "font-semibold text-brand-600"
                    : "font-medium text-ink-700 hover:text-brand-600",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 pr-3 sm:gap-2">
          {/* Decorative for now: there is no notifications feature behind it, and
              the count comes from the mockup rather than from data. */}
          <button
            type="button"
            className="relative rounded-full p-2 text-ink-800 transition hover:bg-brand-50"
            aria-label="Notifikasi"
          >
            <Icon name="notification-3-line" className="text-xl" />
            <span className="absolute right-1 top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-danger-500 px-1 text-[9px] font-bold leading-none text-white">
              3
            </span>
          </button>

          <UserMenu displayName={displayName} email={user?.email ?? ""} />
        </div>

        <div className="hidden h-full shrink-0 items-center rounded-l-[52px] bg-gradient-to-r from-brand-50 via-brand-50 to-brand-100 pl-9 pr-6 xl:flex">
          <span className="whitespace-nowrap text-[13px] font-medium text-brand-600">
            {BRAND_TAGLINE}
          </span>
        </div>
      </div>
    </header>
  );
}
