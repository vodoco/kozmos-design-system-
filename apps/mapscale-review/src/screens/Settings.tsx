import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Button,
  Icon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@kozmos/react";
import { PANEL_WIDTH } from "../ui/Chrome";
import { BAND, MAGNITUDE } from "../mock/diff";
import { SITE_SNAPSHOT, SITE_ID, SITE_NAME } from "../mock/site";
import {
  CURRENT_USER,
  DIRECTORY,
  GRACE_OPTIONS,
  NO_ADMIN_REASON,
  SELF_REMOVE_NOTE,
  addRecipient,
  canAdminister,
  canRemove,
  getSettings,
  graceAdvice,
  recipientsAt,
  removeRecipient,
  setSetting,
  subscribeSettings,
  type NotifyScope,
  type ScopeLevel,
} from "../mock/settings";

/**
 * S5 · Settings → SDK Configuration (Figma `2487:776`).
 *
 * Two cards. The first is the frame's own — the Auto-Map Updates switches and the grace period —
 * with **one line of its copy deliberately not built as drawn**: the frame's Expert Review row
 * says "The level stays read-only while they work", which decision 8 reversed to warn-but-allow
 * on 2026-08-10. Building the frame verbatim would have shipped a settings screen contradicting
 * the behaviour three other surfaces already have.
 *
 * The second card is **not in the frame at all**: US6's notification recipients have never been
 * drawn, and S5 is the story's only plausible home. It is marked as new in the handoff rather
 * than passed off as a design that exists.
 */

const LINE = "var(--primitives-colors-background-100)";
const INK = "var(--primitives-colors-theme-900)";
const LINK = "var(--primitives-colors-theme-800)";
const TINT = "#f1f5fe";
const MUTED = "var(--primitives-colors-background-600)";
const FG = "#2e3138";

/** The settings pages the dashboard's own Settings rail lists, per the frame. Only one is ours. */
const NAV = [
  "Metadata",
  "SDK Configuration",
  "User Management",
  "UI Translation Manager",
  "Taxonomy Management",
  "Style Editor",
  "Security",
];

function useSettings() {
  return useSyncExternalStore(subscribeSettings, getSettings);
}

/* ── layout pieces ────────────────────────────────────────────────────────── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function CardHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${LINE}` }}>
      <Text style={{ display: "block", fontSize: 15, fontWeight: 600, color: INK }}>{title}</Text>
      <Text style={{ display: "block", fontSize: 13, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>
        {sub}
      </Text>
    </div>
  );
}

/**
 * One setting: what it is on the left, the control on the right. The description carries the
 * consequence, not the mechanism — "changes apply automatically by magnitude" is what turning
 * Manual Review off actually does to you.
 */
function Row({
  title,
  detail,
  children,
  last,
}: {
  title: string;
  detail: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 24,
        padding: "16px 24px",
        borderBottom: last ? "none" : `1px solid ${LINE}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: FG }}>{title}</Text>
        <Text style={{ display: "block", fontSize: 12.5, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>
          {detail}
        </Text>
      </div>
      <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 10, paddingTop: 2 }}>
        {children}
      </div>
    </div>
  );
}

/** The DS Switch wrapper is `w-full`, which would eat the row's label column. */
function Toggle({
  on,
  onChange,
  label,
  state,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  state: string;
}) {
  return (
    <>
      <Switch
        checked={on}
        onCheckedChange={onChange}
        aria-label={label}
        wrapperClassName="w-auto shrink-0"
      />
      <Text style={{ fontSize: 12.5, color: on ? LINK : MUTED, minWidth: 64 }}>{state}</Text>
    </>
  );
}

/* ── the band legend ──────────────────────────────────────────────────────── */

/**
 * The footer strip from the frame. It is the one place the three bands are stated as a rule
 * rather than as an outcome, and it is templated from `MAGNITUDE` so it can't drift from the
 * thresholds the code actually routes on.
 */
function BandLegend({ autoUpdates }: { autoUpdates: boolean }) {
  const items = [
    { tone: BAND.minor, text: `<${MAGNITUDE.minorBelow}% · ${autoUpdates ? "auto-publish" : "your review"}` },
    { tone: BAND.medium, text: `${MAGNITUDE.minorBelow}–${MAGNITUDE.largeAbove}% · your review` },
    { tone: BAND.large, text: `>${MAGNITUDE.largeAbove}% · rejected` },
  ];
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        padding: "12px 24px",
        borderTop: `1px solid ${LINE}`,
        background: "#fbfcfd",
      }}
    >
      {items.map((it) => (
        <span key={it.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: MUTED }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: it.tone.solid }} />
          {it.text}
        </span>
      ))}
    </div>
  );
}

/* ── US6 · recipients ─────────────────────────────────────────────────────── */

const SCOPE_TABS: { level: ScopeLevel; label: string }[] = [
  { level: "client", label: "Client" },
  { level: "site", label: "Site" },
  { level: "building", label: "Building" },
];

const SCOPE_BLURB: Record<ScopeLevel, string> = {
  client: "Everyone here is notified about map updates anywhere in the client — every site, every building.",
  site: "Notified about map updates anywhere in this site, on top of the client-level list.",
  building: "Notified about map updates in this building only, on top of the client and site lists.",
};

function RecipientList() {
  const s = useSettings();
  const [level, setLevel] = useState<ScopeLevel>("client");
  const [buildingId, setBuildingId] = useState(SITE_SNAPSHOT[2].id);
  const [adding, setAdding] = useState(false);

  const scope: NotifyScope = useMemo(() => {
    if (level === "client") return { level: "client", name: "Client" };
    if (level === "site") return { level: "site", id: SITE_ID, name: SITE_NAME };
    const b = SITE_SNAPSHOT.find((x) => x.id === buildingId)!;
    return { level: "building", id: b.id, name: b.name };
  }, [level, buildingId]);

  // `s` is read so the list re-renders on every store write; the store is the source, not state.
  void s;
  const people = recipientsAt(scope);
  const admin = canAdminister(scope);
  const available = DIRECTORY.filter((d) => !people.some((p) => p.id === d.id));

  return (
    <div style={{ padding: "16px 24px 20px" }}>
      {/* scope picker */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "inline-flex", border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>
          {SCOPE_TABS.map((t) => (
            <button
              key={t.level}
              onClick={() => { setLevel(t.level); setAdding(false); }}
              style={{
                padding: "6px 14px",
                fontSize: 12.5,
                border: "none",
                cursor: "pointer",
                color: level === t.level ? LINK : MUTED,
                background: level === t.level ? TINT : "#fff",
                fontWeight: level === t.level ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {level === "building" && (
          <Select value={buildingId} onValueChange={(v) => { setBuildingId(v); setAdding(false); }}>
            <SelectTrigger aria-label="Building" style={{ width: 220 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SITE_SNAPSHOT.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Text style={{ display: "block", fontSize: 12.5, color: MUTED, marginTop: 10, lineHeight: 1.5 }}>
        {SCOPE_BLURB[level]}
      </Text>

      {/* the lacking-admin state — US6 gates all six assign/remove criteria on it */}
      {!admin && (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            marginTop: 12,
            padding: "10px 12px",
            background: "#f6f7f9",
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            fontSize: 12.5,
            color: MUTED,
            lineHeight: 1.5,
          }}
        >
          <Icon name="info-circle" />
          <span>
            {NO_ADMIN_REASON} {SELF_REMOVE_NOTE}
          </span>
        </div>
      )}

      <div style={{ marginTop: 12, border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>
        {people.length === 0 && (
          <div style={{ padding: "14px 14px", fontSize: 12.5, color: MUTED }}>
            Nobody is notified at this level.
          </div>
        )}
        {people.map((p, i) => {
          const self = p.id === CURRENT_USER.id;
          const may = canRemove(scope, p.id);
          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderTop: i === 0 ? "none" : `1px solid ${LINE}`,
              }}
            >
              <div
                style={{
                  width: 28, height: 28, borderRadius: 16, flex: "0 0 auto",
                  display: "grid", placeItems: "center",
                  background: TINT, color: LINK, fontSize: 11, fontWeight: 600,
                }}
              >
                {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ display: "block", fontSize: 13, color: FG }}>
                  {p.name}
                  {self && <span style={{ color: MUTED, fontWeight: 400 }}> · you</span>}
                </Text>
                <Text style={{ display: "block", fontSize: 12, color: MUTED }}>{p.email}</Text>
              </div>
              {/* A disabled <button> swallows its own hover, so the reason rides a wrapping span
                  — the same pattern every locked control in the expert hold uses. */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span style={{ display: "inline-flex" }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!may}
                      onClick={() => removeRecipient(scope, p.id)}
                    >
                      Remove
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {may
                    ? self
                      ? "Remove yourself from these notifications"
                      : `Stop notifying ${p.name} at this level`
                    : NO_ADMIN_REASON}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        {adding ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Select
              value=""
              onValueChange={(v) => { addRecipient(scope, v); setAdding(false); }}
            >
              <SelectTrigger aria-label="Add a recipient" style={{ width: 280 }}>
                <SelectValue placeholder="Choose a user…" />
              </SelectTrigger>
              <SelectContent>
                {available.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name} · {d.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span style={{ display: "inline-flex" }}>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!admin || available.length === 0}
                  onClick={() => setAdding(true)}
                >
                  <Icon name="plus" /> Add recipient
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {!admin
                ? NO_ADMIN_REASON
                : available.length === 0
                  ? "Everyone in the directory is already notified at this level"
                  : "Assign someone to these notifications"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

/* ── the screen ───────────────────────────────────────────────────────────── */

export function Settings() {
  const s = useSettings();
  const advice = graceAdvice(s.graceSeconds);

  return (
    <>
      {/* the Settings rail, in the same column every screen's left panel uses */}
      <div
        style={{
          width: PANEL_WIDTH,
          flex: `0 0 ${PANEL_WIDTH}px`,
          borderRight: `1px solid ${LINE}`,
          background: "#fff",
          padding: "16px 12px",
          overflowY: "auto",
        }}
      >
        <Text
          style={{
            display: "block",
            fontSize: 11,
            letterSpacing: ".06em",
            color: MUTED,
            padding: "0 12px 8px",
          }}
        >
          SETTINGS
        </Text>
        {NAV.map((n) => {
          const active = n === "SDK Configuration";
          return (
            <div
              key={n}
              style={{
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 13,
                color: active ? LINK : FG,
                background: active ? TINT : "transparent",
                fontWeight: active ? 600 : 400,
                cursor: active ? "default" : "not-allowed",
                opacity: active ? 1 : 0.75,
              }}
              title={active ? undefined : "Not part of this prototype"}
            >
              {n}
            </div>
          );
        })}
      </div>

      {/* the page */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", background: "#f5f6f8", padding: "24px 40px 48px" }}>
        <div style={{ maxWidth: 780 }}>
          <Text style={{ display: "block", fontSize: 12, color: MUTED }}>Settings</Text>
          <Text style={{ display: "block", fontSize: 24, fontWeight: 700, color: INK, marginTop: 2 }}>
            SDK Configuration
          </Text>
          <Text style={{ display: "block", fontSize: 13, color: MUTED, marginTop: 4 }}>
            Configure how MapScale™ handles floor-plan updates for this client.
          </Text>

          <div style={{ marginTop: 20 }}>
            <Card>
              <CardHead
                title="Auto-Map Updates"
                sub="Let MapScale™ keep this client's maps up to date as new floor-plans arrive."
              />

              <Row
                title="Enable Auto-Map Updates"
                detail="When on, MapScale detects changes in new floor-plans and updates maps automatically based on change magnitude."
              >
                <Toggle
                  on={s.autoUpdates}
                  onChange={(v) => setSetting("autoUpdates", v)}
                  label="Enable Auto-Map Updates"
                  state={s.autoUpdates ? "Enabled" : "Disabled"}
                />
              </Row>

              <Row
                title="Manual Review"
                detail="Have your team confirm, flag, or reject each detected change before it's applied. Off = changes apply automatically by magnitude."
              >
                <Toggle
                  on={s.manualReview}
                  onChange={(v) => setSetting("manualReview", v)}
                  label="Manual Review"
                  state={s.manualReview ? "On · default" : "Off"}
                />
              </Row>

              <Row
                title="Expert Review"
                /* NOT the frame's copy. `2487:776` says "The level stays read-only while they
                   work" — true of the morning of 2026-08-10 and reversed that afternoon
                   (decision 8). The level stays editable; only frame-changing operations lock. */
                detail="Let Pointr's Mapping Team correct the result before your team sees it — so the change percentage you're shown is the corrected one. You can keep editing the level while they work; uploading, restoring and georeferencing wait until they're done."
              >
                <Toggle
                  on={s.expertReview}
                  onChange={(v) => setSetting("expertReview", v)}
                  label="Expert Review"
                  state={s.expertReview ? "On" : "Off"}
                />
              </Row>

              <Row
                title="Grace period"
                detail={`How long medium changes (${MAGNITUDE.minorBelow}–${MAGNITUDE.largeAbove}%) wait for your review before auto-publishing.`}
                last
              >
                <Select
                  value={String(s.graceSeconds)}
                  onValueChange={(v) => setSetting("graceSeconds", Number(v))}
                >
                  <SelectTrigger aria-label="Grace period" style={{ width: 160 }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRACE_OPTIONS.map((o) => (
                      <SelectItem key={o.seconds} value={String(o.seconds)}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Row>

              {/* The stories ask for advice at ≤1 week and a warning above 2 weeks. Neither
                  blocks the choice — it is the client's to make. */}
              {advice && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    margin: "0 24px 16px",
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    background: advice.tone === "warn" ? BAND.medium.tint : "#f6f7f9",
                    border: `1px solid ${advice.tone === "warn" ? BAND.medium.border : LINE}`,
                    color: advice.tone === "warn" ? BAND.medium.ink : MUTED,
                  }}
                >
                  <Icon name={advice.tone === "warn" ? "alert-triangle" : "info-circle"} />
                  <span>{advice.text}</span>
                </div>
              )}

              <BandLegend autoUpdates={s.autoUpdates} />
            </Card>
          </div>

          {/* US6 — no Figma frame exists for this; see the handoff. */}
          <div style={{ marginTop: 20 }}>
            <Card>
              <CardHead
                title="Update notifications"
                sub="Who gets emailed when a map update needs attention. The three levels stack — a client-level recipient hears about every site and building beneath it."
              />
              <RecipientList />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
