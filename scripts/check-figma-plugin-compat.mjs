import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PLUGIN_MAIN = path.join(ROOT, "figma/foundations-importer/code.js");

const syntaxCheck = spawnSync(process.execPath, ["--check", PLUGIN_MAIN], {
  stdio: "inherit",
});

if (syntaxCheck.status !== 0) {
  process.exit(syntaxCheck.status || 1);
}

const code = fs.readFileSync(PLUGIN_MAIN, "utf8");
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
  pattern.test(code),
);

if (failures.length > 0) {
  console.error("Figma plugin compatibility check failed:");
  for (const failure of failures) {
    console.error(`- ${failure.label}: ${failure.reason}`);
  }
  process.exit(1);
}

console.log("Figma plugin compatibility ok");
