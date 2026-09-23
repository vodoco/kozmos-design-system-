import assert from "node:assert/strict";
import test from "node:test";
import { launchFixtureBrowser } from "./built-react-fixture.mjs";

test("an explicit Firefox request actually launches Firefox", async () => {
  const previous = process.env.ADAPTIVE_BROWSER;
  process.env.ADAPTIVE_BROWSER = "firefox";
  let browser;
  try {
    browser = await launchFixtureBrowser();
    assert.equal(browser.browserType().name(), "firefox");
  } finally {
    await browser?.close();
    if (previous === undefined) delete process.env.ADAPTIVE_BROWSER;
    else process.env.ADAPTIVE_BROWSER = previous;
  }
});

test("an unknown browser name cannot silently run Chromium", async () => {
  const previous = process.env.ADAPTIVE_BROWSER;
  process.env.ADAPTIVE_BROWSER = "firfox";
  let browser;
  try {
    await assert.rejects(async () => {
      browser = await launchFixtureBrowser();
    }, /Unsupported ADAPTIVE_BROWSER/);
  } finally {
    await browser?.close();
    if (previous === undefined) delete process.env.ADAPTIVE_BROWSER;
    else process.env.ADAPTIVE_BROWSER = previous;
  }
});
