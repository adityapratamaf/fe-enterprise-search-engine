import { useState } from "react";
import { Outlet } from "react-router-dom";
import { MobileNav } from "./MobileNav";
import { Topbar } from "./Topbar";

/**
 * Owns the mobile drawer state locally. It used to live in a `SidebarContext`
 * wrapped around the whole application — a global provider for one boolean read
 * by exactly the two children rendered here.
 */
export function MainLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-base">
      <Topbar onOpenNav={() => setNavOpen(true)} />
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
