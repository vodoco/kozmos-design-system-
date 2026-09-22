import { test, expect } from "@playwright/experimental-ct-react";
import React from "react";
import { EdgeRoles } from "./EdgeRoles.fixture";

// Edges in the Semantics.Border roles, as the page draws them in light. Until
// 2026-09-22 a bare `border` drew Tailwind's gray-200 (229, 231, 235) in both
// themes, and a field's edge read foreground/500 by its primitive, not by
// the Input role; a pending step's ring was `muted` (227, 228, 232), 1.2:1
// on the page, where Figma and the natives draw foreground/500.
test("a bare border, a field and a pending step read their roles", async ({
  mount,
}) => {
  const component = await mount(<EdgeRoles />);
  const edge = (locator: ReturnType<typeof component.locator>) =>
    locator.evaluate((element) => getComputedStyle(element).borderTopColor);
  expect(await edge(component.getByTestId("bare"))).toBe("rgb(199, 202, 209)");
  expect(await edge(component.getByLabel("Gate"))).toBe("rgb(116, 123, 139)");
  expect(await edge(component.getByText("3", { exact: true }))).toBe(
    "rgb(116, 123, 139)",
  );
});

// Every step is a 32 circle; the current step's ring is 2, a pending one's 1,
// as the plugin paints them. The current step's ring was 1 until 2026-09-22.
test("a step is a 32 circle, its ring 2 when current and 1 when pending", async ({
  mount,
}) => {
  const component = await mount(<EdgeRoles />);
  const current = component.getByText("1", { exact: true });
  const pending = component.getByText("3", { exact: true });
  await expect(current).toHaveCSS("width", "32px");
  await expect(current).toHaveCSS("height", "32px");
  await expect(current).toHaveCSS("border-top-width", "2px");
  await expect(pending).toHaveCSS("border-top-width", "1px");
});
