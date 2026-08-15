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
 * **`Split` is a mode, not a button that does something.** Pressing it arms the map; the two clicks
 * that follow lay the cut, and Escape backs out. It reads as pressed the whole time it is armed,
 * because between those two clicks the map behaves differently and the toolbar is the only thing
 * on screen that can say so.
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

const BTN: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  height: 32,
  padding: "0 10px",
  borderRadius: 8,
  border: "none",
  background: "none",
  font: "inherit",
  fontSize: 12.5,
  color: "var(--review-ink)",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

function Sep() {
  return (
    <span
      style={{
        width: 1,
        height: 20,
        background: "var(--primitives-colors-background-900)",
      }}
    />
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

  const toggled = (on: boolean): React.CSSProperties =>
    on
      ? {
          background: "var(--primitives-colors-theme-100, #eaf0ff)",
          color: "#0b369c",
          fontWeight: 500,
        }
      : {};

  return (
    <div
      role="toolbar"
      aria-label="Geometry"
      style={{
        position: "absolute",
        bottom: 18,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 4,
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: 6,
        borderRadius: 12,
        background: "#fff",
        border: "1px solid var(--primitives-colors-background-900)",
        boxShadow: "0 8px 28px rgba(11,54,156,.16)",
      }}
    >
      <span
        style={{
          ...BTN,
          cursor: "default",
          color: "var(--primitives-colors-background-600)",
          fontSize: 11.5,
        }}
      >
        Geometry
      </span>
      <Sep />

      <button
        type="button"
        style={{ ...BTN, ...toggled(state.mode === "vertices") }}
        aria-pressed={state.mode === "vertices"}
        onClick={() => onCommand({ cmd: "mode", mode: "vertices" })}
        title="Drag a point to move it · click a midpoint to add · Alt-click to remove"
      >
        Points
      </button>
      <button
        type="button"
        style={{ ...BTN, ...toggled(state.mode === "move") }}
        aria-pressed={state.mode === "move"}
        onClick={() => onCommand({ cmd: "mode", mode: "move" })}
        title="Drag the shape to move the whole thing"
      >
        Move
      </button>

      <Sep />
      {/* Rotate and scale step, rather than drag a handle: a fixed increment is repeatable, and
          repeatability is what you want when squaring a room up against its neighbours. */}
      <button
        type="button"
        style={BTN}
        onClick={() => onCommand({ cmd: "rotate", deg: -15 })}
        title="Rotate 15° left"
      >
        ⟲
      </button>
      <button
        type="button"
        style={BTN}
        onClick={() => onCommand({ cmd: "rotate", deg: 15 })}
        title="Rotate 15° right"
      >
        ⟳
      </button>
      <button
        type="button"
        style={BTN}
        onClick={() => onCommand({ cmd: "scale", k: 1.05 })}
        title="Scale up 5%"
      >
        ⤢
      </button>
      <button
        type="button"
        style={BTN}
        onClick={() => onCommand({ cmd: "scale", k: 1 / 1.05 })}
        title="Scale down 5%"
      >
        ⤡
      </button>

      <Sep />
      <button
        type="button"
        style={{ ...BTN, ...toggled(state.mode === "split") }}
        aria-pressed={state.mode === "split"}
        onClick={() => onCommand({ cmd: "split" })}
        title="Click twice on the map to cut the shape in two · Escape to cancel"
      >
        Split
      </button>
      {/* The one place the toolbar says anything: the instruction while a cut is being laid, the
          refusal when one is rejected, and the piece count once the shape is in more than one.
          It appears beside the button rather than replacing anything, so the bar never reflows
          under the cursor mid-cut. */}
      {(state.mode === "split" || notice || (state.pieces ?? 1) > 1) && (
        <span
          style={{
            ...BTN,
            cursor: "default",
            // The app's own danger ink (`AiMappingStatus`'s `danger600`), not a token — the DS
            // publishes no red at this weight, and a `var()` that only ever resolves to its
            // fallback is a token in appearance and a hex in fact.
            color: notice
              ? "#d41c42"
              : "var(--primitives-colors-background-600)",
            fontSize: 11.5,
            padding: "0 4px",
          }}
        >
          {notice ??
            (state.mode === "split"
              ? state.cutting
                ? "…and the far side"
                : "Click one side of the cut"
              : `${state.pieces} pieces`)}
        </span>
      )}

      <Sep />
      <button
        type="button"
        style={BTN}
        onClick={() => onCommand({ cmd: "straighten" })}
        title="Drop points that already sit on the line between their neighbours"
      >
        Straighten
      </button>
      <button
        type="button"
        style={{ ...BTN, ...toggled(!!state.snap) }}
        aria-pressed={!!state.snap}
        onClick={() => onCommand({ cmd: "snap" })}
        title="Snap points to nearby corners of other features"
      >
        Snap
      </button>

      <Sep />
      <button
        type="button"
        style={{ ...BTN, opacity: state.canUndo ? 1 : 0.4 }}
        disabled={!state.canUndo}
        onClick={() => onCommand({ cmd: "undo" })}
        title="Undo"
      >
        ↶
      </button>
      <button
        type="button"
        style={{ ...BTN, opacity: state.canRedo ? 1 : 0.4 }}
        disabled={!state.canRedo}
        onClick={() => onCommand({ cmd: "redo" })}
        title="Redo"
      >
        ↷
      </button>
      <button
        type="button"
        style={BTN}
        onClick={() => onCommand({ cmd: "reset" })}
        title="Back to the published outline"
      >
        Reset
      </button>
    </div>
  );
}
