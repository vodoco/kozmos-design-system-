import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { launchFixtureBrowser } from "./lib/built-react-fixture.mjs";

const base = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
const response = await fetch(`${base}/index.json`);
assert(response.ok, "Storybook index is unavailable");
const entries = (await response.json()).entries;
const cases = [
  ["components-listbox--single", "listbox"],
  ["components-multiselect--default", "combobox"],
  ["components-combobox--default", "combobox"],
  ["components-fileupload--multiple", "button"],
  ["components-label--default", "label"],
  ["components-label--with-input", "textbox"],
];
const browser = await launchFixtureBrowser();
const failures = [];
try {
  for (const theme of ["light", "dark"])
    for (const viewport of [
      { width: 320, height: 568 },
      { width: 568, height: 320 },
      { width: 1280, height: 800 },
    ]) {
      for (const [id, role] of cases) {
        const name = `${id} ${theme} ${viewport.width}x${viewport.height}`;
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        const pageErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));
        try {
          assert(entries[id], `Story does not exist: ${id}`);
          // Disable only the addon's concurrent automatic invocation. This gate
          // runs its own axe audit with all WCAG A/AA rules below, in every state.
          await page.goto(
            `${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`,
            { waitUntil: "domcontentloaded" },
          );
          const control =
            role === "label"
              ? page.locator("#storybook-root label").first()
              : page.getByRole(role).first();
          await control.waitFor({ timeout: 60000 });
          assert.equal(
            await page
              .locator("#storybook-root [data-kozmos-root]")
              .first()
              .getAttribute("data-theme"),
            theme,
            "theme toolbar must control component tokens",
          );
          if (role === "combobox") {
            await control.click();
            await page.getByRole("listbox").waitFor();
          }
          if (role === "listbox") await page.getByRole("option").nth(1).hover();
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            true,
            "story must not overflow the viewport horizontally",
          );
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
            "WCAG violations",
          );
          if (id === "components-multiselect--default") {
            for (const option of await page.getByRole("option").all())
              await option.click();
            assert.equal(await page.locator('[data-slot="chip"]').count(), 4);
          }
          if (id === "components-fileupload--multiple") {
            await page
              .locator('input[type="file"]')
              .setInputFiles({
                name: `${"long-report-".repeat(15)}.txt`,
                mimeType: "text/plain",
                buffer: Buffer.from("test"),
              });
            await page.getByRole("list", { name: "Selected files" }).waitFor();
          }
          if (role === "combobox") {
            await control.fill("no matching result");
            await page.getByRole("status").filter({ hasText: "No" }).waitFor();
            assert.equal(await control.getAttribute("aria-expanded"), "false");
            assert.equal(await control.getAttribute("aria-controls"), null);
          }
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            true,
            "populated/empty-result state must not overflow",
          );
          const populated = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze();
          assert.deepEqual(
            populated.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
            [],
            "populated/empty-result accessibility",
          );
          assert.deepEqual(pageErrors, [], "Story runtime errors");
          console.log(`PASS ${name}`);
        } catch (error) {
          failures.push(name);
          console.error(`FAIL ${name}: ${error.message}`);
        } finally {
          await context.close();
        }
      }
    }
} finally {
  await browser.close();
}
assert.deepEqual(failures, [], "Storybook screenshot regression cases failed");
