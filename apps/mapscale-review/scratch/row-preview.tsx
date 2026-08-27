/**
 * Every state the changelog row's tray has, side by side — MAP-566.
 * See `row-preview.html` for why this exists. Nothing in the app imports it.
 */
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, TooltipProvider } from "@kozmos/react";
import "@kozmos/react/dist/style.css";
import "../src/index.css";
import { ChangeReviewRow } from "../src/ui/ChangeReviewRow";
import type { Change, Decision, Override } from "../src/mock/diff";

const ROWS: {
  caption: string;
  change: Change;
  edit?: Override;
  preserved?: boolean;
}[] = [
  {
    caption: "undecided — [✓ ✎ ✗], nothing selected",
    change: {
      id: "costa",
      name: "Costa Coffee",
      type: "new",
      kind: "food-beverage-space",
      detail: "New café",
    },
  },
  {
    caption: "confirmed — the pill is on ✓",
    change: {
      id: "zone10",
      name: "DDF Zone 10",
      type: "new",
      kind: "retail-space",
      detail: "New retail zone",
      decision: "confirm",
    },
  },
  {
    caption: "rejected — the pill is on ✗",
    change: {
      id: "pharmacy",
      name: "DDF Pharmacy",
      type: "deleted",
      kind: "retail-space",
      detail: "Removed from floor plan",
      decision: "reject",
    },
  },
  {
    caption: "EDITED — [✎ ⟲] only, ✎ selected, no pill anywhere",
    change: {
      id: "subway",
      name: "Subway",
      type: "metadata",
      kind: "food-beverage-space",
      detail: 'Type: "Restaurant" → "Cafe"',
    },
    edit: {
      kind: "quick-service-restaurant",
      details: ['Type: "Cafe" → "Quick Service Restaurant"'],
    },
  },
  {
    caption: "preserved — Kept + [✎ ⟲], NEITHER selected",
    change: {
      id: "marhaba",
      name: "Marhaba Reception",
      type: "preserved",
      kind: "lounge",
      detail: 'You renamed "Marhaba" to "Marhaba Reception"',
    },
    preserved: true,
  },
  {
    caption: "re-removed — ✗ keeps its own tooltip (D17)",
    change: {
      id: "wrap",
      name: "Wrapping Machine Area",
      type: "deleted",
      kind: "operational-space",
      detail: "Present in the new source, removed again",
      warning: "re-removed",
    },
  },
];

function Bench() {
  const [decisions, setDecisions] = useState<
    Record<string, Decision | undefined>
  >({});
  const [overrides, setOverrides] = useState<
    Record<string, Override | undefined>
  >(
    Object.fromEntries(
      ROWS.filter((r) => r.edit).map((r) => [r.change.id, r.edit]),
    ),
  );
  return (
    <div style={{ padding: 32, background: "#fff", maxWidth: 520 }}>
      <h1 style={{ font: "600 18px 'Readex Pro'", marginBottom: 4 }}>
        Changelog row — the tray
      </h1>
      <p
        style={{
          font: "13px 'Readex Pro'",
          color: "#5d626f",
          marginTop: 0,
          marginBottom: 24,
        }}
      >
        ✎ is OVERRIDE_INK in every state; ✓ ✗ ⟲ are muted. The white pill says
        where the row stands.
      </p>
      {ROWS.map((r) => (
        <div key={r.change.id} style={{ marginBottom: 22 }}>
          <div
            style={{
              font: "500 11px 'Readex Pro'",
              color: "#5d626f",
              marginBottom: 6,
            }}
          >
            {r.caption}
          </div>
          <ChangeReviewRow
            change={{
              ...r.change,
              decision: decisions[r.change.id] ?? r.change.decision,
            }}
            preserved={r.preserved}
            edit={overrides[r.change.id]}
            onDecide={(d) => setDecisions((p) => ({ ...p, [r.change.id]: d }))}
            onEdit={(o) => setOverrides((p) => ({ ...p, [r.change.id]: o }))}
            onRevert={() =>
              setOverrides((p) => ({ ...p, [r.change.id]: undefined }))
            }
          />
        </div>
      ))}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="mapscale-theme">
      {/* the row's glyphs live in Tooltips — App.tsx provides this, so the bench must too */}
      <TooltipProvider delayDuration={0}>
        <Bench />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
