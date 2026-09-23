/** Offline, signed-out smoke of the built installed-package product.
 * Never imports product source or authenticates to Pointr services.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import AxeBuilder from "@axe-core/playwright";
import { launchFixtureBrowser } from "./lib/built-react-fixture.mjs";

assert(
  process.argv[2],
  "Provide the retained directory from product:consumer:check",
);
const work = fs.realpathSync(process.argv[2]);
const result = JSON.parse(
  fs.readFileSync(path.join(work, "result.json"), "utf8"),
);
assert.equal(result.status, "build-verified");
const dist = fs.realpathSync(path.join(work, "app/dist"));
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
};
const server = createServer((req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    const file = path.resolve(
      dist,
      `.${pathname === "/" ? "/index.html" : pathname}`,
    );
    if (!file.startsWith(`${dist}${path.sep}`) || !fs.statSync(file).isFile())
      throw new Error("Not found");
    res.setHeader(
      "Content-Type",
      mime[path.extname(file)] ?? "application/octet-stream",
    );
    res.end(fs.readFileSync(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const report = {
  scope: "signed-out, offline product shell only",
  status: "running",
  scenarios: [],
  blockedExternalRequests: [],
};
try {
  browser = await launchFixtureBrowser();
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 568, height: 320 },
    { width: 1280, height: 800 },
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
      serviceWorkers: "block",
    });
    // No real SDK, font, telemetry, authentication or API requests leave the test.
    await context.route("**/*", (route) => {
      if (new URL(route.request().url()).origin === origin)
        return route.continue();
      report.blockedExternalRequests.push(
        new URL(route.request().url()).origin,
      );
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(origin);
    const email = page.getByRole("textbox", { name: "Email", exact: true });
    const password = page.getByLabel("Password", { exact: true });
    const submit = page.getByRole("button", { name: "Sign in", exact: true });
    await email.waitFor();
    await page.evaluate(() => document.fonts.ready);
    const typography = await page.evaluate(() => {
      const size = (selector) =>
        parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
      return {
        headline: size(".ms-login-title"),
        title: size(".ms-login-card-title"),
        privacy: size(".ms-login-privacy"),
      };
    });
    assert(
      typography.headline >= 38,
      "Design-system reset overrides product headline typography",
    );
    assert.equal(
      typography.title,
      26,
      "Design-system Text overrides product title typography",
    );
    assert.equal(
      typography.privacy,
      11.5,
      "Design-system Text overrides product small print",
    );
    const headline = page.locator(".ms-login-title");
    await headline.scrollIntoViewIfNeeded();
    assert(
      await headline.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      "Product headline is clipped",
    );
    await page.screenshot({
      path: path.join(
        work,
        `signed-out-${browser.browserType().name()}-${viewport.width}-top.png`,
      ),
      fullPage: true,
    });
    for (const control of [email, password, submit]) {
      assert(await control.isVisible(), "Login control is not visible");
      await control.scrollIntoViewIfNeeded();
      const bounds = await control.boundingBox();
      assert(
        bounds &&
          bounds.x >= 0 &&
          bounds.x + bounds.width <= viewport.width + 1,
        "Login control clipped horizontally",
      );
    }
    await email.focus();
    await page.keyboard.press("Tab");
    assert(
      await password.evaluate((el) => el === document.activeElement),
      "Password is not next in keyboard order",
    );
    // Unconfigured offline builds deliberately disable submission.
    if (await submit.isEnabled()) {
      await page.keyboard.press("Tab");
      assert(
        await submit.evaluate((el) => el === document.activeElement),
        "Submit missing from keyboard order",
      );
    }
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      "Product page overflows horizontally",
    );
    assert.deepEqual(errors, [], "Uncaught product runtime error");
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const screenshot = path.join(
      work,
      `signed-out-${browser.browserType().name()}-${viewport.width}.png`,
    );
    await page.screenshot({ path: screenshot, fullPage: true });
    report.scenarios.push({
      viewport,
      screenshot,
      violations: axe.violations,
      incomplete: axe.incomplete.map((item) => ({
        id: item.id,
        nodes: item.nodes.length,
      })),
    });
    await context.close();
  }
  const violations = report.scenarios.flatMap((s) =>
    s.violations.map((v) => `${s.viewport.width}px: ${v.id}`),
  );
  assert.deepEqual(violations, [], "Product accessibility violations");
  console.log(
    `PASS: three offline signed-out layouts, keyboard order and axe (${browser.browserType().name()}). No authenticated or routing acceptance claimed.`,
  );
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = String(error);
  throw error;
} finally {
  report.blockedExternalRequests = [...new Set(report.blockedExternalRequests)];
  fs.writeFileSync(
    path.join(
      work,
      `browser-${process.env.ADAPTIVE_BROWSER ?? "chromium"}.json`,
    ),
    JSON.stringify(report, null, 2),
  );
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
