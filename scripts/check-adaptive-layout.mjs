// Exercise the distributed component and CSS in a real browser. No source alias.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { chromium, webkit } from "playwright";

const root = process.cwd();
const packageDir = path.join(root, "packages/react");
const require = createRequire(path.join(packageDir, "package.json"));
const { build } = await import(
  pathToFileURL(
    require.resolve("vite").replace(/index\.cjs$/, "dist/node/index.js"),
  ).href
);
const result = await build({
  configFile: false,
  root: packageDir,
  logLevel: "error",
  esbuild: { jsx: "automatic" },
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    write: false,
    minify: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code !== "MODULE_LEVEL_DIRECTIVE") warn(warning);
      },
    },
    lib: {
      entry: path.join(packageDir, "tests/integration/adaptive-host.tsx"),
      formats: ["iife"],
      name: "AdaptiveHost",
    },
  },
});
const code = (Array.isArray(result) ? result[0] : result).output.find(
  (output) => output.type === "chunk",
).code;
const css = fs.readFileSync(path.join(packageDir, "dist/style.css"), "utf8");
const browserType =
  process.env.ADAPTIVE_BROWSER === "webkit" ? webkit : chromium;
const browser = await browserType.launch({
  channel: process.env.ADAPTIVE_BROWSER === "chrome" ? "chrome" : undefined,
});
let failures = 0;
try {
  for (const scenario of [
    {
      name: "narrow container on a wide page",
      viewport: { width: 1440, height: 900 },
      width: 360,
      height: 600,
      direction: "ltr",
    },
    {
      name: "short landscape",
      viewport: { width: 844, height: 390 },
      width: 844,
      height: 390,
      direction: "ltr",
    },
    {
      name: "logical end in RTL",
      viewport: { width: 1024, height: 768 },
      width: 1024,
      height: 768,
      direction: "rtl",
    },
    {
      name: "vertical hinge",
      viewport: { width: 800, height: 700 },
      width: 800,
      height: 700,
      direction: "ltr",
      options: {
        usableRegions: [
          { x: 0, y: 0, width: 390, height: 700 },
          { x: 410, y: 0, width: 390, height: 700 },
        ],
      },
      separated: true,
    },
    {
      name: "RTL vertical hinge",
      viewport: { width: 800, height: 700 },
      width: 800,
      height: 700,
      direction: "rtl",
      options: {
        usableRegions: [
          { x: 0, y: 0, width: 390, height: 700 },
          { x: 410, y: 0, width: 390, height: 700 },
        ],
      },
      separated: true,
    },
    {
      name: "tabletop",
      viewport: { width: 700, height: 720 },
      width: 700,
      height: 720,
      direction: "ltr",
      options: {
        usableRegions: [
          { x: 0, y: 0, width: 700, height: 300 },
          { x: 0, y: 320, width: 700, height: 400 },
        ],
      },
      separated: true,
    },
    {
      name: "keyboard exclusion",
      viewport: { width: 390, height: 600 },
      width: 390,
      height: 600,
      direction: "ltr",
      options: { safeAreaInsets: { bottom: 200 } },
    },
    {
      name: "short host on a wide page",
      viewport: { width: 1440, height: 900 },
      width: 844,
      height: 200,
      direction: "ltr",
    },
  ]) {
    const page = await browser.newPage({ viewport: scenario.viewport });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      await page.setContent(
        `<html dir="${scenario.direction}"><head><style>${css}</style></head><body><div id="fixture" style="width:${scenario.width}px;height:${scenario.height}px"></div></body></html>`,
      );
      await page.addScriptTag({
        content: `window.adaptiveOptions = ${JSON.stringify(scenario.options ?? {})};`,
      });
      await page.addScriptTag({ content: code });
      await page.locator("aside").waitFor();
      // Give ResizeObserver and React their frames before checking geometry.
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      const host = await page.locator("#fixture").boundingBox();
      const shell = await page.locator("[data-map-status]").boundingBox();
      const panel = await page.locator("aside").boundingBox();
      assert(
        shell.height <= host.height + 1,
        `shell ${shell.height} exceeds host ${host.height}`,
      );
      assert(
        panel.x >= host.x - 1 &&
          panel.x + panel.width <= host.x + host.width + 1,
        `panel ${JSON.stringify(panel)} exceeds host ${JSON.stringify(host)}`,
      );
      assert(
        panel.y >= host.y - 1 &&
          panel.y + panel.height <= host.y + host.height + 1,
        "panel exceeds available height",
      );
      if (scenario.direction === "rtl")
        assert(
          panel.x < host.x + host.width / 2,
          "end panel must be on the physical left in RTL",
        );
      await page.waitForFunction(
        () => window.adaptiveSnapshot?.mapBounds.width > 0,
        undefined,
        { timeout: 1500 },
      );
      const layout = await page.evaluate(() => window.adaptiveSnapshot);
      const map = await page
        .getByRole("region", { name: "Map", exact: true })
        .boundingBox();
      for (const key of ["width", "height"])
        assert(
          Math.abs(map[key] - layout.mapBounds[key]) < 1,
          `reported map ${key} differs from the renderer slot`,
        );
      assert(
        Math.abs(map.x - host.x - layout.mapBounds.x) < 1 &&
          Math.abs(map.y - host.y - layout.mapBounds.y) < 1,
        "reported map position differs from rendered bounds",
      );
      if (scenario.separated) {
        assert.equal(layout.presentation, "separated");
        assert.deepEqual(
          layout.mapBounds,
          scenario.options.usableRegions[scenario.direction === "rtl" ? 1 : 0],
        );
        assert.deepEqual(
          layout.panelBounds,
          scenario.options.usableRegions[scenario.direction === "rtl" ? 0 : 1],
        );
        assert.equal(
          layout.collisionInsets.bottom,
          0,
          "separated panel must not pad the map",
        );
      } else {
        const edge =
          layout.presentation === "bottom"
            ? "bottom"
            : scenario.direction === "rtl"
              ? "left"
              : "right";
        const expected =
          edge === "bottom"
            ? layout.mapBounds.height -
              layout.panelBounds.y +
              layout.mapBounds.y
            : edge === "right"
              ? layout.mapBounds.width -
                layout.panelBounds.x +
                layout.mapBounds.x
              : layout.panelBounds.x +
                layout.panelBounds.width -
                layout.mapBounds.x;
        assert(
          Math.abs(layout.collisionInsets[edge] - expected) < 1,
          "camera padding must include measured panel coverage",
        );
      }
      const bottomExclusion = scenario.options?.safeAreaInsets?.bottom ?? 0;
      assert(
        panel.y + panel.height <= host.y + host.height - bottomExclusion + 1,
        "panel intersects keyboard exclusion",
      );
      const topBar = await page
        .getByRole("button", { name: "Search this floor" })
        .boundingBox();
      const controls = await page
        .getByRole("button", { name: "Focus map" })
        .boundingBox();
      assert(
        controls.y >= topBar.y + topBar.height - 1,
        "controls overlap top bar",
      );
      assert(
        controls.y + controls.height <= panel.y + 1 ||
          controls.x + controls.width <= panel.x + 1 ||
          controls.x >= panel.x + panel.width - 1,
        "controls overlap panel",
      );
      assert(
        layout.collisionInsets.top >= topBar.y + topBar.height - map.y - 1,
        "top bar must contribute camera padding",
      );
      if (process.env.ADAPTIVE_SCREENSHOTS) {
        fs.mkdirSync(process.env.ADAPTIVE_SCREENSHOTS, { recursive: true });
        await page.screenshot({
          path: path.join(
            process.env.ADAPTIVE_SCREENSHOTS,
            `${scenario.name.replaceAll(" ", "-")}.png`,
          ),
        });
      }
      // Exercise the POI's internal state across presentations.
      await page
        .getByRole("button", { name: "Favourite", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("button", { name: "Favourite", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      await page.getByRole("textbox", { name: "Search places" }).fill("Museum");
      // Host adapters supply fresh local regions when the window/hinge moves.
      await page.evaluate(() => window.setAdaptiveOptions({}));
      await page.locator("#fixture").evaluate((element) => {
        element.style.width = "340px";
        element.style.height = "320px";
      });
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      assert.equal(
        await page.getByRole("textbox", { name: "Search places" }).inputValue(),
        "Museum",
        "resizing must preserve panel state",
      );
      assert.equal(
        await page
          .getByRole("textbox", { name: "Search places" })
          .evaluate((element) => element === document.activeElement),
        true,
        "resizing must preserve focus",
      );
      assert.equal(
        await page
          .getByRole("button", { name: "Favourite", exact: true })
          .getAttribute("aria-pressed"),
        "true",
        "resizing must preserve POI state",
      );
      assert.deepEqual(
        await page.evaluate(() => [window.mapMounts, window.panelMounts]),
        [1, 1],
        "resizing must not remount the renderer or panel",
      );
      const resized = await page.locator("aside").boundingBox();
      const resizedHost = await page.locator("#fixture").boundingBox();
      assert(
        resized.x >= resizedHost.x - 1 &&
          resized.x + resized.width <= resizedHost.x + 341 &&
          resized.y + resized.height <= resizedHost.y + 321,
        "resized panel exceeds host",
      );
      const notifications = await page.evaluate(
        () => window.adaptiveNotifications,
      );
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      assert.equal(
        await page.evaluate(() => window.adaptiveNotifications),
        notifications,
        "stable geometry must not cause a notification loop",
      );
      // A host locale switch must resolve direction without a window resize.
      await page.locator("#fixture").evaluate((element) => {
        element.style.width = "1024px";
        element.style.height = "600px";
      });
      await page.evaluate(() => (document.documentElement.dir = "rtl"));
      await page.waitForFunction(
        () =>
          window.adaptiveSnapshot?.presentation === "side" &&
          window.adaptiveSnapshot?.panelBounds?.x === 16,
      );
      await page.evaluate(() => (document.documentElement.dir = "ltr"));
      await page.waitForFunction(
        () => window.adaptiveSnapshot?.panelBounds?.x === 592,
      );
      await page.evaluate(() =>
        window.setAdaptiveOptions({ usableRegions: [] }),
      );
      await page.waitForFunction(
        () => window.adaptiveSnapshot?.mapBounds.width === 0,
      );
      assert(
        await page.locator("aside").isHidden(),
        "no usable region must remove panel content from interaction",
      );
      assert.equal(
        await page.getByRole("textbox", { name: "Search places" }).count(),
        0,
        "clipped content must not remain in the accessibility tree",
      );
      await page.evaluate(() => window.setAdaptiveOptions({}));
      await page.waitForFunction(
        () => window.adaptiveSnapshot?.mapBounds.width === 1024,
      );
      assert.deepEqual(
        await page.evaluate(() => [window.mapMounts, window.panelMounts]),
        [1, 1],
        "empty-to-usable regions must preserve component instances",
      );
      assert.deepEqual(errors, [], "browser runtime errors");
      console.log(`PASS ${scenario.name}`);
    } catch (error) {
      failures++;
      console.error(`FAIL ${scenario.name}: ${error.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
process.exitCode = failures ? 1 : 0;
