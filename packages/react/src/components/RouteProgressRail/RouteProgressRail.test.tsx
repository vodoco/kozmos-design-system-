import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  RouteProgressRail,
  clampProgress,
  discLeading,
} from "./RouteProgressRail";

describe("RouteProgressRail", () => {
  it("keeps progress between the ends of the rail", () => {
    expect(clampProgress(0.5)).toBe(0.5);
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(2)).toBe(1);
    expect(clampProgress(Number.NaN)).toBe(0);
  });

  it("puts the disc just after the start dot, just before the end dot, and between", () => {
    expect(discLeading(0)).toBe("calc(10px + (100% - 54px) * 0)");
    expect(discLeading(1)).toBe("calc(10px + (100% - 54px) * 1)");
    expect(discLeading(0.5)).toBe("calc(10px + (100% - 54px) * 0.5)");
  });

  it("is a progress bar with the label and the percentage", () => {
    render(
      <RouteProgressRail
        progress={0.84}
        type="destination"
        label="Step 4 of 4"
      />,
    );
    const rail = screen.getByRole("progressbar", { name: "Step 4 of 4" });
    expect(rail).toHaveAttribute("aria-valuenow", "84");
    expect(rail).toHaveAttribute("aria-valuemin", "0");
    expect(rail).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByTestId("route-progress-disc")).toHaveStyle({
      left: discLeading(0.84),
    });
  });

  it("reads a progress outside the rail as its nearest end", () => {
    render(
      <RouteProgressRail progress={3} type="straight" label="Step 1 of 1" />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });
});
