/**
 * The search sheet's parts, measured in a real browser against the
 * Storybook build: the category grid aligns its cells at the top, so a
 * one-line label beside a two-line one keeps its square on the same edge;
 * the AI search button is laid out at 48 with its 66 ring outside, and the
 * ring's gradient turns in place unless motion is reduced.
 *
 *   STORYBOOK_URL=http://127.0.0.1:6012 node scripts/check-search-sheet.mjs
 *   ADAPTIVE_BROWSER=firefox|webkit for the other engines.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { launchFixtureBrowser } from "./lib/built-react-fixture.mjs";

const base = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
const engine = process.env.ADAPTIVE_BROWSER ?? "chromium";
const output = path.resolve("test-results/search-sheet", engine);
fs.mkdirSync(output, { recursive: true });

const results = [];
const browser = await launchFixtureBrowser();
const near = (actual, expected, tolerance, message) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} is not within ${tolerance} of ${expected}`);

try {
  const open = async (id, options = {}) => {
    const context = await browser.newContext({ viewport: { width: 402, height: 874 }, ...options });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story&globals=theme:light`);
    await page.waitForTimeout(500);
    return { context, page, errors };
  };
  const finish = async ({ context, page, errors }, name, checks) => {
    const record = { name, status: "pending" };
    try {
      await checks(page);
      assert.deepEqual(errors, [], `${name}: page errors`);
      record.status = "ok";
    } catch (error) {
      record.status = `FAIL ${error.message}`;
    } finally {
      await page.screenshot({ path: path.join(output, `${name}.png`) });
      await context.close();
    }
    results.push(record);
    console.log(`${record.status === "ok" ? "ok  " : "FAIL"} ${name}${record.status === "ok" ? "" : ` — ${record.status}`}`);
  };

  await finish(await open("product-sdk-browsecategoriespanel--default"), "tiles-share-a-top-edge", async (page) => {
    const tiles = page.locator(".kozmos-category-tile");
    await tiles.first().waitFor();
    const rows = await tiles.evaluateAll((nodes) =>
      nodes.slice(0, 4).map((node) => {
        const square = node.querySelector("span[aria-hidden]").getBoundingClientRect();
        const label = node.querySelectorAll(":scope > span")[1].getBoundingClientRect();
        return { squareTop: square.top, squareHeight: square.height, labelHeight: label.height, label: node.textContent.trim() };
      }),
    );
    assert.equal(rows.length, 4, "the first row has four tiles");
    const labelHeights = rows.map((r) => r.labelHeight);
    assert.ok(Math.max(...labelHeights) >= 26 && Math.min(...labelHeights) <= 16, `the row mixes one- and two-line labels: ${JSON.stringify(rows)}`);
    for (const row of rows) {
      near(row.squareHeight, 64, 1, `${row.label}: the square is not 64`);
      near(row.squareTop, rows[0].squareTop, 1, `${row.label}: its square is not on the first tile's top edge`);
    }
  });

  await finish(await open("product-sdk-aisearchbutton--default"), "ai-search-ring-turns", async (page) => {
    const button = page.getByRole("button", { name: "AI search" });
    await button.waitFor();
    const box = await button.boundingBox();
    near(box.width, 48, 1, "the button is not laid out at 48");
    near(box.height, 48, 1, "the button is not laid out at 48");
    // The layout size, not the client rect: a turning square's client rect
    // is its rotated bounds, up to 66 x root two.
    const ring = await page.locator(".kozmos-ai-search-ring").evaluate((node) => {
      const s = getComputedStyle(node);
      return { width: node.offsetWidth, height: node.offsetHeight, animationName: s.animationName, animationDuration: s.animationDuration, background: s.backgroundImage };
    });
    near(ring.width, 66, 1, "the ring is not 66");
    near(ring.height, 66, 1, "the ring is not 66");
    assert.equal(ring.animationName, "kozmos-ai-search-spin", `the ring does not turn: ${ring.animationName}`);
    assert.equal(ring.animationDuration, "3s", `the ring's turn is not three seconds: ${ring.animationDuration}`);
    assert.match(ring.background, /conic-gradient/, `the ring is not the conic gradient: ${ring.background}`);
    // It turns: the transform differs a moment later.
    const first = await page.locator(".kozmos-ai-search-ring").evaluate((node) => getComputedStyle(node).transform);
    await page.waitForTimeout(400);
    const later = await page.locator(".kozmos-ai-search-ring").evaluate((node) => getComputedStyle(node).transform);
    assert.notEqual(first, later, `the ring's transform did not change over 400 ms: ${first}`);
  });

  await finish(await open("product-sdk-aisearchbutton--default", { reducedMotion: "reduce" }), "ai-search-ring-rests-with-reduced-motion", async (page) => {
    await page.getByRole("button", { name: "AI search" }).waitFor();
    const animationName = await page.locator(".kozmos-ai-search-ring").evaluate((node) => getComputedStyle(node).animationName);
    assert.equal(animationName, "none", `the ring still turns with reduced motion: ${animationName}`);
  });
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(output, "results.json"), JSON.stringify(results, null, 2));
const failed = results.filter((r) => r.status !== "ok");
console.log(`${results.length - failed.length}/${results.length} search-sheet checks passed on ${engine}`);
if (failed.length) process.exit(1);
