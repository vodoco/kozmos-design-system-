import { test, expect } from "@playwright/experimental-ct-react";
import React from "react";
import { IslandFixture, PanelCardsFixture } from "./PanelSurfaces.fixture";

// The four cards that float over the map take the panel role, 24, as SwiftUI
// and Compose draw them and the plugin paints them. They were the 2xl
// primitive, 32, until 2026-09-22.
test("the map's cards take the panel radius", async ({ mount }) => {
  const component = await mount(<PanelCardsFixture />);
  for (const id of ["feedback", "summary", "routing", "save"]) {
    await expect(component.getByTestId(id)).toHaveCSS(
      "border-top-left-radius",
      "24px",
    );
  }
});

// The island is black with light ink in both themes, as the device's is and
// the natives draw it. It was bg-foreground, which turned light in dark mode.
for (const theme of ["light", "dark"] as const) {
  test(`the island is black with light ink in the ${theme} theme`, async ({
    mount,
  }) => {
    const component = await mount(<IslandFixture theme={theme} />);
    const island = component.getByTestId("island");
    await expect(island).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await expect(island).toHaveCSS("color", "rgb(255, 255, 255)");
  });
}
