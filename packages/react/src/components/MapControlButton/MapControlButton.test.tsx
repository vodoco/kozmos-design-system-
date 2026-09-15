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
  it("tints an active control instead of filling it, by default", () => {
    render(
      <MapControlButton
        icon={<Focus data-testid="glyph" />}
        label="Focus"
        presentation="labelled"
        pressed
        stateLabel="On"
        onClick={() => undefined}
      />,
    );

    const button = screen.getByRole("button", { name: "Focus, On" });
    // The map surface survives: a filled control would take the primary tier
    // and hide the tiles it sits on. Asserted against the opaque role because
    // `bg-background/90` compiles to nothing — see the component comment.
    expect(button).toHaveClass("bg-background");
    expect(button.className).not.toContain("bg-background/");
    expect(button).toHaveClass("ring-primary");
    expect(button.className).not.toContain("bg-primary");
    // Only the icon carries the colour; the label stays ink so it keeps its
    // contrast against the surface.
    expect(screen.getByTestId("glyph").parentElement).toHaveClass(
      "text-primary",
    );
  });

  it("still fills when a caller asks for the heavier emphasis", () => {
    render(
      <MapControlButton
        emphasis="filled"
        icon={<Focus data-testid="glyph" />}
        label="Focus"
        pressed
        onClick={() => undefined}
      />,
    );

    const button = screen.getByRole("button", { name: "Focus" });
    expect(button.className).not.toContain("ring-primary");
    expect(screen.getByTestId("glyph").parentElement).not.toHaveClass(
      "text-primary",
    );
  });

  it("stacks the state under the label when asked", () => {
    render(
      <MapControlButton
        icon={<Focus />}
        label="Focus"
        labelPlacement="stacked"
        presentation="labelled"
        pressed
        stateLabel="On"
        onClick={() => undefined}
      />,
    );

    const name = screen.getByText("Focus");
    const state = screen.getByText("On");
    const stack = name.parentElement;
    expect(stack).toBe(state.parentElement);
    expect(stack).toHaveClass("flex-col");
    expect(state).toHaveClass("font-semibold");
  });

  it("reaches for the control radius rather than a container's", () => {
    render(
      <MapControlButton
        icon={<Focus />}
        label="Zoom in"
        onClick={() => undefined}
      />,
    );

    const button = screen.getByRole("button", { name: "Zoom in" });
    expect(button).toHaveClass("rounded-control");
    expect(button.className).not.toContain("rounded-container");
  });

  it("keeps the label mounted and clipped when icon-only, so it can animate", () => {
    render(
      <MapControlButton
        icon={<Focus />}
        label="Focus"
        presentation="icon-only"
        stateLabel="On"
        onClick={() => undefined}
      />,
    );

    // Present for the width transition, hidden from the accessible name by the
    // button's own aria-label.
    const clipped = screen.getByText("Focus").parentElement;
    expect(clipped).toHaveClass("max-w-0");
    expect(screen.getByRole("button", { name: "Focus, On" })).toHaveAttribute(
      "data-presentation",
      "icon-only",
    );
  });
});
