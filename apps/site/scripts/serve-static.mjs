#!/usr/bin/env node
/**
 * Serves build/client the way a static host does: a directory answers with
 * its index.html, and anything missing answers with /404.html and a 404
 * status. Vercel, Netlify and GitHub Pages all behave like this; `vite
 * preview` does not (it answers every miss with the home page), so the
 * end-to-end tests and `pnpm preview` use this instead.
 *
 *   node scripts/serve-static.mjs [port]   (default 5181)
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "build",
  "client",
);
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 5181);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function fileFor(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const candidate = path.normalize(path.join(ROOT, decoded));
  if (candidate !== ROOT && !candidate.startsWith(ROOT + path.sep)) {
    return null;
  }
  try {
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
    if (info.isDirectory()) {
      const index = path.join(candidate, "index.html");
      if ((await stat(index)).isFile()) return index;
    }
  } catch {
    // Not there: fall through to the 404 page.
  }
  return null;
}

const server = http.createServer(async (request, response) => {
  const found = await fileFor(request.url ?? "/");
  const file = found ?? path.join(ROOT, "404.html");
  response.writeHead(found ? 200 : 404, {
    "content-type":
      TYPES[path.extname(file)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(file).pipe(response);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Serving ${path.relative(process.cwd(), ROOT)} at http://127.0.0.1:${PORT}`);
});
