import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { chromium, webkit } from "playwright";

/** Bundle built public package entry points, never a React source alias. */
export async function buildReactFixture(entry) {
  const packageDir = path.join(process.cwd(), "packages/react");
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
        entry: path.join(packageDir, "tests/integration", entry),
        formats: ["iife"],
        name: "KozmosFixture",
      },
    },
  });
  return {
    code: (Array.isArray(result) ? result[0] : result).output.find(
      (output) => output.type === "chunk",
    ).code,
    css: fs.readFileSync(path.join(packageDir, "dist/style.css"), "utf8"),
  };
}

export function launchFixtureBrowser() {
  const browserType =
    process.env.ADAPTIVE_BROWSER === "webkit" ? webkit : chromium;
  return browserType.launch({
    channel: process.env.ADAPTIVE_BROWSER === "chrome" ? "chrome" : undefined,
  });
}

export async function settleLayout(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
      ),
  );
}
