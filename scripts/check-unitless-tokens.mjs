/**
 * A token that is a bare number is not a length.
 *
 * The layout tokens are emitted as unitless numbers — `--primitives-layout-
 * spacing-200: 16` — because the natives want a number and Tailwind's theme
 * multiplies them itself. In CSS a bare number is not a `<length>`, so a
 * declaration like `height: var(--primitives-layout-spacing-200)` is invalid
 * and the browser drops it silently: no warning, no fallback, the property
 * simply keeps its initial value. The rule reads as if it works.
 *
 * That is how GAP-38 survived: the map sheet's drag handle asked for a 16px row
 * holding a 40px grip and got a 4px row holding nothing, in every engine, for
 * as long as the component has existed. Three declarations, no test, because
 * the package's own browser fixtures had no doctype and quirks mode accepts a
 * unitless length.
 *
 * So this check reads the token values the build emits, finds every custom
 * property whose value is a bare number, and scans the owned stylesheets for
 * one used where a length is required. The conversion is `calc(var(…) * 1px)`,
 * as the owned blur and slide rules already make.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TOKENS = "packages/tokens/dist/css/variables-light.css";
const SOURCES = ["packages/react/src/index.css", "packages/react/src/styles"];

// Properties that take a <length>. A unitless token reaching one of these is
// dropped; anywhere else (line-height, z-index, opacity, flex-grow) a bare
// number is exactly right, so those uses are not this check's business.
const LENGTH_PROPERTIES = new Set([
  "width", "height", "min-width", "min-height", "max-width", "max-height",
  "block-size", "inline-size", "min-block-size", "min-inline-size",
  "max-block-size", "max-inline-size",
  "top", "right", "bottom", "left",
  "inset", "inset-block", "inset-inline",
  "inset-block-start", "inset-block-end",
  "inset-inline-start", "inset-inline-end",
  "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
  "margin-block", "margin-inline", "margin-block-start", "margin-block-end",
  "margin-inline-start", "margin-inline-end",
  "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
  "padding-block", "padding-inline", "padding-block-start", "padding-block-end",
  "padding-inline-start", "padding-inline-end",
  "gap", "row-gap", "column-gap",
  "border-radius", "border-top-left-radius", "border-top-right-radius",
  "border-bottom-left-radius", "border-bottom-right-radius",
  "border-width", "border-top-width", "border-right-width",
  "border-bottom-width", "border-left-width",
  "outline-width", "outline-offset",
  "flex-basis", "font-size", "letter-spacing", "word-spacing", "text-indent",
  "stroke-width", "scroll-padding", "scroll-margin", "border-spacing",
]);

if (!fs.existsSync(path.join(ROOT, TOKENS))) {
  console.error(
    `Cannot read ${TOKENS}. Build the tokens first: pnpm tokens:build`,
  );
  process.exit(1);
}

const unitless = new Set();
const tokenCss = fs.readFileSync(path.join(ROOT, TOKENS), "utf8");
for (const match of tokenCss.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;}]+)[;}]/g)) {
  if (/^-?\d+(\.\d+)?$/.test(match[2].trim())) unitless.add(match[1]);
}

const files = [];
for (const entry of SOURCES) {
  const full = path.join(ROOT, entry);
  if (!fs.existsSync(full)) continue;
  if (fs.statSync(full).isDirectory())
    for (const name of fs.readdirSync(full).sort())
      if (name.endsWith(".css")) files.push(path.join(entry, name));
  else files.push(entry);
}

const problems = [];
for (const rel of files) {
  const raw = fs.readFileSync(path.join(ROOT, rel), "utf8");
  // Blank comments out rather than removing them, so line numbers survive.
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
  for (const decl of src.matchAll(
    /(?:^|[;{])\s*([a-z-]+)\s*:\s*([^;{}]*?)\s*(?=[;}])/g,
  )) {
    const property = decl[1];
    const value = decl[2];
    if (!LENGTH_PROPERTIES.has(property) || !value.includes("var(--")) continue;
    for (const use of value.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
      if (!unitless.has(use[1])) continue;
      // Converted where the var is multiplied by a unit — `* 1px`, and the
      // `* 1rem / 16` the typography rules use.
      const rest = value.slice(value.indexOf(use[0]));
      if (/^var\((?:[^()]|\([^()]*\))*\)\s*\*\s*1(px|rem|em)\b/.test(rest))
        continue;
      const line = src.slice(0, decl.index + decl[0].indexOf(property)).split("\n").length;
      problems.push(`${rel}:${line}  ${property}: var(${use[1]}) — ${use[1]} is a bare number, so this declaration is dropped. Use calc(var(${use[1]}) * 1px).`);
    }
  }
}

console.log(
  `Unitless tokens used as lengths\n\n  ${unitless.size} custom properties are bare numbers; ${files.length} owned stylesheets read.\n`,
);
for (const problem of problems) console.log(`  FAIL  ${problem}`);
if (!problems.length) console.log("  ok    every length converts its token");
process.exitCode = problems.length ? 1 : 0;
