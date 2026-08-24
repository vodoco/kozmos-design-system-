import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RouteSummary } from "./RouteSummary";

describe("RouteSummary", () => {
  it("renders active route details and ends the route", () => {
    const onEndRoute = vi.fn();

    render(
      <RouteSummary
        etaText="12 min"
        distanceText="1.8 km remaining"
        onEndRoute={onEndRoute}
      />,
    );

    expect(screen.getByText("12 min")).toBeInTheDocument();
    expect(screen.getByText("1.8 km remaining")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("End route"));
    expect(onEndRoute).toHaveBeenCalledTimes(1);
  });

  it("renders preview action when navigation can start", () => {
    const onStartNavigation = vi.fn();

    render(
      <RouteSummary
        etaText="18 min"
        distanceText="2 stops"
        state="preview"
        onEndRoute={vi.fn()}
        onStartNavigation={onStartNavigation}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /start navigation/i }));
    expect(onStartNavigation).toHaveBeenCalledTimes(1);
  });
});
