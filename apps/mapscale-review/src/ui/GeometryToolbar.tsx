/**
 * The geometry toolbar — bottom centre of the map, the v9 *Map Content Geometry* position
 * (Olcay, 2026-08-14, against `b8dqhE3CPxitYfqlXuQJTC` node `465:7046`).
 *
 * **It appears only while a feature is being edited**, which is the whole reason it can sit in the
 * middle of the map: a permanent bar there would cover the floor plan for the 95% of the time
 * nobody is drawing.
 *
 * ⚠️ **`Split` is not here, deliberately.** Cutting a polygon properly means walking the ring,
 * inserting every intersection with the cut line and re-assembling two valid rings — for concave
 * shapes, with multiple crossings. A version that only worked on convex shapes would be a trap that
 * silently mangles a real floor plan, so it is recorded as unbuilt rather than shipped half-right.
 * Everything else from that list is here.
 */
export interface GeomState {
  editing: boolean;
  fid?: string;
  mode?: "vertices" | "move";
  snap?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
}

export type GeomCommand =
  | { cmd: "mode"; mode: "vertices" | "move" }
  | { cmd: "snap" }
  | { cmd: "undo" }
  | { cmd: "redo" }
  | { cmd: "reset" }
  | { cmd: "straighten" }
  | { cmd: "rotate"; deg: number }
  | { cmd: "scale"; k: number }
  | { cmd: "end"; commit: boolean };

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
  onCommand,
}: {
  state: GeomState;
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

      <Sep />
      <button
        type="button"
        style={{ ...BTN, color: "var(--primitives-colors-background-600)" }}
        onClick={() => onCommand({ cmd: "end", commit: false })}
      >
        Cancel
      </button>
      <button
        type="button"
        style={{
          ...BTN,
          background: "#0b369c",
          color: "#fff",
          fontWeight: 500,
        }}
        onClick={() => onCommand({ cmd: "end", commit: true })}
      >
        Done
      </button>
    </div>
  );
}
