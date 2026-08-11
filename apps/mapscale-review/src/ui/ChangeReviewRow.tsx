import { SegmentedControl, Tooltip, TooltipTrigger, TooltipContent } from "@kozmos/react";
import {
  changeAccent,
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
function WarningGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden focusable="false">
      <path d="M8 2.2 L14.6 13.4 H1.4 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 6.2 V9.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

/**
 * The same three marks the map draws on each feature — ✓ / 🚩 / ✗ in neutral black, so a decision
 * never reads as a change type. `currentColor` lets the control tint them when a segment is off.
 */
export function DecisionGlyph({ kind, size = 18 }: { kind: Decision; size?: number }) {
  const d =
    kind === "confirm"
      ? "M4 9.5 L7.5 13 L14 5.5"
      : kind === "reject"
        ? "M5 5 L13 13 M13 5 L5 13"
        : "M5.5 4 L5.5 15";
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {kind === "flag" && <path d="M5.5 4 L14 6.5 L5.5 9 Z" fill="currentColor" />}
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
  readOnly,
  active,
  onActivate,
}: {
  change: Change;
  onDecide: (d: Decision) => void;
  /** Preserved features are carried through untouched — there is no decision to make on them. */
  readOnly?: boolean;
  /** This is the change the map is showing — the two surfaces share one selection. */
  active?: boolean;
  /** Clicking the row anywhere but the decision control makes it the active one. */
  onActivate?: () => void;
}) {
  const accent = changeAccent(change);
  const warning = warningOf(change);
  const items = ACTIONS.map((a) => ({
    value: a.value,
    label: (
      <Tooltip>
        <TooltipTrigger asChild>
          {/* the label lives in the tooltip, so the glyph still needs an accessible name */}
          <span
            role="img"
            aria-label={a.label}
            style={{ display: "grid", placeItems: "center", color: DECISION_INK }}
          >
            <DecisionGlyph kind={a.value} />
          </span>
        </TooltipTrigger>
        <TooltipContent>{a.label}</TooltipContent>
      </Tooltip>
    ),
  }));

  return (
    <div
      data-change-row={change.id}
      onClick={onActivate}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
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
      <div style={{ flex: "1 1 0", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
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
            Glyph only, not a labelled pill: at 440px the label ate the feature name ("Nurs…"), and
            the name is the thing you scan for. The label is spelled out on the line below instead.
          */}
          {warning && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  role="img"
                  aria-label={`Warning: ${WARNING_LABEL[warning]}`}
                  style={{ flex: "0 0 auto", display: "grid", placeItems: "center", color: DECISION_INK }}
                >
                  <WarningGlyph />
                </span>
              </TooltipTrigger>
              <TooltipContent>{WARNING_WHY[warning]}</TooltipContent>
            </Tooltip>
          )}
        </div>
        {warning && (
          <div style={{ fontSize: 12, fontWeight: 600, color: DECISION_INK, marginTop: 1 }}>
            {WARNING_LABEL[warning]}
          </div>
        )}
        {/* one line per attribute that moved, as the MapScale report words it */}
        {change.details?.length ? (
          change.details.map((d) => (
            <div key={d} style={{ fontSize: 12, color: "var(--review-muted)" }}>
              • {d}
            </div>
          ))
        ) : (
          <div
            style={{
              fontSize: 13,
              color: "var(--review-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {change.detail}
          </div>
        )}
      </div>
      {/* Deciding is not selecting: without this, every ✓ would also fly the map to that feature,
          and working down the list would become a slideshow. */}
      <div style={{ flex: "0 0 auto" }} onClick={(e) => e.stopPropagation()}>
        {readOnly ? (
          <span style={{ fontSize: 12, color: "var(--review-muted)" }}>Kept</span>
        ) : (
          <SegmentedControl
            items={items}
            value={change.decision}
            onValueChange={(v) => onDecide(v as Decision)}
          />
        )}
      </div>
    </div>
  );
}
