import { useCallback, useEffect, useMemo, useState } from "react";
import { Text, Button } from "@kozmos/react";
import { ChangeGroupBlock } from "../ui/ChangeGroup";
import { ChangeReviewRow } from "../ui/ChangeReviewRow";
import { ConfirmOverlay } from "../ui/ConfirmOverlay";
import { PANEL_WIDTH } from "../ui/Chrome";
import { MapSettings } from "../ui/MapSettings";
import { PanelHeader } from "../ui/PanelHeader";
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
} from "../mock/diff";
import { getLevelVersions, levelKey, setLevelVersions, setReviewOutcome } from "../mock/store";

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
     * Confirm Changes — hands the DECIDED ROWS back, not a count, so reopening the review resumes
     * where the user left off (the wizard owns them; this screen is remounted each time).
     */
    onConfirm: (rows: Change[]) => void;
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
  const [fate, setFate] = useState<"pending" | "published" | "cancelled">("pending");
  /** Save asks first — the consequence lives in the v9 confirmation overlay, not in a caption. */
  const [confirmOpen, setConfirmOpen] = useState(false);
  // `preserved` is not a change to review — it carries no decision, and the group and section
  // controls filter it out themselves rather than the screen pre-computing a list.
  // keyed by id, so a rebind (which changes names, never ids) can't lose a decision
  const [decisions, setDecisions] = useState<Record<string, Decision | undefined>>(() =>
    Object.fromEntries(initialChanges.map((c) => [c.id, c.decision])),
  );
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
  const setOne = (id: string, d: Decision) => setDecisions((p) => ({ ...p, [id]: d }));
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
    (id: string, d: "confirm" | "flag" | "reject") => setOne(id, d as Decision),
    [],
  );

  /**
   * The active change — one selection shared by the changelog and the map (Olcay, 2026-08-11).
   * Clicking a row opens that feature's card and eases the camera onto it; clicking a shape lights
   * the row and scrolls it into view. Held here rather than in either surface because neither owns
   * it: it is a fact about the review.
   */
  const [activeId, setActiveId] = useState<string | null>(null);
  const activate = (id: string) => setActiveId((cur) => (cur === id ? null : id));
  /** Stable, so PointrMap doesn't re-subscribe its message listener on every render. */
  const onMapSelect = useCallback((id: string | null) => setActiveId(id), []);

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
  const concludeReview = () => {
    if (creation || !target) return;
    const key = levelKey(target.buildingId, target.index);
    const versions = getLevelVersions(key, () => seedVersions(target.short, target.index, target.buildingId));
    const newest = versions[0];
    if (!newest) return;
    const published = fate === "published" || (!matchFailed && bandKind === "medium");
    setReviewOutcome(key, {
      versionN: newest.n,
      decisions,
      changes,
      published,
    });
    if (published && newest.state !== "published")
      setLevelVersions(key, [{ ...newest, state: "published" }, ...versions.slice(1)]);
  };

  /**
   * Bring the lit row into view when the *map* drove the selection. Guarded on the row already
   * being off-screen: scrolling a row you just clicked yourself is an unrequested jolt, and
   * `block: "nearest"` does nothing when it's already visible.
   */
  useEffect(() => {
    if (!activeId) return;
    const row = document.querySelector(`[data-change-row="${CSS.escape(activeId)}"]`);
    row?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeId]);
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
          <div style={{ padding: "18px 20px 8px", flex: 1 }}>
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
        <div style={{ padding: "18px 20px 8px", overflow: "auto", flex: 1 }}>
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
          <div style={{ height: 10 }} />
          <Text style={{ fontSize: 13, color: "var(--review-muted)", display: "block", lineHeight: 1.45 }}>
            {creation
              ? "Confirm each of MapScale's guesses, flag it for a later dashboard edit, or reject it."
              : matchFailed
                ? "Inspect the whole floor, then publish it or upload a corrected floor-plan."
                : "Confirm each change to apply it now, flag it for a later dashboard edit, or reject it."}
          </Text>
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
                  : "Scheduled publish cancelled — nothing publishes until you conclude the review or publish it yourself."}
              </div>
              {/* killing the timer doesn't take away the deliberate path */}
              {fate === "cancelled" && (
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
              <div style={{ display: "flex", gap: 8, flex: "0 0 auto" }}>
                {bandKind === "medium" && (
                  <Button variant="outline" size="sm" onClick={() => setFate("cancelled")}>
                    Cancel scheduled publish
                  </Button>
                )}
                <Button size="sm" onClick={() => setFate("published")}>
                  Publish now
                </Button>
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
              A changelog is a comparison against the published map — and aligning the two is
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
                    readOnly={c.type === "preserved"}
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
          {/* Cancel/Go back became the header's ✕ (Olcay's standing rule) — the footer keeps only
              the concluding action. Just "Save", no subtext (Olcay, 2026-08-10 twice over: the
              draft model is gone, and the consequence belongs in a confirmation overlay, not in a
              caption). A concluded, eligible review triggers the site publish automatically; the
              overlay says so before it happens. Creation's Confirm Changes has no ceremony —
              nothing publishes there. */}
          {creation ? (
            <Button onClick={() => creation.onConfirm(changes)}>Confirm Changes</Button>
          ) : (
            <Button onClick={() => setConfirmOpen(true)}>Save</Button>
          )}
        </div>

        <ConfirmOverlay
          open={confirmOpen}
          tone="info"
          title="Save this review?"
          confirmLabel="Save"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            concludeReview();
            onClose?.();
          }}
        >
          {fate === "published"
            ? "This version is already live. Saving keeps your decisions on record."
            : "Saving concludes the review. If this level is eligible, the site publishes automatically with your decisions applied."}
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
