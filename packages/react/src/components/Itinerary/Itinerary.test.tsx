import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Itinerary, type ItineraryStep } from "./Itinerary";

const steps: ItineraryStep[] = [
  {
    id: "1",
    instruction: "Take Elevator down to First Floor",
    type: "straight",
  },
  {
    id: "2",
    instruction: "Take Corridor to Garage B",
    type: "straight",
    current: true,
  },
  { id: "3", instruction: "Destination", type: "destination" },
];

describe("Itinerary", () => {
  it("lists the origin, every step and the destination, in order", () => {
    render(
      <Itinerary
        origin="Dunkin'"
        steps={steps}
        destination="Airport Shuttles"
      />,
    );

    expect(
      screen.getByRole("region", { name: "Itinerary" }),
    ).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "FromDunkin'",
      "Take Elevator down to First Floor",
      "Take Corridor to Garage B",
      "Destination",
      "ToAirport Shuttles",
    ]);
  });

  it("marks the current step alone, and none when there is none", () => {
    const { rerender } = render(
      <Itinerary origin="A" steps={steps} destination="B" />,
    );
    const current = screen
      .getAllByRole("listitem")
      .filter((item) => item.getAttribute("aria-current") === "step");
    expect(current.map((item) => item.textContent)).toEqual([
      "Take Corridor to Garage B",
    ]);

    rerender(
      <Itinerary
        origin="A"
        steps={steps.map((step) => ({ ...step, current: false }))}
        destination="B"
      />,
    );
    expect(
      screen
        .getAllByRole("listitem")
        .some((item) => item.hasAttribute("aria-current")),
    ).toBe(false);
  });

  it("takes its own endpoint labels", () => {
    render(
      <Itinerary
        origin="A"
        steps={[]}
        destination="B"
        originLabel="Von"
        destinationLabel="Nach"
        label="Wegbeschreibung"
      />,
    );
    expect(
      screen.getByRole("region", { name: "Wegbeschreibung" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Von")).toBeInTheDocument();
    expect(screen.getByText("Nach")).toBeInTheDocument();
  });
});
