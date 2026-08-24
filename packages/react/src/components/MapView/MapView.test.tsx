import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapView } from "./MapView";

describe("MapView", () => {
  it("renders an accessible map host and its renderer content", () => {
    render(
      <MapView mapLabel="Ground floor map">
        <div>Map renderer</div>
      </MapView>,
    );

    expect(
      screen.getByRole("region", { name: "Ground floor map" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Map renderer")).toBeInTheDocument();
  });
});
