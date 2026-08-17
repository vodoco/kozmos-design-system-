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
 * ## It renders now, too — and that is why the properties come with it
 *
 * This began as the editor's geometry supply and nothing else, on the reasoning that the tiles are
 * good at drawing floors and re-implementing their styling would buy nothing. That held until
 * Olcay, 2026-08-16: *"tell me when we see render the map features from geojson source and disable
 * vector tile source."* The map shell now clones the SDK's own `source_ptr` layers onto this
 * collection — **derivation, not authorship**: the paint and layout are the product's, untouched.
 *
 * ⚠️ **A cloned layer styles on properties, so the property bag can no longer be stripped.** It was
 * (`fid` + `geometry` only) to keep the `postMessage` small, and that was right while only the
 * editor read this. A layer that filters on `mainType` and labels on `name` needs the bag, and
 * hand-picking a whitelist would silently blank whichever layer filtered on the field left out. So
 * the bag travels whole and the **size is measured and logged**, rather than guessed at either way.
 */
import { authFetch } from "./session";
import { MAP_PERSONA, POINTR, visibleToPersona } from "../mock/pointrConfig";

/** One feature's true geometry and its own property bag. */
export interface LevelGeometry {
  fid: string;
  geometry: unknown;
  /**
   * The feature's properties, **whole and unfiltered**.
   *
   * ⚠️ Not a whitelist, deliberately. The map shell's cloned layers carry the SDK's own filters,
   * and those name fields this file has no list of — drop the one a layer filters on and that layer
   * renders nothing, with no error anywhere. The cost is a bigger `postMessage`; the size is logged
   * below so it is a number somebody has seen rather than an assumption.
   */
  properties: Record<string, unknown>;
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
        properties?: Record<string, unknown> & { fid?: string };
        geometry?: unknown;
      }[];
      const out: LevelGeometry[] = [];
      let hidden = 0;
      for (const f of feats) {
        const fid = f?.properties?.fid;
        if (!fid || !f.geometry) continue;
        /**
         * ⚠️ **The persona is applied HERE, where the data enters** — not at each of the four
         * places that use it. The editor's geometry, the tree's counts and, since the render swap,
         * **the floor itself** all derive from this list, and the SDK has been filtering its own
         * tiles by persona all along. Filtering downstream would mean four chances to disagree.
         */
        if (!visibleToPersona(f.properties?.mapPersonas)) {
          hidden++;
          continue;
        }
        out.push({
          fid: String(fid),
          geometry: f.geometry,
          properties: f.properties ?? {},
        });
      }
      /**
       * ⚠️ **The one measurement that sizes the render swap.** A whole level now crosses the iframe
       * boundary by `postMessage`, which structured-clones it, and "is a floor small enough to send
       * comfortably?" was an open question with nothing behind it. This is that number. A megabyte
       * is fine and a hundred is not; nobody has to guess which this is any more.
       */
      const kb = Math.round(JSON.stringify(out).length / 1024);
      console.info(
        "[geojson] level",
        lvl,
        "→",
        out.length,
        `features with geometry, unclipped, from the draft content · ${kb} KB to the map shell` +
          (hidden ? ` · ${hidden} hidden from the ${MAP_PERSONA} persona` : ""),
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
