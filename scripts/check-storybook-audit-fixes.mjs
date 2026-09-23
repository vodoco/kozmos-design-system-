import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { launchFixtureBrowser } from "./lib/built-react-fixture.mjs";

const base = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
const browser = await launchFixtureBrowser();
const ids = [
  "navigation-navbar--contextual",
  "navigation-navbar--narrow-container",
  "components-poicard--inside-map-overlay",
  "feedback-skeleton--default",
  "examples-map-based-search--default",
  "platform-dynamicisland--minimal",
  "components-userlocationmarker--default",
];
let checks = 0;
try {
  for (const theme of ["light", "dark"]) {
    for (const viewport of [
      { width: 320, height: 568 },
      { width: 568, height: 320 },
      { width: 1280, height: 800 },
    ]) {
      const context = await browser.newContext({
        viewport,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const id of ids) {
        await page.goto(
          `${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`,
        );
        const root = page.locator("#storybook-root .kozmos-story-surface");
        await root.waitFor();
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          true,
          `${id}: viewport overflow`,
        );
        if (id.startsWith("navigation-navbar")) {
          const navbar = page.locator('[data-slot="navbar"]');
          const controls = [
            page.getByRole("button", { name: /Workspace/ }),
            page.getByRole("button", { name: "Publish", exact: true }),
            page.getByRole("link", { name: "Overview" }),
            page.getByRole("link", { name: "Explore" }),
            page.getByRole("link", { name: "Settings" }),
            page.getByRole("button", { name: "Notifications" }),
            page.getByRole("button", { name: "Account menu" }),
          ];
          for (const control of controls) {
            assert(
              await control.isVisible(),
              `${id}: hidden essential control`,
            );
            await control.click({ trial: true });
            const box = await control.boundingBox();
            const bounds = await navbar.boundingBox();
            assert(
              box &&
                bounds &&
                box.x >= bounds.x - 1 &&
                box.x + box.width <= bounds.x + bounds.width + 1,
              `${id}: clipped essential control`,
            );
          }
          await controls[0].focus();
          for (const control of controls.slice(1)) {
            // WebKit's default macOS preference skips links with plain Tab;
            // Option-Tab traverses every interactive control without changing it.
            await page.keyboard.press(
              browser.browserType().name() === "webkit" ? "Alt+Tab" : "Tab",
            );
            assert(
              await control.evaluate((e) => e === document.activeElement),
              `${id}: essential control missing from keyboard sequence`,
            );
          }
        } else if (id.includes("poicard")) {
          const cards = await page.getByRole("article").all();
          assert.equal(cards.length, 2);
          const a = await cards[0].boundingBox();
          const b = await cards[1].boundingBox();
          assert(a && b && b.y >= a.y + a.height - 1, "POI cards overlap");
          for (const card of cards)
            for (const button of await card.getByRole("button").all()) {
              await button.scrollIntoViewIfNeeded();
              await button.click({ trial: true });
            }
        } else if (id.includes("skeleton")) {
          const avatar = root.locator(".rounded-pill");
          const box = await avatar.boundingBox();
          assert(
            box && box.width === 48 && box.height === 48,
            "Skeleton avatar must stay circular, 48px square",
          );
        } else if (id.includes("map-based")) {
          const map = page.getByRole("region", {
            name: "Illustrative coffee shop map",
          });
          const box = await map.boundingBox();
          assert(
            box && box.width > 200 && box.height >= 250,
            "Map example is collapsed",
          );
          await page.getByRole("button", { name: "Select Bean There" }).click();
          assert.equal(
            await page
              .getByRole("button", { name: "Select Bean There" })
              .getAttribute("aria-pressed"),
            "true",
          );
          await page.getByRole("searchbox").fill("Espresso");
          assert.equal(await page.getByRole("article").count(), 1);
          await page
            .getByRole("button", { name: "Open now", exact: true })
            .click();
          assert.equal(await page.getByRole("article").count(), 0);
          await page
            .getByText("No coffee shops match.", { exact: false })
            .waitFor();
          await page.getByRole("button", { name: "Clear search" }).click();
          assert.equal(await page.getByRole("article").count(), 2);
          await page
            .getByRole("button", { name: "Navigate", exact: true })
            .first()
            .click();
          await page
            .getByText("Demo route requested for Bean There.", { exact: false })
            .waitFor();
        } else if (id.includes("userlocationmarker")) {
          await page.getByRole("img", { name: "User location" }).waitFor();
          assert.equal(
            await page
              .locator(".animate-ping")
              .evaluate((el) => getComputedStyle(el).animationName),
            "none",
            "Marker must honour reduced motion",
          );
          await page
            .getByRole("button", { name: "Rotate simulated heading" })
            .click();
          await page
            .getByText("Simulated heading: 90°", { exact: true })
            .waitFor();
        } else {
          await page
            .getByRole("img", { name: "Navigation in progress (demo)" })
            .waitFor();
        }
        // Assert settled UI, not an intermediate colour during a CSS transition.
        // Infinite loading indicators intentionally do not block this condition.
        await page.waitForFunction(() =>
          document
            .getAnimations()
            .every(
              (animation) =>
                animation.playState !== "running" ||
                animation.effect?.getComputedTiming().iterations === Infinity,
            ),
        );
        const result = await new AxeBuilder({ page })
          .include("#storybook-root")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        assert.deepEqual(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
          `${id} ${theme} ${viewport.width}: axe violations`,
        );
        checks++;
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  }
  console.log(
    `${checks} responsive audit scenarios passed: visible content, actions, keyboard order, hit targets, geometry and axe.`,
  );
} finally {
  await browser.close();
}
