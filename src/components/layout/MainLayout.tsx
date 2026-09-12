import type { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fbff]">
      <Topbar />
      <MobileNav />
      <main>{children}</main>
    </div>
  );
}
