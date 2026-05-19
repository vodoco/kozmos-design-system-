import { test, expect } from "@playwright/experimental-ct-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../src/components/Tooltip";
import React from "react";

test.describe("Tooltip Behavioral CT", () => {
  test("content visible on hover, disappears on mouse leave", async ({
    mount,
    page,
  }) => {
    const component = await mount(
      <TooltipProvider
        delayDuration={0}
        skipDelayDuration={0}
        disableHoverableContent
      >
        <Tooltip>
          <TooltipTrigger>HoverMe</TooltipTrigger>
          <TooltipContent>Info text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    const trigger = component.locator("text=HoverMe");
    await trigger.hover();

    const content = page.locator('[role="tooltip"]');
    await expect(content).toBeVisible();

    const viewport = page.viewportSize() ?? { width: 1280, height: 720 };
    await page.mouse.move(viewport.width - 8, viewport.height - 8);
    await expect(content).not.toBeVisible();
  });
});
