import { Warning, Pencil, Reset } from "./icons";
import { useState } from "react";
import {
  SegmentedControl,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@kozmos/react";
import {
  changeAccent,
  warningOf,
  DECISION_INK,
  OVERRIDE_INK,
  WARNING_LABEL,
  WARNING_WHY,
  type Change,
  type Decision,
  type Override,
} from "../mock/diff";
import { typeLabel } from "../mock/taxonomy";

/**
 * Risk is a third axis and is never coloured — traffic-light red/amber/green stays reserved for
 * magnitude, and the four diff colours stay reserved for what a feature *is*. So a warning is a
 * neutral mark, in the same ink as ✓ 🚩 ✗.
 */
/** Exported since 2026-08-13: the floor-warning strip (D16) draws the same mark, and two copies
 *  of one glyph is exactly how the two halves of a statement drift apart. */
export function WarningGlyph({ size = 14 }: { size?: number }) {
  /* `alert-triangle` from the Pointr Icon Library (see `./icons`). Still exported from here: the
     floor-warning strip draws the same mark, and two copies of one glyph is exactly how the two
     halves of a statement drift apart. */
  return <Warning size={size} />;
}

/**
 * The same two marks the map draws on each feature — ✓ / ✗. `currentColor` lets the control tint
 * them when a segment is off.
 *
 * ⚠️ **The 🚩 arm was removed 2026-08-25** with flagging itself. These are still hand-drawn paths
 * on an 18-grid rather than Pointr Icon Library instances, and deliberately: they are **marks**,
 * sized for a 22px badge and for a centroid mark on the map, where the library's 24-grid at
 * stroke 2 renders visibly lighter (`./icons` documents exactly that behaviour). The two *new*
 * controls this row grew — Edit and Revert — are library icons, as the standing rule requires.
 */
export function DecisionGlyph({
  kind,
  size = 18,
}: {
  kind: Decision;
  size?: number;
}) {
  const d =
    kind === "confirm" ? "M4 9.5 L7.5 13 L14 5.5" : "M5 5 L13 13 M13 5 L5 13";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      aria-hidden
      focusable="false"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ACTIONS: { value: Decision; label: string }[] = [
  { value: "confirm", label: "Confirm" },
  { value: "reject", label: "Reject" },
];

/**
 * A small square icon button — Edit and Revert both, so the pair reads as one family beside the
 * segmented control rather than as two unrelated affordances bolted on.
 */
function RowAction({
  label,
  ink,
  onClick,
  children,
}: {
  label: string;
  ink: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{
            display: "grid",
            placeItems: "center",
            width: 30,
            height: 30,
            padding: 0,
            borderRadius: 6,
            border: "1px solid var(--primitives-colors-background-100)",
            background: "#fff",
            color: ink,
            cursor: "pointer",
          }}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        style={{ maxWidth: 240, whiteSpace: "normal", lineHeight: 1.4 }}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function ChangeReviewRow({
  change,
  onDecide,
  preserved,
  active,
  onActivate,
  edit,
  onEdit,
  onRevert,
  onEditShape,
  onEditEnd,
  shapeDirty,
}: {
  change: Change;
  /** `undefined` clears the decision. */
  onDecide: (d: Decision | undefined) => void;
  /**
   * A `preserved` row — **your override from an earlier run**, carried through untouched, so there
   * is no incoming *change* to confirm or reject.
   *
   * ⚠️ **Renamed from `override` 2026-08-25**, because `Override` now means something specific and
   * adjacent: the value the user is putting in place of MapScale's *during this review*. A
   * `preserved` row is the same fact one run older. Two names, so a reader can tell which age is
   * meant.
   *
   * It used to be `readOnly` and render the bare word "Kept" (Olcay, 2026-08-11: *"maybe we should
   * allow flagging the user overrides too?"*), then Kept-or-Flagged. It is now **Kept, with Edit
   * and Reset** (Olcay, 2026-08-25: *"we should have edit and reset for previous user overrides
   * too"*) — which is a better answer to the same question flagging was reaching for. The warned
   * ones are precisely the rows you need to act on: an override that now **overlaps** the new
   * content, that the new floor-plan's boundary **no longer covers**, or whose **source value moved
   * underneath it**. "Kept" was a statement with no affordance; now it has two.
   *
   * **Reset is still not a ✗.** Discarding your own earlier work is a real act, so it says what it
   * discards and reads as its own control rather than hiding inside a triage segment.
   */
  preserved?: boolean;
  /**
   * **The user's own value for this row**, if they have edited it. Lives in the review outcome
   * beside the decisions, never on the change — see `Override`.
   */
  edit?: Override;
  /** Commit an edit. Omit to render the row read-only — the map's card does, it has no room. */
  onEdit?: (o: Override) => void;
  /** Throw the override away and go back to what MapScale detected. */
  onRevert?: () => void;
  /**
   * Hand the shape to the geometry editor on the review map. Omitted for rows with nothing to
   * reshape — a `metadata` change is a one-field fix and a `deleted` one has no new outline.
   */
  onEditShape?: () => void;
  /**
   * The edit form closed, and whether it closed by saving.
   *
   * The screen needs this because **the map may be holding a live geometry session** started by
   * `onEditShape`, and the row is where the one commit point lives: one row, one Save. Without it
   * the shape and the fields would each have their own idea of when the edit was over, which is
   * precisely how you end up with a saved name beside a discarded outline.
   */
  onEditEnd?: (commit: boolean) => void;
  /**
   * **The map's live geometry session has actually moved the outline.**
   *
   * Without it, Save cannot tell a shape-only edit from an edit that changed nothing: both arrive
   * with an empty `details` list, and the second one must *not* leave an override behind (see the
   * no-op note on Save). Asking the editor whether the shape is dirty is the only honest way to
   * tell them apart — and it settles it **before** the commit, rather than racing the geometry
   * message back from the iframe.
   */
  shapeDirty?: boolean;
  /** This is the change the map is showing — the two surfaces share one selection. */
  active?: boolean;
  /** Clicking the row anywhere but the decision control makes it the active one. */
  onActivate?: () => void;
}) {
  const accent = changeAccent(change, edit);
  const warning = warningOf(change);
  const [expanded, setExpanded] = useState(false);
  /**
   * The edit form is open. Local, not lifted: which row you have open is a fact about this row's
   * own UI, and hoisting it would make the changelog re-render every keystroke.
   */
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftKind, setDraftKind] = useState("");
  const openEditor = () => {
    setDraftName(edit?.name ?? change.name);
    setDraftKind(edit?.kind ?? change.kind ?? "");
    setEditing(true);
  };
  /**
   * **D17 (approved 2026-08-13, wording settled the same day).** US7 requires "an option to NOT
   * remove a Map Object", and the only mechanism was the generic ✗ with nothing saying that
   * rejecting a removal is *how you keep it*.
   *
   * The affordance is the **words, not a different control** (Olcay: *"I'd like them consistent so
   * X is fine, tooltip could say Keep it"*). Every row keeps the same glyphs — a re-removal must
   * not grow an extra-looking control in a list of twenty — and only the reject tooltip changes.
   * It still writes a plain `reject`, so no new state enters the model.
   */
  const keepIt = change.warning === "re-removed";
  const items = ACTIONS.map((a) => {
    const label =
      keepIt && a.value === "reject"
        ? "Keep it — this object stays on the map"
        : a.label;
    return {
      value: a.value,
      label: (
        <Tooltip>
          <TooltipTrigger asChild>
            {/* the label lives in the tooltip, so the glyph still needs an accessible name */}
            <span
              role="img"
              aria-label={label}
              style={{
                display: "grid",
                placeItems: "center",
                color: DECISION_INK,
              }}
            >
              <DecisionGlyph kind={a.value} />
            </span>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ),
    };
  });
  return (
    <div
      data-change-row={change.id}
      onClick={onActivate}
      style={{
        /**
         * A COLUMN, not a row (Olcay, 2026-08-11: *"details should be full width — flags could
         * align with what's above details"*). The card used to be one horizontal flex, so the
         * bullets lived inside the left column and wrapped at roughly half the card's width while
         * the empty right column held the decision control; and the control, centred against the
         * whole card, drifted downward as the details expanded — away from the name it decides on.
         *
         * Now the top strip is [identity | control] and the details span the full width below it.
         */
        display: "flex",
        flexDirection: "column",
        gap: 6,
        /**
         * The active row and the map's open tooltip are the same selection seen twice. The
         * treatment is deliberately NOT a colour: §3 reserves colour for what a feature *is* and
         * marks for what you *decided*, and selection is neither. So it reads as a ring and a
         * lift — the row comes forward, keeping its type accent and its decision mark saying
         * exactly what they said before.
         */
        background: active ? "#fff" : "var(--review-surface)",
        borderLeft: `4px solid ${accent}`,
        borderRadius: 8,
        padding: "10px 12px 10px 14px",
        boxShadow: active
          ? "0 0 0 2px var(--primitives-colors-theme-800), 0 2px 8px rgba(0,0,0,.10)"
          : "none",
        cursor: onActivate ? "pointer" : "default",
        transition: "box-shadow .12s, background .12s",
      }}
    >
      {/* top strip — the identity, and the decision that belongs to it, on one baseline */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
        }}
      >
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: "var(--review-ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {change.name}
            </span>
            {/*
            The glyph moved INTO the chip below (Olcay, 2026-08-11). It used to sit here beside the
            name, which meant the same warning was announced twice on two lines — a mark up here and
            its label down there — and the mark was the half with no words on it.
          */}
          </div>
          {warning && (
            /**
             * **A yellow chip** (Olcay, 2026-08-11). This supersedes §3's *"Risk is a third axis, and
             * it is never coloured… never amber"* — the reasoning there was that amber already means
             * *magnitude*, so spending it on risk says two things with one colour. Worth re-reading
             * before it becomes law; the chip is at least confined to the row, where no traffic light
             * appears.
             */
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  role="img"
                  aria-label={`Warning: ${WARNING_LABEL[warning]}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--primitives-colors-emotional-alert-900)",
                    background: "var(--primitives-colors-emotional-alert-0)",
                    border: "1px solid #fde0a8",
                    borderRadius: 999,
                    padding: "1px 8px 1px 6px",
                    margin: "3px 0 1px",
                    cursor: "help",
                  }}
                >
                  <WarningGlyph size={12} />
                  {WARNING_LABEL[warning]}
                </div>
              </TooltipTrigger>
              {/* Bounded, or a single sentence lays itself out as one line wider than the panel
                (Olcay, 2026-08-11) — it overhung the drawer and covered the row above. */}
              <TooltipContent
                style={{ maxWidth: 260, whiteSpace: "normal", lineHeight: 1.4 }}
              >
                {WARNING_WHY[warning]}
              </TooltipContent>
            </Tooltip>
          )}
          {/*
          **Details are behind a toggle** (Olcay, 2026-08-11: *"maybe there could be a 'details'
          button — when clicked the card expands and shows the details much more neatly"*).
          Every bullet used to render inline, so a row with two of them grew tall enough to wrap
          around the decision control and collide with it. Collapsed, a row is one line of summary
          and its decision; the bullets are there when you want them.
        */}
          <div style={{ fontSize: 12.5, color: "var(--review-muted)" }}>
            {change.detail}
          </div>
        </div>
        {/* Deciding is not selecting: without this, every ✓ would also fly the map to that feature,
          and working down the list would become a slideshow. */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {edit ? (
            /**
             * **Edited outranks the decision, and takes its place** (Olcay, 2026-08-25: *"edit
             * becomes user override which supersedes the incoming change"*).
             *
             * There is deliberately no ✓/✗ pair here. Confirm would mean "apply MapScale's
             * suggestion", and you have just replaced it; reject would mean "keep the published
             * value", and you have just replaced that too. Both segments would be lies about a row
             * whose answer is now yours. The way back is **Revert**, which restores the detected
             * value and puts the pair back — one step, and never a hidden one.
             */
            <>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 0.2,
                  color: OVERRIDE_INK,
                  border: `1px solid ${OVERRIDE_INK}`,
                  borderRadius: 999,
                  padding: "2px 9px",
                  whiteSpace: "nowrap",
                }}
              >
                EDITED
              </span>
              {onEdit && (
                <RowAction
                  label="Edit again"
                  ink={OVERRIDE_INK}
                  onClick={openEditor}
                >
                  <Pencil size={16} />
                </RowAction>
              )}
              {onRevert && (
                <RowAction
                  label="Revert to MapScale's detected value"
                  ink="var(--review-muted)"
                  onClick={() => {
                    setEditing(false);
                    onEditEnd?.(false);
                    onRevert();
                  }}
                >
                  <Reset size={16} />
                </RowAction>
              )}
            </>
          ) : preserved ? (
            /**
             * "Kept" stays a word rather than becoming a ✓, because it is the row's *status* and
             * people read it as one — and because ✓ means "apply this change", which is not what
             * is happening here. Beside it, the two acts Olcay asked for on 2026-08-25: edit your
             * own earlier override, or reset it back to what the source says.
             */
            <>
              <span
                style={{ fontSize: 12, color: DECISION_INK, padding: "0 2px" }}
              >
                Kept
              </span>
              {onEdit && (
                <RowAction
                  label="Edit your override"
                  ink={OVERRIDE_INK}
                  onClick={openEditor}
                >
                  <Pencil size={16} />
                </RowAction>
              )}
              {onRevert && (
                <RowAction
                  label="Reset — discard your override and take MapScale's value"
                  ink="var(--review-muted)"
                  onClick={onRevert}
                >
                  <Reset size={16} />
                </RowAction>
              )}
            </>
          ) : (
            <>
              <SegmentedControl
                items={items}
                value={change.decision}
                onValueChange={(v) => onDecide(v as Decision)}
              />
              {onEdit && (
                <RowAction
                  label="Edit — put your own value in place of this suggestion"
                  ink={OVERRIDE_INK}
                  onClick={openEditor}
                >
                  <Pencil size={16} />
                </RowAction>
              )}
            </>
          )}
        </div>
      </div>

      {/*
        **What the user put in place of the suggestion**, listed the same way MapScale's own
        `details` are and directly under them — so the row reads as one story in two voices rather
        than as a change with a footnote.
      */}
      {edit?.details?.length ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {edit.details.map((d) => (
            <div
              key={d}
              style={{
                fontSize: 12,
                lineHeight: 1.45,
                color: OVERRIDE_INK,
                borderLeft: `3px solid ${OVERRIDE_INK}`,
                paddingLeft: 8,
              }}
            >
              {d}
            </div>
          ))}
        </div>
      ) : null}

      {/*
        **The edit form** (Olcay, 2026-08-25: *"remove flagging, instead introduce editing
        capabilities"*). It replaces the flag's note field, in the same slot and for the opposite
        reason: the note existed to describe work deferred, and this is the work.

        Metadata inline, geometry on the map. A name and a type are two fields and belong where you
        are already reading the row; a shape is not something a 440px panel can offer, so **Edit
        shape** hands the feature to the geometry editor on the review map — the same editor, armed
        the same way, rather than a second one grown here.
      */}
      {editing && onEdit && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 10,
            borderRadius: 6,
            border: `1px solid ${OVERRIDE_INK}`,
            background: "#fff",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--review-muted)",
              }}
            >
              NAME
            </span>
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              aria-label={`Name for ${change.name}`}
              style={{
                font: "inherit",
                fontSize: 13,
                padding: "5px 8px",
                borderRadius: 6,
                border: "1px solid var(--primitives-colors-background-100)",
              }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--review-muted)",
              }}
            >
              TYPE
            </span>
            <input
              value={draftKind}
              onChange={(e) => setDraftKind(e.target.value)}
              aria-label={`Type for ${change.name}`}
              style={{
                font: "inherit",
                fontSize: 13,
                padding: "5px 8px",
                borderRadius: 6,
                border: "1px solid var(--primitives-colors-background-100)",
              }}
            />
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {onEditShape && (
              <button
                type="button"
                onClick={onEditShape}
                style={{
                  font: "inherit",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: `1px solid ${OVERRIDE_INK}`,
                  background: "#fff",
                  color: OVERRIDE_INK,
                  cursor: "pointer",
                }}
              >
                Edit shape on the map
              </button>
            )}
            <div style={{ flex: "1 1 0" }} />
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                onEditEnd?.(false);
              }}
              style={{
                font: "inherit",
                fontSize: 12,
                padding: "5px 10px",
                borderRadius: 6,
                border: "1px solid var(--primitives-colors-background-100)",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            {/**
             * ⚠️ **A no-op edit writes no override.** Opening the form, changing nothing and
             * pressing Save used to be the obvious way to end up with a row marked EDITED that
             * differs from MapScale in no respect — a purple shape on the map claiming an override
             * nobody made. The details are computed first, and an empty list means the row goes
             * back to being undecided rather than becoming a lie.
             */}
            <button
              type="button"
              onClick={() => {
                const name = draftName.trim();
                const kind = draftKind.trim();
                const details: string[] = [];
                const next: Override = { details };
                if (name && name !== change.name) {
                  next.name = name;
                  details.push(`Name: “${change.name}” → “${name}”`);
                }
                if (kind && kind !== (change.kind ?? "")) {
                  next.kind = kind;
                  details.push(
                    `Type: “${typeLabel(change.kind ?? "")}” → “${typeLabel(kind)}”`,
                  );
                }
                // Keep a shape the user already drew — this form does not own it, so it must
                // not drop it on the way past.
                if (edit?.geometry !== undefined) next.geometry = edit.geometry;
                if (edit?.details?.length)
                  for (const d of edit.details)
                    if (!details.includes(d) && d.startsWith("Boundary"))
                      details.push(d);
                setEditing(false);
                onEditEnd?.(true);
                if (details.length || shapeDirty) onEdit(next);
                else onRevert?.();
              }}
              style={{
                font: "inherit",
                fontSize: 12,
                fontWeight: 600,
                padding: "5px 12px",
                borderRadius: 6,
                border: `1px solid ${OVERRIDE_INK}`,
                background: OVERRIDE_INK,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Save edit
            </button>
          </div>
        </div>
      )}

      {/*
        The bullets use the FULL card width, and the toggle is a **full-width bottom cap**
        (Olcay, 2026-08-11). Both come from the same observation: a bullet trapped in the identity
        column wrapped at half the card, and a small inline link buried under the summary read as
        part of the text rather than as the card's own control.

        The cap breaks out of the card's padding with negative margins — hence the odd numbers,
        which are exactly the padding above (`10px 12px 10px 14px`) — so it meets both edges and
        rounds into the card's bottom corners.
      */}
      {change.details?.length ? (
        <div style={{ width: "100%" }}>
          {expanded && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                paddingBottom: 8,
              }}
            >
              {change.details.map((d) => (
                <div
                  key={d}
                  style={{
                    fontSize: 12,
                    color: "var(--review-muted)",
                    lineHeight: 1.45,
                  }}
                >
                  • {d}
                </div>
              ))}
            </div>
          )}
          <button
            // stopPropagation: expanding is reading, not selecting — otherwise opening the
            // details would also fly the map to this feature.
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            aria-expanded={expanded}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              width: "calc(100% + 26px)",
              margin: "0 -12px -10px -14px",
              padding: "6px 0",
              border: "none",
              borderTop: "1px solid var(--primitives-colors-background-100)",
              borderRadius: "0 0 8px 8px",
              background: "transparent",
              cursor: "pointer",
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--primitives-colors-theme-700)",
            }}
          >
            {expanded ? "Hide details" : "Details"}
            <span style={{ fontSize: 8, lineHeight: 1 }}>
              {expanded ? "▲" : "▼"}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
