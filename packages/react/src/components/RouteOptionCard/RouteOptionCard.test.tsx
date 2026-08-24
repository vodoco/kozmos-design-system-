import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RouteOptionCard } from "./RouteOptionCard";

const option = {
  id: "quickest",
  label: "Quickest",
  durationSeconds: 240,
  durationLabel: "4 min",
  distanceMetres: 150,
  distanceLabel: "150 m",
  preference: "quickest" as const,
  selected: true,
  available: true,
};

describe("RouteOptionCard", () => {
  it("exposes selected state and emits the stable route ID", () => {
    const onSelect = vi.fn();
    render(<RouteOptionCard onSelect={onSelect} option={option} />);
    const button = screen.getByRole("button", { name: /Quickest/ });
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith("quickest");
  });

  it("keeps unavailable routes readable but disabled", () => {
    render(
      <RouteOptionCard
        onSelect={() => undefined}
        option={{
          ...option,
          available: false,
          selected: false,
          warning: "This route is temporarily unavailable.",
        }}
      />,
    );
    expect(screen.getByRole("button", { name: /Quickest/ })).toBeDisabled();
    expect(
      screen.getByText("This route is temporarily unavailable."),
    ).toBeVisible();
  });
});
