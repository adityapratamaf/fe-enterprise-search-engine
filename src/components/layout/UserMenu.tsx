import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Spinner } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Replaces the previous decorative pair of buttons: a hardcoded "AP" avatar and
 * a chevron that did nothing. Logout is wired up here — `useAuth().logout`
 * existed but had no caller anywhere in the app.
 */
export function UserMenu({ displayName, email }: { displayName: string; email: string }) {
  const { initials, logout } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    try {
      await logout();
      navigate(ROUTES.login, { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-1.5 transition hover:bg-brand-50"
          aria-label={`Menu akun ${displayName}`}
        >
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full bg-brand-navy text-[13px] font-semibold text-white"
          >
            {initials}
          </span>
          {/* The design shows the name on a single line; the email belongs to the
              dropdown, where there is room for it. */}
          <span className="hidden text-[13.5px] font-medium text-ink-900 sm:block">
            {displayName}
          </span>
          <Icon name="arrow-down-s-line" className="text-lg text-ink-600" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[80] w-56 rounded-xl border border-line-200 bg-white p-1 shadow-overlay"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-ink-900">{displayName}</p>
            <p className="truncate text-xs text-ink-400">{email}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-line-100" />
          <DropdownMenu.Item
            disabled={busy}
            onSelect={(event) => {
              // Keep the menu mounted while the request is in flight.
              event.preventDefault();
              void handleLogout();
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-500 outline-none data-[highlighted]:bg-danger-50 data-[disabled]:opacity-60"
          >
            {busy ? <Spinner size="sm" label="Keluar" /> : <Icon name="logout-box-r-line" />}
            Keluar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
