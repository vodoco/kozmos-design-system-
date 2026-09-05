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
 *   truncated — text set to TRUNCATE in a box too small for its own string
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
  if (process.env.FIGMA_ACCESS_TOKEN)
    return process.env.FIGMA_ACCESS_TOKEN.trim();
  const envPath = path.join(ROOT, ".env");
  if (fs.existsSync(envPath)) {
    const line = fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .find((l) => l.startsWith("FIGMA_ACCESS_TOKEN="));
    if (line)
      return line
        .slice("FIGMA_ACCESS_TOKEN=".length)
        .replace(/["']/g, "")
        .trim();
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

  const sectionsBlock = source.match(
    /const COMPONENT_PAGE_LAYOUT_SECTIONS = \[([\s\S]*?)\n\];/,
  )[1];
  const names = [...sectionsBlock.matchAll(/"([A-Za-z][A-Za-z0-9 /]*)"/g)]
    .map((m) => m[1])
    .filter(
      (n) =>
        !n.includes("/") &&
        !/^(Typography|Actions|Status|Selection|Layout|Data display|Navigation|Disclosure|Overlay|Controls|Inputs|Feedback|Media)$/.test(
          n,
        ),
    );

  const start = source.indexOf(
    "function expectedVariantAxesForComponentSetName(",
  );
  const end = source.indexOf("\n}\n", start);
  const region = source.slice(start, end === -1 ? source.length : end);
  const axes = {};
  for (const m of region.matchAll(
    /canonicalName === "([A-Za-z]+)"\)\s*\{\s*return \{([\s\S]*?)\};/g,
  )) {
    const byAxis = {};
    for (const a of m[2].matchAll(/([A-Za-z]+):\s*([A-Z0-9_]+)/g)) {
      if (arrays[a[2]] && arrays[a[2]].length) byAxis[a[1]] = arrays[a[2]];
    }
    if (Object.keys(byAxis).length) axes[m[1]] = byAxis;
  }
  return { names: [...new Set(names)], axes };
}

/**
 * Roughly how wide a string renders, as a multiple of its font size.
 *
 * A truncated node is indistinguishable from a healthy one in the REST
 * payload: same type, same width, full `characters`. The only way to see it
 * from here is to measure the string and compare. There is no font metric in
 * the API, so this approximates Inter by character class, and deliberately
 * runs narrow — the check should miss a marginal case rather than invent one.
 * Validated against the whole Components page: over 1,758 nodes set to
 * TRUNCATE it flagged 9, and all 9 were confirmed truncated in the render.
 */
const NARROW_GLYPHS = "ijlt.,;:'!|()[]{}/\\ ";
const WIDE_GLYPHS = "mwMW@%";
const THIN_MARKS = "\u2022\u00b7\u2026\u2039\u203a\u00d7";
const advanceRatio = (ch) => {
  if (NARROW_GLYPHS.includes(ch)) return 0.3;
  if (WIDE_GLYPHS.includes(ch)) return 0.86;
  if (THIN_MARKS.includes(ch)) return 0.35;
  if (ch >= "A" && ch <= "Z") return 0.68;
  if (ch >= "0" && ch <= "9") return 0.57;
  if (ch.charCodeAt(0) > 0x2000) return 0.8;
  return 0.54;
};
const textWidth = (characters, fontSize) => {
  let width = 0;
  for (const ch of characters) width += advanceRatio(ch) * fontSize;
  return width;
};

const luminance = (hex) => {
  const c = hex.replace("#", "");
  const v = [0, 2, 4]
    .map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
    .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};
const toHex = (c) =>
  "#" +
  [c.r, c.g, c.b]
    .map((x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase();
const solidFill = (node) => {
  const fill = (node.fills || []).find(
    (f) => f.type === "SOLID" && f.visible !== false,
  );
  // Near-transparent fills are decoration, not a readable background.
  return fill && (fill.opacity === undefined || fill.opacity > 0.5)
    ? toHex(fill.color)
    : null;
};

async function main() {
  const t = token();
  if (!t) {
    console.error(
      "FIGMA_ACCESS_TOKEN is not set (env or .env). Needs file_content:read.",
    );
    process.exit(2);
  }

  // No depth cap. It used to be depth=8, which looked harmless and hid 1,120
  // text nodes — 17% of the page — from the collapsed, truncation and contrast
  // walks below, including everything nested past a variant's sixth level.
  // Fetching the whole tree costs 1.7 MB more and no extra time.
  const res = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(PAGE_NODE)}`,
    { headers: { "X-Figma-Token": t } },
  );
  if (res.status !== 200) {
    console.error(
      `Figma API returned ${res.status}. ${res.status === 403 ? "The token is expired or lacks file_content:read — see docs/session-handoff.md §6." : ""}`,
    );
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
  const truncated = [];
  const unbound = [];
  const overflowing = [];

  for (const name of names) {
    if (!sets[name]) {
      missing.push(name);
      continue;
    }
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
      const pairs = String(variant.name)
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      const seenAxes = [];
      for (const pair of pairs) {
        const at = pair.indexOf("=");
        if (at === -1) continue;
        const axis = pair.slice(0, at).trim();
        const value = pair.slice(at + 1).trim();
        seenAxes.push(axis);
        if (!byAxis[axis]) {
          problems.push(`unknown axis "${axis}"`);
          continue;
        }
        if (!byAxis[axis].includes(value))
          problems.push(`${axis}="${value}" is not a declared value`);
      }
      for (const axis of Object.keys(byAxis)) {
        if (!seenAxes.includes(axis))
          problems.push(`variant "${variant.name}" has no ${axis}`);
      }
    }

    // Every declared value should appear at least once, or the set is stale.
    for (const [axis, values] of Object.entries(byAxis)) {
      const used = new Set();
      for (const variant of set.children || []) {
        for (const pair of String(variant.name).split(",")) {
          const at = pair.indexOf("=");
          if (at !== -1 && pair.slice(0, at).trim() === axis)
            used.add(pair.slice(at + 1).trim());
        }
      }
      const unused = values.filter((v) => !used.has(v));
      if (unused.length)
        problems.push(`${axis} never uses ${unused.join(", ")}`);
    }

    const unique = [...new Set(problems)];
    if (unique.length) {
      variantDrift.push(
        `${name}: ${unique.slice(0, 3).join("; ")}${unique.length > 3 ? ` (+${unique.length - 3})` : ""}`,
      );
    }
  }

  // Figma refuses to publish a component set carrying a property no layer
  // references, so this is the check that answers "can the library ship?" —
  // and the five checks above all passed while eleven such properties held
  // five sets, two of them Core, out of the library. Reading it from the
  // terminal beats reading it off the publish dialog: the dialog names the
  // sets, this names the properties.
  //
  // VARIANT is exempt because a variant property lives in the variant's name
  // rather than in a layer reference, which is why a naive scan appears to
  // condemn every set in the file.
  for (const [name, set] of Object.entries(sets)) {
    const definitions = set.componentPropertyDefinitions || {};
    const referenced = new Set();
    (function walk(node) {
      const refs = node.componentPropertyReferences;
      if (refs)
        for (const field of Object.keys(refs)) referenced.add(refs[field]);
      if (node.children) node.children.forEach(walk);
    })(set);

    for (const property of Object.keys(definitions)) {
      const definition = definitions[property];
      if (definition.type === "VARIANT") continue;
      if (referenced.has(property)) continue;
      unbound.push(
        `${name} / ${property.split("#")[0]} (${definition.type}) — declared, referenced by no layer`,
      );
    }
  }

  // A child wider than the box its parent leaves it. This catches the failure
  // that a hard-coded width hides: a node sized to a literal that happened to
  // equal the content width, in a frame whose padding later moved. Menu drew
  // its rows at 184 inside a 168 content box after the popover inset went from
  // 4 to 12, and every row and its separator hung 8px past the rounded corner.
  //
  // The tolerance is 1.5px, which is arithmetic rather than a design flaw, and
  // only auto-layout frames are judged, because a child of an absolutely
  // positioned frame is placed on purpose.
  const OVERFLOW_TOLERANCE = 1.5;
  for (const [name, set] of Object.entries(sets)) {
    const seen = new Set();
    (function walk(node) {
      const box = node.absoluteBoundingBox;
      if (box && node.paddingLeft !== undefined && node.children) {
        const contentWidth =
          box.width - (node.paddingLeft || 0) - (node.paddingRight || 0);
        const contentHeight =
          box.height - (node.paddingTop || 0) - (node.paddingBottom || 0);
        for (const child of node.children) {
          if (child.visible === false) continue;
          // An absolutely positioned child has opted out of the parent's
          // layout, so the content box says nothing about where it belongs.
          // Focus rings are deliberately larger than the thing they ring, and
          // a tooltip's tip hangs outside on purpose. Judging them here is the
          // same category error as demanding a pill be concentric with its
          // card. 913 nodes in the file are absolute, 901 of them focus rings.
          if (child.layoutPositioning === "ABSOLUTE") continue;
          const childBox = child.absoluteBoundingBox;
          if (!childBox) continue;
          // Both axes: the file row that pushed its second line past the
          // bottom edge on 2026-09-04 was a height overflow, and a width-only
          // rule was blind to it.
          for (const [axis, size, content] of [
            ["wide", childBox.width, contentWidth],
            ["tall", childBox.height, contentHeight],
          ]) {
            const over = size - content;
            if (over <= OVERFLOW_TOLERANCE) continue;
            const key = `${name}|${node.name}|${child.name}|${axis}`;
            if (seen.has(key)) continue;
            seen.add(key);
            overflowing.push(
              `${name} / ${node.name} > ${child.name} — ${Math.round(size)} ${axis} in a ${Math.round(content)} content box (over by ${Math.round(over)})`,
            );
          }
        }
      }
      if (node.children) node.children.forEach(walk);
    })(set);
  }

  // WCAG 1.4.3 exempts inactive controls, and a dimmed layer is a deliberate
  // de-emphasis rather than a contrast bug. Without these the report is mostly
  // disabled states repeated once per variant.
  const isInactive = (variantName) =>
    /Disabled|Inactive|OffFloor|Unavailable/i.test(variantName);
  const seen = new Set();

  for (const [name, set] of Object.entries(sets)) {
    for (const variant of set.children || []) {
      const inactive = isInactive(String(variant.name));
      (function walk(node, bg, dimmed) {
        // Hidden nodes carry component properties without ever being seen —
        // Avatar's "Image URL" and "Alt Text" are text nodes at visible:false.
        // Contrast on something nobody can look at is not a finding.
        if (node.visible === false) return;
        const faded =
          dimmed || (node.opacity !== undefined && node.opacity < 0.9);
        const surface = solidFill(node) || bg;
        if (node.type === "TEXT") {
          const box = node.absoluteBoundingBox;
          if (box && box.width < 4) {
            const key = `c:${name}/${node.name}`;
            if (!seen.has(key)) {
              seen.add(key);
              collapsed.push(
                `${name} / ${node.name} (${Math.round(box.width)}x${Math.round(box.height)})`,
              );
            }
          }
          const style = node.style || {};
          if (
            style.textAutoResize === "TRUNCATE" ||
            style.textTruncation === "ENDING"
          ) {
            const fontSize = style.fontSize || 14;
            const lineHeight = style.lineHeightPx || fontSize * 1.4;
            const lines = box
              ? Math.max(1, Math.round(box.height / lineHeight))
              : 1;
            const need = textWidth(node.characters || "", fontSize);
            const have = (box ? box.width : 0) * lines;
            // A tenth of slack absorbs the approximation; anything past that is
            // wide enough that the ellipsis is visible in the render.
            if (have > 0 && need > have * 1.1) {
              const key = `t:${name}/${node.name}/${node.characters}`;
              if (!seen.has(key)) {
                seen.add(key);
                truncated.push(
                  `${name} / ${node.name}: "${node.characters}" needs ~${Math.round(need)}px, has ${Math.round(have)}px`,
                );
              }
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
                lowContrast.push(
                  `${name} / ${node.name}: ${fg} on ${bg} = ${ratio.toFixed(2)}`,
                );
              }
            }
          }
        }
        if (node.children)
          node.children.forEach((c) => walk(c, surface, faded));
      })(variant, null, false);
    }
  }

  const report = (label, items, limit = 12) => {
    if (!items.length) {
      console.log(`  ok    ${label}`);
      return 0;
    }
    console.log(`  FAIL  ${label} — ${items.length}`);
    for (const i of items.slice(0, limit)) console.log(`          ${i}`);
    if (items.length > limit)
      console.log(`          (+${items.length - limit} more)`);
    return items.length;
  };

  console.log(
    `Figma library verification — ${Object.keys(sets).length} component set(s) on the Components page\n`,
  );
  let total = 0;
  total += report(`presence (${names.length} expected)`, missing);
  total += report("variant drift", variantDrift);
  total += report("collapsed text nodes", collapsed);
  total += report("text truncated by its own box", truncated);
  total += report(`text contrast below ${AA}:1`, lowContrast);
  total += report("properties bound to no layer (blocks publishing)", unbound);
  // Reported, not enforced, for the same reason the nesting check was: the
  // 62 findings this arrived with are pre-existing and two of them are design
  // calls, not bugs. NavigationItem computes 8px of padding for its rail, 10
  // for compact and 12 for default, then binds all three to one variable worth
  // 12, so the rail's content box is 48 where the painter assumed 56. Deciding
  // whether the rail gets its own padding variable is a design question. Add
  // this to `total` on the day the count reaches zero — a gate that is red on
  // purpose is a gate somebody switches off.
  report("children that overflow the box holding them", overflowing);

  console.log(
    total === 0
      ? "\nThe published file matches what the importer would generate."
      : `\n${total} drift item(s). The file is behind the code — re-run the importer, then verify again.`,
  );
  console.log(
    "\nNote: the REST API resolves variables in the file's default mode, so contrast here is the light theme only.",
  );
  process.exit(total === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("verification failed: " + e.message);
  process.exit(2);
});
