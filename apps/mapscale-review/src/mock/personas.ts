/**
 * **The six map personas, read off the published taxonomy** — Pointr Maps Indoor Mapping Taxonomy
 * `10.10.0`, `mapPersonas[]`. Key, display name, colour and description are the taxonomy's own
 * values, not this app's choices, so a persona chip here is the same colour the map itself uses.
 *
 * Order is the taxonomy's order, and `customer` is its `isDefault`.
 *
 * ⚠️ **This is a snapshot, not a fetch.** The taxonomy is a published artefact behind a version in
 * its URL; pinning it here means a persona cannot change colour underneath a running prototype. When
 * the version moves, regenerate rather than hand-edit — the source of truth is:
 * `https://pointrmapstorage.blob.core.windows.net/taxonomy/10.10.0/taxonomy.json`
 *
 * ⚠️ **Colour is decoration, never the state.** The check mark says whether a persona can see the
 * feature; the diamond only says which persona the row is. A row read by colour alone is unreadable
 * to anyone who cannot separate #6D1B2A from #8D6E63, which is most people at 11px.
 */
import { PERSONAS } from "./taxonomyData";

export type MapPersona = {
  key: string;
  displayName: string;
  /** The taxonomy's own colour for this persona — also what its map style uses. */
  color: string;
  isDefault: boolean;
  /** The taxonomy's definition, shown behind the row's (i). */
  description: string;
};

/**
 * ⚠️ **The data is no longer typed out here.** It is generated from the published taxonomy into
 * `taxonomyData.ts` (`pnpm taxonomy:gen`), which is also where the version lives — this file had a
 * second `TAXONOMY_VERSION` of its own, and the two had already drifted apart (10.10.0 here against
 * 10.11.0 there) so the app reported a different version depending on which module you imported.
 *
 * What stays here is the part that is a JUDGEMENT rather than a reading: the three-state model, and
 * what an untouched persona means.
 */
export { TAXONOMY_VERSION } from "./taxonomyData";

export const MAP_PERSONAS: MapPersona[] = PERSONAS;

export const PERSONA_BY_KEY: Record<string, MapPersona> = Object.fromEntries(
  MAP_PERSONAS.map((p) => [p.key, p]),
);

/**
 * The three states a persona row can hold across a selection: every selected feature shows it,
 * none does, or they disagree. `indeterminate` exists ONLY while they disagree — see US4.
 */
export type PersonaState = "on" | "off" | "indeterminate";

/**
 * What one persona's row should read across a selection of features.
 *
 * ⚠️ **A feature with no `mapPersonas` is visible to everyone**, which is the platform's rule and
 * the same one `isVisibleToPersona` applies. Treating absence as "off" here would offer to turn on
 * something that was never off.
 */
export function personaStateAcross(
  key: string,
  features: { mapPersonas?: unknown }[],
): PersonaState {
  if (!features.length) return "off";
  const seen = new Set<boolean>();
  for (const f of features) {
    const raw = f.mapPersonas;
    if (raw == null || raw === "") {
      seen.add(true);
      continue;
    }
    const list = Array.isArray(raw)
      ? raw.map(String)
      : String(raw)
          .replace(/[[\]"\s]/g, "")
          .split(",")
          .filter(Boolean);
    seen.add(list.length === 0 ? true : list.indexOf(key) >= 0);
  }
  return seen.size > 1 ? "indeterminate" : seen.has(true) ? "on" : "off";
}

/**
 * A feature's `mapPersonas` as a list, or **`null` when it has none** — which the platform reads as
 * "visible to everyone", not "visible to no one". Handles both wire shapes for the same reason
 * `isVisibleToPersona` does: a vector tile flattens the array to `a,b,c` (or `["a","b","c"]`) while
 * our own GeoJSON keeps a real array.
 */
export function personaListOf(raw: unknown): string[] | null {
  if (raw == null || raw === "") return null;
  const list = Array.isArray(raw)
    ? raw.map(String)
    : String(raw)
        .replace(/[[\]"\s]/g, "")
        .split(",")
        .filter(Boolean);
  return list.length ? list : null;
}

/**
 * Apply the panel's decisions to ONE feature's list. Personas the user left indeterminate appear in
 * neither argument and are therefore untouched — US4: *"If the persona control is left
 * indeterminate, then no change is made to the visibility for that persona."*
 *
 * ⚠️ **An unset list starts as every persona**, not as none, so turning one OFF has to write the
 * other five rather than an empty array — otherwise "hide from Staff" would hide from everybody.
 */
export function applyPersonaEdits(
  raw: unknown,
  edits: Record<string, boolean>,
): string[] {
  const current = personaListOf(raw) ?? MAP_PERSONAS.map((x) => x.key);
  const out = new Set(current);
  for (const [key, on] of Object.entries(edits)) {
    if (on) out.add(key);
    else out.delete(key);
  }
  // Written in the taxonomy's order so two features edited together read the same.
  return MAP_PERSONAS.map((x) => x.key).filter((k) => out.has(k));
}
