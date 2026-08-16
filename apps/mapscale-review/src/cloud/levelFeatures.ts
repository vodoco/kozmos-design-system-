/**
 * A level's features as **GeoJSON from Pointr Cloud**, rather than as geometry scraped out of the
 * rendered vector tiles.
 *
 * Olcay, 2026-08-16: *"Can we ditch tiles and just use geojson? So that we can also write
 * changes."* — asked after seeing a terminal-sized shape with a dead-straight line through it.
 *
 * ## Why this exists: a tile has no obligation to hold a whole feature
 *
 * `querySourceFeatures` returns a feature **once per tile it touches, clipped to that tile**. A
 * feature bigger than one tile therefore has *no true outline anywhere in the tiles* — it arrives
 * in pieces whose straight edges are the tile grid rather than the building. The editor was
 * accumulating those pieces and drawing draggable handles on the seams.
 *
 * This is the fix at its root: the API returns the feature's real, unclipped geometry, once.
 *
 * ⚠️ **`draft`, because that is the only scope with a features endpoint.** There is no
 * `content/published/…/levels/{lvl}/features`; the published content reaches the browser as tiles
 * and nothing else. That is the right scope to *edit* — the platform's model is edit-draft, then
 * publish — but it has a consequence worth stating rather than discovering: **the outline you edit
 * can legitimately differ from the one drawn underneath it**, because the tiles are the last
 * publish and this is what has happened since.
 *
 * ## What it deliberately does not do
 *
 * It does not render anything. The SDK's tiles remain what you look at — basemap, floor plan,
 * labels, the lot — and they are good at that. Only the *editor* takes its geometry from here.
 * Replacing the rendering as well would mean re-implementing the SDK's styling for no gain the
 * editor can use.
 */
import { authFetch } from "./session";
import { POINTR } from "../mock/pointrConfig";

/**
 * One feature's true geometry, and nothing else.
 *
 * ⚠️ Stripped to `fid` + `geometry` on purpose. The whole collection crosses into the map iframe by
 * `postMessage`, which structured-clones it, and a floor carries enough features that shipping
 * every property bag twice — the tiles already have them — is a real cost for no use. Properties
 * still come from the tiles; only the shape comes from here.
 */
export interface LevelGeometry {
  fid: string;
  geometry: unknown;
}

/** `sid/bid/lvl` — one level's worth, keyed for the cache. */
const key = (bid: string, lvl: number) => `${bid}/${lvl}`;

/**
 * Cached per level, for the session.
 *
 * A level's geometry does not change under us: this prototype writes nothing back yet, and when it
 * does the write will be the thing that invalidates the entry. Re-fetching on every level switch
 * would put a megabyte on the wire each time somebody flicked between floors to compare them.
 */
const cache = new Map<string, LevelGeometry[]>();
/** In-flight requests, so two callers for one level make one request. */
const pending = new Map<string, Promise<LevelGeometry[]>>();

/**
 * Every feature on a level, by `fid`, with its unclipped geometry.
 *
 * Returns `[]` rather than throwing on any failure — a missing token, a 404, a network blip. The
 * editor **falls back to the tiles** when this is empty, which is exactly the behaviour it had
 * before this existed, so the worst case of the whole feature is "no worse than yesterday".
 */
export async function levelGeometry(
  bid: string,
  lvl: number,
): Promise<LevelGeometry[]> {
  if (!POINTR.baseUrl || !POINTR.client || !POINTR.site || !bid) return [];
  const k = key(bid, lvl);
  const hit = cache.get(k);
  if (hit) return hit;
  const already = pending.get(k);
  if (already) return already;

  const run = (async () => {
    try {
      const res = await authFetch(
        `/api/v10/content/draft/clients/${POINTR.client}` +
          `/sites/${POINTR.site}/buildings/${bid}/levels/${lvl}/features`,
      );
      if (!res.ok) {
        console.info(
          "[geojson] level",
          lvl,
          "features unavailable —",
          res.status,
          "· the editor will read geometry from the tiles instead",
        );
        return [];
      }
      const body = (await res.json()) as {
        result?: { features?: unknown[] };
        features?: unknown[];
      };
      /**
       * ⚠️ The platform wraps some payloads in `result` and returns others bare, so both shapes are
       * accepted rather than one being assumed. Getting this wrong would look exactly like "the
       * level has no features", which is a silent, plausible, wrong answer.
       */
      const feats = (body?.result?.features ?? body?.features ?? []) as {
        properties?: { fid?: string };
        geometry?: unknown;
      }[];
      const out: LevelGeometry[] = [];
      for (const f of feats) {
        const fid = f?.properties?.fid;
        if (fid && f.geometry)
          out.push({ fid: String(fid), geometry: f.geometry });
      }
      console.info(
        "[geojson] level",
        lvl,
        "→",
        out.length,
        "features with geometry, unclipped, from the draft content",
      );
      cache.set(k, out);
      return out;
    } catch (e) {
      console.info(
        "[geojson] level",
        lvl,
        "features failed —",
        (e as Error)?.message,
        "· the editor will read geometry from the tiles instead",
      );
      return [];
    } finally {
      pending.delete(k);
    }
  })();
  pending.set(k, run);
  return run;
}
