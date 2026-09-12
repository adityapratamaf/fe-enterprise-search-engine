import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NAV_ITEMS } from "@/config/navigation";
import { BRAND_TAGLINE } from "@/config/branding";
import { Topbar } from "./Topbar";

function renderTopbar(initialUrl = "/") {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <AuthProvider>
        <Topbar onOpenNav={vi.fn()} />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Topbar", () => {
  it("renders the logo and every navigation entry", () => {
    renderTopbar();

    expect(screen.getByAltText("Pertamina")).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: /Navigasi utama/i });
    for (const item of NAV_ITEMS) {
      expect(within(nav).getByRole("link", { name: item.label })).toBeInTheDocument();
    }
  });

  it("marks only the current route as active", () => {
    renderTopbar("/analytics");

    const nav = screen.getByRole("navigation", { name: /Navigasi utama/i });
    const active = within(nav).getByRole("link", { name: "Analitik" });
    const inactive = within(nav).getByRole("link", { name: "Peta" });

    // NavLink sets aria-current on the matched route.
    expect(active).toHaveAttribute("aria-current", "page");
    expect(inactive).not.toHaveAttribute("aria-current");
    expect(active.className).toContain("text-brand-600");
  });

  it("keeps the index route from matching every path", () => {
    renderTopbar("/analytics");

    const nav = screen.getByRole("navigation", { name: /Navigasi utama/i });
    expect(within(nav).getByRole("link", { name: "SPBU Search" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows the notification bell with its badge", () => {
    renderTopbar();

    const bell = screen.getByRole("button", { name: /Notifikasi/i });
    expect(within(bell).getByText("3")).toBeInTheDocument();
  });

  it("shows the account avatar initials and the name on one line", () => {
    renderTopbar();

    const account = screen.getByRole("button", { name: /Menu akun/i });
    // Initials are derived from the session, not hardcoded as "AP" in markup.
    expect(within(account).getByText("AP")).toBeInTheDocument();
    expect(within(account).getByText("Aditya Pratama")).toBeInTheDocument();
    // The email belongs to the dropdown, not the header row.
    expect(within(account).queryByText(/@/)).toBeNull();
  });

  it("renders the brand tagline panel", () => {
    renderTopbar();
    expect(screen.getByText(BRAND_TAGLINE)).toBeInTheDocument();
  });
});
