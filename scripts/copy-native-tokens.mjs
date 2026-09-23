/**
 * Copy the token build's native files over the packages' copies.
 *
 * Run after `pnpm tokens:build`. `pnpm tokens:copies:check` fails while any
 * copy differs from the build.
 */
import fs from "node:fs";
import path from "node:path";
import { BUILT, nativeTokenCopies } from "./lib/native-token-copies.mjs";

const ROOT = process.cwd();
const pairs = nativeTokenCopies(ROOT);
if (!pairs.length) {
  console.error(`Nothing built under ${BUILT}/ios or ${BUILT}/android; run pnpm tokens:build first.`);
  process.exit(1);
}
let changed = 0;
for (const { built, packaged } of pairs) {
  const src = fs.readFileSync(path.join(ROOT, built));
  const dest = path.join(ROOT, packaged);
  const same = fs.existsSync(dest) && fs.readFileSync(dest).equals(src);
  if (!same) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, src);
    changed++;
  }
  console.log(`  ${same ? "same   " : "copied "} ${packaged}`);
}
console.log(`\n${changed} of ${pairs.length} native token file(s) copied`);
