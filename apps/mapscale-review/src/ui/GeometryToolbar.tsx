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
   One 20×20 grid, one 1.6 stroke, `currentColor` throughout — so a button's own
   colour and disabled state carry to its icon without a second set of rules. */

const ICON = {
  width: 17,
  height: 17,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function RotateLeft() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M4.2 7.2A6.5 6.5 0 1 1 3.5 10" />
      <path d="M3.4 3.6v3.7h3.7" />
    </svg>
  );
}

function RotateRight() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M15.8 7.2A6.5 6.5 0 1 0 16.5 10" />
      <path d="M16.6 3.6v3.7h-3.7" />
    </svg>
  );
}

/** Scale up — corners pushed outward. */
function ScaleUp() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M11.6 8.4 16.5 3.5M16.5 3.5h-4M16.5 3.5v4" />
      <path d="M8.4 11.6 3.5 16.5M3.5 16.5h4M3.5 16.5v-4" />
    </svg>
  );
}

/** Scale down — corners pulled in. */
function ScaleDown() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M16.5 3.5 11.6 8.4M11.6 8.4h4M11.6 8.4v-4" />
      <path d="M3.5 16.5 8.4 11.6M8.4 11.6h-4M8.4 11.6v4" />
    </svg>
  );
}

function Undo() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M4 9h8.2a3.9 3.9 0 0 1 0 7.8H7.5" />
      <path d="M7 5.8 3.6 9 7 12.2" />
    </svg>
  );
}

function Redo() {
  return (
    <svg {...ICON} aria-hidden>
      <path d="M16 9H7.8a3.9 3.9 0 0 0 0 7.8h4.7" />
      <path d="M13 5.8 16.4 9 13 12.2" />
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

const ROW_H = 34;

const CONTROL: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  height: ROW_H,
  borderRadius: 8,
  border: "none",
  background: "none",
  font: "inherit",
  fontSize: 12.5,
  lineHeight: 1,
  color: BAR_INK,
  cursor: "pointer",
  whiteSpace: "nowrap",
  padding: "0 11px",
  transition: "background .12s ease, color .12s ease",
};

/** Square, because an icon has no reading direction to give it a natural width. */
const ICON_BTN: React.CSSProperties = {
  ...CONTROL,
  width: ROW_H,
  padding: 0,
  color: BAR_MUTED,
};

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        height: 18,
        margin: "0 5px",
        background: BAR_LINE,
      }}
    />
  );
}

/**
 * One of the three mutually exclusive modes. A track behind the set is what tells you they are
 * alternatives rather than three more buttons — and it is the only group in the bar that is.
 */
function ModeButton({
  on,
  label,
  title,
  onClick,
}: {
  on: boolean;
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      title={title}
      onClick={onClick}
      style={{
        ...CONTROL,
        height: ROW_H - 6,
        borderRadius: 6,
        padding: "0 12px",
        background: on ? "#fff" : "transparent",
        color: on ? BAR_ON_INK : BAR_INK,
        fontWeight: on ? 500 : 400,
        boxShadow: on ? "0 1px 3px rgba(16,24,40,.16)" : "none",
      }}
    >
      {label}
    </button>
  );
}

function IconButton({
  label,
  title,
  disabled,
  onClick,
  children,
}: {
  label: string;
  title: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...ICON_BTN,
        // 0.4 on a hairline glyph was invisible; on a drawn icon 0.3 still reads as "a control
        // that is here but not available", which is the thing a disabled state has to say.
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function GeometryToolbar({
  state,
  notice,
  onCommand,
}: {
  state: GeomState;
  /** The editor refusing something, in its own words. Transient — the app clears it. */
  notice?: string | null;
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
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
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
          alignItems: "center",
          padding: 5,
          borderRadius: 12,
          background: "#fff",
          border: `1px solid ${BAR_LINE}`,
          boxShadow: "0 8px 28px rgba(11,54,156,.16)",
        }}
      >
        {/* Mode — the three that are alternatives, on their own track. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: 3,
            borderRadius: 8,
            background: "var(--primitives-colors-background-100, #f2f3f5)",
          }}
        >
          <ModeButton
            on={state.mode === "vertices"}
            label="Points"
            title="Drag a point to move it · click a midpoint to add · Alt-click to remove"
            onClick={() => onCommand({ cmd: "mode", mode: "vertices" })}
          />
          <ModeButton
            on={state.mode === "move"}
            label="Move"
            title="Drag the shape to move the whole thing"
            onClick={() => onCommand({ cmd: "mode", mode: "move" })}
          />
          <ModeButton
            on={state.mode === "split"}
            label="Split"
            title="Click twice on the map to cut the shape in two · Escape to cancel"
            onClick={() => onCommand({ cmd: "split" })}
          />
        </div>

        <Sep />

        {/* Transform — whole-shape, and stepped rather than dragged: a fixed increment is
            repeatable, and repeatability is what you want when squaring a room up to its
            neighbours. */}
        <Group>
          <IconButton
            label="Rotate 15° left"
            title="Rotate 15° left"
            onClick={() => onCommand({ cmd: "rotate", deg: -15 })}
          >
            <RotateLeft />
          </IconButton>
          <IconButton
            label="Rotate 15° right"
            title="Rotate 15° right"
            onClick={() => onCommand({ cmd: "rotate", deg: 15 })}
          >
            <RotateRight />
          </IconButton>
          <IconButton
            label="Scale up 5%"
            title="Scale up 5%"
            onClick={() => onCommand({ cmd: "scale", k: 1.05 })}
          >
            <ScaleUp />
          </IconButton>
          <IconButton
            label="Scale down 5%"
            title="Scale down 5%"
            onClick={() => onCommand({ cmd: "scale", k: 1 / 1.05 })}
          >
            <ScaleDown />
          </IconButton>
        </Group>

        <Sep />

        {/* Tidy. Snap is a toggle and has to look like one even when it is off, which is why it
            keeps a filled shape rather than going flat like the buttons around it. */}
        <Group>
          <button
            type="button"
            style={CONTROL}
            onClick={() => onCommand({ cmd: "straighten" })}
            title="Drop points that already sit on the line between their neighbours"
          >
            Straighten
          </button>
          <button
            type="button"
            aria-pressed={!!state.snap}
            style={{
              ...CONTROL,
              background: state.snap ? BAR_ON_BG : "transparent",
              color: state.snap ? BAR_ON_INK : BAR_MUTED,
              fontWeight: state.snap ? 500 : 400,
            }}
            onClick={() => onCommand({ cmd: "snap" })}
            title="Snap points to nearby corners of other features"
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: state.snap ? BAR_ON_INK : "transparent",
                border: `1px solid ${state.snap ? BAR_ON_INK : BAR_MUTED}`,
              }}
            />
            Snap
          </button>
        </Group>

        <Sep />

        {/* History. Reset keeps its word — it is the destructive one, and an icon would ask you to
            be sure you had guessed it right before throwing your work away. */}
        <Group>
          <IconButton
            label="Undo"
            title="Undo"
            disabled={!state.canUndo}
            onClick={() => onCommand({ cmd: "undo" })}
          >
            <Undo />
          </IconButton>
          <IconButton
            label="Redo"
            title="Redo"
            disabled={!state.canRedo}
            onClick={() => onCommand({ cmd: "redo" })}
          >
            <Redo />
          </IconButton>
          <button
            type="button"
            style={{ ...CONTROL, color: BAR_MUTED }}
            onClick={() => onCommand({ cmd: "reset" })}
            title="Back to the published outline"
          >
            Reset
          </button>
        </Group>
      </div>
    </div>
  );
}
