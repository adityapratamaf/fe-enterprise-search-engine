import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { SearchPage } from "./SearchPage";

/**
 * Leaflet needs real element sizing, which jsdom does not provide. The map panel
 * is lazy-loaded behind Suspense anyway, so stubbing it keeps this a test of the
 * search page rather than of Leaflet.
 */
vi.mock("./components/MapPanel", () => ({
  MapPanel: () => <div data-testid="map-panel" />,
}));

function renderPage(initialUrl = "/search") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialUrl]}>
        <SearchPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

/**
 * Result cards are the only `article` elements on the page. Matching them by
 * accessible name would also catch the "SPBU Jakarta Selatan" example chip, and
 * `findAllBy*` resolves on its first hit — so during the loading skeleton it
 * would return the chip alone and the assertion would pass for the wrong reason.
 */
async function findResultCards(): Promise<HTMLElement[]> {
  // Wait for the results header, which only appears once the query resolves.
  await screen.findByText(/Menampilkan/i);
  await waitFor(() => {
    expect(document.querySelectorAll("article").length).toBeGreaterThan(0);
  });
  return Array.from(document.querySelectorAll("article"));
}

describe("SearchPage", () => {
  beforeEach(() => {
    // jsdom does not implement it, and the page scrolls on page change.
    window.scrollTo = vi.fn();
  });

  it("renders a full page of results from the mock API", async () => {
    renderPage();

    expect(screen.getByRole("heading", { name: /Temukan SPBU/i })).toBeInTheDocument();

    const cards = await findResultCards();
    expect(cards).toHaveLength(10);
  });

  it("renders facet groups with real counts", async () => {
    renderPage();
    await findResultCards();

    // Scoped to the sidebar: province names also appear in the detail panel, so
    // an unscoped query matches twice and proves nothing about the facets.
    const sidebar = screen.getByRole("complementary", { name: /Filter pencarian/i });

    expect(within(sidebar).getByRole("button", { name: /Provinsi/i })).toBeInTheDocument();
    const option = within(sidebar).getByText("DKI Jakarta");
    expect(option).toBeInTheDocument();

    // The count beside the value is what shows the buckets came from the response.
    const row = option.closest("label");
    expect(row?.textContent).toMatch(/DKI Jakarta\s*\d+/);
  });

  it("reads the initial query from the URL", async () => {
    renderPage("/search?q=Denpasar");

    expect(screen.getByRole("combobox", { name: /Cari SPBU/i })).toHaveValue("Denpasar");

    const cards = await findResultCards();
    expect(cards.length).toBeGreaterThan(0);
    // The term shows up in the name, the address and the city, so match loosely.
    expect(within(cards[0]!).getAllByText(/Denpasar/i).length).toBeGreaterThan(0);
  });

  it("explains what the SQL engine cannot do", async () => {
    renderPage("/search?q=sudirman&engine=Sql");

    await waitFor(() => {
      expect(screen.getByText(/Tidak tersedia pada mesin ini/i)).toBeInTheDocument();
    });
  });

  it("renders the empty state for a query with no matches", async () => {
    renderPage("/search?q=zzzzzqqq");

    await waitFor(() => {
      expect(screen.getByText(/SPBU tidak ditemukan/i)).toBeInTheDocument();
    });
    expect(document.querySelectorAll("article")).toHaveLength(0);
  });

  it("selecting a result updates the detail panel", async () => {
    const user = userEvent.setup();
    renderPage();

    const cards = await findResultCards();
    const target = within(cards[1]!).getAllByRole("button")[0]!;
    const name = target.textContent ?? "";
    expect(name).not.toBe("");

    await user.click(target);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    });
  });
});
