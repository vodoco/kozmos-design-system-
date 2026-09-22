/**
 * Generate owned React components from the Pointr Icon Library's own artwork.
 *
 * `@kozmos-ds/icons` maps its names onto lucide components, which draw the same
 * concept in a different hand. That was recorded as "renders different artwork
 * from Figma ... resolve before extending" (`docs/ds-handoff.md` §4.4), and the
 * POI detail card made it concrete: 14 of its 19 glyphs had no Kozmos name at
 * all. The icons added from here carry Pointr's real outlines instead.
 *
 * Both libraries draw on a 24×24 grid at stroke 2 with round caps, measured
 * 2026-09-14, so an owned icon and a lucide icon are interchangeable in a row.
 *
 * The node ids come from `docs/figma-pointr-icon-catalog.json`. Note that
 * `figma:icons`, which regenerates that catalog, needs `library_content:read`
 * and the current token does not carry it — but `/v1/images`, which this script
 * uses, works on `file_content:read`.
 *
 * Usage: FIGMA_ACCESS_TOKEN=... node scripts/build-pointr-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const FILE_KEY = "PpbQbvpNTMvwqCx9dD4efJ";
const CATALOG = path.join(ROOT_DIR, "docs/figma-pointr-icon-catalog.json");
const OUTPUT = path.join(
  ROOT_DIR,
  "packages/icons/src/pointr/icons.generated.ts",
);

/**
 * The icons owned so far, and why each is here: every one was drawn by the
 * SDK's POI detail card (`HbFSXhCPxKUy2fWa5x9TKO`, node `241:4772`) and had no
 * Kozmos equivalent. Adding a name here and re-running is the whole process.
 */
const OWNED = [
  "heart",
  "bookmark",
  "loading-01",
  "eye",
  "share-01",
  "calendar-check-01",
  "shopping-bag-02",
  "layout-alt-02",
  "phone",
  "globe-02",
  "mail-01",
  "clock-plus",
  "feather",
];

function findDotEnv(startDir) {
  let current = startDir;
  for (;;) {
    const candidate = path.join(current, ".env");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function parseDotEnv(filePath) {
  const values = {};
  if (!filePath) return values;
  for (const line of fs.readFileSync(filePath, "utf-8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    values[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
  return values;
}

function pascalCase(name) {
  return name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Pull the outlines out of an exported SVG.
 *
 * Stroke attributes are dropped deliberately: the wrapper sets them once, so an
 * icon inherits `currentColor` and whatever `strokeWidth` the caller asked for
 * instead of freezing the black and the 2 that Figma exported. Anything else —
 * a fill, a shape that is not a path — is refused rather than silently lost.
 */
function extractPaths(svg, name) {
  const elements = [...svg.matchAll(/<(\w+)([^>]*)\/>/g)];
  const paths = [];

  for (const [, tag, attrText] of elements) {
    if (tag !== "path") {
      throw new Error(
        `${name}: <${tag}> is not a path; this generator only understands paths`,
      );
    }
    const attrs = {};
    for (const [, key, value] of attrText.matchAll(/([\w-]+)="([^"]*)"/g)) {
      attrs[key] = value;
    }
    const fill = attrs.fill;
    if (fill && fill !== "none") {
      throw new Error(
        `${name}: path carries fill="${fill}"; the wrapper draws strokes, not fills`,
      );
    }
    paths.push({
      d: attrs.d,
      ...(attrs["fill-rule"] ? { fillRule: attrs["fill-rule"] } : {}),
      ...(attrs["clip-rule"] ? { clipRule: attrs["clip-rule"] } : {}),
    });
  }

  if (!paths.length) throw new Error(`${name}: no paths found`);
  return paths;
}

async function figma(pathname, token) {
  const response = await fetch(`https://api.figma.com/v1${pathname}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!response.ok) {
    throw new Error(
      `Figma API ${response.status} for ${pathname}: ${(await response.text()).slice(0, 200)}`,
    );
  }
  return response.json();
}

const env = { ...parseDotEnv(findDotEnv(ROOT_DIR)), ...process.env };
const token = env.FIGMA_ACCESS_TOKEN;
if (!token) {
  console.error(
    "Missing FIGMA_ACCESS_TOKEN. Add it to .env or pass it in the environment.",
  );
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf-8"));
const byName = new Map(catalog.icons.map((icon) => [icon.name, icon]));

const picked = OWNED.map((name) => {
  const icon = byName.get(name);
  if (!icon)
    throw new Error(`${name} is not in ${path.relative(ROOT_DIR, CATALOG)}`);
  return { name, ...icon };
});

const { images } = await figma(
  `/images/${FILE_KEY}?ids=${encodeURIComponent(picked.map((p) => p.nodeId).join(","))}&format=svg`,
  token,
);

const generated = [];
for (const icon of picked) {
  const url = images[icon.nodeId];
  if (!url)
    throw new Error(`${icon.name}: Figma returned no image for ${icon.nodeId}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${icon.name}: could not download ${url}`);
  const paths = extractPaths(await response.text(), icon.name);
  generated.push({ ...icon, paths });
  console.log(
    `  ${icon.name.padEnd(20)} ${icon.nodeId.padEnd(12)} ${paths.length} path(s)`,
  );
}

const body = generated
  .map((icon) => {
    const paths = icon.paths
      .map((p) => {
        const extras = [
          p.fillRule ? `\n      fillRule: "${p.fillRule}",` : "",
          p.clipRule ? `\n      clipRule: "${p.clipRule}",` : "",
        ].join("");
        return `    {\n      d: "${p.d}",${extras}\n    },`;
      })
      .join("\n");
    return (
      `/** ${icon.description || icon.name} — Pointr \`${icon.name}\`, node \`${icon.nodeId}\`. */\n` +
      `export const ${pascalCase(icon.name)} = createPointrIcon("${pascalCase(icon.name)}", [\n${paths}\n]);`
    );
  })
  .join("\n\n");

const header = `/**
 * Generated by scripts/build-pointr-icons.mjs — do not edit by hand.
 *
 * The outlines are the Pointr Icon Library's own, exported from
 * https://www.figma.com/design/${FILE_KEY}/Pointr-Icon-Library and carried here
 * so that an icon the design system names is the icon the product draws.
 */
import { createPointrIcon } from "./createPointrIcon";

`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, header + body + "\n");
console.log(
  `\n${generated.length} icons -> ${path.relative(ROOT_DIR, OUTPUT)}`,
);
