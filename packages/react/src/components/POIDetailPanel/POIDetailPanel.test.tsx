import { fireEvent, render, screen } from "@testing-library/react";
import type { POIAction, POIPresentation } from "@kozmos/product-contracts";
import { describe, expect, it, vi } from "vitest";
import { POIDetailPanel } from "./POIDetailPanel";
import {
  restaurantDetails,
  restaurantPOI,
  entranceDetails,
  entrancePOI,
} from "./POIDetailPanel.fixtures";

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
  it("renders the restaurant's optional anatomy as semantic information", () => {
    render(
      <POIDetailPanel
        poi={restaurantPOI}
        details={restaurantDetails}
        actionLabels={labels}
        onAction={vi.fn()}
      />,
    );
    expect(screen.getByText("4.7 / 5")).toBeVisible();
    expect(screen.getByText("32 reviews")).toBeVisible();
    expect(screen.getByRole("region", { name: "Cuisines" })).toHaveTextContent(
      "Mediterranean",
    );
    expect(
      screen.queryByRole("button", { name: "Vegetarian" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Go 2 min/ })).toBeVisible();
    // No handler means no capability; never pretend that booking succeeded.
    expect(screen.getByRole("button", { name: "Book" })).toBeDisabled();
  });

  it("emits supplementary capabilities independently of legacy actions", () => {
    const onSupplementaryAction = vi.fn();
    render(
      <POIDetailPanel
        poi={restaurantPOI}
        details={restaurantDetails}
        actionLabels={labels}
        onAction={vi.fn()}
        onSupplementaryAction={onSupplementaryAction}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Book" }));
    expect(onSupplementaryAction).toHaveBeenCalledWith("book", "il-forno");
  });

  it("keeps favourite state controlled and labelled", () => {
    const onAction = vi.fn();
    render(
      <POIDetailPanel
        poi={restaurantPOI}
        actionLabels={labels}
        onAction={onAction}
        actionStates={{ favourite: { pressed: true } }}
      />,
    );
    const favourite = screen.getByRole("button", { name: "Favourite" });
    expect(favourite).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(favourite);
    expect(onAction).toHaveBeenCalledWith("favourite", "il-forno");
    expect(favourite).toHaveAttribute("aria-pressed", "true");
  });

  it("expands plain-text description and resets expansion on POI selection", () => {
    const props = {
      actionLabels: labels,
      onAction: vi.fn(),
      details: restaurantDetails,
    };
    const { rerender } = render(
      <POIDetailPanel {...props} poi={restaurantPOI} />,
    );
    const expand = screen.getByRole("button", { name: "Read more" });
    expect(expand).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(expand);
    expect(screen.getByRole("button", { name: "Read less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(
      screen.getByText(restaurantDetails.description!.full!),
    ).toBeVisible();
    rerender(
      <POIDetailPanel {...props} poi={{ ...restaurantPOI, id: "other" }} />,
    );
    expect(screen.getByRole("button", { name: "Read more" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("omits unavailable media, logos, ratings and irrelevant sections for an entrance", () => {
    render(
      <POIDetailPanel
        poi={entrancePOI}
        details={entranceDetails}
        actionLabels={labels}
        onAction={vi.fn()}
      />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByText("Rating")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Cuisines" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Read more" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Access programs" }),
    ).toHaveTextContent("TSA PreCheck");
  });

  it("does not infer availability or render empty groups or a false hours disclosure", () => {
    const { container } = render(
      <POIDetailPanel
        poi={{
          ...entrancePOI,
          availability: "unknown",
          availabilityLabel: "Hours unavailable",
        }}
        details={{
          groups: [{ id: "empty", heading: "Amenities", items: [] }],
          openingHours: {
            label: "Opening hours",
            summary: "Ask at reception",
            rows: [],
          },
        }}
        actionLabels={labels}
        onAction={vi.fn()}
      />,
    );
    expect(screen.queryByText("Open")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Amenities" }),
    ).not.toBeInTheDocument();
    expect(container.querySelector("summary")).toBeNull();
    expect(screen.getByText("Ask at reception")).toBeVisible();
  });

  it("renders a native labelled hours disclosure and respects heading level", () => {
    const { container } = render(
      <POIDetailPanel
        poi={restaurantPOI}
        details={restaurantDetails}
        titleLevel={3}
        actionLabels={labels}
        onAction={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Il Forno", level: 3 }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Cuisines", level: 4 }),
    ).toBeVisible();
    expect(container.querySelector("details > summary")).toHaveTextContent(
      "Closes 12:30 pm",
    );
  });

  it("announces supplementary failures and disables in-progress actions", () => {
    render(
      <POIDetailPanel
        poi={restaurantPOI}
        details={restaurantDetails}
        actionLabels={labels}
        onAction={vi.fn()}
        onSupplementaryAction={vi.fn()}
        supplementaryActionStates={{
          book: {
            loading: true,
            message: "Could not book.",
            messageTone: "error",
          },
        }}
      />,
    );
    expect(screen.getByRole("button", { name: "Book" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Could not book.");
  });
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
