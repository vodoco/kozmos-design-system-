import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

// Explicit smoke coverage, not a claim to audit the whole library. Screenshot
// regressions run separately. Missing stories/interactions are failures.
const base = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
const cases = [
  ["components-select--default", '[role="combobox"]', '[role="listbox"]'],
  ["components-tabs--default", '[role="tablist"]', null],
  ["components-dialog--default", "button", '[role="dialog"]'],
  ["components-badge--outline", "text=Outline", null],
  ["components-button--default", "button", null],
] as const;

async function runAudit() {
  const response = await fetch(`${base}/index.json`);
  assert(response.ok, "Storybook index is unavailable");
  const { entries } = await response.json();
  const browser = await chromium.launch();
  let failures = 0;
  try {
    for (const [id, ready, popup] of cases) {
      const context = await browser.newContext();
      const page = await context.newPage();
      try {
        assert(entries[id], `Missing story: ${id}`);
        await page.goto(
          `${base}/iframe.html?id=${id}&viewMode=story&globals=a11y.manual:!true`,
          { waitUntil: "domcontentloaded" },
        );
        const control = page.locator("#storybook-root").locator(ready).first();
        await control.waitFor({ timeout: 60000 });
        if (popup) {
          await control.click();
          await page.locator(popup).waitFor();
        }
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        assert.deepEqual(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
          [],
        );
        console.log(`PASS ${id}`);
      } catch (error) {
        failures++;
        console.error(`FAIL ${id}:`, error);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  assert.equal(failures, 0, "Storybook accessibility smoke failures");
}

runAudit().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
