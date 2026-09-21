import { copyFile } from "node:fs/promises";
import path from "node:path";
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  // A static site: every route is rendered to HTML at build time and hydrated
  // in the browser. Nothing runs on a server after the build.
  ssr: false,
  async prerender({ getStaticPaths }) {
    // "/404" matches the catch-all route, so the not-found page is drawn at
    // build time like every other page.
    return [...getStaticPaths(), "/404"];
  },
  // Static hosts answer an unknown address with /404.html and a 404 status.
  async buildEnd({ reactRouterConfig }) {
    const client = path.join(reactRouterConfig.buildDirectory, "client");
    await copyFile(
      path.join(client, "404", "index.html"),
      path.join(client, "404.html"),
    );
  },
  // React Router 8 turns these on; opting in now keeps the upgrade small.
  // Version 8 itself needs Node 22, and CI runs Node 20 (README.md).
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
