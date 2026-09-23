import { test, expect } from "@playwright/experimental-ct-react";
import React from "react";
import { BrowseGrid } from "./BrowseCategoriesPanel.fixture";

// The prototype's grid, measured on 2026-09-22: a CSS grid, row-gap 12px and
// column-gap 8px. The panel drew its rows 8 apart until then, as did Compose
// and Figma; SwiftUI drew 12.
test("the grid is four across 8 apart, its rows 12 apart", async ({
  mount,
}) => {
  const component = await mount(<BrowseGrid />);
  const tiles = component.locator("li");
  await expect(tiles).toHaveCount(8);
  const [first, second, fifth] = await Promise.all(
    [0, 1, 4].map((index) => tiles.nth(index).boundingBox()),
  );
  if (!first || !second || !fifth) throw new Error("a tile has no box");
  expect(second.y).toBeCloseTo(first.y, 1);
  expect(second.x - (first.x + first.width)).toBeCloseTo(8, 1);
  expect(fifth.x).toBeCloseTo(first.x, 1);
  expect(fifth.y - (first.y + first.height)).toBeCloseTo(12, 1);
});
