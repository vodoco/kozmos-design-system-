import { render, screen, fireEvent } from "@testing-library/react";
import { WayfindingCard, WayfindingInputRow } from "./WayfindingCard";
import { describe, it, expect, vi } from "vitest";

describe("WayfindingCard", () => {
  it("does not submit a surrounding form when closing navigation", () => {
    const submit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <WayfindingCard onClose={() => {}}>Route</WayfindingCard>
      </form>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close navigation" }));
    expect(submit).not.toHaveBeenCalled();
  });
  it("names its controls and supports localized names", () => {
    render(
      <WayfindingCard onClose={() => {}} closeLabel="Close route">
        <WayfindingInputRow
          originLabel="From"
          destinationLabel="To"
          swapLabel="Reverse route"
        />
      </WayfindingCard>,
    );
    expect(
      screen.getByRole("button", { name: "Close route" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reverse route" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "From" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "To" })).toBeInTheDocument();
  });
  it("renders title and children", () => {
    render(
      <WayfindingCard title="Test Route">
        <div>Step 1</div>
      </WayfindingCard>,
    );
    expect(screen.getByText("Test Route")).toBeInTheDocument();
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("handles close", () => {
    const onClose = vi.fn();
    render(<WayfindingCard onClose={onClose}>Content</WayfindingCard>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalled();
  });
});
