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
