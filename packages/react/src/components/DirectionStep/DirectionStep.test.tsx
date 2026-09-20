import { render, screen } from "@testing-library/react";
import { DirectionStep, DIRECTION_TYPES } from "./DirectionStep";
import { describe, it, expect } from "vitest";

describe("DirectionStep", () => {
  it("renders instruction and distance", () => {
    render(
      <DirectionStep type="left" instruction="Turn left" distance="50m" />,
    );
    expect(screen.getByText("Turn left")).toBeInTheDocument();
    expect(screen.getByText(/50m/)).toBeInTheDocument();
  });

  it("draws an arrow for every direction, silent to assistive technology", () => {
    for (const type of DIRECTION_TYPES) {
      const { container, unmount } = render(
        <DirectionStep type={type} instruction={type} />,
      );
      const svg = container.querySelector("svg");
      expect(svg, `${type} draws no arrow`).not.toBeNull();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      unmount();
    }
  });
});
