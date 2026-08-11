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

const env = import.meta.env;

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
  });
  return `/map/index.html?${q.toString()}`;
}
