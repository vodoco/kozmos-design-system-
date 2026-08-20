import { useState } from "react";
import {
  Combine,
  Redo,
  Reset,
  Reshape,
  Simplify,
  Snap,
  Split,
  Straighten,
  Transform,
  Undo,
} from "./icons";

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
 * 3. **Eleven controls in one undifferentiated row is a list, not a toolbar.** They are groups
 *    doing distinct jobs: pick a MODE, change how many SHAPES there are, TIDY the outline, or step
 *    through HISTORY. Hairline separators carry that, and nothing else needs to.
 *
 * ⚠️ **The mode pair used to sit on a grey track** — a real segmented control, because those modes
 * are mutually exclusive and nothing else in the bar is. It came out on 2026-08-16 (Olcay: *"I
 * don't like the box in a box. Remove the grey box highlights."*) and he is right: the bar is
 * already a white card floating on the map, so a filled rectangle inside it reads as a *container*
 * rather than as a control, and the eye has to work out which of the two boxes is being described.
 * Nothing was lost — the separators group, and the filled pressed tile is what says "this one is
 * on". The track was saying it a second time, in a heavier voice.
 *
 * ⚠️ **Rotate and scale are NOT in here** (Olcay, 2026-08-16: *"Instead of adding multiple rotation
 * and scale buttons use control points and shortcuts"*). Four stepped buttons — ⟲ ⟳ ±5% — could
 * only ever offer increments somebody guessed in advance. They are handles on the transform box in
 * Move mode now: free by default, Shift or ⌥ snapping to 5° and 5%, with the angle or percentage
 * read out beside the pointer. The caption below carries the only written mention of the modifier,
 * which is why it exists at all.
 *
 * The word "Geometry" used to sit at the left end. It was spending the bar's scarcest resource —
 * width — to say what the bar's presence already says.
 */
export interface GeomState {
  editing: boolean;
  fid?: string;
  /**
   * ⚠️ **Combine is not in here**, and that is the point of it. It was a mode for a few hours on
   * 2026-08-16, with its own armed pick list, until shift-click made selection something the whole
   * editor has. There is nothing left for a Combine mode to do: the features are chosen before you
   * reach for it, so it is an act you perform on a selection — a button, like Straighten.
   */
  mode?: "vertices" | "transform" | "split";
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
  /**
   * How many features are selected **besides** the one the panel is anchored to — so `picked + 1`
   * is what the toast counts. Shift-click on the map is what fills it.
   */
  picked?: number;
  /**
   * Can Combine actually run on what is selected? Decided by the map shell, which is the only side
   * holding the outlines — see `geomCombinable` there.
   */
  combinable?: boolean;
  /**
   * ⚠️ **Why not, in a sentence.** Olcay, 2026-08-16: *"If disabled ... Combine should show a
   * custom tooltip explaining why."* A grey button with no reason makes the user guess what they
   * did wrong; this is the entire justification for disabling it rather than letting it fail.
   */
  combineWhy?: string | null;
  /**
   * How many features this session's combines have swallowed. They still have rows in the tree and
   * nothing here can remove them, so the count is reported rather than dressed up.
   */
  absorbed?: number;
  /** The fids this session's combines have joined into this shape. */
  joined?: string[];
  /**
   * Is a combine still a *composition* — can a member be taken back out and the shape recomputed?
   * False once anything else has edited it. Feeds the panel's row control, not the toolbar.
   */
  recomposable?: boolean;
  /**
   * What was standing between them and has been taken off the map — named by the map shell,
   * because the app has never seen these features and cannot look them up once they are hidden.
   */
  removed?: { fid: string; name: string; type: string }[];
  /**
   * ⚠️ **`"point"` means there is no outline** (Olcay, 2026-08-15: *"if the geometry is point -
   * there is no way to reshape it"*). A great many POIs are a single coordinate: you can move it,
   * and undo moving it, and nothing else in this bar means anything — reshaping, splitting,
   * straightening and snapping all need corners. The tools that cannot apply are not shown rather
   * than shown disabled: a row of greyed-out buttons invites you to work out why.
   */
  kind?: "area" | "point" | "network";
  /** How many corners are selected, for the marquee's own feedback. */
  selected?: number;
  /** …and how many whole EDGES those corners amount to — both ends selected. */
  selectedEdges?: number;
  /** How many nodes the network being edited holds. */
  nodes?: number;
  /** The pointer is on one of its edges — Delete would unlink it. */
  onEdge?: boolean;
}

export type GeomCommand =
  | { cmd: "mode"; mode: "vertices" | "transform" }
  | { cmd: "snap" }
  | { cmd: "undo" }
  | { cmd: "redo" }
  | { cmd: "reset" }
  | { cmd: "simplify" }
  | { cmd: "square" }
  | { cmd: "split" }
  | { cmd: "combine" };

/**
 * **The bar's symbols come from the Pointr Icon Library** — see `./icons`, which records the node
 * each one was exported from. Nothing here is hand-drawn any more; four of the ten (`combine`,
 * `straighten`, `snap`, and the unused `square-up`) were drawn INTO the library on 2026-08-20
 * because they genuinely did not exist, and the rest were already there and had simply never been
 * looked for by category.
 *
 * Drawn at 22px (Olcay, 2026-08-15: *"I rather like to see larger symbols"*), which is large
 * enough that each one has to actually depict its operation — at 17px a wrong icon merely looks
 * like a smudge, at 22px it looks wrong.
 *
 * ⚠️ **The stroke is the library's 2, not the 1.6 these used to be drawn at** (Olcay, 2026-08-20:
 * *"library convention"*). The bar reads heavier than it did, and that is the trade taken for
 * every Pointr surface drawing the same weight.
 */
const ICON_PX = 22;

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

/**
 * A tooltip that works on a **disabled** control — which the native one cannot.
 *
 * ⚠️ A disabled `<button>` fires no pointer events at all, so `title=` on it is silently dead. The
 * listeners therefore live on a wrapper, and the button underneath keeps its real `disabled` so it
 * stays unclickable and out of the tab order. That is the whole reason this exists: the one tooltip
 * in the bar that genuinely matters is the one explaining why a control is unavailable.
 *
 * It is also focus-triggered, not hover-only. A reason a keyboard user cannot reach is not a reason.
 */
function WhyTip({
  text,
  children,
}: {
  text?: string | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (!text) return <>{children}</>;
  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            // Above the bar, which sits at the bottom of the map — below would be off-screen.
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: 244,
            padding: "8px 10px",
            borderRadius: 8,
            background: "var(--review-ink, #1d2433)",
            color: "#fff",
            font: "12px/1.4 inherit",
            textAlign: "left",
            boxShadow: "0 6px 20px rgba(11,54,156,.22)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

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
  const isPoint = state.kind === "point";
  /**
   * A **network** is being edited — every node of it is a handle (Olcay, 2026-08-16: *"I should be
   * able to edit the whole network"*). It has **no ring**, so every tool that needs one goes —
   * there is nothing to straighten, simplify, split or combine about a graph. What it keeps that a
   * point does not is **Reshape**, because dragging the nodes is the whole of network editing.
   */
  const isNetwork = state.kind === "network";
  /**
   * The tools that need a **ring** — Split, Straighten, Simplify, and Transform's scale and rotate
   * handles. Neither a point nor a network has one, so neither gets them (Olcay, 2026-08-20).
   *
   * ⚠️ Until today this was spelled `!isPoint`, so a network showed all six while the comment above
   * claimed it showed none of them. The map shell was never in danger — `geomSquare` and
   * `geomSimplify` both refuse anything that is not an `area`, and a network's `rings` is `[]` — so
   * what shipped was six controls that quietly did nothing, which is the more expensive kind of
   * wrong: a tile that refuses in silence teaches you that you did it incorrectly.
   */
  const ringTools = !isPoint && !isNetwork;
  const nodes = state.nodes ?? 0;
  /** The pointer is on one of the network's edges, so Delete would unlink it. */
  const onEdge = !!state.onEdge;
  const selected = state.selected ?? 0;
  /**
   * How many whole edges that corner selection amounts to — an edge counts when both of its ends
   * are selected (Olcay, 2026-08-16). It is a **description** of the same selection, not a second
   * one, which is why the caption below prefers it rather than adding to it: having grabbed an
   * edge, "2 edges" is what you did and "4 corners" is arithmetic you have to undo in your head.
   */
  const edges = state.selectedEdges ?? 0;
  const picked = state.picked ?? 0;
  const absorbed = state.absorbed ?? 0;
  /**
   * The caption, in priority order. A refusal outranks everything, because it is about the click
   * you just made rather than the one you are about to. Then the instruction for the mode you are
   * in. Then a live selection, which is the thing most likely to be acted on next. The piece count
   * comes last: it is a standing fact, not a prompt.
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
      : selected > 0
        ? {
            // Short enough to stay on one line: the caption sits ABOVE the bar, and a wrapped one
            // grows upward into the map. Dragging the selection is discoverable by trying it;
            // Delete is not, so Delete is what the line spends its words on.
            text:
              edges > 0
                ? `${edges} edge${edges === 1 ? "" : "s"} selected · drag to move · Delete to remove`
                : `${selected} corner${selected === 1 ? "" : "s"} selected · Delete to remove`,
            bad: false,
          }
        : isNetwork
          ? {
              /**
               * The selection is the thing most likely to be acted on next, so it outranks the
               * standing fact about the network — the same order the corner caption follows.
               */
              /**
               * ⚠️ The order is the order Delete itself resolves in: a selection outranks the edge
               * under the pointer, so the caption must never promise the unlink while a selection
               * would be deleted instead.
               */
              text:
                edges > 0
                  ? `${edges} edge${edges === 1 ? "" : "s"} selected · drag to move both ends`
                  : selected > 0
                    ? `${selected} node${selected === 1 ? "" : "s"} selected · drag to move · Delete to remove`
                    : onEdge
                      ? "Delete to unlink these two nodes"
                      : `Editing this network · ${nodes} node${nodes === 1 ? "" : "s"} · shift-drag to lasso`,
              bad: false,
            }
          : isPoint
            ? {
                text: "This feature is a single point — drag it to move it",
                bad: false,
              }
            : /**
               * The standing facts about the shape, and they have to compose: a combine that could
               * only reach two of the three rooms leaves a feature that is BOTH combined and in more
               * than one piece. Reporting only the piece count there would say "Split into 2 pieces"
               * about a shape somebody had just combined, which is exactly backwards.
               *
               * All three are careful about what they claim. "Holds" says the shape covers those
               * features and stops short of saying they are gone — they are still in Pointr Cloud and
               * still have rows in the tree, because nothing in this prototype deletes a feature.
               */
              absorbed > 0 && pieces > 1
              ? {
                  text: `Holds ${absorbed + 1} features, in ${pieces} pieces`,
                  bad: false,
                }
              : absorbed > 0
                ? {
                    text: `Holds ${absorbed + 1} combined features`,
                    bad: false,
                  }
                : pieces > 1
                  ? { text: `Split into ${pieces} pieces`, bad: false }
                  : // Each mode gets the one hint that mode needs, and nothing gets a standing one — an
                    // always-on line is permanent chrome for something you learn once.
                    state.mode === "vertices"
                    ? { text: "Shift-drag to select corners", bad: false }
                    : state.mode === "transform"
                      ? {
                          // The transform handles have no toolbar buttons any more, so this line is the
                          // only place the modifier is written down.
                          text: "Drag to move · corners scale, knob rotates · Shift or ⌥ snaps",
                          bad: false,
                        }
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
      {/**
       * **How many features are selected, on the map, above the toolbar** (Olcay, 2026-08-16:
       * *"On the map above toolbar - toast states how many items are selected as long as they are
       * selected too."*).
       *
       * Above the caption rather than instead of it: they answer different questions and both stay
       * true at once. The caption is about the **tool** — what your next click will do — and it
       * changes constantly; this is about the **subject**, and it stands as long as the selection
       * does. Folding them together would mean losing one of them every time the other had
       * something to say.
       *
       * Filled rather than outlined, so it reads as a state you are in rather than as another hint.
       */}
      {picked > 0 && (
        <div
          role="status"
          aria-live="polite"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 12px",
            borderRadius: 999,
            background: BAR_ON_INK,
            color: "#fff",
            font: "12px/1.35 inherit",
            fontWeight: 500,
            boxShadow: "0 4px 14px rgba(11,54,156,.28)",
            whiteSpace: "nowrap",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "#fff",
              opacity: 0.9,
              flex: "0 0 auto",
            }}
          />
          <span>{picked + 1} features selected</span>
          {/* Escape is the way out and nothing else says so — the panel's list has an ✕ per row,
              but that is a trip to the panel to undo one shift-click. */}
          {/* Braced, so the leading space survives — JSX trims literal whitespace between
              elements, and without it a screen reader reads "…selectedEsc to clear". */}
          <span style={{ fontWeight: 400, opacity: 0.72 }}>
            {" · Esc to clear"}
          </span>
        </div>
      )}

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
        {/**
         * **Mode** — the alternatives. A point has none: there is one coordinate and you drag it,
         * so the whole group goes. A **network** has exactly one — Reshape, which is what editing a
         * graph IS — so the group stays and Transform leaves it, and the pressed tile goes on
         * saying which mode you are in rather than offering a choice that is not there.
         *
         * ⚠️ **The grey track under these two is gone** (Olcay, 2026-08-16: *"I don't like the box
         * in a box. Remove the grey box highlights."*). It was there to say "these are mutually
         * exclusive and nothing else in the bar is" — but that stopped being true of the *shape*
         * once the bar sat on its own white card: a filled rectangle inside a filled rectangle
         * reads as a container, not as a segmented control, and the eye has to work out which of
         * the two boxes it is being told about.
         *
         * The grouping is not lost. The separators already do it, and the pressed tile is filled —
         * which is what actually says "this one is on", and did all along.
         */}
        {!isPoint && (
          <Group>
            {/**
             * ⚠️ **"Points" is gone** (Olcay, 2026-08-15: *"Points doesn't mean much"*). It named the
             * thing you manipulate rather than the thing you achieve — and it named it in the
             * editor's vocabulary, not the reviewer's. Nobody opens a floor plan wanting points; they
             * want the room to be the right shape. **Reshape** is the job; the points are how.
             *
             * Its two neighbours were already verbs, so it was also the odd one out in its own group.
             */}
            <Tile
              icon={<Reshape size={ICON_PX} />}
              label="Reshape"
              title="Drag a corner to move it · click a midpoint to add one · Alt-click to remove"
              on={state.mode === "vertices"}
              onClick={() => onCommand({ cmd: "mode", mode: "vertices" })}
            />
            {/**
             * **Move → Transform** (Olcay, 2026-08-16). The mode moves, rotates AND scales the
             * whole shape — it has done since the handles replaced the stepped buttons — so "Move"
             * had become the name of just one of the three things it does.
             */}
            {ringTools && (
              <Tile
                icon={<Transform size={ICON_PX} />}
                label="Transform"
                title="Drag to move · corners scale · the knob rotates · Shift or ⌥ snaps to 5° and 5%"
                on={state.mode === "transform"}
                onClick={() => onCommand({ cmd: "mode", mode: "transform" })}
              />
            )}
          </Group>
        )}

        {!isPoint && <Sep />}

        {/**
         * **Divide** — its own group (Olcay, 2026-08-16). Splitting is not a way of editing this
         * shape; it changes **how many features there are**, which is a different kind of act from
         * reshaping one, and it belongs with Combine rather than with the modes.
         *
         * Split is an armed mode and Combine is an act; what they share is that both are about how
         * many shapes exist, where the pair on the other side of the separator is about how you are
         * editing one. That distinction is what the separator carries.
         */}
        {ringTools && (
          <Group>
            <Tile
              icon={<Split size={ICON_PX} />}
              label="Split"
              title="Click twice on the map to cut the shape in two · Escape to cancel"
              on={state.mode === "split"}
              onClick={() => onCommand({ cmd: "split" })}
            />
            {/**
             * **Combine** (Olcay, 2026-08-16: *"user selects two or more features to combine, edge
             * case is we should fill the small gaps like walls and remove the combined walls from
             * wall type"*).
             *
             * The largest of the combined rooms keeps its identity, so the panel may well end up on
             * a *different* feature than the one you opened. That is deliberate and decided — it is
             * the only rule that does not depend on the order things were clicked in, which is
             * invisible the moment it is over.
             */}
            <WhyTip text={state.combinable ? null : state.combineWhy}>
              <Tile
                icon={<Combine size={ICON_PX} />}
                label="Combine"
                title="Join the selected features into one · walls between them are hidden, and the largest keeps its name"
                disabled={!state.combinable}
                onClick={() => onCommand({ cmd: "combine" })}
              />
            </WhyTip>
          </Group>
        )}

        {/* ⚠️ Gated on `ringTools`, not `!isPoint`, because the group ABOVE it is too: leave it on
            `!isPoint` and a network draws this separator immediately after the one before it, with
            nothing in between for either of them to divide. */}
        {ringTools && <Sep />}

        <Group>
          {/* Straighten and Simplify need corners to drop; neither a point nor a network has any.
              Snap survives both, because a node or a point dragged onto the corner of a room is
              exactly when you want it. */}
          {ringTools && (
            <Tile
              icon={<Straighten size={ICON_PX} />}
              label="Straighten"
              title="Square the shape onto its own grid — near-right-angle corners become right angles, genuine diagonals are left alone"
              onClick={() => onCommand({ cmd: "square" })}
            />
          )}
          {ringTools && (
            <Tile
              icon={<Simplify size={ICON_PX} />}
              label="Simplify"
              title="Drop corners that already sit on the line between their neighbours"
              onClick={() => onCommand({ cmd: "simplify" })}
            />
          )}
          <Tile
            icon={<Snap size={ICON_PX} />}
            label="Snap"
            title={
              isPoint
                ? "Snap this point to nearby corners of other features"
                : "Snap points to nearby corners of other features"
            }
            on={!!state.snap}
            onClick={() => onCommand({ cmd: "snap" })}
          />
        </Group>

        <Sep />

        <Group>
          <Tile
            icon={<Undo size={ICON_PX} />}
            label="Undo"
            title="Undo"
            disabled={!state.canUndo}
            onClick={() => onCommand({ cmd: "undo" })}
          />
          <Tile
            icon={<Redo size={ICON_PX} />}
            label="Redo"
            title="Redo"
            disabled={!state.canRedo}
            onClick={() => onCommand({ cmd: "redo" })}
          />
          <Tile
            icon={<Reset size={ICON_PX} />}
            label="Reset"
            title="Back to the published outline — discards every change to this shape"
            onClick={() => onCommand({ cmd: "reset" })}
          />
        </Group>
      </div>
    </div>
  );
}
