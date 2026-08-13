import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kozmos/react";
import { ChangeGroupBlock } from "../ui/ChangeGroup";
import { ChangeReviewRow, WarningGlyph } from "../ui/ChangeReviewRow";
import { ConfirmOverlay } from "../ui/ConfirmOverlay";
import { PANEL_WIDTH } from "../ui/Chrome";
import { MapSettings } from "../ui/MapSettings";
import { PANEL_PAD, PanelHeader } from "../ui/PanelHeader";
import PointrMap, { type MapPrefs, type MapLevel } from "../map/PointrMap";
import type { LevelRef } from "./MapContent";
import {
  seedChanges,
  magnitudeBand,
  bindToFloor,
  buildSections,
  inMetric,
  BAND,
  GRACE_DAYS,
  METRIC_COLOR,
  METRIC_LABEL,
  METRIC_ORDER,
  RED_CAUSE_COPY,
  type Change,
  type Decision,
  seedVersions,
  type MagnitudeBand,
  type RedCause,
  WARNING_LABEL,
  type FloorWarning,
} from "../mock/diff";
import { getLevelVersions, getReviewOutcome, levelKey, setLevelVersions, setReviewOutcome } from "../mock/store";

const LINE = "#e3e4e8";
/** Stable identity — PointrMap re-posts whenever `changes` changes by reference. */
const NO_CHANGES: Change[] = [];

function MapChrome({ prefs, onPrefs, focus }: { prefs: MapPrefs; onPrefs: (p: MapPrefs) => void; focus: boolean }) {
  // No legend: every colour on the map is named in the list beside it (NEW / UPDATED / REMOVED /
  // PRESERVED), and the ✓ 🚩 ✗ marks are keyed by the tally under the magnitude block.
  // Focus lives here and nowhere else: it exists to get noise out from between you and the diff —
  // so cause B's review, which has no diff, doesn't offer it (§3).
  return <MapSettings prefs={prefs} onChange={onPrefs} focus={focus} />;
}

export function ManualReview({
  level: target,
  magnitudePct,
  redCause,
  onClose,
  onCompare,
  creation,
  floorWarnings,
}: {
  level?: LevelRef | null;
  /**
   * The job's post-expert modified-area %, when the caller knows it — the editor does, the tree
   * path derives it from the same seed. Absent for red cause B, which has no reliable ratio.
   */
  magnitudePct?: number;
  /** Why red isn't the band's arithmetic: `cannot-match` reviews without a % (US5 cause B). */
  redCause?: RedCause;
  onClose?: () => void;
  /** Opens Version History in Compare mode — cause B's review is the one that needs it. */
  onCompare?: () => void;
  /**
   * Whole-floor conditions (D16) — US10's georeference shift, US7's size edge cases. They render
   * as a notice ABOVE the changelog because they scope every row beneath them; hanging them off a
   * single change was the bug this prop exists to end.
   */
  floorWarnings?: FloorWarning[];
  /**
   * The Building wizard's review sequence rides THIS screen (Olcay, 2026-08-11: "exactly the
   * same as user review"): MapScale's guesses arrive as changes, the magnitude block carries the
   * run's confidence (a new building has no baseline to diff), there is no fate strip (Save =
   * created, not live — decision from the wizard scoping), and the footer returns to the wizard.
   */
  creation?: {
    confidencePct: number;
    changes: Change[];
    onBack: () => void;
    /**
     * Save — hands the DECIDED ROWS back without concluding, so the level reads **In review** and
     * the user can come back to it. Same intention, same word and same pair of buttons as the
     * update flow (Olcay, 2026-08-11); creation's Save just has nothing to hold out of publishing,
     * because nothing publishes here.
     */
    onSave: (rows: Change[]) => void;
    /**
     * Complete review — concludes this LEVEL. Hands the decided rows back, not a count, so
     * reopening resumes where the user left off (the wizard owns them; this screen is remounted
     * each time). No confirmation overlay: the update flow's asks first because completing may
     * publish a site, and creation publishes nothing.
     */
    onConfirm: (rows: Change[]) => void;
    /**
     * The wizard reviews **one level at a time**, and moving between them is the wizard's own
     * "Level to Align, N of M" idiom rather than the map's `LevelSelector` — you are inside the
     * wizard, which taught that vocabulary two steps earlier (§18).
     *
     * Completing a level deliberately does **not** advance to the next one (Olcay's answer 3): the
     * others stay exactly where they are, so a user who wants to stop after one can.
     */
    levels?: {
      currentId: number;
      items: { id: number; label: string; issues: number; done: boolean }[];
      onPick: (id: number) => void;
    };
  };
}) {
  const pct = magnitudePct ?? 30;
  // Cause B has no ratio but the whole floor needs eyes, so it reads as the large band.
  // Creation reads minor: a 92%-confidence result is good news, and green is its colour.
  const bandKind: MagnitudeBand = creation ? "minor" : redCause ? "large" : magnitudeBand(pct);
  /**
   * Cause B reviews WITHOUT a changelog (Olcay, 2026-08-10 evening, ruling audit Q8): a changelog
   * IS a comparison against the published map, and matching is exactly what failed — so any
   * per-change list here would be invented. The whole floor gets eyes instead: inspect the map,
   * Compare against the published version, publish or re-upload wholesale. (It previously showed
   * the large change set as a stand-in.)
   */
  /**
   * What the map says is on this floor. The changelog binds to it (see `bindToFloor`), so the
   * list and the map describe the same place on every level — not just B2, whose features the
   * seeds were harvested from. Empty until the map reports; the seeded names stand in meanwhile.
   */
  const [floorFeatures, setFloorFeatures] = useState<string[]>([]);
  const onFeatures = useCallback((names: string[]) => setFloorFeatures(names), []);
  const matchFailed = redCause === "cannot-match";
  /**
   * Decision 9 in this screen's own voice: a >50% change is REJECTED, never reviewed. Every
   * caller already honours that (the tag carries no action, the card offers no Review), but the
   * screen used to have no guard of its own — hand it a bare 62% and it would have rendered a
   * full changelog under "publish when you're ready", contradicting the decision. Cause B is the
   * one large-band review that exists.
   */
  const rejectedByGuard = !creation && !redCause && magnitudeBand(pct) === "large";
  // The set scales with the declared magnitude — a 62% screen shows a remodel, not the 30% list.
  // Creation mode reviews MapScale's guesses instead of a diff.
  const initialChanges = useMemo(
    () =>
      bindToFloor(
        creation ? creation.changes : matchFailed ? [] : seedChanges(bandKind),
        floorFeatures,
      ),
    [creation, matchFailed, bandKind, floorFeatures],
  );
  const band = BAND[bandKind];
  /**
   * What happens to this version if nobody acts, and whether someone already intervened: Amber
   * counts down to an automatic publish (US4 — cancellable, or publish now); Red never publishes
   * itself but may be published at any time (US5). Local state only — persistence is Phase 2.
   */
  /**
   * `held` = this review was saved part-way, so the level is out of publishing until it is
   * completed (Olcay, 2026-08-11). Seeded on mount from the store, because reopening a held level
   * must not greet you with "publishes automatically in 6 days" — that countdown is suspended, and
   * saying otherwise would be the screen lying about the one thing it exists to tell you.
   */
  const [fate, setFate] = useState<"pending" | "published" | "cancelled" | "held">(() => {
    if (creation || !target) return "pending";
    const key = levelKey(target.buildingId, target.index);
    const newestN = getLevelVersions(key, () =>
      seedVersions(target.short, target.index, target.buildingId),
    )[0]?.n;
    const saved = getReviewOutcome(key, newestN);
    return saved && !saved.complete ? "held" : "pending";
  });
  /** Save asks first — the consequence lives in the v9 confirmation overlay, not in a caption. */
  const [confirmOpen, setConfirmOpen] = useState(false);
  // `preserved` is not a change to review — it carries no decision, and the group and section
  // controls filter it out themselves rather than the screen pre-computing a list.
  // keyed by id, so a rebind (which changes names, never ids) can't lose a decision
  const [decisions, setDecisions] = useState<Record<string, Decision | undefined>>(() => {
    const seeded = Object.fromEntries(initialChanges.map((c) => [c.id, c.decision]));
    // Resume a review saved part-way. Version-matched, so a new upload starts clean rather than
    // inheriting decisions taken about a floor-plan that has since been replaced.
    if (creation || !target) return seeded;
    const key = levelKey(target.buildingId, target.index);
    const newestN = getLevelVersions(key, () =>
      seedVersions(target.short, target.index, target.buildingId),
    )[0]?.n;
    // version-matched by the key itself now: a newer upload simply has no report yet
    const saved = getReviewOutcome(key, newestN);
    if (!saved) return seeded;
    return { ...seeded, ...saved.decisions };
  });
  // memoised: this array is posted to the map, so a fresh identity each render would re-post it
  const changes: Change[] = useMemo(
    () => initialChanges.map((c) => ({ ...c, decision: decisions[c.id] })),
    [initialChanges, decisions],
  );
  // Greyscale focus exists to see the diff (§3); cause B has none, so its map opens in colour.
  const [prefs, setPrefs] = useState<MapPrefs>({
    greyscale: !matchFailed,
    hidePoiLabels: false,
    floorplan: true,
    basemap: "vector",
  });
  const [mapLevel, setMapLevel] = useState<MapLevel | null>(null);
  const onLevel = useCallback((l: MapLevel) => setMapLevel(l), []);
  /**
   * Whose name the header carries. **The passed level wins** (fixed 2026-08-11) — this screen has
   * no level switcher, so what it was opened for is what it reviews.
   *
   * It used to prefer `mapLevel`, on the principle that the map reports reality. That principle
   * belongs to screens where you can *change* level; here it silently lied, twice over: PointrMap
   * only reports boot and FAILED switches upward (successes are deliberately swallowed, see its
   * onMessage), so `mapLevel` stayed the iframe's hard-coded boot floor — reviewing Concourse A's
   * L4 read "Reviewing B2 | Departures - Terminal 3", and the wizard's creation review named the
   * demo building instead of the one being created. `mapLevel` survives only as the fallback for
   * a caller that passes no level at all.
   */
  const shown = {
    building: target?.building ?? mapLevel?.building ?? "",
    short: target?.short ?? mapLevel?.short ?? "",
    long: target?.name ?? mapLevel?.long ?? "",
  };
  // Open the map on the level actually being reviewed, not the map page's own default. Memoised
  // for the same reason `changes` is: PointrMap posts whenever this prop's identity changes, so an
  // inline object would re-target the map on every render.
  const mapTarget = useMemo(
    () => (target?.buildingId ? { building: target.buildingId, level: target.index } : undefined),
    [target?.buildingId, target?.index],
  );
  const setOne = (id: string, d: Decision | undefined) => setDecisions((p) => ({ ...p, [id]: d }));
  /**
   * The map's pinned card decides through the SAME function the list rows use (Olcay, 2026-08-11:
   * *"I want to click on the markers on the map, see all options and change to something else"*).
   * One store of decisions, two ways in — which is what keeps the centroid badge, the row's
   * control and the tally from ever telling different stories.
   *
   * Stable identity: `PointrMap` re-subscribes when this changes, and an inline arrow would
   * re-register the listener on every render.
   */
  const onMapDecision = useCallback(
    (id: string, d: "confirm" | "flag" | "reject" | null) => setOne(id, d ?? undefined),
    [],
  );

  /**
   * The active change — one selection shared by the changelog and the map (Olcay, 2026-08-11).
   * Clicking a row opens that feature's card and eases the camera onto it; clicking a shape lights
   * the row and scrolls it into view. Held here rather than in either surface because neither owns
   * it: it is a fact about the review.
   *
   * It carries **who made it**, because the two want opposite scrolling: a row you clicked is
   * already under your eye, and moving the list then is an unrequested jolt — while a selection
   * made on the map has to come and find you.
   */
  const [active, setActive] = useState<{ id: string | null; from: "list" | "map" }>({
    id: null,
    from: "list",
  });
  const activeId = active.id;
  const activate = (id: string) =>
    setActive((cur) => ({ id: cur.id === id ? null : id, from: "list" }));
  /** Stable, so PointrMap doesn't re-subscribe its message listener on every render. */
  const onMapSelect = useCallback((id: string | null) => setActive({ id, from: "map" }), []);

  /**
   * Concluding the review — what Save leaves behind (Olcay, 2026-08-11: *"we need to show the
   * flags once saved — on the map"*, and *"AI Mapping state should change too as the user
   * concluded the review"*).
   *
   * Two writes, both to the store the editor already reads:
   *
   * 1. **The outcome**, so the flags survive. Decision 2 chose Flag over Edit on the promise that
   *    you *"keep flagged items visible to edit later"* — and until now the decisions died with
   *    the screen, so there was no later.
   * 2. **The version's state**, because saving an eligible review *is* the publish (decision 5).
   *    Amber concluded → published. Red cause B never auto-publishes (US5), so it only moves if
   *    the fate strip's *Publish now* was used. A rejected version never gets here at all.
   *
   * Creation mode writes nothing: the wizard's review hands its rows back to the wizard, and the
   * building isn't in the tree yet.
   */
  const writeOutcome = (complete: boolean) => {
    if (creation || !target) return;
    const key = levelKey(target.buildingId, target.index);
    const versions = getLevelVersions(key, () => seedVersions(target.short, target.index, target.buildingId));
    const newest = versions[0];
    if (!newest) return;
    /**
     * Two different publishes, and only one of them waits for the review to be finished.
     *
     * **Publish now** (the fate strip) is a deliberate act: the strip already says *"Published
     * just now — this version is live"*, so it must publish whether or not you then Save or
     * Complete. Gating it on `complete` — as this did — meant pressing Publish now and then Save
     * left the version unpublished under a strip claiming it was live.
     *
     * **Auto-publish on conclusion** (decision 5) is the other one, and that genuinely requires
     * completing: an amber level publishes because you finished reviewing it.
     */
    const published = fate === "published" || (complete && !matchFailed && bandKind === "medium");
    setReviewOutcome(key, { versionN: newest.n, decisions, changes, published, complete });
    if (published && newest.state !== "published")
      setLevelVersions(key, [{ ...newest, state: "published" }, ...versions.slice(1)]);
  };

  /** Come back to it later. No ceremony: nothing is decided, nothing publishes, nothing is lost. */
  const saveProgress = () => writeOutcome(false);
  /** Conclude it — the version's state moves, and an eligible level publishes (decision 5). */
  const concludeReview = () => writeOutcome(true);

  /**
   * How many changes still carry no decision. Completing with some undecided is **allowed** — the
   * stories never require deciding everything, and a footer that refuses is a rule pretending to
   * be a review. But the overlay has to say what happens to them, and what happens is that they
   * apply: doing nothing at all is what the grace period already does, so an undecided change is
   * a change you let through.
   */
  const undecidedCount = changes.filter(
    (c) => c.type !== "preserved" && !decisions[c.id],
  ).length;

  /**
   * How many changes you have flagged to come back to (Olcay, 2026-08-11: *"if there are flags we
   * should warn user about these flags — you have flagged items to edit, do you still want to
   * publish?"*).
   *
   * The warning is the honest half of §18a's ruling that **flags are annotations, not gates**.
   * Because they don't block, completing takes them live exactly as detected — so the one moment
   * that must say so is the moment before it happens. It warns; it never refuses.
   */
  const flaggedCount = changes.filter((c) => decisions[c.id] === "flag").length;
  /** Does completing this review actually publish? Decision 5 — and only for an eligible band. */
  const willPublish = fate !== "published" && !matchFailed && bandKind === "medium";

  /**
   * Creation reviews one level at a time and **stays mounted while you step between them**, so
   * that decisions taken on a level survive going to another and coming back. That costs this
   * effect: `decisions` is seeded once, from whichever level was open first, so a level arriving
   * later would show its own saved decisions as undecided — the rows carry them, the map didn't.
   *
   * It only ever fills gaps. Overwriting would undo a decision the user has just taken on the row
   * in front of them, and row ids carry their level (`create-{index}-{n}`), so accumulating every
   * level's decisions in one map is safe by construction.
   */
  useEffect(() => {
    if (!creation) return;
    setDecisions((p) => {
      let changed = false;
      const next = { ...p };
      for (const c of initialChanges)
        if (next[c.id] === undefined && c.decision !== undefined) {
          next[c.id] = c.decision;
          changed = true;
        }
      return changed ? next : p;
    });
  }, [creation, initialChanges]);

  /**
   * Bring the lit row to the middle of the panel — but only when the *map* drove the selection.
   *
   * `block: "nearest"` was wrong here and read as right in code: it scrolls the **minimum**
   * distance, so a row from the bottom of a 23-row list arrived jammed against the sticky footer,
   * half covered, exactly where nobody is looking. The list had followed the map and appeared not
   * to. `"center"` puts it where the eye already is.
   */
  useEffect(() => {
    if (!active.id || active.from !== "map") return;
    const row = document.querySelector(`[data-change-row="${CSS.escape(active.id)}"]`);
    row?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [active]);
  /**
   * Bulk decision — used by both a group header and a whole risk section.
   *
   * A flag is a deliberate "I've seen this, come back to it", so a bulk action never silently
   * clears one; deciding a flagged row individually still works. Without this, one "Confirm all"
   * quietly undoes the whole triage pass — and with grouping there are now many more of them.
   */
  const setMany = (ids: string[], d: Decision) =>
    setDecisions((p) => {
      const next = { ...p };
      for (const id of ids) if (p[id] !== "flag" || d === "flag") next[id] = d;
      return next;
    });
  // Colour-keyed sections by change type, warnings sorted to the top of each.
  const sections = useMemo(() => buildSections(changes), [changes]);
  // A user override is carried through untouched, so it can't be bulk-decided.
  const decidableIds = useMemo(
    () => changes.filter((c) => c.type !== "preserved").map((c) => c.id),
    [changes],
  );

  if (rejectedByGuard) {
    return (
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div
          style={{
            width: PANEL_WIDTH,
            flex: `0 0 ${PANEL_WIDTH}px`,
            borderRight: `1px solid ${LINE}`,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div style={{ padding: PANEL_PAD, flex: 1 }}>
            <PanelHeader
              eyebrow={shown.building}
              title={`${shown.short} | ${shown.long}`}
              onClose={onClose}
              closeLabel="Close"
            />
            <div
              style={{
                background: BAND.large.tint,
                border: `1px solid ${BAND.large.border}`,
                color: BAND.large.ink,
                borderRadius: 10,
                padding: "12px 14px",
                marginTop: 14,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700 }}>{RED_CAUSE_COPY["large-change"].card(pct)}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--review-muted)", lineHeight: 1.5, marginTop: 12 }}>
              {RED_CAUSE_COPY["large-change"].error}
            </div>
          </div>
        </div>
        <div style={{ position: "relative", flex: 1, background: "#EDEEF0", minWidth: 0 }}>
          <PointrMap changes={NO_CHANGES} prefs={prefs} target={mapTarget} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
      {/* Left drawer */}
      <div
        style={{
          width: PANEL_WIDTH,
          flex: `0 0 ${PANEL_WIDTH}px`,
          borderRight: "1px solid #E7E9EE",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/*
          The header sits OUTSIDE the scroll area (fixed 2026-08-11, Olcay: *"position of the close
          button should be consistent"*). Two things were wrong while it scrolled with the content:

          1. **A scrollbar moved it.** The ✕ was 36px from the panel's right edge here and 21px on
             the level editor — exactly one 15px scrollbar apart, because a scrollbar takes its
             width out of the content box and only the long screens have one.
          2. **It scrolled away entirely.** 300px down the changelog put the ✕ at top −228 — off
             screen. Panels close from the header ✕ (the standing rule), so the only way out was to
             scroll back up to find it.

          A drawer header is chrome, not content. `PANEL_PAD` keeps every panel's header block
          identical, which is what makes the ✕ land in the same place on every screen.
        */}
        <div style={{ padding: PANEL_PAD }}>
          {/*
            The level is the subject of this screen, so it carries the title weight; the building is
            context above it. (Supersedes the earlier rule of "building name large" — you review a
            floor, not a building.) Still named the way the SDK names it: short | long.
          */}
          <PanelHeader
            eyebrow={shown.building}
            title={
              <Text
                style={{
                  fontSize: 18,
                  display: "block",
                  margin: "1px 0 0",
                  color: "var(--primitives-colors-background-600)",
                  lineHeight: 1.3,
                }}
              >
                Reviewing{" "}
                <b style={{ color: "var(--primitives-colors-theme-900)", fontWeight: 600 }}>
                  {shown.short}
                  <span style={{ color: "var(--primitives-colors-background-200)", fontWeight: 400, margin: "0 6px" }}>|</span>
                  {shown.long}
                </b>
              </Text>
            }
            onClose={creation ? creation.onBack : onClose}
            closeLabel={creation ? "Back to the wizard" : "Close review"}
          />
        </div>
        <div style={{ padding: "0 20px 8px", overflow: "auto", flex: 1 }}>
          {/* 8px of the old 10px gap now comes from the header block's own bottom padding */}
          <div style={{ height: 2 }} />
          <Text style={{ fontSize: 13, color: "var(--review-muted)", display: "block", lineHeight: 1.45 }}>
            {creation
              ? "Confirm each of MapScale's guesses, flag it for a later dashboard edit, or reject it."
              : matchFailed
                ? "Inspect the whole floor, then publish it or upload a corrected floor-plan."
                : "Confirm each change to apply it now, flag it for a later dashboard edit, or reject it."}
          </Text>
          {/*
            The wizard's level cycle — step 3's "Level to Align, N of M" idiom, reused because you
            are still inside the wizard and it taught this control two steps earlier. Levels with
            nothing to confirm never appear here: a zero-issue level is creation's Green, and the
            wizard skips it rather than asking you to open an empty list (Olcay's answer 2).
          */}
          {creation?.levels && creation.levels.items.length > 1 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: "var(--review-ink)" }}>
                ● Level to Review{" "}
                <span
                  style={{
                    background: "var(--primitives-colors-emotional-success-0)",
                    border: "1px solid var(--primitives-colors-emotional-success-200)",
                    borderRadius: 999,
                    padding: "0 8px",
                    fontSize: 10,
                  }}
                >
                  {creation.levels.items.findIndex((l) => l.id === creation.levels!.currentId) + 1} of{" "}
                  {creation.levels.items.length}
                </span>
              </div>
              <Select
                value={String(creation.levels.currentId)}
                onValueChange={(v) => creation.levels!.onPick(Number(v))}
              >
                <SelectTrigger aria-label="Level to Review">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {creation.levels.items.map((l) => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {l.label} · {l.issues} issue{l.issues === 1 ? "" : "s"}
                      {l.done ? " ✓" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* magnitude — traffic light, the one place red/amber/green is allowed. Cause B has no
              reliable ratio, so the block explains instead of counting (US5). */}
          <div
            data-tour="magnitude"
            style={{
              background: band.solid,
              color: "#3A2A00",
              // the tally hangs off the block's bottom edge; without one (cause B) it closes itself
              borderRadius: matchFailed ? 10 : "10px 10px 0 0",
              padding: "12px 14px",
              marginTop: 14,
              marginBottom: matchFailed ? 12 : 0,
            }}
          >
            {creation ? (
              <>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{creation.confidencePct}%</div>
                <div style={{ fontSize: 12 }}>
                  MapScale confidence — a new building has nothing to compare yet; confirm its guesses below
                </div>
              </>
            ) : redCause === "cannot-match" ? (
              <>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{RED_CAUSE_COPY["cannot-match"].title}</div>
                <div style={{ fontSize: 12, lineHeight: 1.35 }}>{RED_CAUSE_COPY["cannot-match"].detail}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{pct}%</div>
                <div style={{ fontSize: 12 }}>of floor area changed vs the published floor plan</div>
              </>
            )}
          </div>
          {/* the tally, hung off the magnitude block rather than floating as a sentence — dropped
              for cause B: counting is exactly what the engine could not do (decision 11) */}
          {!matchFailed && (
            <div
              style={{
                display: "flex",
                border: `1px solid ${LINE}`,
                borderTop: "none",
                borderRadius: "0 0 10px 10px",
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              {METRIC_ORDER.map((t, i) => (
                <div
                  key={t}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderLeft: i ? `1px solid ${LINE}` : "none",
                    lineHeight: 1.15,
                  }}
                >
                  <div style={{ fontSize: 17, fontWeight: 600, color: METRIC_COLOR[t] }}>
                    {changes.filter((c) => inMetric(c, t)).length}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--review-muted)" }}>{METRIC_LABEL[t]}</div>
                </div>
              ))}
            </div>
          )}

          {/*
            The version's fate if nobody acts, and the levers to change it — US4 and US5's real
            actions, which the old Cancel/"Apply update" footer never expressed. Amber counts down
            to an automatic publish: cancel the schedule, or publish now. Red never publishes
            itself but is publishable at any time. Traffic-light tinting is sanctioned here — the
            strip restates the magnitude's consequence, like the tree tags (§10). What "Publish
            now" publishes for ONE level while publishing is site-scoped is open question Q5; the
            mock records the intent locally and Phase 2 gives it a real backend.
          */}
          {/* creation has no fate: Save creates, publishing stays the site's Publish */}
          {!creation && (fate !== "pending" ? (
            <div
              style={{
                border: `1px solid ${fate === "published" ? BAND.minor.border : LINE}`,
                background: fate === "published" ? BAND.minor.tint : "#f2f3f5",
                color: fate === "published" ? BAND.minor.ink : "var(--review-muted)",
                borderRadius: 10,
                padding: "10px 12px",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              <div style={{ flex: 1 }}>
                {fate === "published"
                  ? "Published just now — this version is live."
                  : fate === "held"
                    ? // A part-way save suspends the countdown, so the strip must stop promising it.
                      "In review — this level is held out of publishing, including the automatic one, until you complete the review."
                    : "Scheduled publish cancelled — nothing publishes until you conclude the review or publish it yourself."}
              </div>
              {/* killing the timer doesn't take away the deliberate path — and being held doesn't
                  either: you can still decide to put it live as it stands */}
              {(fate === "cancelled" || fate === "held") && (
                <Button size="sm" onClick={() => setFate("published")}>
                  Publish now
                </Button>
              )}
            </div>
          ) : (
            <div
              style={{
                border: `1px solid ${band.border}`,
                background: band.tint,
                color: band.ink,
                borderRadius: 10,
                padding: "10px 12px",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 180, fontSize: 12, lineHeight: 1.4 }}>
                {bandKind === "medium"
                  ? `Publishes automatically in ${GRACE_DAYS.demoLeft} days unless you finish reviewing.`
                  : // only cause B reaches a large-band review: cause A is rejected before it gets
                    // here (decision 9) and cause C never produces anything to review
                    "Never published automatically. Review it, then publish when you're ready."}
              </div>
              {/*
                Amber carries ONE action, and it is the quiet one (Olcay, 2026-08-13).
                *Publish now* used to sit here too, and it was the wrong offer mid-review: it
                publishes the same thing **Complete review** publishes, from the opposite end of the
                screen, while you are still deciding. US4's "publish immediately as soon as I'm done
                with my review" IS Complete review — so the duplicate went, and only the action with
                no substitute stayed: stopping the clock.

                Cause B keeps *Publish now*, and must: decision 11 gives it no changelog, so there
                is nothing to "complete" and this is its only way to publish.
              */}
              <div style={{ display: "flex", gap: 8, flex: "0 0 auto" }}>
                {bandKind === "medium" ? (
                  <Button variant="link" size="sm" onClick={() => setFate("cancelled")}>
                    Cancel scheduled publish
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setFate("published")}>
                    Publish now
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/*
            Cause B's body (decision 11): whole-floor inspection instead of a changelog. The map
            beside this panel already shows the floor; Compare puts it next to the published
            version; the fate strip above carries Publish now, and a corrected re-upload lives
            where uploads live — the editor.
          */}
          {matchFailed && (
            <div
              style={{
                border: `1px solid ${LINE}`,
                borderRadius: 10,
                padding: "14px 16px",
                marginTop: 10,
                fontSize: 12.5,
                lineHeight: 1.5,
                color: "#464a53",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--review-ink)", marginBottom: 4 }}>
                No per-change list for this update
              </div>
              A per-change list is a comparison against the published map — and aligning the two is
              exactly what failed, so listing changes here would be guesswork. Inspect the floor on
              the map, compare it with the published version, then publish when you're satisfied —
              or upload a corrected floor-plan from the level's editor.
              {onCompare && (
                <div style={{ marginTop: 10 }}>
                  <Button variant="outline" size="sm" onClick={onCompare}>
                    Compare with published map
                  </Button>
                </div>
              )}
            </div>
          )}

          {/*
            Sections by change type, colour-keyed, rows visible — the v9 shape. Risk rides on the
            rows (warnings sort first and wear a mark) rather than becoming an outer container,
            which hid every change behind a chevron. Confirm all / Reject all sit on the first
            section's title row.
          */}
          {/*
            D16 — whole-floor conditions, above the list they scope. Neutral by §3: risk is a third
            axis and is never coloured, so this never wears amber even though it is a warning. It
            says the list is UNAFFECTED, because US10's whole point is that the engine carries on.
          */}
          {floorWarnings && floorWarnings.length > 0 && (
            <div
              data-tour="floor-warnings"
              style={{ marginTop: 10, border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}
            >
              {floorWarnings.map((w, i) => (
                <div
                  key={w.kind}
                  style={{
                    display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px",
                    background: "#f6f7f9", borderTop: i ? `1px solid ${LINE}` : "none",
                  }}
                >
                  <span style={{ flex: "0 0 auto", marginTop: 1 }}>
                    <WarningGlyph size={13} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--review-ink)" }}>
                      {WARNING_LABEL[w.kind]}
                    </div>
                    <div style={{ fontSize: 12, color: "#5d626f", lineHeight: 1.45, marginTop: 2 }}>
                      {w.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div data-tour="changelog">
          {sections.map((s, i) => (
            <div key={s.key} style={{ marginTop: i ? 18 : 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flex: "0 0 auto" }}
                />
                <span style={{ fontSize: 11, letterSpacing: 1, fontWeight: 700, color: s.color }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 11, letterSpacing: 1, fontWeight: 600, color: "#9AA0A6" }}>
                  · {s.count}
                </span>
                <span style={{ flex: 1 }} />
                {i === 0 && (
                  <>
                    <Button variant="link" size="sm" onClick={() => setMany(decidableIds, "confirm")}>
                      Confirm all
                    </Button>
                    <Button variant="link" size="sm" onClick={() => setMany(decidableIds, "reject")}>
                      Reject all
                    </Button>
                  </>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                {s.groups.map((g) => (
                  <ChangeGroupBlock key={g.key} group={g} onDecideOne={setOne} onDecideGroup={setMany} />
                ))}
                {s.rows.map((c) => (
                  <ChangeReviewRow
                    key={c.id}
                    change={c}
                    override={c.type === "preserved"}
                    onDecide={(d) => setOne(c.id, d)}
                    active={activeId === c.id}
                    onActivate={() => activate(c.id)}
                  />
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "12px 20px",
            borderTop: "1px solid #E7E9EE",
            justifyContent: "flex-end",
          }}
        >
          {/*
            Cancel/Go back became the header's ✕ (Olcay's standing rule). The footer used to keep
            only the concluding action — one button, "Save" — and it now keeps **two**, because
            they are genuinely two different intentions (Olcay, 2026-08-11):

              **Save** — "I'm part-way through, I'll come back." Your decisions are written to the
              level and **the level is held out of publishing until you complete the review** —
              including the automatic publish, because a grace period firing here would take a
              half-reviewed floor live. No confirmation: nothing goes live, so there is nothing to
              warn about.
              **Complete review** — the concluding action, and the only one that publishes.
              Primary, right-most, and it still asks first.

            The held state is **"In review"**, never "draft" (Olcay: *"similar to draft but we
            don't want to say draft"*) — decision 5 removed the draft model and the word is spoken
            for.

            **Creation carries the same pair** (§18: *"each level gets its own Save / Complete
            review, exactly like the update flow"*), superseding its single Confirm Changes. The
            words mean the same things: Save keeps your decisions and leaves the level **In
            review**; Complete review concludes it. What differs is only what conclusion *costs* —
            in the update flow it can publish a site, so it asks first; here it publishes nothing,
            so it doesn't.
          */}
          {creation ? (
            <>
              <Button
                variant="secondary"
                title="Save your decisions and come back to this level later. Nothing is concluded."
                onClick={() => creation.onSave(changes)}
              >
                Save
              </Button>
              <Button onClick={() => creation.onConfirm(changes)}>Complete review</Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                title="Save your decisions to the level and come back later. The level is held out of publishing — including the automatic one — until you complete the review."
                onClick={() => {
                  saveProgress();
                  onClose?.();
                }}
              >
                Save
              </Button>
              <Button onClick={() => setConfirmOpen(true)}>Complete review</Button>
            </>
          )}
        </div>

        <ConfirmOverlay
          open={confirmOpen}
          tone="info"
          title={flaggedCount ? `Complete review with ${flaggedCount} flagged change${flaggedCount === 1 ? "" : "s"}?` : "Complete this review?"}
          confirmLabel="Complete review"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            concludeReview();
            onClose?.();
          }}
        >
          {/*
            Three sentences, each earning its place, in the order they matter.

            1. **What completing does** — and it says *publishes* outright when it will, rather
               than the old hedge "if this level is eligible", which left the reader to work out
               whether it applied to them at the moment they most needed to know.
            2. **The flags**, when there are any: they go live as they are. Flagging means "come
               back to this later"; §18a settled that it does not hold anything back, so this is
               the sentence that keeps that from being a nasty surprise.
            3. **The undecided**, which apply as detected — exactly what the grace period would
               have done unattended.
          */}
          {(fate === "published"
            ? "This version is already live. Completing the review keeps your decisions on record."
            : willPublish
              ? "Completing concludes the review and publishes this level with your decisions applied."
              : "Completing concludes the review. This level is not published automatically — use Publish now when you're ready.") +
            (flaggedCount
              ? ` ${flaggedCount} change${flaggedCount === 1 ? " is" : "s are"} flagged to edit later — flagging marks ${flaggedCount === 1 ? "it" : "them"} for a later dashboard edit, so ${flaggedCount === 1 ? "it goes" : "they go"} live as detected.`
              : "") +
            (undecidedCount
              ? ` ${undecidedCount} change${undecidedCount === 1 ? "" : "s"} still ${undecidedCount === 1 ? "has" : "have"} no decision — ${undecidedCount === 1 ? "it will be applied" : "they will be applied"} as detected.`
              : "")}
        </ConfirmOverlay>
      </div>

      {/* Map pane — live Pointr WebSDK map, highlights driven by the decisions above */}
      <div data-tour="review-map" style={{ position: "relative", flex: 1, background: "#EDEEF0", minWidth: 0 }}>
        <PointrMap
          changes={changes}
          prefs={prefs}
          onLevel={onLevel}
          onFeatures={onFeatures}
          onDecision={onMapDecision}
          active={activeId}
          onSelect={onMapSelect}
          target={mapTarget}
        />
        <MapChrome prefs={prefs} onPrefs={setPrefs} focus={!matchFailed} />
      </div>
    </div>
  );
}
