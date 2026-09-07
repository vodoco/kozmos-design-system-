/**
 * Keep every surface reading elevation from the same three places.
 *
 * Until 2026-09-07 there was no elevation role. Three shadow primitives existed
 * at the root of the token file, the web exposed them as `shadow-sm/md/lg`, and
 * the Figma plugin used none of them — it carried ten hand-written `rgba`
 * shadows instead, no two of which agreed. That is why the MapScale prototype
 * invented a four-depth blue-tinted ramp of its own for over-map chrome.
 *
 * Two things made it invisible. The native shadow formatters' regexes were
 * double-escaped, so they never matched and silently emitted the same default
 * three times — iOS shipped one shadow under three names. And nothing compared
 * the plugin's literals to anything.
 *
 * `Semantics.Elevation` is now the source: Raised for a surface lifted off the
 * page, Floating for a control over content it does not belong to, Overlay for
 * something above everything. This asserts the consumers still agree.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const problems = [];
const ok = (msg) => console.log(`  ok    ${msg}`);
const fail = (msg) => {
  problems.push(msg);
  console.log(`  FAIL  ${msg}`);
};

const ROLES = {
  Raised: { primitive: "shadow.sm", plugin: "raised" },
  Floating: { primitive: "shadow.md", plugin: "floating" },
  Overlay: { primitive: "shadow.lg", plugin: "overlay" },
};

const lookup = (tokens, dotted) =>
  dotted
    .split(".")
    .reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), tokens);

/** "0 4px 8px rgba(0,0,0,0.1)" → { y, blur, alpha } */
function parseShadow(value) {
  const rgba =
    /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*([\d.]+))?\s*\)/.exec(value);
  const dims = String(value).match(/(-?[\d.]+)px/g);
  if (!rgba || !dims || dims.length < 2) return null;
  return {
    y: parseFloat(dims[0]),
    blur: parseFloat(dims[1]),
    alpha: parseFloat(rgba[1] || "1"),
  };
}

console.log("Elevation parity — Semantics.Elevation against its consumers\n");

// 1. The tokens, both modes.
for (const mode of ["light", "dark"]) {
  const t = JSON.parse(read(`packages/tokens/src/tokens-${mode}.json`));
  for (const [role, spec] of Object.entries(ROLES)) {
    const token = lookup(t, `Semantics.Elevation.${role}`);
    if (!token) {
      fail(`${mode}: Semantics.Elevation.${role} is missing`);
      continue;
    }
    if (token.$value !== `{${spec.primitive}}`)
      fail(
        `${mode}: Elevation.${role} aliases ${token.$value}, expected {${spec.primitive}}`,
      );
    else ok(`${mode}: Elevation.${role} → ${spec.primitive}`);
  }
}

// 2. The plugin's copy of the light values.
{
  const plugin = read("figma/foundations-importer/code.js");
  const t = JSON.parse(read("packages/tokens/src/tokens-light.json"));
  const block = /const KOZMOS_ELEVATION = \{([\s\S]*?)\};/.exec(plugin);
  if (!block) {
    fail("plugin: KOZMOS_ELEVATION was not found");
  } else {
    for (const [role, spec] of Object.entries(ROLES)) {
      const entry = new RegExp(
        `${spec.plugin}:\\s*\\{\\s*y:\\s*(-?[\\d.]+),\\s*blur:\\s*([\\d.]+),\\s*alpha:\\s*([\\d.]+)\\s*\\}`,
      ).exec(block[1]);
      const source = parseShadow(lookup(t, spec.primitive).$value);
      if (!entry) {
        fail(`plugin: KOZMOS_ELEVATION.${spec.plugin} is missing`);
        continue;
      }
      const got = { y: +entry[1], blur: +entry[2], alpha: +entry[3] };
      if (
        got.y !== source.y ||
        got.blur !== source.blur ||
        got.alpha !== source.alpha
      )
        fail(
          `plugin: ${spec.plugin} is y${got.y}/blur${got.blur}/a${got.alpha}, ${spec.primitive} is y${source.y}/blur${source.blur}/a${source.alpha}`,
        );
      else ok(`plugin: ${spec.plugin} matches ${spec.primitive}`);
    }
  }
}

// 3. The web.
{
  const tailwind = read("packages/react/tailwind.config.js");
  for (const role of ["raised", "floating", "overlay"]) {
    const re = new RegExp(
      `^\\s*${role}:\\s*"var\\(--semantics-elevation-${role}\\)"`,
      "m",
    );
    if (re.test(tailwind))
      ok(`web: shadow-${role} reads --semantics-elevation-${role}`);
    else fail(`web: tailwind.config.js does not map shadow-${role}`);
  }
}

// 4. The native output, which used to emit one shadow under three names.
{
  const swift = "packages/tokens/dist/ios/KozmosShadows.swift";
  if (!fs.existsSync(path.join(ROOT, swift))) {
    ok("native: dist not built in this checkout, skipped");
  } else {
    const src = read(swift);
    const seen = new Set();
    for (const role of ["Raised", "Floating", "Overlay"]) {
      const m = new RegExp(
        `semanticsElevation${role} = ShadowToken\\(([^)]*\\)[^\\n]*)`,
      ).exec(src);
      if (!m) {
        fail(
          `native: semanticsElevation${role} is missing from KozmosShadows.swift`,
        );
        continue;
      }
      seen.add(m[1].replace(/\s+/g, ""));
    }
    if (seen.size === 3)
      ok("native: the three roles emit three distinct shadows");
    else if (seen.size > 0)
      fail(
        `native: the three roles emit only ${seen.size} distinct value(s) — the formatter is falling back to a default again`,
      );
  }
}

// 5. What is deliberately not a role.
{
  const plugin = read("figma/foundations-importer/code.js");
  const literals = (plugin.match(/type: "DROP_SHADOW"/g) || []).length;
  const roles = (plugin.match(/elevationEffect\("/g) || []).length;
  console.log(
    `\n  ${roles} shadow(s) read a role; ${literals} remain literal and are named in the KOZMOS_ELEVATION comment:` +
      `\n  a FloatingActionButton is heavier than any step on purpose, a BottomNavigation casts upward,` +
      `\n  and a Tooltip stacks two layers. The scale cannot say those, and flattening them would lose them.`,
  );
}

console.log(
  `\n${problems.length === 0 ? "ok    every consumer reads Semantics.Elevation" : `${problems.length} problem(s)`}`,
);
process.exit(problems.length === 0 ? 0 : 1);
