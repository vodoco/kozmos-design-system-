import { fireEvent, render, screen } from "@testing-library/react";
import type {
  POIPresentation,
  POIResultPresentation,
} from "@kozmos-ds/product-contracts";
import { describe, expect, it, vi } from "vitest";
import { POIResultCard, getPOIResultDomId } from "./POIResultCard";

const poi: POIPresentation = {
  id: "burger-king/a",
  name: "Burger King",
  categoryLabel: "Dining",
  floorId: "1",
  floorLabel: "First floor",
  buildingLabel: "Building A",
  media: [],
  availability: "open",
  availabilityLabel: "Open",
  actions: ["navigate"],
};

const result: POIResultPresentation = {
  poiId: poi.id,
  resultIndex: 2,
  selected: true,
  featured: true,
  floorId: poi.floorId,
  travelEstimate: { durationSeconds: 180, durationLabel: "3 min" },
};

describe("POIResultCard", () => {
  it("renders synchronized result metadata and calls selection", () => {
    const onSelect = vi.fn();
    render(<POIResultCard poi={poi} result={result} onSelect={onSelect} />);

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("id", getPOIResultDomId(poi.id));
    expect(card).toHaveAttribute("data-selected", "true");
    expect(screen.getByText("Featured")).toBeVisible();
    expect(screen.getByText("First floor · Building A")).toBeVisible();
    expect(screen.getByText("3 min")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { pressed: true }));
    expect(onSelect).toHaveBeenCalledWith(poi.id);
  });

  it("prevents selection when a result is unavailable", () => {
    const onSelect = vi.fn();
    render(
      <POIResultCard
        poi={poi}
        result={{
          ...result,
          selected: false,
          available: false,
          unavailableReason: "This floor is temporarily unavailable.",
        }}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole("button")).toBeDisabled();
    expect(
      screen.getByText("This floor is temporarily unavailable."),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("is the prototype's row: 80 tall, no number, a dot before the floor when it is the current one", () => {
    const { container, rerender } = render(
      <POIResultCard
        poi={poi}
        result={{ ...result, featured: false, selected: false }}
        onSelect={vi.fn()}
        currentFloorId={result.floorId}
      />,
    );
    expect(screen.getByRole("button")).toHaveClass("min-h-20");
    expect(
      screen.queryByText(String(result.resultIndex)),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-current-floor='true']"),
    ).not.toBeNull();
    rerender(
      <POIResultCard
        poi={poi}
        result={{ ...result, featured: false, selected: false }}
        onSelect={vi.fn()}
        currentFloorId="somewhere-else"
      />,
    );
    expect(container.querySelector("[data-current-floor='true']")).toBeNull();
  });
});
