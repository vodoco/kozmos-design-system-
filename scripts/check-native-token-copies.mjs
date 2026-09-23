/**
 * Hold the packages' native token files to the build.
 *
 * The iOS and Android packages ship copies of what `pnpm tokens:build` writes.
 * They were copied by hand from a list, and the list fell behind: until
 * 2026-09-22 KozmosDesignTokens.kt lacked the category palette and both
 * colors.xml files still carried the emotional button colours from before
 * 10cbfb8. This builds nothing; it reads the build, so run the token build
 * first. `pnpm tokens:native:copy` brings the copies up to date.
 */
import fs from "node:fs";
import path from "node:path";
import { BUILT, nativeTokenCopies } from "./lib/native-token-copies.mjs";

const ROOT = process.cwd();
const pairs = nativeTokenCopies(ROOT);
if (!pairs.length) {
  console.log(`  FAIL  nothing built under ${BUILT}/ios or ${BUILT}/android; run pnpm tokens:build first`);
  process.exit(1);
}
const stale = [];
for (const { built, packaged } of pairs) {
  const dest = path.join(ROOT, packaged);
  if (!fs.existsSync(dest)) {
    stale.push(packaged);
    console.log(`  FAIL  ${packaged} is missing; the build writes ${built}`);
  } else if (!fs.readFileSync(dest).equals(fs.readFileSync(path.join(ROOT, built)))) {
    stale.push(packaged);
    console.log(`  FAIL  ${packaged} differs from ${built}`);
  } else console.log(`  ok    ${packaged}`);
}
if (stale.length) {
  console.log(`\n${stale.length} native token file(s) differ from the build; run pnpm tokens:native:copy`);
  process.exit(1);
}
console.log(`\nok    all ${pairs.length} native token files match the build`);
