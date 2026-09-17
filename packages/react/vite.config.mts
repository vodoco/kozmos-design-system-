import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

const dependencyExternals = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
  "react/jsx-runtime",
  "react-dom/client",
];

function toGlobalName(packageName: string) {
  const knownGlobals: Record<string, string> = {
    react: "React",
    "react-dom": "ReactDOM",
    "react-dom/client": "ReactDOMClient",
    "react/jsx-runtime": "ReactJsxRuntime",
    "@kozmos/tokens": "KozmosTokens",
  };

  return (
    knownGlobals[packageName] ??
    packageName
      .replace(/^@/, "")
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr: string) => chr.toUpperCase())
      .replace(/^[a-z]/, (chr) => chr.toUpperCase())
  );
}

export default defineConfig(async () => {
  let visualizerPlugin = null;
  if (process.env.ANALYZE) {
    const { visualizer } = await import("rollup-plugin-visualizer");
    visualizerPlugin = visualizer({ filename: "dist/stats.html", open: false });
  }

  return {
    plugins: [
      react(),
      {
        name: "kozmos-opt-in-reset",
        async generateBundle() {
          // A separate, deliberate host-page reset. The default CSS is scoped.
          this.emitFile({
            type: "asset",
            fileName: "reset.css",
            source: await readFile(
              require.resolve("tailwindcss/lib/css/preflight.css"),
              "utf8",
            ),
          });
        },
      },
      dts({
        insertTypesEntry: true,
        // The Code Connect files are type-checked (they are in tsconfig's
        // include since 2026-09-14) but they are not part of the package: each
        // one describes a Figma mapping, not an export. Without this the dts
        // plugin followed tsconfig and emitted 92 `*.figma.d.ts` files of
        // `export {}` into dist, which `files: ["dist"]` would then publish.
        exclude: ["src/**/*.figma.ts", "src/**/*.figma.tsx"],
      }),
      visualizerPlugin,
    ].filter(Boolean),
    css: {
      postcss: {
        plugins: [
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require("tailwindcss"),
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require("autoprefixer"),
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require("./postcss/scoped-css.cjs")(),
        ],
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "KozmosReact",
        fileName: (format: string) =>
          format === "es" ? "kozmos-react.mjs" : "kozmos-react.umd.cjs",
      },
      rollupOptions: {
        external: dependencyExternals,
        output: {
          banner: '"use client";',
          globals: Object.fromEntries(
            dependencyExternals.map((dep) => [dep, toGlobalName(dep)]),
          ),
        },
      },
    },
  };
});
