import { fireEvent, render, screen } from "@testing-library/react";
import { POICard } from "./POICard";
import { describe, it, expect, vi } from "vitest";

describe("POICard", () => {
  it("renders title and subtitle", () => {
    render(<POICard title="Coffee Shop" subtitle="Food & Drink" />);
    expect(screen.getByText("Coffee Shop")).toBeInTheDocument();
    expect(screen.getByText("Food & Drink")).toBeInTheDocument();
  });

  it("keeps primary selection separate from secondary actions", () => {
    const onSelect = vi.fn();
    const onBookmark = vi.fn();
    render(
      <POICard
        title="Coffee Shop"
        onClick={onSelect}
        selectionLabel="Open Coffee Shop"
        actions={<button onClick={onBookmark}>Bookmark</button>}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Bookmark" }));
    expect(onBookmark).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Open Coffee Shop" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
