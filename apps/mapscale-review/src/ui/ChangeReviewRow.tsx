import { Warning } from "./icons";
import { useState } from "react";
import {
  SegmentedControl,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@kozmos/react";
import {
  changeAccent,
  decisionInk,
  warningOf,
  DECISION_INK,
  WARNING_LABEL,
  WARNING_WHY,
  type Change,
  type Decision,
} from "../mock/diff";

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
 * The same three marks the map draws on each feature — ✓ / 🚩 / ✗ in neutral black, so a decision
 * never reads as a change type. `currentColor` lets the control tint them when a segment is off.
 */
export function DecisionGlyph({
  kind,
  size = 18,
}: {
  kind: Decision;
  size?: number;
}) {
  const d =
    kind === "confirm"
      ? "M4 9.5 L7.5 13 L14 5.5"
      : kind === "reject"
        ? "M5 5 L13 13 M13 5 L5 13"
        : "M5.5 4 L5.5 15";
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
      {kind === "flag" && (
        <path d="M5.5 4 L14 6.5 L5.5 9 Z" fill="currentColor" />
      )}
    </svg>
  );
}

const ACTIONS: { value: Decision; label: string }[] = [
  { value: "confirm", label: "Confirm" },
  { value: "flag", label: "Flag for later" },
  { value: "reject", label: "Reject" },
];

export function ChangeReviewRow({
  change,
  onDecide,
  override,
  active,
  onActivate,
  note,
  onNote,
}: {
  change: Change;
  /** `undefined` clears the decision — how a user override returns to its resting "Kept". */
  onDecide: (d: Decision | undefined) => void;
  /**
   * A user override — carried through untouched, so there is no *change* to confirm or reject.
   *
   * It used to be `readOnly` and render the bare word "Kept" (Olcay, 2026-08-11: *"maybe we should
   * allow flagging the user overrides too?"* — and he is right; this is the missing half of US7).
   * The warned ones are precisely the rows you need to come back to — an override that now
   * **overlaps** the new content, or that the new floor-plan's boundary **no longer covers**, or
   * whose **source value moved underneath it** — and "Kept" was a statement with no affordance,
   * the same gap D17 names for re-removals.
   *
   * **Flag only, and deliberately so.** Confirm would be a no-op: it is already kept. Reject would
   * mean discarding your own earlier work, which is a destructive act and must not be a ✗ in a
   * triage list next to twenty ordinary rows. So an override has two states — kept, and kept but
   * flagged — and flagging one now carries it onto the editor's map like any other flag.
   */
  override?: boolean;
  /** The note written against this flag, if any. Lives in the review outcome, not on the change. */
  note?: string;
  /** Omit to render the row without a note field — the map's card does, it has no room. */
  onNote?: (v: string) => void;
  /** This is the change the map is showing — the two surfaces share one selection. */
  active?: boolean;
  /** Clicking the row anywhere but the decision control makes it the active one. */
  onActivate?: () => void;
}) {
  const accent = changeAccent(change);
  const warning = warningOf(change);
  const [expanded, setExpanded] = useState(false);
  /** A user override's two states: kept, and kept but flagged to come back to. */
  const overrideItems = [
    {
      value: "confirm",
      label: (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              aria-label="Keep as it is"
              style={{ fontSize: 12, color: DECISION_INK, padding: "0 2px" }}
            >
              Kept
            </span>
          </TooltipTrigger>
          <TooltipContent>Keep your edit as it is</TooltipContent>
        </Tooltip>
      ),
    },
    {
      value: "flag",
      label: (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              role="img"
              aria-label="Flag for later"
              style={{
                display: "grid",
                placeItems: "center",
                color: decisionInk("flag"),
              }}
            >
              <DecisionGlyph kind="flag" />
            </span>
          </TooltipTrigger>
          <TooltipContent>Flag for later</TooltipContent>
        </Tooltip>
      ),
    },
  ];
  /**
   * **D17 (approved 2026-08-13, wording settled the same day).** US7 requires "an option to NOT
   * remove a Map Object", and the only mechanism was the generic ✗ with nothing saying that
   * rejecting a removal is *how you keep it*.
   *
   * The affordance is the **words, not a different control** (Olcay: *"I'd like them consistent so
   * X is fine, tooltip could say Keep it"*). Every row keeps the same three glyphs — a re-removal
   * must not grow a fourth-looking control in a list of twenty — and only the reject tooltip
   * changes. It still writes a plain `reject`, so no new state enters the model.
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
                color: decisionInk(a.value),
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
        <div style={{ flex: "0 0 auto" }} onClick={(e) => e.stopPropagation()}>
          {override ? (
            /*
            "Kept" stays a word rather than becoming a ✓, because it is the row's *status* and
            people read it as one — and because ✓ means "apply this change", which is not what is
            happening here. It is a segment now instead of a label, so it doubles as the way back
            out of a flag: within a review you un-flag by picking Kept again.
          */
            <SegmentedControl
              items={overrideItems}
              /* "Kept" is the resting state, so it is SHOWN selected while the row carries no
               decision at all — and picking it clears back to none rather than writing `confirm`.
               Recording a decision here would put a ✓ badge on the map for a feature that was
               never in question; five overrides would all sprout marks meaning "still kept". */
              value={change.decision === "flag" ? "flag" : "confirm"}
              onValueChange={(v) => onDecide(v === "flag" ? "flag" : undefined)}
            />
          ) : (
            <SegmentedControl
              items={items}
              value={change.decision}
              onValueChange={(v) => onDecide(v as Decision)}
            />
          )}
        </div>
      </div>

      {/*
        **The note, and only when the row is flagged** (Olcay, 2026-08-14: *"flag with optional
        notes"*). A flag says *come back to this* and not what for; a week later that is a mystery
        to whoever wrote it. It appears on flagging and disappears with the flag, so it can never
        become a field you scroll past on twenty settled rows.

        Optional, deliberately: requiring it would turn the cheap triage mark into a form, and Flag
        exists precisely because it is the decision that costs nothing.
      */}
      {change.decision === "flag" && onNote && (
        <div style={{ width: "100%" }} onClick={(e) => e.stopPropagation()}>
          <textarea
            value={note ?? ""}
            onChange={(e) => onNote(e.target.value)}
            rows={note && note.length > 60 ? 2 : 1}
            placeholder="Add a note — what should you come back for?"
            aria-label={`Note on ${change.name}`}
            style={{
              width: "100%",
              boxSizing: "border-box",
              resize: "vertical",
              font: "inherit",
              fontSize: 12,
              lineHeight: 1.45,
              color: "var(--review-ink)",
              padding: "6px 8px",
              borderRadius: 6,
              border: `1px solid ${decisionInk("flag")}55`,
              background: "#fffdf7",
            }}
          />
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
