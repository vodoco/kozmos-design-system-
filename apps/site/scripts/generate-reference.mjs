#!/usr/bin/env node
/**
 * Generates the component reference's data from the design system's own
 * sources, so the site never restates by hand what the repository already
 * says:
 *
 *  - the component list and its lanes from scripts/skills/check-completion.ts
 *    (the same sets that build STATUS.md);
 *  - each component's description and its React, Vue, SwiftUI and Compose
 *    snippets from its .mdx documentation (the PlatformSnippets block);
 *  - each component's props from the TypeScript source, through
 *    react-docgen-typescript, as the Storybook docs do.
 *
 * Output (gitignored, rebuilt by `pnpm generate` before dev, build and
 * typecheck): src/generated/components.json — the index — and
 * src/generated/components/<slug>.json, one per component.
 *
 *   node scripts/generate-reference.mjs            # write
 *   node scripts/generate-reference.mjs --check    # fail if the output would change
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..", "..");
const COMPONENTS_DIR = path.join(REPO_ROOT, "packages/react/src/components");
const STATUS_SCRIPT = path.join(REPO_ROOT, "scripts/skills/check-completion.ts");
const OUT_DIR = path.join(SITE_ROOT, "src/generated");
const CONTRAST_CONTRACT = path.join(REPO_ROOT, "packages/tokens/src/contrast-contract.json");

export const LANES = {
  core: "Core",
  "code-only": "Code-only / utility",
  "product-sdk": "Product / SDK",
  "platform-form-factor": "Platform / form factor",
};

/** PascalCase to kebab-case, keeping acronyms whole: POIDetailPanel → poi-detail-panel. */
export function slugOf(name) {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

/** The name sets the status script classifies by, read from its source. */
export function readLaneSets(source) {
  const setOf = (constant) => {
    const match = source.match(
      new RegExp(`const ${constant} = new Set\\(\\[([\\s\\S]*?)\\]\\)`),
    );
    if (!match) throw new Error(`${constant} not found in check-completion.ts`);
    return new Set([...match[1].matchAll(/"([A-Za-z0-9]+)"/g)].map((m) => m[1]));
  };
  return {
    internal: setOf("INTERNAL_COMPONENT_NAMES"),
    productSdk: setOf("PRODUCT_SDK_COMPONENT_NAMES"),
    codeOnly: setOf("CODE_ONLY_UTILITY_COMPONENT_NAMES"),
    platform: setOf("PLATFORM_FORM_FACTOR_COMPONENT_NAMES"),
  };
}

export function laneOf(name, sets) {
  if (sets.codeOnly.has(name)) return "code-only";
  if (sets.productSdk.has(name)) return "product-sdk";
  if (sets.platform.has(name)) return "platform-form-factor";
  return "core";
}

/**
 * The first paragraph after the mdx's title: prose, not an import, a JSX
 * block or a heading. Markdown emphasis is dropped; inline code is kept.
 */
export function readDescription(mdx) {
  const lines = mdx.split("\n");
  const title = lines.findIndex((line) => /^#\s+\S/.test(line));
  const paragraph = [];
  for (const line of lines.slice(title + 1)) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (paragraph.length) break;
      continue;
    }
    if (/^(import |<|#|export )/.test(trimmed)) {
      if (paragraph.length) break;
      continue;
    }
    paragraph.push(trimmed);
  }
  return paragraph.join(" ").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/(^|[^*])\*([^*]+)\*/g, "$1$2");
}

function dedent(code) {
  const lines = code.replace(/^\n+|\s+$/g, "").split("\n");
  const indent = Math.min(
    ...lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length),
  );
  return lines.map((line) => line.slice(Number.isFinite(indent) ? indent : 0)).join("\n");
}

/** The PlatformSnippets block's code, per platform, from an mdx source. */
export function readSnippets(mdx) {
  const snippets = {};
  for (const match of mdx.matchAll(/\b(react|vue|swift|kotlin)=\{`([\s\S]*?)`\}/g)) {
    const [, platform, code] = match;
    if (!(platform in snippets)) snippets[platform] = dedent(code);
  }
  return snippets;
}

/** A folder's component sources: the .tsx files, not its stories, tests, mappings or barrel. */
function sourceFilesOf(directory) {
  return fs
    .readdirSync(directory)
    .filter((name) => /\.tsx$/.test(name) && !/\.(stories|test|spec|figma)\.tsx$/.test(name))
    .map((name) => path.join(directory, name));
}

/** A React component's name, as opposed to a helper (`buttonVariants`) or a constant (`BUTTON_EMOTIONS`). */
export function isComponentName(name) {
  return /^[A-Z][A-Za-z0-9]*$/.test(name) && !/^[A-Z0-9_]+$/.test(name);
}

/** A prop's type as one line: a union's members spelled out, an object's raw text. */
export function typeText(type) {
  if (!type) return "";
  if (type.name === "enum" && Array.isArray(type.value)) {
    return type.value.map((member) => member.value).join(" | ");
  }
  return type.raw ?? type.name ?? "";
}

function readProps(files) {
  const docgen = require("react-docgen-typescript");
  const parser = docgen.withCustomConfig(path.join(REPO_ROOT, "packages/react/tsconfig.json"), {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    // A component's own props, not the hundreds every element inherits.
    propFilter: (prop) => !prop.parent || !prop.parent.fileName.includes("node_modules"),
  });
  const byFile = new Map();
  for (const doc of parser.parse(files)) {
    if (!isComponentName(doc.displayName)) continue;
    const list = byFile.get(doc.filePath) ?? [];
    if (list.some((part) => part.name === doc.displayName)) continue;
    list.push({
      name: doc.displayName,
      description: doc.description ?? "",
      props: Object.values(doc.props)
        .map((prop) => ({
          name: prop.name,
          type: typeText(prop.type),
          required: Boolean(prop.required),
          defaultValue: prop.defaultValue?.value ?? null,
          description: prop.description ?? "",
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    });
    byFile.set(doc.filePath, list);
  }
  return byFile;
}

export function generate() {
  const sets = readLaneSets(fs.readFileSync(STATUS_SCRIPT, "utf8"));
  const names = fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !sets.internal.has(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const allFiles = names.flatMap((name) => sourceFilesOf(path.join(COMPONENTS_DIR, name)));
  const propsByFile = readProps(allFiles);

  const components = names.map((name) => {
    const directory = path.join(COMPONENTS_DIR, name);
    const mdxPath = path.join(directory, `${name}.mdx`);
    const mdx = fs.existsSync(mdxPath) ? fs.readFileSync(mdxPath, "utf8") : "";
    const parts = sourceFilesOf(directory)
      .flatMap((file) => propsByFile.get(file) ?? [])
      .sort((a, b) => (a.name === name ? -1 : b.name === name ? 1 : a.name.localeCompare(b.name)));
    return {
      name,
      slug: slugOf(name),
      lane: laneOf(name, sets),
      // The docs' first paragraph; failing that, the component's own doc comment.
      description:
        readDescription(mdx) ||
        parts.find((part) => part.name === name)?.description.split("\n\n")[0] ||
        "",
      snippets: readSnippets(mdx),
      parts,
    };
  });

  return {
    index: {
      lanes: LANES,
      components: components.map(({ name, slug, lane, description, parts }) => ({
        name,
        slug,
        lane,
        description,
        exports: parts.map((part) => part.name),
      })),
    },
    components,
  };
}

function writeIfChanged(file, content, check) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (current === content) return false;
  if (check) return true;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const check = process.argv.includes("--check");
  const { index, components } = generate();
  const changed = [];
  const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
  if (writeIfChanged(path.join(OUT_DIR, "components.json"), json(index), check)) {
    changed.push("components.json");
  }
  // The contrast contract, as CI checks it, for the colour page to measure.
  const contract = JSON.parse(fs.readFileSync(CONTRAST_CONTRACT, "utf8"));
  if (writeIfChanged(path.join(OUT_DIR, "contrast-contract.json"), json(contract), check)) {
    changed.push("contrast-contract.json");
  }
  for (const component of components) {
    const file = path.join(OUT_DIR, "components", `${component.slug}.json`);
    if (writeIfChanged(file, json(component), check)) changed.push(path.basename(file));
  }
  // Drop files for components that no longer exist.
  const componentsDir = path.join(OUT_DIR, "components");
  if (fs.existsSync(componentsDir)) {
    const expected = new Set(components.map((c) => `${c.slug}.json`));
    for (const name of fs.readdirSync(componentsDir)) {
      if (!expected.has(name)) {
        if (!check) fs.rmSync(path.join(componentsDir, name));
        changed.push(`- ${name}`);
      }
    }
  }
  if (check && changed.length) {
    console.error(`generate-reference: ${changed.length} file(s) out of date: ${changed.join(", ")}`);
    process.exit(1);
  }
  console.log(
    `generate-reference: ${components.length} components, ${components.reduce((n, c) => n + c.parts.length, 0)} parts${changed.length ? `, ${changed.length} file(s) written` : ", unchanged"}.`,
  );
}
