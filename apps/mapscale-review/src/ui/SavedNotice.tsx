import { Check } from "./icons";
/**
 * "Applied" — the confirmation that an edit landed (Olcay, 2026-08-15: *"update a feature should
 * close the edit and save the changes … act like saved"*).
 *
 * Update closes the panel, so without this the whole panel simply vanishes and you are left
 * wondering whether you pressed the button or dismissed the thing. A gesture that removes its own
 * UI has to say something on the way out.
 *
 * ⚠️ **The wording is "Applied", not "Saved", and that is deliberate.** Nothing here is written to
 * Pointr Cloud (D3) — the edit lives in memory and dies with the tab. *Applied* is precisely what
 * happened, so the demo gets its completed gesture without the prototype claiming a round-trip it
 * never made. The line underneath says where the change actually lives.
 *
 * **Bottom-right** (Olcay, 2026-08-16), which is where a confirmation is looked for and where it
 * costs nothing — the panel it replaces has just closed, taking the geometry toolbar with it.
 *
 * ⚠️ **Stacked ABOVE the zoom control rather than beside it.** `#zoomctl` in the map page sits at
 * `right: 16 / bottom: 16` and is two 44px buttons with a 6px gap — 44×94, reaching 110px up from
 * the bottom edge. Sitting flush in the corner would put a toast over the zoom buttons for its
 * whole life; `bottom: 122` clears them with the same 12px breathing room the rest of the over-map
 * chrome uses, and `right: 16` keeps it in that chrome's column.
 */
export function SavedNotice({ name }: { name: string }) {
  return (
    <div
      // Announced rather than just drawn: the panel it replaces held focus, and a sighted user gets
      // the toast where a screen-reader user would otherwise get silence.
      role="status"
      aria-live="polite"
      style={{
        position: "absolute",
        bottom: 122,
        right: 16,
        zIndex: 6,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 14px 9px 11px",
        borderRadius: 10,
        background: "var(--semantics-surface-0)",
        border: "1px solid var(--semantics-border-subtle)",
        boxShadow: "0 8px 28px rgba(11,54,156,.16)",
        pointerEvents: "none",
        maxWidth: 420,
      }}
    >
      <span
        aria-hidden
        style={{
          flex: "0 0 auto",
          display: "grid",
          placeItems: "center",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "var(--primitives-colors-theme-800)",
        }}
      >
        {/* `check` from the Pointr Icon Library (see `./icons`); white on the disc. */}
        <Check
          size={12}
          style={{ color: "var(--primitives-colors-foreground-1000)" }}
        />
      </span>
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: 13,
            color: "var(--primitives-colors-foreground-100)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <strong style={{ fontWeight: 500 }}>{name}</strong> updated
        </span>
        <span
          style={{
            display: "block",
            fontSize: 11.5,
            color: "var(--primitives-colors-foreground-400)",
          }}
        >
          Applied to this session — not published
        </span>
      </span>
    </div>
  );
}
