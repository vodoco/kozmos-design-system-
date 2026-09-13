/**
 * Write a generated JSON file the way lint-staged would commit it.
 *
 * The generators wrote JSON.stringify's output and left the pre-commit hook to
 * prettify it, so a checked-in file never matched what its generator wrote:
 * every regeneration reflowed thousands of lines of short arrays before the
 * real change could be seen — 3,331 lines for the library manifest on
 * 2026-09-13, of which 24 mappings and 22 tokens were the change. Formatting
 * here, with the repository's own Prettier configuration, makes a regeneration
 * a content-only diff, and lets a check compare the checked-in file with what
 * the generator produces.
 */
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";

export async function writeGeneratedJson(filePath, value) {
  const config = (await prettier.resolveConfig(filePath)) || {};
  const formatted = await prettier.format(JSON.stringify(value, null, 2), {
    ...config,
    filepath: filePath,
  });
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, formatted);
}
