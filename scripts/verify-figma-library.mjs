/**
 * Verify the published Figma file against what the importer would generate.
 *
 * The plugin writes a rendered copy of code.js into Figma. Change the code and
 * that copy silently goes stale — which is invisible until someone runs the
 * in-Figma audit and reads a tooltip. This reads the file over the REST API and
 * reports the drift from the terminal.
 *
 * Checks, in order of how badly they have bitten us:
 *   presence  — every set the layout registry names exists on the page
 *   variants  — each set's variants match the expected axis and values exactly
 *   collapsed — text nodes at zero width, the sizing bug from 6803f20
 *   contrast  — WCAG AA on every text node against the surface behind it
 *
 * Needs FIGMA_ACCESS_TOKEN (env or .env) with file_content:read.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FILE_KEY = "Yj4O8p6Y9h2Sa9zJVoAiVY";
const PAGE_NODE = "4:4";
const PLUGIN = path.join(ROOT, "figma/foundations-importer/code.js");
const AA = 4.5;

function token() {
  if (process.env.FIGMA_ACCESS_TOKEN) return process.env.FIGMA_ACCESS_TOKEN.trim();
  const envPath = path.join(ROOT, ".env");
  if (fs.existsSync(envPath)) {
    const line = fs.readFileSync(envPath, "utf8").split("\n")
      .find((l) => l.startsWith("FIGMA_ACCESS_TOKEN="));
    if (line) return line.slice("FIGMA_ACCESS_TOKEN=".length).replace(/["']/g, "").trim();
  }
  return "";
}

/** Expected set names and variant axes, read from the plugin source. */
function expectations() {
  const source = fs.readFileSync(PLUGIN, "utf8");

  const arrays = {};
  for (const m of source.matchAll(/^const ([A-Z0-9_]+) = \[([^\]]*)\];/gm)) {
    arrays[m[1]] = [...m[2].matchAll(/"([^"]+)"/g)].map((v) => v[1]);
  }

  const sectionsBlock = source.match(/const COMPONENT_PAGE_LAYOUT_SECTIONS = \[([\s\S]*?)\n\];/)[1];
  const names = [...sectionsBlock.matchAll(/"([A-Za-z][A-Za-z0-9 /]*)"/g)]
    .map((m) => m[1])
    .filter((n) => !n.includes("/") && !/^(Typography|Actions|Status|Selection|Layout|Data display|Navigation|Disclosure|Overlay|Controls|Inputs|Feedback|Media)$/.test(n));

  const start = source.indexOf("function expectedVariantAxesForComponentSetName(");
  const end = source.indexOf("\n}\n", start);
  const region = source.slice(start, end === -1 ? source.length : end);
  const axes = {};
  for (const m of region.matchAll(/canonicalName === "([A-Za-z]+)"\)\s*\{\s*return \{([\s\S]*?)\};/g)) {
    const byAxis = {};
    for (const a of m[2].matchAll(/([A-Za-z]+):\s*([A-Z0-9_]+)/g)) {
      if (arrays[a[2]] && arrays[a[2]].length) byAxis[a[1]] = arrays[a[2]];
    }
    if (Object.keys(byAxis).length) axes[m[1]] = byAxis;
  }
  return { names: [...new Set(names)], axes };
}

const luminance = (hex) => {
  const c = hex.replace("#", "");
  const v = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
    .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};
const toHex = (c) =>
  "#" + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const solidFill = (node) => {
  const fill = (node.fills || []).find((f) => f.type === "SOLID" && f.visible !== false);
  // Near-transparent fills are decoration, not a readable background.
  return fill && (fill.opacity === undefined || fill.opacity > 0.5) ? toHex(fill.color) : null;
};

async function main() {
  const t = token();
  if (!t) {
    console.error("FIGMA_ACCESS_TOKEN is not set (env or .env). Needs file_content:read.");
    process.exit(2);
  }

  const res = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(PAGE_NODE)}&depth=8`,
    { headers: { "X-Figma-Token": t } });
  if (res.status !== 200) {
    console.error(`Figma API returned ${res.status}. ${res.status === 403 ? "The token is expired or lacks file_content:read — see docs/session-handoff.md §6." : ""}`);
    process.exit(2);
  }
  const page = (await res.json()).nodes[PAGE_NODE].document;

  const sets = {};
  (function find(n) {
    if (n.type === "COMPONENT_SET") sets[n.name] = n;
    if (n.children) n.children.forEach(find);
  })(page);

  const { names, axes } = expectations();
  const missing = [];
  const variantDrift = [];
  const collapsed = [];
  const lowContrast = [];

  for (const name of names) {
    if (!sets[name]) { missing.push(name); continue; }
  }

  // Check the axis names and the values in use — not the full cartesian
  // product. Multi-axis sets deliberately omit impossible combinations:
  // Tabs has no Count=Two with Active=Three, and demanding one is a bug in the
  // verifier, not drift in the file.
  for (const [name, byAxis] of Object.entries(axes)) {
    const set = sets[name];
    if (!set) continue;
    const problems = [];

    for (const variant of set.children || []) {
      const pairs = String(variant.name).split(",").map((p) => p.trim()).filter(Boolean);
      const seenAxes = [];
      for (const pair of pairs) {
        const at = pair.indexOf("=");
        if (at === -1) continue;
        const axis = pair.slice(0, at).trim();
        const value = pair.slice(at + 1).trim();
        seenAxes.push(axis);
        if (!byAxis[axis]) { problems.push(`unknown axis "${axis}"`); continue; }
        if (!byAxis[axis].includes(value)) problems.push(`${axis}="${value}" is not a declared value`);
      }
      for (const axis of Object.keys(byAxis)) {
        if (!seenAxes.includes(axis)) problems.push(`variant "${variant.name}" has no ${axis}`);
      }
    }

    // Every declared value should appear at least once, or the set is stale.
    for (const [axis, values] of Object.entries(byAxis)) {
      const used = new Set();
      for (const variant of set.children || []) {
        for (const pair of String(variant.name).split(",")) {
          const at = pair.indexOf("=");
          if (at !== -1 && pair.slice(0, at).trim() === axis) used.add(pair.slice(at + 1).trim());
        }
      }
      const unused = values.filter((v) => !used.has(v));
      if (unused.length) problems.push(`${axis} never uses ${unused.join(", ")}`);
    }

    const unique = [...new Set(problems)];
    if (unique.length) {
      variantDrift.push(`${name}: ${unique.slice(0, 3).join("; ")}${unique.length > 3 ? ` (+${unique.length - 3})` : ""}`);
    }
  }

  // WCAG 1.4.3 exempts inactive controls, and a dimmed layer is a deliberate
  // de-emphasis rather than a contrast bug. Without these the report is mostly
  // disabled states repeated once per variant.
  const isInactive = (variantName) => /Disabled|Inactive|OffFloor|Unavailable/i.test(variantName);
  const seen = new Set();

  for (const [name, set] of Object.entries(sets)) {
    for (const variant of set.children || []) {
      const inactive = isInactive(String(variant.name));
      (function walk(node, bg, dimmed) {
        // Hidden nodes carry component properties without ever being seen —
        // Avatar's "Image URL" and "Alt Text" are text nodes at visible:false.
        // Contrast on something nobody can look at is not a finding.
        if (node.visible === false) return;
        const faded = dimmed || (node.opacity !== undefined && node.opacity < 0.9);
        const surface = solidFill(node) || bg;
        if (node.type === "TEXT") {
          const box = node.absoluteBoundingBox;
          if (box && box.width < 4) {
            const key = `c:${name}/${node.name}`;
            if (!seen.has(key)) {
              seen.add(key);
              collapsed.push(`${name} / ${node.name} (${Math.round(box.width)}x${Math.round(box.height)})`);
            }
          }
          const fg = solidFill(node);
          if (fg && bg && !inactive && !faded) {
            const ratio = contrast(fg, bg);
            if (ratio < AA) {
              // One entry per distinct pairing, not one per variant.
              const key = `k:${name}/${node.name}/${fg}/${bg}`;
              if (!seen.has(key)) {
                seen.add(key);
                lowContrast.push(`${name} / ${node.name}: ${fg} on ${bg} = ${ratio.toFixed(2)}`);
              }
            }
          }
        }
        if (node.children) node.children.forEach((c) => walk(c, surface, faded));
      })(variant, null, false);
    }
  }

  const report = (label, items, limit = 12) => {
    if (!items.length) { console.log(`  ok    ${label}`); return 0; }
    console.log(`  FAIL  ${label} — ${items.length}`);
    for (const i of items.slice(0, limit)) console.log(`          ${i}`);
    if (items.length > limit) console.log(`          (+${items.length - limit} more)`);
    return items.length;
  };

  console.log(`Figma library verification — ${Object.keys(sets).length} component set(s) on the Components page\n`);
  let total = 0;
  total += report(`presence (${names.length} expected)`, missing);
  total += report("variant drift", variantDrift);
  total += report("collapsed text nodes", collapsed);
  total += report(`text contrast below ${AA}:1`, lowContrast);

  console.log(
    total === 0
      ? "\nThe published file matches what the importer would generate."
      : `\n${total} drift item(s). The file is behind the code — re-run the importer, then verify again.`);
  console.log("\nNote: the REST API resolves variables in the file's default mode, so contrast here is the light theme only.");
  process.exit(total === 0 ? 0 : 1);
}

main().catch((e) => { console.error("verification failed: " + e.message); process.exit(2); });
