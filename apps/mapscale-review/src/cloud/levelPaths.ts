/**
 * The **wayfinding network** of one level, from Pointr Cloud — the nodes *and* the graph between
 * them.
 *
 * Olcay, 2026-08-16: *"there should be lines with direction on the wayfinding network."*
 *
 * ## The graph is in the data, and so is the direction
 *
 * `GET …/levels/{lvl}/paths` — *"all draft features classified as path of the selected level"* —
 * returns a FeatureCollection of `wayfinding-network` points whose properties carry the edges:
 *
 * ```
 * neighbors:           [{ fid, speed }]   the nodes this one connects to, on this floor
 * transitionNeighbors: [{ fid }]          …and on ANOTHER floor — a way off this level
 * travelTime · isAccessible · isComfortable · transitionGroupId · name · subType
 * ```
 *
 * ⚠️ **Direction is not a property; it is whether the adjacency is returned.** An adjacency list is
 * directed by construction: A naming B does not oblige B to name A. So a **two-way** edge is one
 * both ends declare, and a **one-way** edge is one only its origin declares — an escalator, a
 * one-way corridor, a security lane you cannot walk back through. There was nothing to invent here
 * and nothing to add to the taxonomy; the arrows are simply the shape of the data, drawn.
 *
 * ⚠️ **`transitionNeighbors` point off this floor**, so they have no line to draw on it. They are
 * counted and reported, and the node itself already draws distinctly (§13: the network's two tiers).
 *
 * ## Writing it back is a bigger claim than anywhere else in this app
 *
 * The only write is `POST …/sites/{sid}/paths`, and its own description is explicit: *"It deletes
 * all existing paths for the given site, then inserts the new data provided in the request
 * payload."* **Site-wide, destructive, no per-feature form** — a heavier claim than the per-feature
 * `PUT` the geometry editor would use, and squarely inside the write decision that is still open.
 * Nothing here writes. Editing the network in this prototype is local, like every other edit.
 */
import { authFetch } from "./session";
import { POINTR } from "../mock/pointrConfig";

/** One neighbour, as the API returns it. `speed` is per-edge and only on same-floor neighbours. */
export interface PathNeighbor {
  fid: string;
  speed?: number;
}

/** One wayfinding node: where it is, what kind it is, and what it connects to. */
export interface PathNode {
  fid: string;
  /** `[lng, lat]` — every node in this collection is a Point. */
  at: [number, number];
  subType?: string;
  name?: string;
  neighbors: PathNeighbor[];
  /** Neighbours on another level. No line to draw on this one — see the note above. */
  transitionNeighbors: PathNeighbor[];
}

const key = (bid: string, lvl: number) => `${bid}/${lvl}`;
const cache = new Map<string, PathNode[]>();
const pending = new Map<string, Promise<PathNode[]>>();

/**
 * The level's wayfinding nodes, with their adjacency.
 *
 * Returns `[]` on any failure — a missing token, a 404, a level with no network — for the same
 * reason `levelGeometry` does: the section then draws no edges, which is exactly how the map
 * behaved before this existed. There is no worse case than "yesterday".
 */
export async function levelPaths(
  bid: string,
  lvl: number,
): Promise<PathNode[]> {
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
          `/sites/${POINTR.site}/buildings/${bid}/levels/${lvl}/paths`,
      );
      if (!res.ok) {
        console.info(
          "[paths] level",
          lvl,
          "unavailable —",
          res.status,
          "· the wayfinding section will draw nodes but no edges",
        );
        return [];
      }
      // The same two shapes `levelGeometry` accepts, for the same reason: the platform wraps some
      // payloads in `result` and returns others bare, and guessing wrong looks exactly like an
      // empty level.
      const body = (await res.json()) as {
        result?: { features?: unknown[] };
        features?: unknown[];
      };
      const feats = (body?.result?.features ?? body?.features ?? []) as {
        properties?: Record<string, unknown>;
        geometry?: { type?: string; coordinates?: unknown };
      }[];
      const list = (v: unknown): PathNeighbor[] =>
        Array.isArray(v)
          ? v
              .map((n): PathNeighbor | null => {
                const o = n as { fid?: unknown; speed?: unknown };
                if (!o?.fid) return null;
                const out: PathNeighbor = { fid: String(o.fid) };
                if (typeof o.speed === "number") out.speed = o.speed;
                return out;
              })
              .filter((n): n is PathNeighbor => !!n)
          : [];

      const out: PathNode[] = [];
      for (const f of feats) {
        const p = f?.properties ?? {};
        const c = f?.geometry?.coordinates;
        if (!p.fid || f?.geometry?.type !== "Point" || !Array.isArray(c))
          continue;
        out.push({
          fid: String(p.fid),
          at: [Number(c[0]), Number(c[1])],
          subType: p.subType ? String(p.subType) : undefined,
          name: p.name ? String(p.name) : undefined,
          neighbors: list(p.neighbors),
          transitionNeighbors: list(p.transitionNeighbors),
        });
      }
      const links = out.reduce((n, x) => n + x.neighbors.length, 0);
      console.info(
        "[paths] level",
        lvl,
        "→",
        out.length,
        "nodes ·",
        links,
        "neighbour references · from the draft content",
      );
      cache.set(k, out);
      return out;
    } catch (e) {
      console.info(
        "[paths] level",
        lvl,
        "failed —",
        (e as Error)?.message,
        "· the wayfinding section will draw nodes but no edges",
      );
      return [];
    } finally {
      pending.delete(k);
    }
  })();
  pending.set(k, run);
  return run;
}
