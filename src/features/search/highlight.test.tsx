import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { highlightedField, renderHighlight } from "./highlight";

describe("renderHighlight", () => {
  it("turns <mark> into real mark elements", () => {
    render(<p>{renderHighlight("SPBU <mark>Sudirman</mark> Jakarta")}</p>);
    expect(screen.getByText("Sudirman").tagName).toBe("MARK");
  });

  it("renders any other markup as literal text rather than elements", () => {
    // The snippet is backend-controlled text; only <mark> may become an element.
    const { container } = render(<p>{renderHighlight("<img src=x onerror=alert(1)>")}</p>);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toBe("<img src=x onerror=alert(1)>");
  });

  it("passes plain text through untouched", () => {
    const { container } = render(<p>{renderHighlight("tanpa sorotan")}</p>);
    expect(container.textContent).toBe("tanpa sorotan");
  });
});

describe("highlightedField", () => {
  it("prefers the snippet when the engine produced one", () => {
    render(<p>{highlightedField({ nama: ["<mark>SPBU</mark> A"] }, "nama", "SPBU A")}</p>);
    expect(screen.getByText("SPBU").tagName).toBe("MARK");
  });

  it("falls back to the plain value, which is what SQL always needs", () => {
    const { container } = render(<p>{highlightedField(null, "nama", "SPBU A")}</p>);
    expect(container.textContent).toBe("SPBU A");
  });
});
