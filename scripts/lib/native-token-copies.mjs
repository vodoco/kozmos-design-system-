// Every file the token build writes for the native packages, and where the
// package keeps its copy. Walked from the build rather than listed, so a new
// output is carried from the day it is generated: the hand-kept lists left
// both colors.xml files behind from the 18th and KozmosDesignTokens.kt from
// the 21st.
import fs from "node:fs";
import path from "node:path";

export const BUILT = "packages/tokens/dist";

const HOMES = [
  // [build folder, package folder]
  ["ios", "packages/ios/Sources"],
  ["android", "packages/android"],
];

export function nativeTokenCopies(root) {
  const pairs = [];
  for (const [from, to] of HOMES) {
    const base = path.join(root, BUILT, from);
    if (!fs.existsSync(base)) continue;
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else {
          const rel = path.relative(base, p);
          pairs.push({ built: path.join(BUILT, from, rel), packaged: path.join(to, rel) });
        }
      }
    };
    walk(base);
  }
  return pairs.sort((a, b) => a.built.localeCompare(b.built));
}
