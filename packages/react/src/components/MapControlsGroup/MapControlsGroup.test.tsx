import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MapControlsGroup } from "./MapControlsGroup";

describe("MapControlsGroup", () => {
  it("renders zoom controls and calls handlers", () => {
    const onZoomIn = vi.fn();
    const onZoomOut = vi.fn();

    render(<MapControlsGroup onZoomIn={onZoomIn} onZoomOut={onZoomOut} />);

    fireEvent.click(screen.getByLabelText("Zoom in"));
    fireEvent.click(screen.getByLabelText("Zoom out"));

    expect(onZoomIn).toHaveBeenCalledTimes(1);
    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });

  it("renders optional compass and location controls", () => {
    const onCompassReset = vi.fn();
    const onMyLocation = vi.fn();

    render(
      <MapControlsGroup
        onCompassReset={onCompassReset}
        onMyLocation={onMyLocation}
        compassBearing={90}
        locationLabel="Locate me"
      />,
    );

    fireEvent.click(screen.getByLabelText("Reset bearing"));
    fireEvent.click(screen.getByLabelText("Locate me"));

    expect(onCompassReset).toHaveBeenCalledTimes(1);
    expect(onMyLocation).toHaveBeenCalledTimes(1);
  });

  it("communicates location-following state without relying on colour", () => {
    render(
      <MapControlsGroup
        onMyLocation={() => undefined}
        locationLabel="Focus"
        locationPresentation="labelled"
        locationState="following"
        locationStateLabel="On"
      />,
    );

    expect(screen.getByRole("button", { name: "Focus, On" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("does not render controls without corresponding handlers", () => {
    render(<MapControlsGroup />);

    expect(
      screen.getByRole("group", { name: "Map controls" }),
    ).toBeEmptyDOMElement();
  });
});
