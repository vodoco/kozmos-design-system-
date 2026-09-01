import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserLocationMarker } from "./UserLocationMarker";

describe("UserLocationMarker", () => {
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
