import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserLocationMarker } from "./UserLocationMarker";

describe("UserLocationMarker", () => {
  it("keeps SVG paint references local to each instance", () => {
    const { container } = render(
      <>
        <UserLocationMarker />
        <UserLocationMarker />
      </>,
    );
    const gradients = [...container.querySelectorAll("radialGradient")];
    expect(new Set(gradients.map((el) => el.id)).size).toBe(2);
    container.querySelectorAll("svg").forEach((svg) => {
      expect(svg.querySelector("path")).toHaveAttribute(
        "fill",
        `url(#${svg.querySelector("radialGradient")!.id})`,
      );
    });
  });
  it("renders as an accessible location marker", () => {
    render(<UserLocationMarker heading={45} />);

    expect(
      screen.getByRole("img", { name: "User location" }),
    ).toBeInTheDocument();
  });

  it("can hide the heading cone", () => {
    const { container } = render(<UserLocationMarker showHeading={false} />);

    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
