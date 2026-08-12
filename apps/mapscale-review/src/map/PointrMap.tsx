import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { Change } from "../mock/diff";
import type { LevelTypeCount } from "../mock/taxonomy";
import { pointrMapSrc } from "../mock/pointrConfig";

/**
 * Live Pointr WebSDK map, isolated in an iframe (`public/map/index.html`) so the SDK's fullscreen
 * loader/modals stay inside the pane and its CSS can't leak into the dashboard. The iframe renders
 * the live indoor map (Dubai · Terminal 3 and B Gates · Departures - Concourse B) with the
 * greyscale focus, the floor-plan outline, and the colour diff highlights drawn as an SVG overlay
 * from the real feature geometry — plus the ✓/🚩/✗ marks and a click-to-inspect tooltip.
 *
 * The app owns the diff: `changes` is pushed in and merged by feature name (`Change.name` is what
 * the SDK's vector tiles carry in `properties.name`). `prefs` drives the Map Settings popover.
 */
export interface MapPrefs {
  greyscale: boolean;
  /** Hide the SDK's POI pins and labels so nothing sits between you and the diff. Review only. */
  hidePoiLabels: boolean;
  floorplan: boolean;
  basemap: "vector" | "satellite";
}

export interface MapLevel {
  index: number;
  short: string;
  long: string;
  building: string;
}

/** A building on the active site, straight from the SDK's site/building manager. */
export interface MapBuilding {
  id: string;
  name: string;
  levels: { index: number; short: string; long: string }[];
}

/** One pane's camera, as the map page reports and accepts it. */
export interface MapCamera {
  lng: number;
  lat: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

/** The imperative surface: Compare uses it to mirror one pane's camera into the other. */
export interface PointrMapHandle {
  setCamera: (cam: MapCamera) => void;
}

const PointrMap = forwardRef<PointrMapHandle, {
  changes?: Change[];
  prefs?: MapPrefs;
  /** Which building/level the map should show. Omit to keep the page's own default. */
  target?: { building: string; level: number };
  onLevel?: (level: MapLevel) => void;
  onBuildings?: (buildings: MapBuilding[]) => void;
  /** Fired on every user/boot move — the feed Compare mirrors into its sibling pane. */
  onCamera?: (cam: MapCamera) => void;
  /**
   * A floor-plan file was dropped on the map. Passing this ENABLES the pane's drop zone (the map
   * page shows its veil and reports drops only when the app can take them) — upload surfaces
   * pass it, review/Compare panes don't.
   */
  onFileDrop?: (file: { name: string; size: number }) => void;
  /**
   * The named polygons actually on the current floor, biggest first — the map answering "what is
   * here?". Screens that draw a changelog use it to bind their rows to real geometry, so the list
   * and the map correspond on EVERY level rather than only on the one the seeds were written for.
   */
  onFeatures?: (names: string[]) => void;
  /**
   * What kinds of feature the reported floor holds, and how many of each — the tree's expandable
   * level rows read this. Arrives with `features`, from the same `ready`/`switched` moments.
   */
  onTypes?: (forLevel: { building: string; level: number }, types: LevelTypeCount[]) => void;
  /**
   * A decision taken on the map itself — the pinned card's ✓ / 🚩 / ✗ (Olcay, 2026-08-11). The
   * map reports it and changes nothing; the app applies it and posts the result back down, so the
   * centroid badge and the changelog row can never disagree about what you decided.
   */
  /** `null` clears it — a user override returning to its resting "Kept" (2026-08-11). */
  onDecision?: (id: string, decision: "confirm" | "flag" | "reject" | null) => void;
  /**
   * The change currently selected, shared with the changelog — one selection, two surfaces.
   * Setting it opens that feature's card and eases the camera onto it; `onSelect` reports the
   * same thing happening from the map's side.
   */
  active?: string | null;
  onSelect?: (id: string | null) => void;
}>(function PointrMap({ changes, prefs, onLevel, onBuildings, onCamera, onFileDrop, onFeatures, onTypes, onDecision, active, onSelect, target }, handle) {
  const ref = useRef<HTMLIFrameElement>(null);
  useImperativeHandle(handle, () => ({
    setCamera: (cam) => ref.current?.contentWindow?.postMessage({ type: "camera", cam }, "*"),
  }), []);
  const latest = useRef({ changes, prefs, target, active, dropOn: !!onFileDrop });
  latest.current = { changes, prefs, target, active, dropOn: !!onFileDrop };

  const send = () => {
    const win = ref.current?.contentWindow;
    if (!win) return;
    win.postMessage({ type: "dropzone", on: latest.current.dropOn }, "*");
    if (latest.current.changes)
      win.postMessage(
        {
          type: "changes",
          // `id` rides along so the map can decide a change back at us (the pinned card's
          // ✓ / 🚩 / ✗) — decisions are keyed by id, and a name can be re-pointed by
          // `bindToFloor`, so name would be the wrong key even though it is the merge key here.
          changes: latest.current.changes.map(({ id, name, type, detail, decision }) => ({
            id,
            name,
            type,
            detail,
            decision,
          })),
        },
        "*",
      );
    if (latest.current.prefs) win.postMessage({ type: "prefs", ...latest.current.prefs }, "*");
    if (latest.current.target) win.postMessage({ type: "target", ...latest.current.target }, "*");
    if (latest.current.active) win.postMessage({ type: "active", id: latest.current.active }, "*");
  };

  // The map page announces itself when the level is up; anything posted before that is lost.
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (ev.data?.source !== "mapscale-map") return;
      if (ev.data.type === "ready") {
        send();
        if (ev.data.level) onLevel?.(ev.data.level);
        if (ev.data.buildings?.length) onBuildings?.(ev.data.buildings);
        if (ev.data.features?.length) onFeatures?.(ev.data.features);
        if (ev.data.types?.length && ev.data.forLevel) onTypes?.(ev.data.forLevel, ev.data.types);
      } else if (ev.data.type === "features") {
        // a switch settled on a new floor — its features replace the old floor's
        if (ev.source === ref.current?.contentWindow && ev.data.features?.length)
          onFeatures?.(ev.data.features);
        if (ev.source === ref.current?.contentWindow && ev.data.types?.length && ev.data.forLevel)
          onTypes?.(ev.data.forLevel, ev.data.types);
      } else if (ev.data.type === "switched" && ev.data.ok === false) {
        // Only failures are reported upward, and deliberately so. The app owns intent; the map
        // reports reality; the app corrects itself only when reality contradicts intent. Feeding
        // *successful* switches back would let a `switched` that lands in the same tick as a click
        // overwrite the level the user just picked — the map would then obediently follow the
        // stale value and the click would vanish. On success the selector is already right by
        // construction, so there is nothing to report.
        // Deliberately no send() either: re-posting here is what fed the app↔map loop that made
        // panning fight the camera.
        if (ev.data.level) onLevel?.(ev.data.level);
      } else if (ev.data.type === "camera" && ev.data.cam) {
        // Only this pane's own iframe is the sender we care about — a message from a sibling
        // pane's iframe would mirror the mirror.
        if (ev.source === ref.current?.contentWindow) onCamera?.(ev.data.cam);
      } else if (ev.data.type === "filedrop" && ev.data.name) {
        if (ev.source === ref.current?.contentWindow)
          onFileDrop?.({ name: ev.data.name, size: ev.data.size ?? 0 });
        // `"decision" in data`, not a truthiness test: `null` is a real value here — it clears a
        // user override's flag — and a falsy guard would have swallowed exactly that message.
      } else if (ev.data.type === "decision" && ev.data.id && "decision" in ev.data) {
        // Compare renders two panes; only this one's iframe may decide for it.
        if (ev.source === ref.current?.contentWindow) onDecision?.(ev.data.id, ev.data.decision);
      } else if (ev.data.type === "select") {
        if (ev.source === ref.current?.contentWindow) onSelect?.(ev.data.id ?? null);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onLevel, onBuildings, onCamera, onFileDrop, onFeatures, onTypes, onDecision, onSelect]);

  /**
   * Its own effect, not part of `send()`: selection changes far more often than the diff does, and
   * bundling them would re-post the whole change set (and reset the map's resolved geometry) every
   * time you clicked a row.
   */
  useEffect(() => {
    ref.current?.contentWindow?.postMessage({ type: "active", id: active ?? null }, "*");
  }, [active]);

  useEffect(send, [changes, prefs, target]);
  /**
   * The drop-zone flag needs its own effect: it isn't in `send`'s dep list, so a pane that turns
   * its drop zone OFF mid-session (the expert hold, or a job starting) never told the iframe — it
   * kept painting the "Drop to upload" veil and then swallowed the drop in silence. Posting on
   * `onFileDrop`'s identity is enough: the app passes a stable useCallback or undefined.
   */
  useEffect(() => {
    ref.current?.contentWindow?.postMessage({ type: "dropzone", on: !!onFileDrop }, "*");
  }, [onFileDrop]);

  return (
    <iframe
      ref={ref}
      title="Live indoor map"
      // the connection rides the URL: `public/` is copied verbatim by Vite, so the map page never
      // sees import.meta.env and the parent has to hand it over (see mock/pointrConfig.ts)
      src={pointrMapSrc()}
      // anything posted before the document exists is dropped, so send on load as well as on ready
      onLoad={send}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
});

export default PointrMap;
