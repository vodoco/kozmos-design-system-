/**
 * **Generate `src/mock/taxonomyData.ts` from the published Pointr taxonomy.**
 *
 *     pnpm taxonomy:gen            # the pinned version below
 *     pnpm taxonomy:gen 10.12.0    # a different one
 *
 * ⚠️ **The prototype must not fetch the taxonomy at runtime.** It is a published artefact behind a
 * version in its URL, and a running prototype whose type list can change underneath it is not a
 * thing anyone can review — the screenshot somebody shares would stop matching what they see. So
 * the version is PINNED, the data is checked in, and this script is how it moves.
 *
 * ⚠️ **Everything here is a copy, never a rewrite.** Display names, descriptions, categories,
 * classes, suggested properties, control types and value lists are the taxonomy's own words. Where
 * this app needs a judgement the taxonomy does not make, that judgement lives in `taxonomy.ts` or
 * `properties.ts` where it can be read and argued with — not smuggled in here.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { get } from "node:https";

/** The release this prototype is drawn from. Bump deliberately, and say so in the hand-off. */
const VERSION = process.argv[2] || "10.11.0";
const URL = `https://pointrmapstorage.blob.core.windows.net/taxonomy/${VERSION}/taxonomy.json`;
const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "src", "mock", "taxonomyData.ts");

const fetchJson = (url) =>
  new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`${url} → HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      // ⚠️ Concatenated as BUFFERS, not as strings. A multi-byte character split across two chunks
      // decodes to replacement characters if you join the pieces as text, and the damage is
      // invisible until somebody reads a mangled description months later.
      res.on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });

const t = await fetchJson(URL);
if (t?.metadata?.version !== VERSION)
  throw new Error(`asked for ${VERSION}, the file says ${t?.metadata?.version}`);

/* ── types ────────────────────────────────────────────────────────────────────
   One row per (mainType, subType). A row with no subType is the mainType itself — 39 of the 43
   mainTypes publish one, and it carries the name the dashboard shows above the sub-type picker. */
const types = t.taxonomy.map((x) => ({
  mainType: x.mainType,
  subType: x.subType || null,
  displayName: x.displayName || "",
  class: x.class || "poi",
  category: x.category || null,
  description: x.description || "",
  /** What the taxonomy expects this type to carry — the panel's suggested fields. */
  suggested: x.suggestedProperties || [],
  /**
   * The words people actually use for it. Not decoration: the type picker searches these, so
   * "food hall" finds Food Court and "loo" finds a restroom — which is the difference between a
   * list of 362 and a list you can get to the bottom of.
   */
  alsoKnownAs: x.alsoKnownAs || [],
  isPoi: !!x.apiAssignments?.isPoi,
}));

/* ── properties ───────────────────────────────────────────────────────────────
   All 60, with the control the taxonomy asks for and the values it publishes. */
const properties = Object.values(t.properties).map((p) => ({
  key: p.key,
  displayName: p.display?.displayName || p.key,
  description: p.description || "",
  valueType: p.valueType,
  inputType: p.inputType,
  segment: p.segment || "Other",
  /** The taxonomy's own ordering, which is why this app no longer invents one. */
  order: typeof p.display?.order === "number" ? p.display.order : 9999,
  values: p.values && p.values.length ? p.values : null,
  /** `tsa-precheck` → `TSA PreCheck`. A closed list is only usable if its values have names. */
  valueLabels: p.display?.valueDisplay
    ? Object.fromEntries(
        Object.entries(p.display.valueDisplay).map(([k, v]) => [
          k,
          v?.displayName ?? k,
        ]),
      )
    : null,
  /** Set where the property is an action on the POI card — `websiteUrl` → a *Website* button. */
  actionName: p.actionName || null,
  /** Written by the platform, not by a content editor. The panel must not offer these. */
  isSystem: !!p.isSystem,
  maxCount: typeof p.maxCount === "number" ? p.maxCount : null,
}));
properties.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));

/* ── personas ─────────────────────────────────────────────────────────────── */
const personas = t.mapPersonas.map((p) => ({
  key: p.key,
  displayName: p.displayName,
  color: p.color,
  isDefault: !!p.isDefault,
  description: p.description || "",
}));

/** Segment → the lowest `order` any of its properties has, so segments sort the same way. */
const segments = [...new Set(properties.map((p) => p.segment))].sort(
  (a, b) =>
    Math.min(...properties.filter((p) => p.segment === a).map((p) => p.order)) -
    Math.min(...properties.filter((p) => p.segment === b).map((p) => p.order)),
);

const j = (v) => JSON.stringify(v, null, 2).replace(/\n/g, "\n");

writeFileSync(
  OUT,
  `/**
 * **The published Pointr taxonomy, as this prototype carries it.** GENERATED — do not hand-edit.
 *
 *     pnpm taxonomy:gen
 *
 * Source: ${URL}
 * Generated from that file's own metadata: ${t.metadata.totalItems} types, ${properties.length} properties,
 * ${personas.length} personas, ${t.metadata.mainTypes} main types, ${segments.length} segments.
 *
 * ⚠️ **Pinned, not fetched.** A prototype whose type list can change underneath it cannot be
 * reviewed — the screenshot somebody shares stops matching what they see. See scripts/gen-taxonomy.mjs.
 *
 * ⚠️ **Data only.** Every judgement this app makes ON this data lives in \`taxonomy.ts\` and
 * \`properties.ts\`, where it can be read and argued with.
 */

export const TAXONOMY_VERSION = ${JSON.stringify(VERSION)};
export const TAXONOMY_SOURCE = ${JSON.stringify(URL)};

/** One row per (mainType, subType). \`subType: null\` is the main type itself. */
export interface TaxonomyType {
  mainType: string;
  subType: string | null;
  displayName: string;
  class: string;
  category: string | null;
  description: string;
  suggested: string[];
  alsoKnownAs: string[];
  isPoi: boolean;
}

export interface TaxonomyProperty {
  key: string;
  displayName: string;
  description: string;
  valueType: string;
  inputType: string;
  segment: string;
  order: number;
  values: string[] | null;
  valueLabels: Record<string, string> | null;
  actionName: string | null;
  isSystem: boolean;
  maxCount: number | null;
}

export interface TaxonomyPersona {
  key: string;
  displayName: string;
  color: string;
  isDefault: boolean;
  description: string;
}

export const TYPES: TaxonomyType[] = ${j(types)};

export const PROPERTIES: TaxonomyProperty[] = ${j(properties)};

export const PERSONAS: TaxonomyPersona[] = ${j(personas)};

/** Segments in the taxonomy's own order — the order its \`display.order\` puts them in. */
export const SEGMENTS: string[] = ${j(segments)};
`,
);

console.log(
  `wrote ${OUT}\n  ${types.length} types · ${properties.length} properties · ` +
    `${personas.length} personas · ${segments.length} segments · taxonomy ${VERSION}`,
);
