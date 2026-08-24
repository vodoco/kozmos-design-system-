import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const contractPath = path.join(
  root,
  "packages/tokens/src/contrast-contract.json",
);
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const modes = ["light", "dark"];

function readCssVariables(mode) {
  const filePath = path.join(
    root,
    `packages/tokens/dist/css/variables-${mode}.css`,
  );
  const css = fs.readFileSync(filePath, "utf8");
  const variables = {};

  for (const match of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    variables[match[1]] = match[2].trim();
  }

  return variables;
}

function colorFor(variables, tokenName, mode, pairName) {
  const color = variables[tokenName];
  if (!color) {
    throw new Error(`${mode} ${pairName}: missing token --${tokenName}`);
  }

  if (!/^#[0-9a-f]{6}$/i.test(color)) {
    throw new Error(
      `${mode} ${pairName}: expected --${tokenName} to be a 6-digit hex color, received ${color}`,
    );
  }

  return color;
}

function contrastRatio(a, b) {
  const aLuminance = relativeLuminance(hexToRgb(a));
  const bLuminance = relativeLuminance(hexToRgb(b));
  const lighter = Math.max(aLuminance, bLuminance);
  const darker = Math.min(aLuminance, bLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance([r, g, b]) {
  return 0.2126 * linearRgb(r) + 0.7152 * linearRgb(g) + 0.0722 * linearRgb(b);
}

function linearRgb(value) {
  const channel = value / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function hexToRgb(value) {
  const hex = value.trim().replace(/^#/, "");
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

const failures = [];
let checked = 0;

function getPath(value, segments) {
  return segments.reduce((current, segment) => current?.[segment], value);
}

for (const alias of contract.runtimeAliases ?? []) {
  const absolutePath = path.join(root, alias.file);
  const config = require(absolutePath);
  const actual = getPath(config, alias.path);
  checked += 1;

  if (actual !== alias.value) {
    failures.push(
      `${alias.name}: expected ${alias.file} ${alias.path.join(".")} to be ${alias.value}, received ${String(
        actual,
      )}`,
    );
  }
}

for (const mode of modes) {
  const variables = readCssVariables(mode);

  for (const pair of contract.pairs) {
    const background = colorFor(variables, pair.background, mode, pair.name);
    const foreground = colorFor(variables, pair.foreground, mode, pair.name);
    const ratio = contrastRatio(background, foreground);
    checked += 1;

    if (ratio < pair.minimum) {
      failures.push(
        `${mode} ${pair.name}: ${foreground} on ${background} = ${ratio.toFixed(
          2,
        )}; expected >= ${pair.minimum}`,
      );
    }
  }
}

if (failures.length) {
  throw new Error(`Token contrast check failed:\n- ${failures.join("\n- ")}`);
}

console.log(`Token contrast ok (${checked} pairs across light/dark)`);
