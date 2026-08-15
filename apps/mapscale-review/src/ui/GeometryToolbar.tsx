/**
 * The geometry toolbar — bottom centre of the map, the v9 *Map Content Geometry* position
 * (Olcay, 2026-08-14, against `b8dqhE3CPxitYfqlXuQJTC` node `465:7046`).
 *
 * **It appears whenever the properties panel is open**, which is whenever a feature is selected —
 * because selecting a feature IS edit mode here (Olcay, 2026-08-15: *"edit shape already should be
 * enabled when in edit mode"*). It carries no Cancel or Done of its own: the panel's own
 * **Cancel** and **Update** commit or discard the shape and the properties together, because they
 * are one edit, not two.
 *
 * It still disappears with the panel — a permanent bar across the middle of the map would cover the
 * floor plan for the 95% of the time nobody is editing.
 *
 * ## The layout, and what was wrong with the first one
 *
 * Rebuilt 2026-08-15 (Olcay: *"geometry tools needs much love visually and layout-wise"*) against
 * `scratch/toolbar-preview.html`, which mounts it in every state at once. Three things the bench
 * showed that reading the code did not:
 *
 * 1. **The caption cannot live in the button row.** The hint, the refusal and the piece count were
 *    inline, so the bar changed width as you used it — the buttons slid under the cursor between
 *    the two clicks of a cut, and the longest refusal pushed the bar wider than the map, clipping
 *    Reset off one end and Points off the other. The caption now floats ABOVE the row, centred and
 *    absolutely positioned, so the row is the same width in every state it has.
 * 2. **`⟲ ⟳ ⤢ ⤡ ↶ ↷` are not icons.** As text they rendered hairline-thin and half a size too
 *    small, and at 0.4 opacity for disabled they vanished outright. They are drawn now, at the
 *    house 1.6 stroke.
 * 3. **Eleven controls in one undifferentiated row is a list, not a toolbar.** They are four
 *    groups doing four jobs: pick a MODE, TRANSFORM the whole shape, TIDY it, or step through
 *    HISTORY. The mode group is a real segmented control on a track, because those three are
 *    mutually exclusive and nothing else in the bar is.
 *
 * The word "Geometry" used to sit at the left end. It was spending the bar's scarcest resource —
 * width — to say what the bar's presence already says.
 */
export interface GeomState {
  editing: boolean;
  fid?: string;
  mode?: "vertices" | "move" | "split";
  snap?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  /** Has the outline actually changed? Feeds the panel's Update button. */
  dirty?: boolean;
  /**
   * How many separate pieces the feature is in. `1` is a feature nobody has split. The editor
   * deliberately does NOT say which piece is which — see the note on `geomApplyCut` in the map
   * shell for why that question is not the editor's to answer.
   */
  pieces?: number;
  /** The first click of a cut has landed and the second is awaited. */
  cutting?: boolean;
}

export type GeomCommand =
  | { cmd: "mode"; mode: "vertices" | "move" }
  | { cmd: "snap" }
  | { cmd: "undo" }
  | { cmd: "redo" }
  | { cmd: "reset" }
  | { cmd: "straighten" }
  | { cmd: "split" }
  | { cmd: "rotate"; deg: number }
  | { cmd: "scale"; k: number };

/* ── icons ────────────────────────────────────────────────────────────────────
   One 24×24 grid, one 1.6 stroke, `currentColor` throughout — so a button's own
   colour and disabled state carry to its icon without a second set of rules.

   Drawn at 22px (Olcay, 2026-08-15: *"I rather like to see larger symbols"*),
   which is large enough that each one has to actually depict its operation —
   at 17px a wrong icon merely looks like a smudge, at 22px it looks wrong. */

const ICON = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Reshape — an irregular outline with its corners grabbable. */
function Reshape() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M5.5 6.5 12 4l6.5 4.5-2 9.5-9-1z" />
      <circle cx="5.5" cy="6.5" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="4" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="8.5" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="18" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="17" r="1.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Move — the whole thing, in any direction. */
function Move() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M12 3.5v17M3.5 12h17" />
      <path d="M9.6 5.9 12 3.5l2.4 2.4M9.6 18.1 12 20.5l2.4-2.4" />
      <path d="M5.9 9.6 3.5 12l2.4 2.4M18.1 9.6 20.5 12l-2.4 2.4" />
    </svg>
  );
}

/** Split — one shape, two halves, the cut between them. */
function Split() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M9.5 5H5.5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4" />
      <path d="M14.5 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4" />
      <path d="M12 3v3M12 9v3M12 15v3M12 21v0" strokeDasharray="0.1 0" />
    </svg>
  );
}

function RotateLeft() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M5 8.6A8 8 0 1 1 4 12" />
      <path d="M4 4v4.6h4.6" />
    </svg>
  );
}

function RotateRight() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M19 8.6A8 8 0 1 0 20 12" />
      <path d="M20 4v4.6h-4.6" />
    </svg>
  );
}

/** Scale up — corners pushed outward. */
function ScaleUp() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M13.8 10.2 20 4M20 4h-5M20 4v5" />
      <path d="M10.2 13.8 4 20M4 20h5M4 20v-5" />
    </svg>
  );
}

/** Scale down — corners pulled in. */
function ScaleDown() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M20 4l-6.2 6.2M13.8 10.2h5M13.8 10.2v-5" />
      <path d="M4 20l6.2-6.2M10.2 13.8h-5M10.2 13.8v5" />
    </svg>
  );
}

/** Straighten — three points that have been brought onto one line. */
function Straighten() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M3.5 15h17" />
      <path d="M8 8.5 12 5l4 3.5" strokeOpacity=".35" />
      <circle cx="4.5" cy="15" r="2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="15" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Snap — two corners closing on the same point, which is literally what it does. */
function Snap() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M4 10V4h6" />
      <path d="M20 14v6h-6" />
      <circle cx="12" cy="12" r="2.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Undo() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M4.5 10.5h9.8a4.8 4.8 0 0 1 0 9.6H8.5" />
      <path d="M8.2 6.6 4.2 10.5l4 3.9" />
    </svg>
  );
}

function Redo() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M19.5 10.5H9.7a4.8 4.8 0 0 0 0 9.6h5.8" />
      <path d="M15.8 6.6l4 3.9-4 3.9" />
    </svg>
  );
}

/** Reset — rewind to the start. Deliberately NOT a circular arrow: that is the rotate icon, and
    the one control that throws your work away must not look like the one that nudges it 15°. */
function Rewind() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M4.5 5.5v13" />
      <path d="M20 6.2v11.6L12.8 12z" />
      <path d="M12.4 6.2v11.6L5.2 12z" />
    </svg>
  );
}

const BAR_INK = "var(--review-ink)";
const BAR_MUTED = "var(--primitives-colors-background-600)";
const BAR_LINE = "var(--primitives-colors-background-900)";
const BAR_ON_BG = "#eaf0ff";
const BAR_ON_INK = "#0b369c";
/* The app's own danger ink (`AiMappingStatus`'s `danger600`), not a token — the DS publishes no red
   at this weight, and a `var()` that only ever resolves to its fallback is a token in appearance
   and a hex in fact. */
const BAR_BAD = "#d41c42";

/**
 * **Symbol above, word below** (Olcay, 2026-08-15: *"I rather like to see larger symbols. and small
 * text underneath"*).
 *
 * The icon-only version leaned entirely on `title=`, which means the bar could only be learned by
 * hovering every control in it one at a time. A label under each symbol makes the whole bar
 * readable at a glance, and it costs width the map can afford — the bar is one row on a full-width
 * map, not a phone.
 *
 * The rotate and scale labels carry their STEP (`15°`, `5%`) rather than repeating the verb the
 * icon already gives. Those are stepped rather than dragged so they are repeatable, and how big
 * each press is was previously knowable only by pressing it and watching.
 */
const TILE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  minWidth: 52,
  padding: "6px 7px 5px",
  borderRadius: 8,
  border: "none",
  background: "none",
  font: "inherit",
  color: BAR_INK,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "background .12s ease, color .12s ease",
};

const TILE_LABEL: React.CSSProperties = {
  fontSize: 10.5,
  lineHeight: 1,
  letterSpacing: ".01em",
};

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 1 }}>
      {children}
    </div>
  );
}

function Sep() {
  return (
    <span
      style={{
        flex: "0 0 auto",
        width: 1,
        alignSelf: "stretch",
        margin: "4px 5px",
        background: BAR_LINE,
      }}
    />
  );
}

/**
 * A plain tool: press it, it happens. `on` is for the one that is a toggle (Snap) and the three
 * that are modes — a pressed tile is filled, because at this size an outline reads as a border
 * rather than as a state.
 */
function Tile({
  icon,
  label,
  title,
  on,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  on?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      // The visible label is the accessible name; `title` adds the detail a tooltip is for.
      aria-pressed={on === undefined ? undefined : on}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...TILE,
        background: on ? BAR_ON_BG : "transparent",
        color: on ? BAR_ON_INK : BAR_INK,
        // 0.4 on a hairline glyph was invisible; on a drawn icon 0.32 still reads as "a control
        // that is here but not available", which is the thing a disabled state has to say.
        opacity: disabled ? 0.32 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {icon}
      <span
        style={{
          ...TILE_LABEL,
          fontWeight: on ? 500 : 400,
          color: on ? BAR_ON_INK : BAR_MUTED,
        }}
      >
        {label}
      </span>
    </button>
  );
}

export function GeometryToolbar({
  state,
  notice,
  padRight = 0,
  onCommand,
}: {
  state: GeomState;
  /** The editor refusing something, in its own words. Transient — the app clears it. */
  notice?: string | null;
  /**
   * ⚠️ **Screen space the properties panel is covering on the right.**
   *
   * Measured in the real app 2026-08-15: the bar is 707px and was centred on the whole map, so
   * with the panel open at x=1068 on a 1440 viewport, **five of the twelve tools** — Straighten,
   * Snap, Undo, Redo and Reset — sat underneath it. They were in the DOM and reachable by keyboard,
   * and completely invisible to a mouse.
   *
   * It could only be this way round: the panel is only ever open when the toolbar is (selecting a
   * feature is edit mode), so the overlap is not an edge case — it is the *only* case. Centring on
   * the map the user can actually see is the same correction `focusPadRight` already makes for the
   * camera.
   */
  padRight?: number;
  onCommand: (c: GeomCommand) => void;
}) {
  if (!state.editing) return null;

  const pieces = state.pieces ?? 1;
  /**
   * The caption's three jobs, in priority order: a refusal outranks an instruction, because it is
   * about the click you just made rather than the one you are about to; and an instruction
   * outranks the piece count, because you are mid-task.
   */
  const caption = notice
    ? { text: notice, bad: true }
    : state.mode === "split"
      ? {
          text: state.cutting
            ? "Now click the far side of the cut"
            : "Click one side of the cut · Esc to cancel",
          bad: false,
        }
      : pieces > 1
        ? { text: `Split into ${pieces} pieces`, bad: false }
        : null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 18,
        // Centre of the map you can SEE, not of the map element — see `padRight`.
        left: `calc(50% - ${padRight / 2}px)`,
        transform: "translateX(-50%)",
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        // The bar is 707px. Once the panel takes 384 of a 1280 window there is not room for it, so
        // it scrolls rather than hiding its right-hand end again — the failure it just came from.
        maxWidth: `calc(100% - ${padRight + 32}px)`,
      }}
    >
      {/* Above the row and out of flow, so the longest refusal cannot widen the bar, shift a
          button under the cursor, or push either end of the toolbar off the map. */}
      {caption && (
        <div
          role="status"
          aria-live="polite"
          style={{
            maxWidth: 460,
            padding: "5px 11px",
            borderRadius: 999,
            background: "#fff",
            border: `1px solid ${caption.bad ? BAR_BAD : BAR_LINE}`,
            boxShadow: "0 4px 14px rgba(11,54,156,.12)",
            font: "12px/1.35 inherit",
            color: caption.bad ? BAR_BAD : BAR_MUTED,
            textAlign: "center",
          }}
        >
          {caption.text}
        </div>
      )}

      <div
        role="toolbar"
        aria-label="Geometry"
        style={{
          display: "flex",
          alignItems: "stretch",
          padding: 5,
          borderRadius: 12,
          background: "#fff",
          border: `1px solid ${BAR_LINE}`,
          boxShadow: "0 8px 28px rgba(11,54,156,.16)",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        {/* Mode — the three that are alternatives, on their own track. */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 2,
            padding: 3,
            borderRadius: 9,
            background: "var(--primitives-colors-background-100, #f2f3f5)",
          }}
        >
          {/**
           * ⚠️ **"Points" is gone** (Olcay, 2026-08-15: *"Points doesn't mean much"*). It named the
           * thing you manipulate rather than the thing you achieve — and it named it in the
           * editor's vocabulary, not the reviewer's. Nobody opens a floor plan wanting points; they
           * want the room to be the right shape. **Reshape** is the job; the points are how.
           *
           * Its two neighbours were already verbs, so it was also the odd one out in its own group.
           */}
          <Tile
            icon={<Reshape />}
            label="Reshape"
            title="Drag a corner to move it · click a midpoint to add one · Alt-click to remove"
            on={state.mode === "vertices"}
            onClick={() => onCommand({ cmd: "mode", mode: "vertices" })}
          />
          <Tile
            icon={<Move />}
            label="Move"
            title="Drag the shape to move the whole thing"
            on={state.mode === "move"}
            onClick={() => onCommand({ cmd: "mode", mode: "move" })}
          />
          <Tile
            icon={<Split />}
            label="Split"
            title="Click twice on the map to cut the shape in two · Escape to cancel"
            on={state.mode === "split"}
            onClick={() => onCommand({ cmd: "split" })}
          />
        </div>

        <Sep />

        {/* Transform — whole-shape, and stepped rather than dragged: a fixed increment is
            repeatable, and repeatability is what you want when squaring a room up to its
            neighbours. The labels carry the step, which used to be discoverable only by pressing. */}
        <Group>
          <Tile
            icon={<RotateLeft />}
            label="15°"
            title="Rotate 15° anticlockwise"
            onClick={() => onCommand({ cmd: "rotate", deg: -15 })}
          />
          <Tile
            icon={<RotateRight />}
            label="15°"
            title="Rotate 15° clockwise"
            onClick={() => onCommand({ cmd: "rotate", deg: 15 })}
          />
          <Tile
            icon={<ScaleDown />}
            label="5%"
            title="Scale down 5%"
            onClick={() => onCommand({ cmd: "scale", k: 1 / 1.05 })}
          />
          <Tile
            icon={<ScaleUp />}
            label="5%"
            title="Scale up 5%"
            onClick={() => onCommand({ cmd: "scale", k: 1.05 })}
          />
        </Group>

        <Sep />

        <Group>
          <Tile
            icon={<Straighten />}
            label="Straighten"
            title="Drop points that already sit on the line between their neighbours"
            onClick={() => onCommand({ cmd: "straighten" })}
          />
          <Tile
            icon={<Snap />}
            label="Snap"
            title="Snap points to nearby corners of other features"
            on={!!state.snap}
            onClick={() => onCommand({ cmd: "snap" })}
          />
        </Group>

        <Sep />

        <Group>
          <Tile
            icon={<Undo />}
            label="Undo"
            title="Undo"
            disabled={!state.canUndo}
            onClick={() => onCommand({ cmd: "undo" })}
          />
          <Tile
            icon={<Redo />}
            label="Redo"
            title="Redo"
            disabled={!state.canRedo}
            onClick={() => onCommand({ cmd: "redo" })}
          />
          <Tile
            icon={<Rewind />}
            label="Reset"
            title="Back to the published outline — discards every change to this shape"
            onClick={() => onCommand({ cmd: "reset" })}
          />
        </Group>
      </div>
    </div>
  );
}
