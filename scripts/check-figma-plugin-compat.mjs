import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PLUGIN_MAIN = path.join(ROOT, "figma/foundations-importer/code.js");
const PLUGIN_UI = path.join(ROOT, "figma/foundations-importer/ui.html");

const syntaxCheck = spawnSync(process.execPath, ["--check", PLUGIN_MAIN], {
  stdio: "inherit",
});

if (syntaxCheck.status !== 0) {
  process.exit(syntaxCheck.status || 1);
}

const code = fs.readFileSync(PLUGIN_MAIN, "utf8");

function maskStringsAndComments(source) {
  let result = "";
  let index = 0;
  let state = "code";

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (state === "code") {
      if (char === "/" && next === "/") {
        result += "  ";
        index += 2;
        state = "line-comment";
        continue;
      }
      if (char === "/" && next === "*") {
        result += "  ";
        index += 2;
        state = "block-comment";
        continue;
      }
      if (char === '"' || char === "'" || char === "`") {
        result += " ";
        index += 1;
        state = char;
        continue;
      }
      result += char;
      index += 1;
      continue;
    }

    if (state === "line-comment") {
      result += char === "\n" ? "\n" : " ";
      index += 1;
      if (char === "\n") state = "code";
      continue;
    }

    if (state === "block-comment") {
      result += char === "\n" ? "\n" : " ";
      if (char === "*" && next === "/") {
        result += " ";
        index += 2;
        state = "code";
      } else {
        index += 1;
      }
      continue;
    }

    result += char === "\n" ? "\n" : " ";
    if (char === "\\") {
      if (next) {
        result += next === "\n" ? "\n" : " ";
        index += 2;
      } else {
        index += 1;
      }
      continue;
    }
    if (char === state) state = "code";
    index += 1;
  }

  return result;
}

const syntaxOnlyCode = maskStringsAndComments(code);
const unsupportedPatterns = [
  {
    label: "object/rest spread",
    pattern: /\.\.\./,
    reason:
      "Figma plugin sandbox parsing rejected spread syntax in this project.",
  },
  {
    label: "optional chaining",
    pattern: /\?\./,
    reason:
      "Avoid newer syntax in plugin main code; Figma uses its own parser.",
  },
  {
    label: "nullish coalescing",
    pattern: /\?\?/,
    reason:
      "Avoid newer syntax in plugin main code; Figma uses its own parser.",
  },
];

const failures = unsupportedPatterns.filter(({ pattern }) =>
  pattern.test(syntaxOnlyCode),
);

if (failures.length > 0) {
  console.error("Figma plugin compatibility check failed:");
  for (const failure of failures) {
    console.error(`- ${failure.label}: ${failure.reason}`);
  }
  process.exit(1);
}

/**
 * Every component a person can pick must be one the plugin knows how to build,
 * and every component it knows how to build must be pickable.
 *
 * `ui.html` says the same thing twice: a `<select>` of `<option>` values, and a
 * registry keyed by the same names carrying each one's build, update and
 * rebuild messages. MetaStrip's painter landed in the registry and not in the
 * select, so it was fully wired, stamped, verified — and absent from the only
 * menu that can start it. Nothing caught that, because everything else checks
 * the half that was right.
 */
const ui = fs.readFileSync(PLUGIN_UI, "utf8");
const optionKeys = new Set(
  [...ui.matchAll(/<option value="([A-Za-z0-9]+)"/g)].map((match) => match[1]),
);
const registryKeys = new Set(
  [...ui.matchAll(/([A-Za-z][A-Za-z0-9]*):\s*\{\s*\n\s*label:[^\n]*\n\s*build:/g)].map(
    (match) => match[1],
  ),
);

const notPickable = [...registryKeys].filter((key) => !optionKeys.has(key));
const notBuildable = [...optionKeys].filter((key) => !registryKeys.has(key));

if (notPickable.length > 0 || notBuildable.length > 0) {
  console.error("Figma plugin menu check failed:");
  for (const key of notPickable) {
    console.error(`- ${key}: has build/update/rebuild actions but no <option>, so nobody can select it.`);
  }
  for (const key of notBuildable) {
    console.error(`- ${key}: is in the dropdown but has no actions behind it.`);
  }
  process.exit(1);
}

console.log("Figma plugin compatibility ok");
