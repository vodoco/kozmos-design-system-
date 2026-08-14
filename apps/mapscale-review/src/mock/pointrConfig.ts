/**
 * The Pointr WebSDK connection, as configuration rather than source.
 *
 * **What this is and isn't.** These values reach the SDK *in the user's browser*, so they are
 * readable by anyone who opens devtools — a client-side licence key cannot be a secret, here or
 * anywhere. What moving them out of the code does buy:
 *   · they leave the source tree and git history,
 *   · QA / staging / production can differ without a code change,
 *   · rotating one is an env-var edit plus a redeploy, not a commit.
 * Actual access control is Pointr's domain allow-list on the licence, and Vercel's Deployment
 * Protection on the URL.
 *
 * Local development reads `.env.local` (gitignored, never uploaded — see `.vercelignore`).
 * Production reads Vercel's project env vars, pulled into the build with `vercel env pull`
 * (the app is built locally and uploaded prebuilt, so Vercel's own env injection never runs —
 * see handoff §7a).
 */
export interface PointrConfig {
  baseUrl: string;
  client: string;
  licence: string;
  site: string;
  building: string;
}

/**
 * **The map persona** (Olcay, 2026-08-14: *"let's use facility manager map persona for the map and
 * content"*). The dashboard is an operator's tool, so it renders the building the way the people
 * who run it see it — not the way a passenger does.
 *
 * `facilityManager` is one of the six canonical keys the platform ships
 * (`customer · visitor · vip · staff · facilityManager · contractor`), confirmed against
 * `docs/PointrCloudRestApiV10.postman_collection.json`, where every feature's `mapPersonas` array
 * is drawn from exactly that set.
 *
 * **The SDK does the rest from this one value.** `Options.personaIdentifier` accepts either a
 * persona's `personaIdentifier` *or* its `key`, so the key is enough. On boot the SDK loads the
 * client's personas, keeps the enabled ones, finds this one, and then:
 *   · **style** — if that persona has a `styleUrl`, it becomes the map's `styleJsonUrl`, which is
 *     what makes the map itself look like the persona rather than just filtering it;
 *   · **content** — `isPoiVisibleForPersonaKey()` hides any POI whose `mapPersonas` excludes the
 *     key. A POI carrying no `mapPersonas` at all stays visible.
 *
 * ⚠️ **A wrong key does not fail loudly.** The SDK falls back to the client's default persona and
 * only writes `"Given persona identifier is not valid, default persona will be applied"` to the
 * console — so a typo here looks like a working map with the wrong style.
 *
 * ⚠️ **`dashboardStyleUrl` is not this.** The `PersonaModel` carries both `styleUrl` and
 * `dashboardStyleUrl`, but the WebSDK reads only `styleUrl` — `dashboardStyleUrl` appears nowhere
 * in the 10.7.1 bundle. It is for a server-rendered dashboard map, not this SDK.
 */

const env = import.meta.env;

export const MAP_PERSONA = env.VITE_POINTR_PERSONA ?? "facilityManager";

export const POINTR: PointrConfig = {
  baseUrl: env.VITE_POINTR_BASE_URL ?? "",
  client: env.VITE_POINTR_CLIENT ?? "",
  licence: env.VITE_POINTR_LICENCE ?? "",
  site: env.VITE_POINTR_SITE ?? "",
  building: env.VITE_POINTR_BUILDING ?? "",
};

/** Which of them are missing — the map page can't boot without all five. */
export function missingPointrConfig(): string[] {
  return Object.entries(POINTR)
    .filter(([, v]) => !v)
    .map(([k]) => `VITE_POINTR_${k === "baseUrl" ? "BASE_URL" : k.toUpperCase()}`);
}

/**
 * The iframe's query string. The map page lives in `public/`, which Vite copies verbatim — it
 * never sees `import.meta.env` — so the parent hands it the connection on the URL. Values are
 * encoded; the map page reads them with URLSearchParams.
 */
export function pointrMapSrc(): string {
  const q = new URLSearchParams({
    baseUrl: POINTR.baseUrl,
    client: POINTR.client,
    licence: POINTR.licence,
    site: POINTR.site,
    building: POINTR.building,
    persona: MAP_PERSONA,
  });
  return `/map/index.html?${q.toString()}`;
}
