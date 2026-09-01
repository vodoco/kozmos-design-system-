import { fireEvent, render, screen } from "@testing-library/react";
import type { POIPresentation } from "@kozmos/product-contracts";
import { describe, expect, it, vi } from "vitest";
import { POIResultList, type POIResultListItem } from "./POIResultList";

const createItem = (id: string, index: number): POIResultListItem => {
  const poi: POIPresentation = {
    id,
    name: id === "one" ? "Baskin-Robbins" : "Burger King",
    floorId: "2",
    floorLabel: "Second floor",
    media: [],
    actions: ["navigate"],
  };
  return {
    poi,
    result: {
      poiId: id,
      resultIndex: index,
      selected: false,
      featured: false,
      floorId: "2",
    },
  };
};

describe("POIResultList", () => {
  it("controls one selected result and emits its stable ID", () => {
    const onSelect = vi.fn();
    render(
      <POIResultList
        items={[createItem("one", 1), createItem("two", 2)]}
        onSelect={onSelect}
        resultCountLabel="2 results"
        selectedPoiId="two"
      />,
    );

    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: /Baskin-Robbins/i }));
    expect(onSelect).toHaveBeenCalledWith("one");
    expect(screen.getByText("2 results")).toHaveClass("sr-only");
  });

  it("renders a directed empty state", () => {
    render(
      <POIResultList
        emptyState="Try removing a filter."
        items={[]}
        onSelect={() => undefined}
        resultCountLabel="No results"
      />,
    );

    expect(screen.getByText("Try removing a filter.")).toBeVisible();
  });
});
