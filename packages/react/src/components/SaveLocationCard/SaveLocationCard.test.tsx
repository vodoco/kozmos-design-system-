import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SaveLocationCard } from "./SaveLocationCard";

describe("SaveLocationCard", () => {
  it("renders unsaved state and toggles save", () => {
    const onSaveToggle = vi.fn();

    render(<SaveLocationCard onSaveToggle={onSaveToggle} />);

    fireEvent.click(screen.getByRole("button", { name: /save location/i }));
    expect(onSaveToggle).toHaveBeenCalledTimes(1);
  });

  it("renders saved actions", () => {
    const onRouteToLocation = vi.fn();
    const onEditNote = vi.fn();

    render(
      <SaveLocationCard
        isSaved
        description="Level 2, Row C"
        onRouteToLocation={onRouteToLocation}
        onEditNote={onEditNote}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /guide me/i }));
    fireEvent.click(screen.getByLabelText("Edit location note"));

    expect(screen.getByText("Level 2, Row C")).toBeInTheDocument();
    expect(onRouteToLocation).toHaveBeenCalledTimes(1);
    expect(onEditNote).toHaveBeenCalledTimes(1);
  });
});
