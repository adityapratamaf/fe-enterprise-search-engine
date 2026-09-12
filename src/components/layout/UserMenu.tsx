import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Spinner } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/features/auth/AuthContext";

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
          className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-brand-50"
          aria-label={`Menu akun ${displayName}`}
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-brand-800 text-xs font-semibold text-white"
          >
            {initials}
          </span>
          <span className="hidden text-right sm:block">
            <span className="block text-[12px] font-semibold text-ink-900">{displayName}</span>
            <span className="block text-[10px] text-ink-400">{email}</span>
          </span>
          <Icon name="arrow-down-s-line" className="text-ink-500" />
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
