/**
 * **Runtime import cycles in `src/`.**
 *
 *     node scratch/cycles.mjs
 *
 * ⚠️ **Only VALUE imports make a cycle.** `import type {…}` and `import { type X }` are erased by
 * TypeScript before a bundler ever sees an edge, so a type-only loop is not a loop. Four of the five
 * "cycles" a naive scan reports in this app are type-only, and chasing them would mean refactoring
 * code that is already correct.
 *
 * ⚠️ **This exists because the throwaway version of it lied.** Its regex required a relative
 * specifier, so on
 *
 *     import { io } from "socket.io-client";
 *     import type { Transport } from "./presence";
 *
 * it skipped past the first line's specifier and swallowed BOTH lines into one match — whose clause
 * then began `{ io }` rather than `type`, so a type-only import was reported as a value one. It
 * named `presence ⇄ realtime` as a cycle twice, and only a hand check caught it. Match every
 * specifier, then filter: a scanner that is wrong is worse than no scanner, because it is believed.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname, normalize, relative } from "node:path";

const ROOT = "src";
const files = [];
(function walk(d) {
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(f.name)) files.push(p);
  }
})(ROOT);

/** `./foo` → the file it means, trying the extensions a bundler would. */
const resolve = (from, spec) => {
  const base = normalize(join(dirname(from), spec));
  for (const ext of ["", ".tsx", ".ts", "/index.tsx", "/index.ts"])
    if (existsSync(base + ext) && /\.tsx?$/.test(base + ext)) return base + ext;
  return null;
};

/** Every `from "…"` in the file, with the clause that precedes it — no assumption about the spec. */
const IMPORTS = /(?:^|\n)\s*(?:import|export)\s+([\s\S]*?)\s*from\s+["']([^"']+)["']/g;

const graph = new Map();
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const deps = [];
  for (const m of src.matchAll(IMPORTS)) {
    const clause = m[1].trim();
    const spec = m[2];
    if (!spec.startsWith(".")) continue;
    // `import type {…}` — erased. And `{ type A, type B }` — every binding erased.
    if (/^type\b/.test(clause)) continue;
    const named = clause.match(/^\{([\s\S]*)\}$/);
    if (
      named &&
      named[1]
        .split(",")
        .filter((x) => x.trim())
        .every((x) => /^type\s/.test(x.trim()))
    )
      continue;
    const target = resolve(file, spec);
    if (target) deps.push(target);
  }
  graph.set(file, deps);
}

const state = new Map();
const stack = [];
const cycles = new Set();
const visit = (n) => {
  if (state.get(n) === 1) {
    cycles.add(
      stack
        .slice(stack.indexOf(n))
        .concat(n)
        .map((x) => relative(ROOT, x))
        .join(" → "),
    );
    return;
  }
  if (state.get(n) === 2) return;
  state.set(n, 1);
  stack.push(n);
  for (const d of graph.get(n) ?? []) visit(d);
  stack.pop();
  state.set(n, 2);
};
for (const f of files) visit(f);

console.log(`${files.length} modules scanned`);
if (cycles.size) {
  console.error(`\n${cycles.size} runtime import cycle(s):`);
  for (const c of cycles) console.error("  ✗ " + c);
  process.exit(1);
}
console.log("no runtime import cycles");
