import { fireEvent, render, screen } from "@testing-library/react";
import { Focus } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { MapControlButton } from "./MapControlButton";

describe("MapControlButton", () => {
  it("renders an icon-only action with an accessible name", () => {
    const onClick = vi.fn();
    render(
      <MapControlButton
        icon={<Focus />}
        label="Focus location"
        onClick={onClick}
      />,
    );

    const button = screen.getByRole("button", { name: "Focus location" });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("data-presentation", "icon-only");
  });

  it("exposes visible and semantic state for a labelled toggle", () => {
    render(
      <MapControlButton
        icon={<Focus />}
        label="Focus"
        presentation="labelled"
        pressed={false}
        stateLabel="Off"
        onClick={() => undefined}
      />,
    );

    expect(screen.getByText("Focus")).toBeVisible();
    expect(screen.getByText("Off")).toBeVisible();
    expect(screen.getByRole("button", { name: "Focus, Off" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
