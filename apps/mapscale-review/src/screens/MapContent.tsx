import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Button, Icon, Input, Popover, PopoverTrigger, PopoverContent, Text } from "@kozmos/react";
import PointrMap, { type MapBuilding, type MapLevel } from "../map/PointrMap";
import { BAND, EXPERT_HOLD, EXPERT_REVIEW_LEVEL, GRACE_DAYS, isUnderExpertReview, type Change } from "../mock/diff";
import { PANEL_WIDTH } from "../ui/Chrome";
import { MapSettings, type MapPrefsState } from "../ui/MapSettings";
import { LevelSelector } from "../ui/LevelSelector";
import { UploadDropConfirm } from "../ui/UploadDropConfirm";
import { getCreatedBuildings, subscribeCreatedBuildings } from "../mock/store";

/**
 * S4 — Map Content (Figma node 2483:776). The dashboard's entry point: the buildings of the active
 * site, their levels, and the per-level context menu that starts the update flow.
 */

/** Stable identity: an inline [] is a new array every render, and PointrMap posts on change. */
const NO_CHANGES: Change[] = [];

const LINE = "#e3e4e8";
const INK = "#082975";
const LINK = "#0b369c";
const MUTED = "#5d626f";

export interface LevelRef {
  building: string;
  /** The SDK's building id — what the map needs to open this level (`building` is only a label). */
  buildingId: string;
  index: number;
  name: string;
  short: string;
  /** A level being CREATED (drop → "Add as new level"): no seeded history, the upload is v1. */
  isNew?: boolean;
}

/**
 * A status tag on a level row. Tones that restate a magnitude band reuse `BAND` so the tree and the
 * review screen can't drift apart; everything else is neutral or informational.
 *
 * This is the one extension of "traffic-light is reserved for magnitude": a tag like "Auto-published"
 * or "Needs your review" IS the magnitude speaking, just earlier in the journey. A tag never carries
 * a change-type colour or a decision colour.
 */
export type TagTone = "info" | "neutral" | "minor" | "medium" | "large";

/** Every state a level can advertise in the tree. Ordered and filtered by the tables below. */
export type LevelTagKind =
  | "rejected"
  | "needs-decision"
  | "grace"
  | "needs-review"
  | "expert-review"
  | "new-version"
  | "auto-published"
  | "flagged";

export interface LevelTag {
  kind: LevelTagKind;
  label: string;
  tone: TagTone;
  title?: string;
  /** Tags that are also the call to action are clickable; the rest are pure status. */
  action?: "review";
}

/**
 * Which tag matters most when several are true at once. Higher wins, and sorts first.
 *
 * A level routinely qualifies for more than one — a new version arrived AND it is amber AND the
 * grace period is counting down are all the same event seen from three angles. Showing all three
 * is noise, so a tag can supersede the ones it makes redundant.
 */
const TAG_PRIORITY: Record<LevelTagKind, number> = {
  rejected: 100,
  "needs-decision": 100,
  grace: 90,
  "needs-review": 80,
  "expert-review": 70,
  "new-version": 50,
  "auto-published": 40,
  flagged: 30,
};

/**
 * Only true redundancy is suppressed. "Publishes in 6d" says everything "Needs review" says and
 * adds the deadline, so it replaces it — but "New version" survives alongside a band tag, because
 * it is the action (it opens the review) while the band is the status.
 */
const TAG_SUPERSEDES: Partial<Record<LevelTagKind, LevelTagKind[]>> = {
  rejected: ["needs-review", "grace", "new-version"],
  "needs-decision": ["needs-review", "grace", "new-version"],
  grace: ["needs-review"],
  "auto-published": ["new-version"],
};

/** How many tags a row shows before the rest collapse into a count. */
const MAX_VISIBLE_TAGS = 3;

export function resolveTags(tags: LevelTag[] | undefined): { shown: LevelTag[]; hidden: number } {
  if (!tags?.length) return { shown: [], hidden: 0 };
  const sorted = [...tags].sort((a, b) => TAG_PRIORITY[b.kind] - TAG_PRIORITY[a.kind]);
  const beaten = new Set<LevelTagKind>();
  for (const t of sorted) for (const k of TAG_SUPERSEDES[t.kind] ?? []) beaten.add(k);
  const kept = sorted.filter((t) => !beaten.has(t.kind));
  return { shown: kept.slice(0, MAX_VISIBLE_TAGS), hidden: Math.max(0, kept.length - MAX_VISIBLE_TAGS) };
}

interface Level {
  index: number;
  name: string;
  short: string;
  count?: number;
  starred?: boolean;
  /** Every state the level advertises, "New version" included — see resolveTags(). */
  tags?: LevelTag[];
  children?: string[];
}

interface Building {
  id: string;
  name: string;
  count?: number;
  status?: string;
  levels?: Level[];
}

const OUTDOOR = { id: "outdoor", name: "Outdoor Map Content", count: 13 };

/** The level MapScale has a new version for — the one the review flow opens (see LEVEL_TAGS). */
const NEW_VERSION_LEVEL = -2;

const TAG_TONE: Record<TagTone, { bg: string; border: string; ink: string }> = {
  info: { bg: "#eef3ff", border: "#cfdcff", ink: LINK },
  neutral: { bg: "#f2f3f5", border: LINE, ink: MUTED },
  minor: { bg: BAND.minor.tint, border: BAND.minor.border, ink: BAND.minor.ink },
  medium: { bg: BAND.medium.tint, border: BAND.medium.border, ink: BAND.medium.ink },
  large: { bg: BAND.large.tint, border: BAND.large.border, ink: BAND.large.ink },
};

function Tag({ tag, onAction }: { tag: LevelTag; onAction?: () => void }) {
  const t = TAG_TONE[tag.tone];
  const clickable = !!tag.action && !!onAction;
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    lineHeight: 1.6,
    color: t.ink,
    background: t.bg,
    border: `1px solid ${t.border}`,
    borderRadius: 999,
    padding: "1px 8px",
    whiteSpace: "nowrap",
    flex: "0 0 auto",
    cursor: clickable ? "pointer" : "default",
  };
  const inner = (
    <>
      {tag.kind === "new-version" && (
        <span style={{ width: 6, height: 6, borderRadius: 3, background: t.ink, flex: "0 0 auto" }} />
      )}
      {tag.label}
    </>
  );
  return clickable ? (
    <button title={tag.title} onClick={onAction} style={style}>
      {inner}
    </button>
  ) : (
    <span title={tag.title} style={style}>
      {inner}
    </span>
  );
}

/**
 * Where each level stands, shown in the tree so you don't have to open a level to find out.
 * Keyed by level index for the demo building; the real thing reads it from the job + version state.
 *
 * **Kept in step with `seedVersions()` in mock/diff.ts** — the editor seeds its status card from
 * the same index, so the tag you clicked and the screen you land on always agree. Change a band
 * here and the seed there, together. (Index-keyed means every building's matching index carries
 * the same story — a mock-wide convention, not a bug.)
 */
const LEVEL_TAGS: Record<number, LevelTag[]> = {
  [NEW_VERSION_LEVEL]: [
    { kind: "needs-review", label: "Needs review", tone: "medium", title: "30% of floor area changed — publishes automatically in 6 days unless you review it" },
    { kind: "new-version", label: "New version", tone: "info", action: "review", title: "Review the changes MapScale detected" },
  ],
  // Red cause A (>50%): rejected outright (decision 9) — nothing to review, so the tag carries
  // no action; the title says the way out. Its supersede rule drops the "New version" tag.
  3: [
    { kind: "rejected", label: "Rejected", tone: "large", title: "62% of floor area changed — a change this large is unrealistic, so the floor plan was rejected. Upload a corrected file, or contact our support team if this really is new construction" },
  ],
  // Red cause B (US5): MapScale couldn't match the floor plan. Only Concourse A has a level 4,
  // so Terminal 3's six demos stay untouched. (The old placeholder "4F" row that shared this
  // index is gone — SITE_SNAPSHOT is a verbatim real-site capture now, §17.)
  4: [
    { kind: "needs-decision", label: "Needs decision", tone: "large", action: "review", title: "MapScale couldn't match the new floor plan to the published one — review it, then publish when you're ready" },
  ],
  [-4]: [{ kind: "flagged", label: "2 flagged", tone: "neutral", title: "Two changes flagged for a later dashboard edit" }],
  0: [
    { kind: "auto-published", label: "Auto-published", tone: "minor", title: "Minor change (12% of floor area) — published automatically" },
    // Superseded by auto-published: the arrival is history once it is live.
    { kind: "new-version", label: "New version", tone: "info", action: "review" },
  ],
  1: [
    // templated from GRACE_DAYS so the tag and the review screen's strip can't drift apart
    { kind: "grace", label: `Publishes in ${GRACE_DAYS.demoLeft}d`, tone: "medium", title: `Grace period ends in ${GRACE_DAYS.demoLeft} days` },
    // Superseded by the countdown, which says the same thing and adds the deadline.
    { kind: "needs-review", label: "Needs review", tone: "medium" },
  ],
  // keyed off the same constant the hold reads, so the tag and the held screen can't disagree
  [EXPERT_REVIEW_LEVEL]: [
    { kind: "expert-review", label: "Expert Review", tone: "neutral", title: "Pointr's mapping team is checking this floor — changes you make may be overridden by their corrections" },
  ],
};

/**
 * The tree is built from the SDK's own buildings and levels (via the map), so the tree, the
 * breadcrumb and the map can't disagree. `BUILDINGS` below is only the pre-load placeholder.
 */
function toBuildings(live: MapBuilding[]): Building[] {
  return live.map((b) => ({
    id: b.id,
    name: b.name,
    count: b.levels.length,
    levels: b.levels.map((l) => ({
      index: l.index,
      name: l.long,
      short: l.short,
      tags: LEVEL_TAGS[l.index],
    })),
  }));
}

/**
 * The pre-boot placeholder is a verbatim snapshot of the live site (captured from the SDK's own
 * `siteBuildings()` on 2026-08-10), pushed through the SAME mapping the live data uses — so the
 * tree doesn't visibly change when the map finishes booting (Olcay). The old fictional
 * Terminal A/B/C is gone entirely. To refresh after the site changes: run `siteBuildings()` in
 * the map iframe and paste.
 */
const T3_ID = "51dd37d1-c2bc-4d9e-8e22-2ea1a15a626c";

const SITE_SNAPSHOT: MapBuilding[] = [
  {
    id: "c782c844-c9f0-4b02-884b-4cfa8ec9dab6", name: "Concourse A",
    levels: [
      { index: 4, short: "L4", long: "EK Business Class Lounge" },
      { index: 3, short: "L3", long: "EK First Class Lounge" },
      { index: 2, short: "L2", long: "Departures" },
      { index: 1, short: "L1", long: "Arrivals" },
      { index: 0, short: "L0", long: "Connection Floor" },
      { index: -2, short: "B2", long: "Train Connections" },
    ],
  },
  {
    id: "420b008e-9ac9-4d66-bbc6-c2639c1e3f6d", name: "Concourse C",
    levels: [
      { index: 2, short: "L2", long: "Arrivals" },
      { index: 1, short: "L1", long: "Departures" },
      { index: 0, short: "L0", long: "Connection Floor" },
    ],
  },
  {
    id: T3_ID, name: "Terminal 3 and B Gates",
    levels: [
      { index: 3, short: "L3", long: "EK Lounges - Concourse B" },
      { index: 2, short: "L2", long: "Departures - Concourse B" },
      { index: 1, short: "L1", long: "Arrivals - Concourse B" },
      { index: 0, short: "L0", long: "Connection Floor - Concourse B" },
      { index: -2, short: "B2", long: "Departures - Terminal 3" },
      { index: -4, short: "B4", long: "Arrivals - Terminal 3" },
    ],
  },
];

const BUILDINGS: Building[] = toBuildings(SITE_SNAPSHOT);

function Count({ n }: { n: number }) {
  return (
    <span
      style={{
        fontSize: 11,
        lineHeight: "18px",
        color: MUTED,
        background: "#f2f3f5",
        borderRadius: 10,
        padding: "0 8px",
      }}
    >
      {n}
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 20,
        color: MUTED,
        transform: open ? "rotate(90deg)" : "none",
        transition: "transform .12s",
      }}
    >
      <Icon name="chevron-right" />
    </span>
  );
}

/** Three-dot affordance — @kozmos/icons has no ellipsis (see the DS gaps in the handoff). */
function Ellipsis() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden focusable="false">
      {[4.5, 9, 13.5].map((cx) => (
        <circle key={cx} cx={cx} cy="9" r="1.5" fill="currentColor" />
      ))}
    </svg>
  );
}

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-label="Default level" role="img">
      <path
        d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.4 6.2 20.4l1.1-6.5-4.7-4.6 6.5-.95L12 2.5z"
        fill="#3B82F6"
      />
    </svg>
  );
}

/**
 * One indent step = chevron (20) + gap (8), so each level's chevron sits directly under its
 * parent's *symbol* rather than under the parent's chevron.
 */
const INDENT = 28;
const ROW_PAD = 12;
const indent = (depth: number) => ROW_PAD + depth * INDENT;

const MENU_ITEM: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  background: "none",
  border: "none",
  padding: "10px 14px",
  fontSize: 13,
  cursor: "pointer",
  color: "var(--review-ink)",
  borderRadius: 8,
};

/**
 * A row of the ⋯ menu. `reason` disables it and says why — a disabled control needs a title on a
 * wrapper, since a disabled <button> swallows the hover that would show its own.
 */
function MenuItem({
  label,
  onClick,
  danger,
  reason,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  reason?: string;
}) {
  return (
    <span title={reason} style={{ display: "block" }}>
      <button
        disabled={!!reason}
        onClick={onClick}
        style={{
          ...MENU_ITEM,
          color: reason ? MUTED : danger ? "#C62828" : "var(--review-ink)",
          cursor: reason ? "not-allowed" : "pointer",
          opacity: reason ? 0.6 : 1,
        }}
      >
        {label}
      </button>
    </span>
  );
}

function LevelRow({
  building,
  buildingId,
  level,
  onEdit,
  onReview,
  onUpdate,
}: {
  building: string;
  buildingId: string;
  level: Level;
  onEdit: (l: LevelRef) => void;
  onReview: (l: LevelRef) => void;
  /** Update floor-plan: opens the editor with the file browser already popped. */
  onUpdate: (l: LevelRef) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref: LevelRef = { building, buildingId, index: level.index, name: level.name, short: level.short };
  const { shown: shownTags, hidden: hiddenTags } = resolveTags(level.tags);
  const lockedByExperts = isUnderExpertReview(level.index);

  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: `8px 12px 8px ${indent(1)}px`,
          borderBottom: `1px solid ${LINE}`,
          background: hover || menuOpen ? "#f6f7f9" : "#fff",
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          disabled={!level.children}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: level.children ? "pointer" : "default",
            opacity: level.children ? 1 : 0.25,
          }}
          aria-label={open ? "Collapse" : "Expand"}
        >
          <Chevron open={open} />
        </button>
        <span style={{ width: 16, textAlign: "right", fontSize: 13, color: MUTED }}>
          {level.index}
        </span>
        {/*
          Name on the first line, tags on a second beneath it — the same shape the DS `listItem`
          uses for its `additionalInformation` slot (Figma node 2505:1249). Inline tags fight the
          name for width and force it to truncate; stacked, the name gets the whole row.
        */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span
              title={level.name}
              style={{
                fontSize: 13,
                color: "var(--review-ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {level.name}
            </span>
            {level.starred && <Star />}
            {typeof level.count === "number" && <Count n={level.count} />}
          </div>
          {/*
            Every state lives on this line, "New version" included — it is a status like the rest,
            just one that happens to be clickable. Ordered most-important first, with redundant
            states dropped (see TAG_PRIORITY / TAG_SUPERSEDES).
          */}
          {!!shownTags.length && (
            <div data-tour="level-tags" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {shownTags.map((t) => (
                <Tag key={t.kind} tag={t} onAction={t.action === "review" ? () => onReview(ref) : undefined} />
              ))}
              {hiddenTags > 0 && (
                <span style={{ fontSize: 11, color: MUTED }}>+{hiddenTags}</span>
              )}
            </div>
          )}
        </div>
        {/* the menu button only appears on hover, as in the design */}
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button
              aria-label={`Actions for ${level.name}`}
              style={{
                display: "grid",
                placeItems: "center",
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                background: "none",
                color: MUTED,
                cursor: "pointer",
                visibility: hover || menuOpen ? "visible" : "hidden",
              }}
            >
              <Ellipsis />
            </button>
          </PopoverTrigger>
          {/*
            Three items only (Olcay, 2026-08-10 evening — Georeference and View version history
            moved out; both remain reachable from the editor, which is a click away). The expert
            hold still reaches the frame-changing actions (EXPERT_HOLD is the law): Update
            floor-plan and Delete lock with their reasons; Edit stays open — it is how you reach
            the held screen in the first place. Update floor-plan opens the editor AND pops the
            file browser (the menu click's user activation carries into the editor's mount).
          */}
          <PopoverContent align="start" side="bottom" style={{ width: 232, padding: 6 }}>
            <MenuItem
              label="Update floor-plan"
              reason={lockedByExperts ? EXPERT_HOLD.upload : undefined}
              onClick={() => { setMenuOpen(false); onUpdate(ref); }}
            />
            <MenuItem
              label="Edit level details"
              onClick={() => { setMenuOpen(false); onEdit(ref); }}
            />
            <MenuItem
              label="Delete level"
              danger
              reason={lockedByExperts ? EXPERT_HOLD.remove : undefined}
              onClick={() => setMenuOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div>
      {open &&
        level.children?.map((c) => (
          <div
            key={c}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: `8px 12px 8px ${indent(2)}px`,
              borderBottom: `1px solid ${LINE}`,
              fontSize: 13,
              color: MUTED,
            }}
          >
            <Chevron open={false} />
            {c}
          </div>
        ))}
    </>
  );
}

function BuildingRow({
  building,
  open,
  onToggle,
  onEdit,
  onReview,
  onUpdate,
  onEditBuilding,
}: {
  building: Building;
  /** Expansion lives in MapContent so the map's own building can open itself (see openBuildings). */
  open: boolean;
  onToggle: () => void;
  onEdit: (l: LevelRef) => void;
  onReview: (l: LevelRef) => void;
  onUpdate: (l: LevelRef) => void;
  /** The ⋯ menu's Edit building — re-enters the Building wizard with steps pre-completed. */
  onEditBuilding: (b: Building) => void;
}) {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: `10px 12px 10px ${indent(0)}px`,
          borderBottom: `1px solid ${LINE}`,
          background: hover || menuOpen ? "#f6f7f9" : "#fff",
          // the ⋯ floats over the row rather than sitting in its flow: at 28px it is taller than
          // the 19px text line, so in-flow it stretched building rows to 49px against Outdoor Map
          // Content's 39px — a hover affordance was setting the tree's rhythm (fixed 2026-08-11)
          position: "relative",
        }}
      >
        <button
          onClick={onToggle}
          disabled={!building.levels}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: building.levels ? "pointer" : "default",
            opacity: building.levels ? 1 : 0.25,
          }}
          aria-label={open ? "Collapse" : "Expand"}
        >
          <Chevron open={open} />
        </button>
        <span style={{ color: MUTED, display: "grid", placeItems: "center" }}>
          <Icon name="building-01" />
        </span>
        <span style={{ fontSize: 13, color: "var(--review-ink)" }}>{building.name}</span>
        {building.status && (
          <span
            style={{
              fontSize: 11,
              color: "#B45309",
              border: "1px solid #F5A623",
              borderRadius: 999,
              padding: "2px 10px",
            }}
          >
            {building.status}
          </span>
        )}
        {typeof building.count === "number" && <Count n={building.count} />}
        {/* buildings carry a ⋯ just like levels (Olcay, 2026-08-11) */}
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button
              aria-label={`Actions for ${building.name}`}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                display: "grid",
                placeItems: "center",
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                background: "none",
                color: MUTED,
                cursor: "pointer",
                visibility: hover || menuOpen ? "visible" : "hidden",
              }}
            >
              <Ellipsis />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" side="bottom" style={{ width: 232, padding: 6 }}>
            <MenuItem
              label="Edit building"
              onClick={() => { setMenuOpen(false); onEditBuilding(building); }}
            />
            <MenuItem label="Delete building" danger onClick={() => setMenuOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>
      {open &&
        building.levels?.map((l) => (
          <LevelRow
            key={l.index}
            building={building.name}
            buildingId={building.id}
            level={l}
            onEdit={onEdit}
            onReview={onReview}
            onUpdate={onUpdate}
          />
        ))}
    </>
  );
}

export function MapContent({
  onEditLevel,
  onReviewLevel,
  onUpdateLevel,
  onUploadLevel,
  onAddBuilding,
  onEditBuilding,
}: {
  onEditLevel: (l: LevelRef) => void;
  onReviewLevel: (l: LevelRef) => void;
  /** The ⋯ menu's Update floor-plan: open the editor with the file browser popped. */
  onUpdateLevel: (l: LevelRef) => void;
  /** A dropped floor-plan was confirmed for a level — open its editor and start the upload. */
  onUploadLevel: (l: LevelRef, file: string) => void;
  /** "Add new" — opens the Building wizard (v9 10059:102926). */
  onAddBuilding: () => void;
  /** A building row's ⋯ → Edit building: the wizard re-entered with steps pre-completed. */
  onEditBuilding: (b: { id: string; name: string; levels: { index: number; short: string; name: string }[] }) => void;
}) {
  const [buildings, setBuildings] = useState<Building[] | null>(null);
  const [live, setLive] = useState<MapBuilding[]>([]);
  // What the map is showing — driven by the selector over the map, top-centre.
  const [target, setTarget] = useState<{ building: string; level: number } | undefined>();
  const [mapLevel, setMapLevel] = useState<MapLevel | null>(null);
  const onBuildings = useCallback((b: MapBuilding[]) => {
    setBuildings(toBuildings(b));
    setLive(b);
  }, []);
  const onLevel = useCallback((l: MapLevel) => setMapLevel(l), []);
  // Seed the selector from whatever the map opened on, and correct it when the map says a switch
  // failed — that report carries the floor it never left, so the selector can't sit on a level the
  // map isn't showing. PointrMap only surfaces boot and *failed* switches, so this never fights a
  // selection the user just made. Same target in = same object out, so it can't loop back either.
  useEffect(() => {
    if (!live.length || !mapLevel) return;
    const b = live.find((x) => x.name === mapLevel.building) ?? live[0];
    setTarget((cur) =>
      cur && cur.building === b.id && cur.level === mapLevel.index
        ? cur
        : { building: b.id, level: mapLevel.index },
    );
  }, [live, mapLevel]);
  // Wizard-created buildings ride the store so they survive navigation; their levels carry no
  // index-keyed tags — a just-created building has no update story yet.
  const created = useSyncExternalStore(subscribeCreatedBuildings, getCreatedBuildings);
  const tree = [
    ...(buildings ?? BUILDINGS),
    ...created.map((b) => ({
      id: b.id,
      name: b.name,
      count: b.levels.length,
      levels: b.levels.map((l) => ({ index: l.index, name: l.long, short: l.short })),
    })),
  ];
  /**
   * Which buildings are expanded. The building the map is showing is the one you're working in,
   * so it opens itself (Olcay, 2026-08-10) — on boot and again whenever the map's building
   * changes. Only ever ADDED, never collapsed: a building you closed by hand stays closed until
   * the map actually moves to it, and other buildings are never touched. Starts with the
   * placeholder's Terminal C so the pre-boot tree isn't a wall of chevrons.
   */
  const [openBuildings, setOpenBuildings] = useState<Set<string>>(
    () => new Set([T3_ID, ...getCreatedBuildings().map((b) => b.id)]),
  );
  useEffect(() => {
    const b = target?.building;
    if (!b) return;
    setOpenBuildings((prev) => (prev.has(b) ? prev : new Set(prev).add(b)));
  }, [target?.building]);
  const toggleBuilding = (id: string) =>
    setOpenBuildings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const [prefs, setPrefs] = useState<MapPrefsState>({
    greyscale: false,
    hidePoiLabels: false,
    floorplan: false,
    basemap: "vector",
  });
  // A file dropped on the map, waiting for the confirmation overlay's answer. Ignored until the
  // map has booted — before that there is no honest building/level to prefill.
  const [dropped, setDropped] = useState<string | null>(null);
  const onFileDrop = useCallback((f: { name: string }) => setDropped(f.name), []);

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
        <div style={{ padding: "16px 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: 600, color: INK }}>Map Content</Text>
            <span style={{ color: MUTED, display: "grid", placeItems: "center" }}>
              <Icon name="info-circle" />
            </span>
            <span style={{ flex: 1 }} />
            <Button variant="outline" size="sm" onClick={onAddBuilding} data-tour="add-building">
              Add new
            </Button>
          </div>
          <Text style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
            You are viewing buildings for <b style={{ color: "var(--review-ink)" }}>Dubai International Airports</b>
          </Text>
          <div style={{ marginTop: 12 }}>
            <Input placeholder="Search" aria-label="Search map content" />
          </div>
          <Text style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>316 Map Content found.</Text>
        </div>

        <div data-tour="tree" style={{ overflow: "auto", flex: 1, borderTop: `1px solid ${LINE}` }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: `10px 12px 10px ${indent(0)}px`,
              borderBottom: `1px solid ${LINE}`,
            }}
          >
            <Chevron open={false} />
            <span style={{ color: MUTED, display: "grid", placeItems: "center" }}>
              <Icon name="map-01" />
            </span>
            <span style={{ fontSize: 13, color: "var(--review-ink)" }}>{OUTDOOR.name}</span>
            <Count n={OUTDOOR.count} />
          </div>
          {tree.map((b) => (
            <BuildingRow
              key={b.id}
              building={b}
              open={openBuildings.has(b.id)}
              onToggle={() => toggleBuilding(b.id)}
              onEdit={onEditLevel}
              onReview={onReviewLevel}
              onUpdate={onUpdateLevel}
              onEditBuilding={(bb) =>
                onEditBuilding({
                  id: bb.id,
                  name: bb.name,
                  levels: (bb.levels ?? []).map((l) => ({ index: l.index, short: l.short, name: l.name })),
                })
              }
            />
          ))}
        </div>
      </div>

      <div style={{ position: "relative", flex: 1, background: "#EDEEF0", minWidth: 0 }}>
        <PointrMap
          changes={NO_CHANGES}
          prefs={prefs}
          onBuildings={onBuildings}
          onLevel={onLevel}
          onFileDrop={onFileDrop}
          target={target}
        />
        {live.length > 0 && target && (
          <LevelSelector
            buildings={live}
            buildingId={target.building}
            levelIndex={target.level}
            onChange={(building, level) => setTarget({ building, level })}
          />
        )}
        <MapSettings prefs={prefs} onChange={setPrefs} />
        {dropped && live.length > 0 && target && (
          <UploadDropConfirm
            file={dropped}
            buildings={live}
            initialBuildingId={target.building}
            initialLevel={target.level}
            onConfirm={(l, f) => {
              setDropped(null);
              onUploadLevel(l, f);
            }}
            onCancel={() => setDropped(null)}
          />
        )}
      </div>
    </div>
  );
}
