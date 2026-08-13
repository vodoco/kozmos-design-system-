import { Text } from "@kozmos/react";
import { ConfirmOverlay } from "./ConfirmOverlay";
import { HELD_REASON, levelsHeldFromPublish, type HeldLevel } from "../mock/publishScope";

const LINE = "#e3e4e8";
const MUTED = "#5d626f";

/**
 * **What a site publish will leave behind** (Olcay, 2026-08-13).
 *
 * Publishing is a SITE action, but a review is a LEVEL one — so the moment two people work on one
 * site, "Publish" stops meaning "publish what I just did". A level still in review is held out
 * (see `mock/publishScope.ts` for why), and this is where that is said.
 *
 * Three rules this screen obeys:
 *
 * 1. **It does not block.** Publish stays available. The held levels are information, not a gate —
 *    the person publishing may know perfectly well that B2 is mid-review and want the rest live.
 * 2. **It names names.** "Some levels are held" would be worse than saying nothing: the whole risk
 *    of excluding is that a map ships MISSING work somebody uploaded, so every held level appears
 *    with its building, its change count and the reason.
 * 3. **It offers the way out.** Each row routes into that level's review, because the action the
 *    user probably wants is "finish that first", not "publish anyway".
 */
export function PublishScope({
  open,
  onCancel,
  onPublish,
  onOpenLevel,
}: {
  open: boolean;
  onCancel: () => void;
  onPublish: () => void;
  /** Take me to that level's review — the reason most people opened this overlay. */
  onOpenLevel?: (l: HeldLevel) => void;
}) {
  const held = open ? levelsHeldFromPublish() : [];

  return (
    <ConfirmOverlay
      open={open}
      tone={held.length ? "warning" : "info"}
      title={held.length ? `Publish site — ${held.length} level${held.length > 1 ? "s" : ""} will be left out` : "Publish site"}
      confirmLabel="Publish anyway"
      cancelLabel="Cancel"
      onConfirm={onPublish}
      onCancel={onCancel}
    >
      {held.length === 0 ? (
        <Text style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
          Every level is up to date. Publishing takes the site live as you see it.
        </Text>
      ) : (
        <>
          <Text style={{ display: "block", fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
            A level stays out of every publish until its review is concluded — so the changes below
            will <strong>not</strong> go live. Finish a review and it publishes with the next one.
          </Text>

          <div style={{ marginTop: 12, border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>
            {held.map((l, i) => (
              <div
                key={`${l.buildingId}:${l.index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderTop: i === 0 ? "none" : `1px solid ${LINE}`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ display: "block", fontSize: 13, color: "var(--review-ink)" }}>
                    {l.short} · {l.name}
                  </Text>
                  <Text style={{ display: "block", fontSize: 12, color: MUTED }}>
                    {l.building} — {HELD_REASON[l.reason]}
                    {l.changes !== undefined
                      ? ` · ${l.changes} change${l.changes === 1 ? "" : "s"} waiting`
                      : l.reason === "expert-review"
                        ? " · the list isn’t final yet"
                        : " · no changelog (couldn’t be matched)"}
                  </Text>
                </div>
                {onOpenLevel && (
                  <button
                    onClick={() => onOpenLevel(l)}
                    style={{
                      border: "none",
                      background: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: 12.5,
                      color: "#0b369c",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Review it
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </ConfirmOverlay>
  );
}
