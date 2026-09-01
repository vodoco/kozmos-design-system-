import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DynamicIsland } from "./DynamicIsland";

describe("DynamicIsland", () => {
  it("renders compact content slots", () => {
    render(
      <DynamicIsland
        compactLeading={<span>Mode</span>}
        compactTrailing={<span>1.2 km</span>}
      />,
    );

    expect(screen.getByText("Mode")).toBeInTheDocument();
    expect(screen.getByText("1.2 km")).toBeInTheDocument();
  });

  it("renders expanded content", () => {
    render(
      <DynamicIsland
        islandState="expanded"
        expandedContent={<span>Turn right</span>}
      />,
    );

    expect(screen.getByText("Turn right")).toBeInTheDocument();
  });
});
