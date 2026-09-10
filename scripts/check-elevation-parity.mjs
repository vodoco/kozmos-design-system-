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
  // Count reach, not sites. Counting `type: "DROP_SHADOW"` occurrences said
  // five literals remained, which read like a rounding error next to six roles.
  // One of those five is tooltipShadowEffects(), and thirteen painters call it —
  // every overlay surface in the library. A helper is one site and many shadows,
  // and the difference is the whole question.
  const plugin = read("figma/foundations-importer/code.js");
  const lines = plugin.split("\n");
  const roles = (plugin.match(/elevationEffect\("/g) || []).length;

  // Which functions contain a literal shadow, and how far does each one reach?
  const literalFns = new Map();
  let fn = "(top)";
  for (const line of lines) {
    const m = /^(?:async )?function ([A-Za-z0-9_]+)/.exec(line);
    if (m) fn = m[1];
    // elevationEffect builds the role, so its own DROP_SHADOW is the point.
    if (line.includes(`type: "DROP_SHADOW"`) && fn !== "elevationEffect")
      literalFns.set(fn, (literalFns.get(fn) || 0) + 1);
  }
  const reach = [];
  for (const [name, shadows] of literalFns) {
    const calls = lines.filter(
      (l) => l.includes(name + "()") && !/^(?:async )?function /.test(l),
    ).length;
    reach.push({ name, shadows, calls });
  }
  reach.sort((a, b) => b.calls - a.calls);
  const viaHelpers = reach.reduce((n, r) => n + Math.max(r.calls, 1), 0);

  console.log(
    `\n  ${roles} painter site(s) read an elevation role; ${viaHelpers} still paint a literal:`,
  );
  for (const r of reach) {
    console.log(
      `    ${String(Math.max(r.calls, 1)).padStart(3)}  ${r.name}` +
        (r.calls > 1
          ? `  — ${r.shadows} layer(s), called from ${r.calls} painters`
          : ""),
    );
  }
  console.log(
    `  A FloatingActionButton is heavier than any step on purpose and a BottomNavigation` +
      `\n  casts upward; those two the scale genuinely cannot say. Anything else appearing` +
      `\n  in this list is a painter that got away, and a helper counts once per caller —` +
      `\n  tooltipShadowEffects sat here as a single literal while painting 334 shadows.`,
  );
}

// 6. The web reads the roles — every component, not a list of names.
//
// The first version of this named the nine components converted alongside the
// Figma overlay surfaces and asserted those. It passed while 44 raw Tailwind
// shadow classes remained across 29 other components, because a check that
// names what was fixed can only ever confirm what was fixed. That is the same
// defect as counting DROP_SHADOW occurrences and calling tooltipShadowEffects
// one literal. Scan everything; name only the exceptions.
{
  const dir = "packages/react/src/components";
  // shadow-none is not a literal elevation — it is the absence of one, the way
  // KozmosShadows.none is on iOS.
  const RAW = /\bshadow-(?:sm|md|lg|xl|2xl|inner)\b|\bshadow-\[/g;
  const ALLOWED = {
    ColorPicker:
      "the handle's hard ring, which must stay visible on any colour beneath it",
    FloatingActionButton:
      "heavier than any step on purpose — the exemption Figma and iOS both record",
  };
  const offenders = [];
  let raw = 0;
  let roleReaders = 0;
  for (const entry of fs.readdirSync(path.join(ROOT, dir), {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    const file = `${dir}/${entry.name}/${entry.name}.tsx`;
    if (!fs.existsSync(path.join(ROOT, file))) continue;
    const src = read(file);
    if (/shadow-(?:raised|floating|overlay)\b/.test(src)) roleReaders += 1;
    const hits = (src.match(RAW) || []).length;
    if (hits === 0) continue;
    raw += hits;
    if (!ALLOWED[entry.name]) offenders.push(`${entry.name} (${hits})`);
  }
  if (offenders.length === 0)
    ok(
      `web: ${roleReaders} component(s) read an elevation role; the only raw shadows left are ${Object.keys(ALLOWED).length} named exception(s), ${raw} class(es)`,
    );
  else
    fail(
      `web: ${offenders.length} component(s) still pick a raw Tailwind shadow — ${offenders.sort().join(", ")}`,
    );

  // Toast is the one role assignment worth pinning by name, because it is the
  // call that distinguishes a status message from a modal on all four platforms.
  const toast = read(`${dir}/Toast/Toast.tsx`);
  if (/shadow-floating/.test(toast))
    ok("web: Toast reads shadow-floating — a status message, not a modal");
  else fail("web: Toast does not read shadow-floating");
}

// 7. The native components read the roles, not their own numbers.
//
// The roles were generated into packages/tokens/dist for both platforms the day
// they were added, and nothing ever copied them into the shipped packages. So
// every native component picked its own shadow: 23 iOS sites across fifteen
// distinct values, and 4.dp / 6.dp / 20.dp on Android. Elevation existed on
// three platforms and reached two.
{
  const IOS_TOKENS = "packages/ios/Sources/KozmosShadows.swift";
  const ANDROID_TOKENS =
    "packages/android/src/main/java/com/kozmos/tokens/KozmosShadows.kt";
  for (const [file, label] of [
    [IOS_TOKENS, "iOS"],
    [ANDROID_TOKENS, "Android"],
  ]) {
    if (!fs.existsSync(path.join(ROOT, file))) {
      fail(`${label}: ${file} is missing, so components have no role to read`);
      continue;
    }
    const src = read(file);
    const missing = ["Raised", "Floating", "Overlay"].filter(
      (r) => !src.includes(`semanticsElevation${r}`),
    );
    if (missing.length === 0)
      ok(`${label}: KozmosShadows carries all three roles`);
    else fail(`${label}: KozmosShadows is missing ${missing.join(", ")}`);
  }

  // A shadow that is genuinely not a step on the scale. Each names why; a new
  // literal anywhere else fails, which is the whole point.
  const IOS_ALLOWED = {
    FloatingActionButton:
      "heavier than any step on purpose — the exemption Figma already records",
    AdaptiveMapShell:
      "the shell's paired chrome, one half of which casts upward",
    ColorPicker:
      "the handle's hard ring, which must stay visible on any colour beneath it",
    LocationPin: "a pin has to read against an arbitrary map",
  };
  const ANDROID_ALLOWED = {
    Card: "deliberately flat at 0.dp on Android",
  };

  const walk = (dir) => {
    const out = [];
    for (const entry of fs.readdirSync(path.join(ROOT, dir), {
      withFileTypes: true,
    })) {
      const next = `${dir}/${entry.name}`;
      if (entry.isDirectory()) out.push(...walk(next));
      else out.push(next);
    }
    return out;
  };

  for (const [dir, ext, pattern, allowed, label] of [
    [
      "packages/ios/Sources/Components",
      ".swift",
      /\.shadow\(/g,
      IOS_ALLOWED,
      "iOS",
    ],
    [
      "packages/android/src/main/java/com/kozmos/components",
      ".kt",
      /\.shadow\(\s*[0-9]|elevation = [0-9]|defaultElevation = [0-9]/g,
      ANDROID_ALLOWED,
      "Android",
    ],
  ]) {
    if (!fs.existsSync(path.join(ROOT, dir))) continue;
    const offenders = [];
    let literals = 0;
    for (const file of walk(dir)) {
      if (!file.endsWith(ext) || file.includes(".figma.")) continue;
      const hits = (read(file).match(pattern) || []).length;
      if (hits === 0) continue;
      literals += hits;
      const component = file.split("/").slice(-2)[0];
      if (!allowed[component]) offenders.push(`${component} (${hits})`);
    }
    if (offenders.length === 0)
      ok(
        `${label}: every shadow reads a role except ${Object.keys(allowed).length} named exception(s), ${literals} literal(s) in total`,
      );
    else
      fail(
        `${label}: ${offenders.length} component(s) still write their own shadow — ${offenders.sort().join(", ")}`,
      );
  }
}

// 8. The native values are the token values — in both themes.
//
// The tracked native KozmosShadows files are hand-maintained copies, which is
// exactly how the tracked colour files became a frozen May baseline. Section 7
// checked that the three role *names* existed and nothing about what they held,
// so the first iOS copy passed while carrying the light values only: every
// native shadow was close to invisible in dark mode while the web's followed
// the theme. Compare the numbers, in both modes.
//
// Android is held to geometry only. Compose draws a shadow from a single
// elevation in dp with the platform's own ambient and spot light, and Material
// answers dark mode with tonal elevation rather than a deeper shadow, so a
// dark alpha has nowhere to go there. That is a platform model, not a gap.
{
  const lookupToken = (tree, dotted) =>
    dotted
      .split(".")
      .reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), tree);
  const resolveToken = (tree, value, depth = 0) => {
    if (depth > 10) throw new Error(`alias too deep: ${value}`);
    const m = /^\{(.+)\}$/.exec(String(value).trim());
    if (!m) return value;
    const target = lookupToken(tree, m[1]);
    if (!target || target.$value === undefined)
      throw new Error(`unresolved alias ${value}`);
    return resolveToken(tree, target.$value, depth + 1);
  };
  const parseShadow = (value, where) => {
    const rgba =
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/.exec(
        String(value),
      );
    const dims = String(value)
      .replace(/rgba?\([^)]*\)/, "")
      .match(/-?[\d.]+/g);
    if (!rgba || !dims || dims.length < 3)
      throw new Error(`cannot parse ${where}: ${value}`);
    return {
      a: parseFloat(rgba[4] === undefined ? "1" : rgba[4]),
      x: Number(dims[0]),
      y: Number(dims[1]),
      blur: Number(dims[2]),
    };
  };

  const ROLES = ["Raised", "Floating", "Overlay"];
  const expected = {};
  for (const mode of ["light", "dark"]) {
    const tree = JSON.parse(read(`packages/tokens/src/tokens-${mode}.json`));
    for (const role of ROLES) {
      const value = resolveToken(
        tree,
        lookupToken(tree, `Semantics.Elevation.${role}`).$value,
      );
      expected[role] = expected[role] || {};
      expected[role][mode] = parseShadow(
        value,
        `${mode} Semantics.Elevation.${role}`,
      );
    }
  }

  const ios = read("packages/ios/Sources/KozmosShadows.swift");
  for (const role of ROLES) {
    const m = new RegExp(
      `semanticsElevation${role} = ShadowToken\\(\\s*color: kozmosShadowColor\\(\\s*light: \\(([^)]*)\\),\\s*dark: \\(([^)]*)\\)\\s*\\),\\s*radius: ([\\d.]+),\\s*x: ([\\d.-]+),\\s*y: ([\\d.-]+)\\s*\\)`,
    ).exec(ios);
    if (!m) {
      fail(
        `iOS: semanticsElevation${role} is not a theme-aware ShadowToken — it has no dark value`,
      );
      continue;
    }
    const lightAlpha = Number(m[1].split(",")[3]);
    const darkAlpha = Number(m[2].split(",")[3]);
    const e = expected[role];
    const wrong = [];
    if (lightAlpha !== e.light.a)
      wrong.push(`light alpha ${lightAlpha}, token ${e.light.a}`);
    if (darkAlpha !== e.dark.a)
      wrong.push(`dark alpha ${darkAlpha}, token ${e.dark.a}`);
    if (Number(m[3]) !== e.light.blur)
      wrong.push(`radius ${m[3]}, token blur ${e.light.blur}`);
    if (Number(m[4]) !== e.light.x) wrong.push(`x ${m[4]}, token ${e.light.x}`);
    if (Number(m[5]) !== e.light.y) wrong.push(`y ${m[5]}, token ${e.light.y}`);
    if (wrong.length === 0)
      ok(
        `iOS: ${role} matches the tokens in both themes — alpha ${lightAlpha} light, ${darkAlpha} dark`,
      );
    else fail(`iOS: ${role} disagrees with the tokens — ${wrong.join("; ")}`);
  }

  const android = read(
    "packages/android/src/main/java/com/kozmos/tokens/KozmosShadows.kt",
  );
  for (const role of ROLES) {
    const m = new RegExp(`semanticsElevation${role} = ([\\d.]+)\\.dp`).exec(
      android,
    );
    const want = expected[role].light.blur;
    if (m && Number(m[1]) === want)
      ok(`Android: ${role} is ${want}.dp, the role's blur`);
    else
      fail(
        `Android: semanticsElevation${role} is ${m ? `${m[1]}.dp` : "missing"}, the role's blur is ${want}`,
      );
  }
}

console.log(
  `\n${problems.length === 0 ? "ok    every consumer reads Semantics.Elevation" : `${problems.length} problem(s)`}`,
);
process.exit(problems.length === 0 ? 0 : 1);
