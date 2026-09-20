import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdaptiveMapShell } from "./AdaptiveMapShell";

describe("AdaptiveMapShell", () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(390);
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(600);
  });
  afterEach(() => vi.restoreAllMocks());
  it("labels renderer and panel regions without impersonating a map", () => {
    render(
      <AdaptiveMapShell
        controls={<button type="button">Focus</button>}
        map={<canvas data-testid="sdk-renderer" />}
        mapLabel="Level one map"
        panel={<div>Place details</div>}
        panelLabel="Selected place"
      />,
    );

    expect(
      screen.getByRole("region", { name: "Level one map" }),
    ).toContainElement(screen.getByTestId("sdk-renderer"));
    expect(
      screen.getByRole("complementary", { name: "Selected place" }),
    ).toHaveTextContent("Place details");
    expect(screen.getByRole("button", { name: "Focus" })).toBeVisible();
  });

  it("renders explicit map failure content as an alert", () => {
    render(
      <AdaptiveMapShell
        map={<div />}
        mapStatus="error"
        mapStatusContent="The map could not load. Check your connection."
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The map could not load. Check your connection.",
    );
  });

  it("puts the panel on the surface style, solid by default", () => {
    const { rerender } = render(
      <AdaptiveMapShell
        map={<div />}
        panel={<p>Details</p>}
        panelLabel="Details"
      />,
    );
    const aside = screen.getByRole("complementary", { name: "Details" });
    expect(aside).toHaveClass("kozmos-reset", "kozmos-surface-solid");
    rerender(
      <AdaptiveMapShell
        map={<div />}
        panel={<p>Details</p>}
        panelLabel="Details"
        panelSurface="glass"
      />,
    );
    expect(aside).toHaveClass("kozmos-surface-glass");
    expect(aside).not.toHaveClass("kozmos-surface-solid");
  });

  it("fits a bottom panel to its content when asked", () => {
    // jsdom lays nothing out: the shell is told it is 400 tall and that the
    // panel holds 120 pixels, through the same properties it reads live.
    const sizes = { clientWidth: 360, clientHeight: 400, scrollHeight: 120 };
    const spies = [
      vi
        .spyOn(HTMLElement.prototype, "clientWidth", "get")
        .mockReturnValue(sizes.clientWidth),
      vi
        .spyOn(HTMLElement.prototype, "clientHeight", "get")
        .mockReturnValue(sizes.clientHeight),
      vi
        .spyOn(HTMLElement.prototype, "scrollHeight", "get")
        .mockReturnValue(sizes.scrollHeight),
    ];
    try {
      render(
        <AdaptiveMapShell
          map={<div />}
          panel={<p>Details</p>}
          panelLabel="Details"
          panelPresentation="bottom"
          panelSizing="content"
        />,
      );
      const aside = screen.getByRole("complementary", { name: "Details" });
      expect(aside.style.height).toBe("120px");
      expect(aside.style.top).toBe("280px");
    } finally {
      spies.forEach((spy) => spy.mockRestore());
    }
  });
});
