/**
 * Keep every surface reading its border colour from the same two places.
 *
 * Until 2026-09-03 there was no border role at all. Figma's painters chose a
 * primitive by hand — 93 of them picked foreground/500, a muted text colour,
 * and it rendered on 623 strokes across 30 sets — while the web's `border` and
 * `input` both resolved to background/200. Nothing compared them, so the same
 * card had a dark outline in Figma and a soft one in the product.
 *
 * Semantics.Border in packages/tokens/src/tokens-*.json is now the source:
 * `Subtle` for container edges and `Input` for control boundaries. This holds
 * the consumers to it:
 *
 *   - the tokens alias the intended primitives in both modes, and Input clears
 *     WCAG 1.4.11's 3:1 against the page while Subtle stays below it, which is
 *     what makes it subtle;
 *   - the web maps `border` and `input` to the two CSS variables;
 *   - the Figma plugin references both roles and paints no stroke with the old
 *     primitives any more, outside two marks that are not borders;
 *   - the generated native colour files carry both symbols;
 *   - the foundations payload carries both variables for the Figma import.
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
  Subtle: { alias: "Primitives.Colors.background.200", contrast: [1.3, 3.0] },
  Input: {
    alias: "Primitives.Colors.foreground.500",
    contrast: [3.0, Infinity],
  },
};

const lookup = (tokens, dotted) =>
  dotted
    .split(".")
    .reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), tokens);

function resolve(tokens, value, depth = 0) {
  if (depth > 10) throw new Error(`alias too deep: ${value}`);
  const m = /^\{(.+)\}$/.exec(String(value).trim());
  if (!m) return value;
  const target = lookup(tokens, m[1]);
  if (!target || target.$value === undefined)
    throw new Error(`unresolved alias ${value}`);
  return resolve(tokens, target.$value, depth + 1);
}
function luminance(hex) {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

console.log("Border parity — Semantics.Border against its consumers\n");

// 1. the tokens, both modes
for (const mode of ["light", "dark"]) {
  const t = JSON.parse(read(`packages/tokens/src/tokens-${mode}.json`));
  const page = resolve(t, lookup(t, "Primitives.Colors.background.0").$value);
  for (const [role, spec] of Object.entries(ROLES)) {
    const token = lookup(t, `Semantics.Border.${role}`);
    if (!token) {
      fail(`${mode}: Semantics.Border.${role} is missing`);
      continue;
    }
    if (token.$type !== "color")
      fail(`${mode}: Semantics.Border.${role} is ${token.$type}, not color`);
    if (token.$value !== `{${spec.alias}}`)
      fail(
        `${mode}: Semantics.Border.${role} aliases ${token.$value}, expected {${spec.alias}}`,
      );
    const hex = resolve(t, token.$value);
    const ratio = contrast(hex, page);
    const [lo, hi] = spec.contrast;
    if (ratio < lo || ratio >= hi)
      fail(
        `${mode}: Border/${role} ${hex} reads ${ratio.toFixed(3)}:1 on the page, outside [${lo}, ${hi === Infinity ? "∞" : hi})`,
      );
    else
      ok(`${mode}: Border/${role} = ${hex}, ${ratio.toFixed(2)}:1 on the page`);
  }
}

// 2. the web
const tailwind = read("packages/react/tailwind.config.js");
for (const [key, role] of [
  ["border", "subtle"],
  ["input", "input"],
]) {
  const re = new RegExp(
    `^\\s*${key}:\\s*"var\\(--semantics-border-${role}\\)"`,
    "m",
  );
  if (re.test(tailwind)) ok(`web: \`${key}\` reads --semantics-border-${role}`);
  else
    fail(
      `web: tailwind.config.js does not map \`${key}\` to var(--semantics-border-${role})`,
    );
}

// 3. the plugin: roles referenced, and no stroke still painted with the old primitives
const plugin = read("figma/foundations-importer/code.js");
for (const role of ["Border/Subtle", "Border/Input"]) {
  if (plugin.includes(`"${role}"`)) ok(`plugin: references "${role}"`);
  else fail(`plugin: never references "${role}"`);
}
// Marks that happen to use a stroke but are not borders: a rating star's
// outline, a stepper's step ring. They keep the text colour on purpose.
const STROKE_MARKS_ALLOWED = new Set([
  "createRatingStar",
  "createStepperStepItem",
]);
const OLD = ["Colors/foreground/500", "Colors/background/200"];
const lines = plugin.split("\n");
let fn = "(top)";
let inStrokes = false;
const offenders = new Map();
for (let i = 0; i < lines.length; i += 1) {
  const m = /^(?:async )?function ([A-Za-z0-9_]+)/.exec(lines[i]);
  if (m) {
    fn = m[1];
    inStrokes = false;
  }
  // A strokes statement is one line (`x.strokes = [];`), a block (`x.strokes = [`
  // … `];`), or a ternary that opens its array on a later line; all end at `];`.
  if (/\.strokes\s*=/.test(lines[i]))
    inStrokes = !/;\s*$/.test(lines[i]) || /\[\s*$/.test(lines[i]);
  const trimmed = lines[i].trim();
  const configKey =
    /Config$/.test(fn) &&
    /^(fieldStroke|controlStroke|trackStroke|thumbStroke|stroke)\s*:/.test(
      trimmed,
    );
  const scope = inStrokes ? "strokes" : configKey ? "config" : null;
  if (scope) {
    // A config key's value runs to the first line that ends its statement with
    // a comma; a ternary spreads over several. Reading a fixed window instead
    // bled into the text-colour keys that follow, and reported six ghosts.
    let window = lines[i];
    if (scope === "config") {
      let j = i;
      while (!/,\s*$/.test(lines[j]) && j < i + 8 && j < lines.length - 1) {
        j += 1;
        window += " " + lines[j];
      }
    }
    for (const prim of OLD) {
      if (
        window.includes(`"${prim}"`) &&
        !(scope === "strokes" && STROKE_MARKS_ALLOWED.has(fn))
      ) {
        const k = `${fn} still uses ${prim}`;
        offenders.set(k, (offenders.get(k) || 0) + 1);
      }
    }
  }
  if (inStrokes && /\];/.test(lines[i])) inStrokes = false;
}
if (offenders.size === 0)
  ok(
    "plugin: no stroke, and no config stroke key, still paints foreground/500 or background/200",
  );
else
  for (const [k, n] of [...offenders.entries()].sort())
    fail(`plugin: ${k}${n > 1 ? ` (×${n})` : ""}`);

// 4. the native outputs
for (const file of [
  "packages/ios/Sources/KozmosColors.swift",
  "packages/android/src/main/java/com/kozmos/tokens/KozmosColors.kt",
]) {
  const src = read(file);
  for (const sym of ["semanticsBorderSubtle", "semanticsBorderInput"]) {
    if (src.includes(sym)) ok(`native: ${path.basename(file)} has ${sym}`);
    else fail(`native: ${file} lacks ${sym} — run pnpm tokens:build`);
  }
}

// 5. the payload
const payload = JSON.parse(read("docs/figma-foundations-payload.json"));
for (const name of ["Border/Subtle", "Border/Input"]) {
  const entry = (payload.variables || []).find((v) => v.figmaName === name);
  if (entry && entry.collection === "Kozmos Semantics")
    ok(`payload: ${name} in Kozmos Semantics`);
  else fail(`payload: ${name} missing — run pnpm figma:foundations`);
}

console.log(
  `\n${problems.length === 0 ? "ok    every consumer reads Semantics.Border" : `${problems.length} problem(s)`}`,
);
process.exit(problems.length === 0 ? 0 : 1);
