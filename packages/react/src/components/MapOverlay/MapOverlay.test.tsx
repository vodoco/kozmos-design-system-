import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapOverlay } from "./MapOverlay";

describe("MapOverlay", () => {
  it("renders overlay content", () => {
    render(
      <MapOverlay position="bottom-right">
        <button type="button">Open place</button>
      </MapOverlay>,
    );

    expect(
      screen.getByRole("button", { name: "Open place" }),
    ).toBeInTheDocument();
  });

  it("applies the requested position", () => {
    const { container } = render(
      <MapOverlay position="top-center">Panel</MapOverlay>,
    );

    expect(container.firstChild).toHaveClass("top-[var(--map-overlay-top)]");
    expect(container.firstChild).toHaveClass("left-1/2");
    expect(container.firstChild).toHaveStyle({
      "--map-overlay-top": "calc(env(safe-area-inset-top) + 1rem + 0px)",
    });
  });
});
