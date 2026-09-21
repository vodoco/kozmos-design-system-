import { test } from "@playwright/test";

/**
 * Full-page pictures of every page, light and dark, desktop and phone, for a
 * person to look at. Not assertions: run with SCREENSHOTS=1, Chromium only.
 *   SCREENSHOTS=1 pnpm test:e2e --project=chromium tests/screenshots.spec.ts
 */
const paths = [
  ["home", "/"],
  ["get-started", "/get-started"],
  ["examples", "/examples"],
  ["account-settings", "/examples/account-settings"],
  ["not-found", "/no-such-page"],
] as const;

const sizes = [
  ["desktop", { width: 1280, height: 800 }],
  ["phone", { width: 375, height: 812 }],
] as const;

test.skip(!process.env.SCREENSHOTS, "set SCREENSHOTS=1 to take the pictures");

for (const colorScheme of ["light", "dark"] as const) {
  for (const [sizeName, viewport] of sizes) {
    for (const [name, path] of paths) {
      test(`${name} ${colorScheme} ${sizeName}`, async ({
        page,
        browserName,
      }) => {
        test.skip(browserName !== "chromium", "pictures come from Chromium");
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme });
        await page.goto(path);
        await page.waitForFunction(() =>
          Boolean(document.documentElement.dataset.theme),
        );
        await page.waitForFunction(() =>
          document
            .getAnimations()
            .every((animation) => animation.playState !== "running"),
        );
        await page.screenshot({
          path: `screenshots/${name}-${colorScheme}-${sizeName}.png`,
          fullPage: true,
        });
      });
    }
  }
}
