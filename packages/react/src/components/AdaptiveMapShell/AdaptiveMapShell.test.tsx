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
});
