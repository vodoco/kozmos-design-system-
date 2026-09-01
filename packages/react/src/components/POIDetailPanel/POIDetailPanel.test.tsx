import { fireEvent, render, screen } from "@testing-library/react";
import type { POIAction, POIPresentation } from "@kozmos/product-contracts";
import { describe, expect, it, vi } from "vitest";
import { POIDetailPanel } from "./POIDetailPanel";

const labels: Record<POIAction, string> = {
  navigate: "Go",
  favourite: "Favourite",
  bookmark: "Bookmark",
  share: "Share",
  order: "Order",
};

const poi: POIPresentation = {
  id: "burger-king",
  name: "Burger King",
  floorId: "1",
  floorLabel: "First floor",
  buildingLabel: "Building A",
  media: [],
  availability: "open",
  availabilityLabel: "Open",
  description: "Flame-grilled burgers, fries and shakes.",
  services: [{ id: "dine-in", label: "Dine-in" }],
  actions: ["navigate", "share", "order"],
};

describe("POIDetailPanel", () => {
  it("renders optional regions and emits typed actions", () => {
    const onAction = vi.fn();
    const onClose = vi.fn();
    render(
      <POIDetailPanel
        actionLabels={labels}
        onAction={onAction}
        onClose={onClose}
        poi={poi}
      />,
    );

    expect(screen.getByRole("heading", { name: "Burger King" })).toBeVisible();
    expect(screen.getByText("Open")).toBeVisible();
    expect(screen.getByText("Dine-in")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Order" }));
    expect(onAction).toHaveBeenCalledWith("order", poi.id);
    fireEvent.click(screen.getByRole("button", { name: "Close details" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("exposes loading, pressed, and action error states", () => {
    render(
      <POIDetailPanel
        actionLabels={labels}
        actionStates={{
          share: { loading: true },
          order: { message: "Ordering is unavailable.", messageTone: "error" },
        }}
        onAction={() => undefined}
        poi={poi}
      />,
    );

    expect(screen.getByRole("button", { name: "Share" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ordering is unavailable.",
    );
  });
});
