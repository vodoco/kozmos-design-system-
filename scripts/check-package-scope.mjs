/**
 * Nothing outside the record still calls the packages `@kozmos/`.
 *
 * The rename to `@kozmos-ds/` was a search and replace over 247 files, recorded
 * as a diff. A diff cannot know about a file written after it: this branch adds
 * eight, four of them changesets whose frontmatter names the package
 * `changeset version` looks up, and one of them `ci.yml`, whose turbo filters
 * would stop matching anything. So the rename is verified rather than trusted.
 *
 * Deliberately left as they were, and why:
 *   docs/archive/, the dated reports  records of what was true on a date
 *   .ai-skills/, PROJECT_SCOPE.md     renaming makes the hook reformat them,
 *                                     and prettier rewrites their malformed
 *                                     nested fences, which changes how they
 *                                     render — a docs change of its own
 */
import { execFileSync } from "node:child_process";

const ALLOWED = [
  /^docs\/archive\//,
  /^\.ai-skills\//,
  /^PROJECT_SCOPE\.md$/,
  /^docs\/[a-z0-9-]*\d{4}-\d{2}-\d{2}[a-z0-9-]*\.md$/,
];

const files = execFileSync("git", ["grep", "-l", "@kozmos/", "--", "."], {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

const unexpected = files.filter((f) => !ALLOWED.some((r) => r.test(f)));
console.log(`Package scope\n\n  ${files.length} file(s) mention @kozmos/; ${files.length - unexpected.length} are records the rename left alone.\n`);
for (const f of unexpected) {
  const hits = execFileSync("git", ["grep", "-c", "@kozmos/", "--", f], { encoding: "utf8" }).trim();
  console.log(`  FAIL  ${hits.split(":").pop()} reference(s) in ${f}`);
}
if (!unexpected.length) console.log("  ok    only the records still say @kozmos/");
process.exitCode = unexpected.length ? 1 : 0;
