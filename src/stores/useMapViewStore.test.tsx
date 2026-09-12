import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DEFAULT_CENTER, DEFAULT_ZOOM, useMapViewStore } from "./useMapViewStore";

describe("useMapViewStore", () => {
  it("starts at the default view", () => {
    const state = useMapViewStore.getState();
    expect(state.center).toEqual(DEFAULT_CENTER);
    expect(state.zoom).toBe(DEFAULT_ZOOM);
  });

  it("setView then reset round-trips", () => {
    useMapViewStore.getState().setView({ center: [1, 2], zoom: 15 });
    expect(useMapViewStore.getState().zoom).toBe(15);

    useMapViewStore.getState().reset();
    expect(useMapViewStore.getState().center).toEqual(DEFAULT_CENTER);
  });

  /**
   * Regression: zustand v5 compares snapshots with Object.is and ships no
   * default shallow equality. A selector building a new object per call makes
   * every render look like a state change, and React aborts with
   * "Maximum update depth exceeded". Consumers must select one field at a time
   * (or wrap the selector in `useShallow`).
   */
  it("survives being read one field at a time without re-render loops", () => {
    let renders = 0;

    function Probe() {
      renders += 1;
      const center = useMapViewStore((state) => state.center);
      const zoom = useMapViewStore((state) => state.zoom);
      return <span data-testid="view">{`${center.join(",")}@${zoom}`}</span>;
    }

    expect(() => render(<Probe />)).not.toThrow();
    expect(screen.getByTestId("view")).toBeInTheDocument();
    // A loop would blow past this long before React's own 25-update ceiling.
    expect(renders).toBeLessThan(5);
  });
});
