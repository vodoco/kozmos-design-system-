import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { launchFixtureBrowser } from "./lib/built-react-fixture.mjs";

const base = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
const browser = await launchFixtureBrowser();
const failures = [];
try {
  for (const theme of ["light", "dark"]) {
    for (const viewport of [
      { width: 320, height: 568 },
      { width: 568, height: 320 },
      { width: 1280, height: 800 },
    ]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const pageErrors = [];
      page.on("pageerror", (e) => pageErrors.push(e.message));
      async function visit(id) {
        await page.goto(
          `${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`,
        );
        await page.locator(".kozmos-story-surface > *").first().waitFor();
      }
      async function audit() {
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            document
              .getAnimations()
              .filter((a) => a.effect?.getTiming().iterations !== Infinity)
              .map((a) => a.finished.catch(() => {})),
          );
        });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          "page overflows horizontally",
        );
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        assert.deepEqual(
          violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.failureSummary),
          })),
          [],
        );
        assert.deepEqual(pageErrors, []);
      }
      try {
        for (const [id, selector] of [
          [
            "components-scrollarea--horizontal-quick-access",
            ".overflow-x-auto",
          ],
          ["data-display-metastrip--default", "[data-slot=meta-strip]"],
          ["data-display-table--default", ".overflow-auto"],
          ["product-sdk-poimediagallery--default", "ul"],
        ]) {
          await visit(id);
          const scroller = page
            .locator(`.kozmos-story-surface ${selector}`)
            .first();
          assert.equal(
            await scroller.getAttribute("tabindex"),
            "0",
            `${id}: keyboard entry point`,
          );
          await scroller.focus();
          assert(
            await scroller.evaluate((n) => n === document.activeElement),
            `${id}: focusable viewport`,
          );
          if (
            await scroller.evaluate((n) => n.scrollWidth > n.clientWidth + 1)
          ) {
            await page.keyboard.press("ArrowRight");
            await page.waitForFunction(
              (el) => el.scrollLeft > 0,
              await scroller.elementHandle(),
            );
          }
          await audit();
          console.log(`PASS keyboard scroll ${id} ${theme} ${viewport.width}`);
        }
        await visit("selection-segmentedcontrol--default");
        const segments = page.getByRole("radio");
        // Radix single-selection ToggleGroup uses radio semantics.
        await segments.first().focus();
        await page.keyboard.press("End");
        await page.waitForFunction(
          (n) => n === document.activeElement,
          await segments.last().elementHandle(),
        );
        assert(
          await segments.last().evaluate((n) => n === document.activeElement),
          "End reaches the final segment",
        );
        await page.waitForFunction(
          (n) => {
            const r = n.getBoundingClientRect();
            return r.left >= 0 && r.right <= innerWidth;
          },
          await segments.last().elementHandle(),
        );
        await audit();
        console.log(`PASS segmented keyboard ${theme} ${viewport.width}`);

        await visit("components-colorpicker--default");
        await page.getByRole("button", { name: "Show color picker" }).click();
        await page.getByRole("slider", { name: "Hue", exact: true }).waitFor();
        await audit();
        await page.getByRole("button", { name: "Hide color picker" }).click();
        assert.equal(
          await page.getByRole("textbox").first().getAttribute("aria-expanded"),
          null,
        );
        console.log(`PASS expanded ColorPicker ${theme} ${viewport.width}`);
        if (viewport.width === 1280) {
          await visit("components-button--emotions");
          const buttons = page.getByRole("button");
          assert.equal(await buttons.count(), 18);
          for (const button of await buttons.all()) {
            await button.hover();
            await audit();
          }
          console.log(`PASS all 18 emotion hover treatments ${theme}`);
        }
      } catch (error) {
        failures.push(
          `${theme} ${viewport.width}x${viewport.height}: ${error.stack}`,
        );
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
assert.deepEqual(failures, []);
console.log("Storybook interaction regressions passed");
