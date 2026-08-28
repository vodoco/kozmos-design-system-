/**
 * **The persona rule, and nothing else.**
 *
 * ⚠️ **This module imports NOTHING, deliberately** — the same reason `overrideLines.ts` exists as a
 * module of its own. `pointrConfig.ts` reads `import.meta.env` at module scope, so it cannot be
 * transpiled and imported by `scratch/geometry.test.mjs`; anything left in there is untestable by
 * construction. The rule lives here so the harness can reach it.
 *
 * ⚠️ **The rule is written TWICE and that is structural** — `public/map/index.html` cannot import
 * from `src/`, so it carries its own `personaOk()`. The two must agree. Before 2026-08-28 they did
 * not: the shell normalised the string shapes a vector tile produces and this side did not, so a
 * tile-shaped `mapPersonas` fell straight through as "visible" and the app's filter silently did
 * nothing. The shell's comment claimed tests held the two together; the tests asked only the shell.
 *
 * They are now asserted against **one shared table**, both implementations, every case — see the
 * `persona` block in `scratch/geometry.test.mjs`. That is the only thing holding them together, and
 * this time it is true.
 */

/**
 * **Is this feature meant for the persona the map is rendered for?**
 *
 * ⚠️ **Two shapes, one rule.** A vector tile flattens an array property to a string, so
 * `mapPersonas` arrives as `a,b,c` — or, on this instance, as the bracketed JSON form
 * `["a","b","c"]` — while our own GeoJSON keeps a real array. Read only the array and the persona
 * applies on one render path and not the other, which is the exact split that let the tile-drawn
 * floor be filtered while everything the app fetched for itself was not.
 *
 * ⚠️ **No `mapPersonas` at all means VISIBLE**, not hidden — the platform's own rule, and the safer
 * direction: unmarked is unclassified, not private. An empty list means the same thing.
 *
 * ⚠️ **No persona means no filtering.** Without this guard an empty `persona` matches nothing and
 * every marked feature on the floor disappears — a blank building presented as a working one.
 * `MAP_PERSONA` uses `??`, which does not catch an env var set to the empty string, so this guard
 * is load-bearing rather than theoretical.
 */
export function isVisibleToPersona(
  mapPersonas: unknown,
  persona: string,
): boolean {
  if (!persona || mapPersonas == null || mapPersonas === "") return true;
  const list = Array.isArray(mapPersonas)
    ? mapPersonas.map(String)
    : String(mapPersonas)
        .replace(/[[\]"\s]/g, "")
        .split(",")
        .filter(Boolean);
  if (!list.length) return true;
  // Whole keys, not substrings: `facilityManagerAssistant` is not `facilityManager`.
  return list.indexOf(persona) >= 0;
}
