import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RoutingInputGroup } from "./RoutingInputGroup";

const points = [
  { id: "origin", value: "Current location" },
  { id: "destination", value: "Gate A12" },
];

describe("RoutingInputGroup", () => {
  it("renders route points and reports input changes", () => {
    const onPointChange = vi.fn();

    render(<RoutingInputGroup points={points} onPointChange={onPointChange} />);

    fireEvent.change(screen.getByDisplayValue("Current location"), {
      target: { value: "Lobby" },
    });

    expect(onPointChange).toHaveBeenCalledWith("origin", "Lobby");
  });

  it("supports swapping and adding route points", () => {
    const onSwap = vi.fn();
    const onAddPoint = vi.fn();

    render(
      <RoutingInputGroup
        points={points}
        onPointChange={vi.fn()}
        onSwap={onSwap}
        onAddPoint={onAddPoint}
      />,
    );

    fireEvent.click(screen.getByLabelText("Swap route points"));
    fireEvent.click(screen.getByLabelText("Add route point"));

    expect(onSwap).toHaveBeenCalledTimes(1);
    expect(onAddPoint).toHaveBeenCalledTimes(1);
  });

  it("supports removing intermediate stops", () => {
    const onRemovePoint = vi.fn();

    render(
      <RoutingInputGroup
        points={[
          points[0],
          { id: "stop", value: "Coffee bar", placeholder: "Coffee bar" },
          points[1],
        ]}
        onPointChange={vi.fn()}
        onRemovePoint={onRemovePoint}
      />,
    );

    fireEvent.click(screen.getByLabelText("Remove Coffee bar"));
    expect(onRemovePoint).toHaveBeenCalledWith("stop");
  });
});
