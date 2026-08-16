import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { Change } from "../mock/diff";
import { NON_EDITABLE_MAIN_TYPES, type LevelTypeCount } from "../mock/taxonomy";
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

const PointrMap = forwardRef<
  PointrMapHandle,
  {
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
    onTypes?: (
      forLevel: { building: string; level: number },
      types: LevelTypeCount[],
    ) => void;
    /**
     * A decision taken on the map itself — the pinned card's ✓ / 🚩 / ✗ (Olcay, 2026-08-11). The
     * map reports it and changes nothing; the app applies it and posts the result back down, so the
     * centroid badge and the changelog row can never disagree about what you decided.
     */
    /** `null` clears it — a user override returning to its resting "Kept" (2026-08-11). */
    onDecision?: (
      id: string,
      decision: "confirm" | "flag" | "reject" | null,
    ) => void;
    /**
     * The change currently selected, shared with the changelog — one selection, two surfaces.
     * Setting it opens that feature's card and eases the camera onto it; `onSelect` reports the
     * same thing happening from the map's side.
     */
    active?: string | null;
    onSelect?: (id: string | null) => void;
    /**
     * Centre the map on one SDK feature by its `fid` — the tree's level expansion selecting a row.
     * Distinct from `active`, which is about a *change* in a review; this is about a feature that
     * simply exists.
     */
    focusFeature?: string | null;
    /**
     * Bumped by the caller on every focus request. Without it, clicking the same row twice is the
     * same prop value and the effect never re-fires — so a row you'd panned away from would refuse
     * to bring you back.
     */
    focusNonce?: number;
    /**
     * What to light up on the map, through the SDK's own selection layer: one feature by `fid`, or a
     * whole type. `null` clears it. Hover drives this as well as selection, so it changes often —
     * which is why it is its own prop rather than folded into `focusFeature`, whose job is to MOVE
     * the camera and must not fire on every mouseover.
     */
    highlight?: {
      fid?: string;
      /** A whole multi-selection. Takes precedence over `fid` in the map shell. */
      fids?: string[];
      mainType?: string;
      subType?: string;
    } | null;
    /**
     * The properties of the focused feature, as the vector tiles carry them — the POI panel's supply
     * (§19). Arrives with the focus rather than on request: the map's focus scan already holds the
     * bag, and it is the only path that waits for the tiles.
     */
    onFeatureProps?: (fid: string, props: Record<string, unknown>) => void;
    /**
     * An editable feature was clicked on the map (Olcay, 2026-08-14: *"click on a feature on the map
     * and on the listing should show the details panel in edit mode"*). Distinct from `onSelect`,
     * which is about a *change* in a review; this is about a feature that simply exists.
     */
    onFeatureClick?: (
      fid: string,
      props: Record<string, unknown>,
      /**
       * Shift was down: **add this feature to the selection, or take it back out if it is already
       * in** (Olcay, 2026-08-16). The map reports the modifier and nothing more — the app owns the
       * selection, so the app decides what adding means.
       */
      additive?: boolean,
    ) => void;
    /** This tab's cursor, in map coordinates — presence broadcasts it (see cloud/presence.ts). */
    onCursor?: (lng: number, lat: number) => void;
    /**
     * Other people's cursors to draw. The APP decides who belongs here, because it is the app that
     * knows which floor everyone is on — presence is scoped to the level, not the viewport.
     */
    peers?: {
      id: string;
      name: string;
      colour: string;
      lng?: number;
      lat?: number;
    }[];
    /** Features other people currently have open in the editor, so the map can say so. */
    editing?: { fid: string; who: string; colour: string }[];
    /**
     * The level's features as **true GeoJSON**, for the editor to take its geometry from instead of
     * from the tiles — see `cloud/levelFeatures`. Empty or absent means the editor falls back to
     * the tiles, which is what it always did.
     */
    levelGeometry?: { fid: string; geometry: unknown }[];
    /** Geometry-editor commands, and the state it reports back — see ui/GeometryToolbar. */
    geomCommands?: { seq: number; body: Record<string, unknown> }[];
    onGeomState?: (s: Record<string, unknown>) => void;
    /**
     * A committed outline, in lng/lat rings. Local to the prototype, like every other edit.
     * `pieces` is how many separate pieces the feature is now in — `1` if nobody has split it.
     */
    onGeometry?: (
      fid: string,
      rings: number[][][],
      pieces: number,
      /** A point feature's single coordinate — `rings` is empty for those. */
      point?: [number, number] | null,
      /**
       * The fids a Combine has swallowed into this one. They still exist in Pointr Cloud and still
       * have rows in the tree — nothing in this prototype deletes a feature — so this is a report
       * of what the shape now covers, not a list of things that have gone.
       */
      absorbed?: string[],
    ) => void;
    /**
     * ⚠️ **The editor says the edit now belongs to a DIFFERENT feature.**
     *
     * Only Combine does this, and only because the rule is that the largest of the combined rooms
     * keeps its identity. It is not the user switching feature: the unsaved-changes guard must not
     * fire, because the change being guarded is the very thing that caused this.
     *
     * The properties come WITH it and must be applied in the same update — see the note on
     * `geomTakeIdentity` in the map shell for what a second message would cost.
     */
    onGeomIdentity?: (fid: string, props: Record<string, unknown>) => void;
    /**
     * The map asking for the selection to collapse to one feature — Escape peeling the extras off,
     * or a Combine that has just absorbed them. Distinct from a click, because nothing was clicked.
     */
    onSelectClear?: (fid: string) => void;
    /**
     * The editor refusing something, in words meant for the user — a cut that misses the shape, or
     * one laid exactly along an edge. Posted since the editor was written and, until 2026-08-15,
     * listened to by nobody: the map said why and the message went nowhere.
     */
    onGeomError?: (fid: string, message: string) => void;
    /**
     * Screen space to keep clear on the RIGHT when framing a focused feature — the panel's own
     * width. The map is not resized; the feature is simply framed in the part of it you can still
     * see.
     */
    focusPadRight?: number;
  }
>(function PointrMap(
  {
    changes,
    prefs,
    onLevel,
    onBuildings,
    onCamera,
    onFileDrop,
    onFeatures,
    onTypes,
    onDecision,
    active,
    onSelect,
    focusFeature,
    focusNonce,
    highlight,
    onFeatureProps,
    onFeatureClick,
    onCursor,
    peers,
    editing,
    levelGeometry,
    geomCommands,
    onGeomState,
    onGeometry,
    onGeomIdentity,
    onSelectClear,
    onGeomError,
    focusPadRight,
    target,
  },
  handle,
) {
  const ref = useRef<HTMLIFrameElement>(null);
  useImperativeHandle(
    handle,
    () => ({
      setCamera: (cam) =>
        ref.current?.contentWindow?.postMessage({ type: "camera", cam }, "*"),
    }),
    [],
  );
  const latest = useRef({
    changes,
    prefs,
    target,
    active,
    dropOn: !!onFileDrop,
    canDecide: !!onDecision,
    focusPadRight,
  });
  latest.current = {
    changes,
    prefs,
    target,
    active,
    dropOn: !!onFileDrop,
    canDecide: !!onDecision,
    focusPadRight,
  };

  // Its own effect: a focus is an EVENT, not state to re-send on every `ready` — re-posting it
  // with the rest would re-centre the map every time the iframe re-announced itself.
  //
  // The padding is read from the ref, never a dependency: it changes when the panel opens and
  // closes, and depending on it would re-fly the camera every time — a focus is the click, not
  // the layout.
  useEffect(() => {
    if (focusFeature)
      ref.current?.contentWindow?.postMessage(
        {
          type: "focusfeature",
          fid: focusFeature,
          padRight: latest.current.focusPadRight ?? 0,
        },
        "*",
      );
  }, [focusFeature, focusNonce]);

  useEffect(() => {
    ref.current?.contentWindow?.postMessage(
      { type: "highlight", sel: highlight ?? null },
      "*",
    );
  }, [highlight]);

  // Its own effect, and not part of `send()`: peers move ~20 times a second, and folding them in
  // would re-post the whole diff on every mouse twitch anyone else made.
  useEffect(() => {
    ref.current?.contentWindow?.postMessage(
      { type: "peers", peers: peers ?? [] },
      "*",
    );
  }, [peers]);

  /**
   * The level's true geometry, posted on its own because it arrives **asynchronously** — the fetch
   * finishes long after the level switch that asked for it, and folding it into `send()` would make
   * it wait for the next unrelated prop change.
   */
  useEffect(() => {
    ref.current?.contentWindow?.postMessage(
      { type: "levelgeom", features: levelGeometry ?? [] },
      "*",
    );
  }, [levelGeometry]);

  /**
   * Every geometry command the app has queued, posted in order and each exactly once.
   *
   * Commands carry a `seq` so the same one twice — two taps of Undo — still fires. Without it the
   * prop is identical and the effect never re-runs, which is the same trap `focusNonce` exists for.
   *
   * ⚠️ **It is a queue because `seq` alone was not enough.** The app used to hand over one command
   * at a time, and two sent in the same React commit collapsed to the last one — opening a feature
   * fires `begin` and `select` together, so `begin` was dropped and the geometry editor never
   * appeared at all. `seq` answers "the same command twice"; it says nothing about two *different*
   * commands colliding, and that is a different failure with the same shape.
   *
   * `sentSeq` is the high-water mark, so a re-render, a trimmed queue or a remount can never replay
   * a command — and replaying `begin` would discard whatever the user had already edited.
   */
  const sentSeq = useRef(0);
  useEffect(() => {
    const win = ref.current?.contentWindow;
    if (!win || !geomCommands?.length) return;
    for (const c of geomCommands) {
      if (c.seq <= sentSeq.current) continue;
      sentSeq.current = c.seq;
      win.postMessage({ type: "geom", ...c.body }, "*");
    }
  }, [geomCommands]);

  // Its own effect: who is editing changes when a panel opens, not 20 times a second like a cursor.
  useEffect(() => {
    ref.current?.contentWindow?.postMessage(
      { type: "editing", editing: editing ?? [] },
      "*",
    );
  }, [editing]);

  const send = () => {
    const win = ref.current?.contentWindow;
    if (!win) return;
    win.postMessage({ type: "dropzone", on: latest.current.dropOn }, "*");
    /**
     * Whether the map may offer ✓ 🚩 ✗ — derived from whether this caller passed `onDecision`
     * at all, so a control can never appear whose result nobody is listening for.
     *
     * The flag MARK is unaffected and shows everywhere: it is a fact about the feature.
     * Deciding is an act of reviewing, and only the review screen wires the handler.
     */
    win.postMessage({ type: "decidable", on: latest.current.canDecide }, "*");
    /**
     * What the map may **not** offer to edit. The app owns the taxonomy; the map page has none, so
     * it is told rather than left to guess — and until it is told it treats nothing as editable,
     * which is the safe direction.
     *
     * ⚠️ **Empty now: every geometry is editable** (Olcay, 2026-08-16: *"I should also be able to
     * edit all geometries not just POIs"*). It used to be `NON_EDITABLE_MAIN_TYPES` — walls,
     * transitions, circulation space, the floor plan itself — on the reasoning that those are not
     * content somebody curates. That reasoning was about *review*, and this is an editor: if a wall
     * is in the wrong place, the person fixing the floor is the person who needs to move it.
     *
     * The channel is deliberately kept rather than deleted, because it is exactly the hook the
     * **layer locking** Olcay has parked will hang off — locking a layer means adding its types
     * here, and the map already honours that with no further work. See the standing item in the
     * hand-off.
     */
    win.postMessage({ type: "editabletypes", types: [] }, "*");
    /**
     * What raises no hover card. **Silent, not inert** (Olcay, 2026-08-16: *"structural click should
     * work though"*) — these open on a click like anything else.
     *
     * It is the list that used to be `editabletypes`, doing the job it was always really for: a
     * floor has hundreds of walls and circulation strips, and a card that follows the pointer across
     * every one of them is never off and buries the POI cards the hover exists for. Making them
     * *unclickable* was the part that was wrong, and that part has gone.
     */
    win.postMessage(
      { type: "quiettypes", types: NON_EDITABLE_MAIN_TYPES },
      "*",
    );
    if (latest.current.changes)
      win.postMessage(
        {
          type: "changes",
          // `id` rides along so the map can decide a change back at us (the pinned card's
          // ✓ / 🚩 / ✗) — decisions are keyed by id, and a name can be re-pointed by
          // `bindToFloor`, so name would be the wrong key even though it is the merge key here.
          // `markOnly` has to ride along too: this projection is a whitelist, so a field left out
          // here silently never reaches the map however carefully it was set upstream.
          changes: latest.current.changes.map(
            ({ id, name, type, detail, decision, markOnly, note }) => ({
              id,
              name,
              type,
              detail,
              decision,
              markOnly,
              note,
            }),
          ),
        },
        "*",
      );
    if (latest.current.prefs)
      win.postMessage({ type: "prefs", ...latest.current.prefs }, "*");
    if (latest.current.target)
      win.postMessage({ type: "target", ...latest.current.target }, "*");
    if (latest.current.active)
      win.postMessage({ type: "active", id: latest.current.active }, "*");
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
        if (ev.data.types?.length && ev.data.forLevel)
          onTypes?.(ev.data.forLevel, ev.data.types);
      } else if (ev.data.type === "geomstate") {
        if (ev.source === ref.current?.contentWindow) onGeomState?.(ev.data);
      } else if (ev.data.type === "geometry") {
        // ⚠️ `rings` is an EMPTY array for a point feature, so it cannot be the test for whether
        // there is geometry here — an empty array is truthy, but a point committed through this
        // branch used to arrive with its coordinate dropped and be logged as "0 ring(s)".
        if (ev.source === ref.current?.contentWindow && ev.data.fid)
          onGeometry?.(
            ev.data.fid,
            ev.data.rings ?? [],
            Number(ev.data.pieces) || 1,
            ev.data.point ?? null,
            Array.isArray(ev.data.absorbed) ? ev.data.absorbed.map(String) : [],
          );
      } else if (ev.data.type === "geomidentity") {
        // `props` is required, not optional: the shell refuses to send an identity it cannot also
        // describe, precisely so this side never has to handle half of one.
        if (
          ev.source === ref.current?.contentWindow &&
          ev.data.fid &&
          ev.data.props
        )
          onGeomIdentity?.(String(ev.data.fid), ev.data.props);
      } else if (ev.data.type === "selectclear") {
        if (ev.source === ref.current?.contentWindow && ev.data.fid)
          onSelectClear?.(String(ev.data.fid));
      } else if (ev.data.type === "geomerror") {
        if (ev.source === ref.current?.contentWindow && ev.data.message)
          onGeomError?.(String(ev.data.fid ?? ""), String(ev.data.message));
      } else if (ev.data.type === "cursor") {
        if (
          ev.source === ref.current?.contentWindow &&
          typeof ev.data.lng === "number"
        )
          onCursor?.(ev.data.lng, ev.data.lat);
      } else if (ev.data.type === "featureclick") {
        if (
          ev.source === ref.current?.contentWindow &&
          ev.data.fid &&
          ev.data.props
        )
          onFeatureClick?.(ev.data.fid, ev.data.props, !!ev.data.additive);
      } else if (ev.data.type === "featureprops") {
        if (
          ev.source === ref.current?.contentWindow &&
          ev.data.fid &&
          ev.data.props
        )
          onFeatureProps?.(ev.data.fid, ev.data.props);
      } else if (ev.data.type === "features") {
        // a switch settled on a new floor — its features replace the old floor's
        if (
          ev.source === ref.current?.contentWindow &&
          ev.data.features?.length
        )
          onFeatures?.(ev.data.features);
        if (
          ev.source === ref.current?.contentWindow &&
          ev.data.types?.length &&
          ev.data.forLevel
        )
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
      } else if (
        ev.data.type === "decision" &&
        ev.data.id &&
        "decision" in ev.data
      ) {
        // Compare renders two panes; only this one's iframe may decide for it.
        if (ev.source === ref.current?.contentWindow)
          onDecision?.(ev.data.id, ev.data.decision);
      } else if (ev.data.type === "select") {
        if (ev.source === ref.current?.contentWindow)
          onSelect?.(ev.data.id ?? null);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [
    onLevel,
    onBuildings,
    onCamera,
    onFileDrop,
    onFeatures,
    onTypes,
    onDecision,
    onSelect,
    onFeatureProps,
  ]);

  /**
   * Its own effect, not part of `send()`: selection changes far more often than the diff does, and
   * bundling them would re-post the whole change set (and reset the map's resolved geometry) every
   * time you clicked a row.
   */
  useEffect(() => {
    ref.current?.contentWindow?.postMessage(
      { type: "active", id: active ?? null },
      "*",
    );
  }, [active]);

  useEffect(send, [changes, prefs, target]);
  /**
   * The drop-zone flag needs its own effect: it isn't in `send`'s dep list, so a pane that turns
   * its drop zone OFF mid-session (the expert hold, or a job starting) never told the iframe — it
   * kept painting the "Drop to upload" veil and then swallowed the drop in silence. Posting on
   * `onFileDrop`'s identity is enough: the app passes a stable useCallback or undefined.
   */
  useEffect(() => {
    ref.current?.contentWindow?.postMessage(
      { type: "dropzone", on: !!onFileDrop },
      "*",
    );
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
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
});

export default PointrMap;
