/**
 * The navigation parts, measured in a real browser against the Storybook
 * build: the manoeuvre card closed and open, the itinerary, the rail, the
 * summary's navigation layout, and the Examples/Navigation composition on
 * the shell. Every claim the components make about geometry is checked as
 * a number, and every story is run through axe.
 *
 *   STORYBOOK_URL=http://127.0.0.1:6012 node scripts/check-navigation-examples.mjs
 *   ADAPTIVE_BROWSER=firefox|webkit for the other engines.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { launchFixtureBrowser } from "./lib/built-react-fixture.mjs";

const base = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
const engine = process.env.ADAPTIVE_BROWSER ?? "chromium";
const output = path.resolve("test-results/navigation-examples", engine);
fs.mkdirSync(output, { recursive: true });

const box = (locator) =>
  locator.evaluate((node) => {
    const r = node.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height, bottom: r.bottom, right: r.right };
  });

const results = [];
const browser = await launchFixtureBrowser();
try {
  for (const theme of ["light", "dark"]) {
    for (const viewport of [
      { width: 320, height: 568 },
      { width: 1280, height: 800 },
    ]) {
      const open = async (id) => {
        const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
        return { context, page, errors };
      };
      const finish = async ({ context, page, errors }, name, checks) => {
        const record = { name: `${name}-${theme}-${viewport.width}`, status: "pending", violations: [] };
        try {
          await checks(page);
          const axe = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze();
          record.violations = axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
          assert.deepEqual(record.violations, [], `${record.name}: axe violations`);
          assert.deepEqual(errors, [], `${record.name}: page errors`);
          record.status = "ok";
        } catch (error) {
          record.status = `FAIL ${error.message}`;
        } finally {
          await page.screenshot({ path: path.join(output, `${record.name}.png`), fullPage: true });
          await context.close();
        }
        results.push(record);
        console.log(`${record.status === "ok" ? "  ok   " : "  FAIL "} ${record.name}`);
      };

      // 1. The card, closed: one button that reads the manoeuvre; the grab bar silent.
      await finish(await open("map-manoeuvrecard--closed"), "card-closed", async (page) => {
        const card = page.getByRole("region", { name: "Current manoeuvre" });
        await card.waitFor({ timeout: 60000 });
        const manoeuvre = card.getByRole("button", { name: "Take Elevator down to First Floor, 58 m · Second Floor" });
        await manoeuvre.waitFor();
        assert.equal(await manoeuvre.getAttribute("aria-expanded"), "false");
        assert.equal(await card.getByRole("list").count(), 0, "the closed card shows its itinerary");
        const bar = card.locator('[aria-label="Show itinerary"]');
        assert.equal(await bar.getAttribute("aria-hidden"), "true", "the closed grab bar is not silent");
        const arrow = await box(manoeuvre.locator("svg"));
        const text = await box(manoeuvre.locator("span.line-clamp-2"));
        assert.ok(arrow.right <= text.x + 1, "the arrow is not before the instruction");
        // Opening: the itinerary appears, with exactly one current step, and
        // the card hugs it — no taller than its list plus the chrome.
        await manoeuvre.click();
        const itinerary = page.getByRole("region", { name: "Itinerary" });
        await itinerary.waitFor();
        const current = itinerary.locator('[aria-current="step"]');
        assert.equal(await current.count(), 1, "steps reading as current");
        assert.equal(await current.textContent(), "Take Elevator down to First Floor");
        const list = await box(itinerary.getByRole("list"));
        // Open, the card has no name of its own; the itinerary inside is the named region.
        assert.equal(await page.getByRole("region", { name: "Current manoeuvre" }).count(), 0, "the open card keeps its closed name");
        const cardBox = await box(page.locator(".kozmos-manoeuvre-card"));
        assert.ok(cardBox.height - list.height < 60, `the open card does not hug its itinerary: card ${cardBox.height}, list ${list.height}`);
        const bar2 = page.getByRole("button", { name: "Hide itinerary" });
        assert.equal(await bar2.getAttribute("aria-expanded"), "true");
        await bar2.click();
        await manoeuvre.waitFor();
      });

      // 2. The card, open with a long instruction story as the cap check is
      //    not reachable from a story: the Open story's list is short. The cap
      //    is asserted through the style the component sets.
      await finish(await open("map-manoeuvrecard--open"), "card-open", async (page) => {
        const itinerary = page.getByRole("region", { name: "Itinerary" });
        await itinerary.waitFor({ timeout: 60000 });
        // The scroller holds the itinerary, not the other way round.
        const scroller = page.locator(".kozmos-manoeuvre-itinerary");
        assert.equal(await scroller.evaluate((n) => n.style.maxHeight), "320px", "the itinerary is not capped");
        assert.equal(await scroller.evaluate((n) => getComputedStyle(n).overflowY), "auto", "the itinerary cannot scroll past the cap");
      });

      // 3. The rail: the disc's centre at the track's middle at 0.5.
      await finish(await open("map-routeprogressrail--midway"), "rail-midway", async (page) => {
        const rail = page.getByRole("progressbar", { name: "Step 2 of 4" });
        await rail.waitFor({ timeout: 60000 });
        assert.equal(await rail.getAttribute("aria-valuenow"), "50");
        const railBox = await box(rail);
        const disc = await box(rail.locator('[data-testid="route-progress-disc"]'));
        assert.equal(Math.round(disc.width), 34, "the disc is not 34 wide");
        const expected = railBox.x + 10 + (railBox.width - 54) * 0.5;
        assert.ok(Math.abs(disc.x - expected) <= 1, `the disc is at ${disc.x}, not ${expected}`);
        assert.ok(Math.abs(disc.y + disc.height / 2 - (railBox.y + railBox.height / 2)) <= 1, "the disc is not centred on the rail");
      });

      // 4. The summary's navigation layout: End on the heading's row, the
      //    stats on one row under it, the rail under those.
      await finish(await open("map-routesummary--navigation"), "summary-navigation", async (page) => {
        const heading = page.getByRole("heading", { name: "Airport Shuttles" });
        await heading.waitFor({ timeout: 60000 });
        const end = page.getByRole("button", { name: "End" });
        const h = await box(heading);
        const e = await box(end);
        assert.ok(e.y + e.height / 2 > h.y && e.y + e.height / 2 < h.bottom, "End is not on the heading's row");
        assert.ok(e.x >= h.right, "End is not beside the heading");
        const duration = await box(page.getByText("4 min"));
        const arrival = await box(page.getByText("Arrive 12:58"));
        assert.ok(Math.abs(duration.y - arrival.y) <= 1, "the stats are not on one row");
        assert.ok(duration.y >= h.bottom, "the stats are not under the heading");
        assert.ok(arrival.right > duration.right + 100, "the arrival is not at the row's far end");
        const rail = await box(page.getByRole("progressbar"));
        assert.ok(rail.y >= duration.bottom, "the rail is not under the stats");
      });

      // 5. The composition on the shell: the card in the top slot, the sheet
      //    with the summary; stepping moves the rail and the current step.
      await finish(await open("examples-navigation--directions"), "directions", async (page) => {
        await page.getByRole("region", { name: "Current manoeuvre" }).waitFor({ timeout: 60000 });
        const card = page.locator(".kozmos-manoeuvre-card");
        const rail = page.getByRole("progressbar");
        const before = await rail.getAttribute("aria-valuenow");
        await page.getByRole("button", { name: "Next step" }).click();
        const after = await rail.getAttribute("aria-valuenow");
        assert.ok(Number(after) > Number(before), `the rail did not advance: ${before} → ${after}`);
        await card.getByRole("button").first().click();
        const current = page.getByRole("region", { name: "Itinerary" }).locator('[aria-current="step"]');
        assert.equal(await current.count(), 1);
        assert.equal(await current.textContent(), "Take Corridor to Garage B", "the second step is not current after Next");
        // The sheet is fitted to its content — the summary and the buttons —
        // and on the glass surface; the map has the rest.
        const sheet = page.getByRole("complementary", { name: "Directions" });
        const sheetBox = await box(sheet);
        const contentHeight = await sheet.locator("> div").first().evaluate((node) => node.scrollHeight);
        assert.ok(Math.abs(sheetBox.height - contentHeight) <= 2, `the sheet (${sheetBox.height}) is not fitted to its content (${contentHeight})`);
        assert.ok(sheetBox.height < viewport.height * 0.5, `the fitted sheet takes ${sheetBox.height} of ${viewport.height}`);
        assert.ok(await sheet.evaluate((node) => node.classList.contains("kozmos-surface-glass")), "the sheet is not on the glass surface");
      });
    }
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(output, "results.json"), JSON.stringify(results, null, 2));
const failed = results.filter((r) => r.status !== "ok");
console.log(`${results.length - failed.length} of ${results.length} navigation checks passed on ${engine}`);
if (failed.length) process.exit(1);
