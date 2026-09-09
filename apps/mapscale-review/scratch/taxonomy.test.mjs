/**
 * **The taxonomy layer, checked against the real modules.**
 *
 *     node scratch/taxonomy.test.mjs
 *
 * ⚠️ **It compiles `src/mock/*.ts` and imports the OUTPUT.** Re-implementing the lookups here would
 * test a copy and agree with itself; the whole reason this layer exists is that a hand-kept copy of
 * the taxonomy drifts. Same principle as `geometry.test.mjs`, which extracts the map shell's own
 * source rather than restating it.
 *
 * ⚠️ **The numbers are the published taxonomy's, not this app's.** `section` has seven subtypes and
 * `cuisines` has 73 values because 10.11.0 says so. When the pinned version moves, these move with
 * it — that is the point, and a failure here after `pnpm taxonomy:gen` is the signal to read the
 * changelog rather than to edit the expectation.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, renameSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, "..");
const out = mkdtempSync(join(tmpdir(), "taxonomy-test-"));

execFileSync(
  "npx",
  ["tsc",
    join("src", "mock", "taxonomyData.ts"),
    join("src", "mock", "taxonomy.ts"),
    join("src", "mock", "properties.ts"),
    join("src", "mock", "personas.ts"),
    "--outDir", out,
    "--module", "esnext", "--target", "es2022",
    "--moduleResolution", "bundler", "--skipLibCheck"],
  { cwd: app, stdio: ["ignore", "ignore", "inherit"] },
);

// `tsc` emits .js with extensionless relative imports; Node needs both spelled out.
for (const f of readdirSync(out).filter((f) => f.endsWith(".js")))
  renameSync(join(out, f), join(out, f.replace(/\.js$/, ".mjs")));
for (const f of readdirSync(out).filter((f) => f.endsWith(".mjs")))
  writeFileSync(join(out, f), readFileSync(join(out, f), "utf8")
    .replace(/from "\.\/(\w+)"/g, 'from "./$1.mjs"'));

const load = (m) => import(pathToFileURL(join(out, m)).href);
const T = await load("taxonomy.mjs");
const P = await load("properties.mjs");
const A = await load("personas.mjs");

let pass = 0;
const fail = [];
const check = (name, cond) => (cond ? pass++ : fail.push(name));

/* ── the type picker, which is what started this ───────────────────────────────
   Olcay, 2026-09-08, on a `section` whose picker showed "—": the options came from the FLOOR's
   own types, so a floor with one section offered nothing to classify it as. */
check("section offers its 7 subtypes", T.subTypesOf("section").length === 7);
check("…with the taxonomy's display names", T.subTypesOf("section").some((t) => t.displayName === "Food Court"));
check("medical-space offers 33", T.subTypesOf("medical-space").length === 33);
check("a mainType with no subtypes offers none", T.subTypesOf("blueprint").length === 0);

/* ⚠️ 41 of 362 names were wrong under the old mechanical kebab→Title rule. */
check("atm is ATM, not Atm", T.typeLabel("atm") === "ATM");
check("cctv is CCTV", T.typeLabel("cctv") === "CCTV");
check("x-ray-room is X-Ray Room", T.typeLabel("x-ray-room") === "X-Ray Room");
check("food-beverage-space keeps its ampersand", T.typeLabel("food-beverage-space") === "Food & Beverage Space");
check("an unpublished slug still gets a label", T.typeLabel("not-a-real-type") === "Not A Real Type");
check("typeName resolves the pair", T.typeName("section", "food-court") === "Food Court");
check("typeDescription is the taxonomy's own", T.typeDescription("section", "food-court").length > 20);

// Class depends on the PAIR, which is the trap the old hand table was written to avoid.
check("class is per pair, not per mainType",
  T.classOf("circulation-space", "walkway") !== T.classOf("circulation-space", "elevator-lobby"));
check("an unknown type falls back to poi", T.classOf("not-a-real-type") === "poi");
check("category comes off the taxonomy", T.categoryOf("section", "food-court") === "COMMERCIAL");
check("suggested properties come off the taxonomy", (T.suggestedFor("food-beverage-space") || []).length > 0);
check("an unknown type suggests nothing rather than borrowing", T.suggestedFor("not-a-real-type") === null);

// A list of 362 is only usable if you can type at it — and `alsoKnownAs` is why "food hall" works.
check("search finds a type by what people call it",
  T.searchTypes(T.subTypesOf("section"), "food hall").some((t) => t.subType === "food-court"));

/* ── properties ───────────────────────────────────────────────────────────────
   Ten of the sixty were typed out by hand; the other fifty guessed at their own shape. */
check("cuisines knows its 73 values", (P.propertyDef("cuisines").options || []).length === 73);
check("parkingTypes has options at all", (P.propertyDef("parkingTypes").options || []).length > 0);
check("closed-list values have names", P.valueLabel("accessPrograms", "tsa-precheck") === "TSA PreCheck");
check("a value with no published name is left alone", P.valueLabel("accessPrograms", "made-up") === "made-up");
check("31 real segments", P.SEGMENT_ORDER.length === 31);
check("…and the invented ones are gone",
  !P.SEGMENT_ORDER.includes("Metadata") && !P.SEGMENT_ORDER.includes("Operations"));
check("58 editable properties — 60 less the 2 the platform writes", P.EDITABLE_PROPERTIES.length === 58);
check("system properties are not offered",
  !P.EDITABLE_PROPERTIES.some((d) => d.key === "isAccessible" || d.key === "travelTime"));
check("every value type has a word", P.TYPE_LABEL.email === "Email" && P.TYPE_LABEL.image === "Image");

/* ⚠️ A feature really does carry keys the taxonomy does not publish — the demo floor's sections
   have `sl`, `Color` and `Icon Image`. Those must infer, and must NOT claim to be grounded. */
check("an unpublished key infers", P.propertyDef("sl").valueType === "text");
check("…and does not claim to be grounded", !P.propertyDef("sl").grounded);
check("a published key IS grounded", P.propertyDef("cuisines").grounded === true);

/* ── personas ─────────────────────────────────────────────────────────────── */
check("6 personas", A.MAP_PERSONAS.length === 6);
check("colour is the taxonomy's own", A.MAP_PERSONAS[0].color === "#FF9800");
/* ⚠️ There were two `TAXONOMY_VERSION` constants and they disagreed — 10.10.0 here, 10.11.0 in the
   generated module — so the app reported a different version depending on the import path. */
check("one version, and it is the pinned one", A.TAXONOMY_VERSION === "10.11.0");
check("taxonomy.ts re-exports the same one", T.TAXONOMY_VERSION === A.TAXONOMY_VERSION);

rmSync(out, { recursive: true, force: true });
if (fail.length) {
  console.error(`\n${fail.length} of ${pass + fail.length} checks FAILED`);
  for (const f of fail) console.error("  ✗ " + f);
  process.exit(1);
}
console.log(`\n${pass} checks passed`);
