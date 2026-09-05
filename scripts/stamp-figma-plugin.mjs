/**
 * Stamp the plugin with a build id derived from its own source.
 *
 * Figma reads a development plugin's files when the plugin *launches*, so a
 * panel left open after an edit runs the previous build and reports success.
 * That has cost several rounds of "I updated it" / "the file disagrees", each
 * ending in a restart. The only way out is to make the build a fact recorded in
 * the file rather than something inferred from a timestamp.
 *
 * The id is the first 12 hex of a SHA-256 of `code.js` with the stamp line
 * itself normalised out, so it is derived rather than maintained: edit the
 * plugin and the id changes; change nothing and it does not. `--check` fails
 * when the stamp is stale, which is what keeps it honest in CI and in the
 * pre-commit hook.
 *
 * The plugin writes the id onto every component set it touches, so
 * `sharedPluginData.kozmos_ds_importer.build` read back over REST says exactly
 * which build produced what is in the file.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";

const FILE = "figma/foundations-importer/code.js";
const LINE = /^const PLUGIN_BUILD = "[^"]*";$/m;

function computeId(source) {
  const normalised = source.replace(LINE, 'const PLUGIN_BUILD = "";');
  return createHash("sha256").update(normalised).digest("hex").slice(0, 12);
}

const source = fs.readFileSync(FILE, "utf8");
if (!LINE.test(source)) {
  console.error(`${FILE}: no PLUGIN_BUILD line to stamp.`);
  process.exit(2);
}

const id = computeId(source);
const current = /^const PLUGIN_BUILD = "([^"]*)";$/m.exec(source)[1];
const check = process.argv.includes("--check");

if (current === id) {
  console.log(`  ok    plugin build stamp is current (${id})`);
  process.exit(0);
}

if (check) {
  console.error(
    `  FAIL  plugin build stamp is ${current || "(empty)"}, source hashes to ${id}.\n` +
      `        Run \`pnpm figma:stamp\` and commit the result.`,
  );
  process.exit(1);
}

fs.writeFileSync(FILE, source.replace(LINE, `const PLUGIN_BUILD = "${id}";`));
console.log(`  stamped ${current || "(empty)"} → ${id}`);
