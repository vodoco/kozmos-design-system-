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
 * **Top-centre**, because the geometry toolbar owns bottom-centre and a confirmation that covers
 * the tools you just used is a confirmation in the way.
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
        top: 18,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 6,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 14px 9px 11px",
        borderRadius: 10,
        background: "#fff",
        border: "1px solid var(--primitives-colors-background-900)",
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
          background: "#0b369c",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.2 4.7 8.4 9.5 3.6"
            stroke="#fff"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: 13,
            color: "var(--review-ink)",
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
            color: "var(--primitives-colors-background-600)",
          }}
        >
          Applied to this session — not published
        </span>
      </span>
    </div>
  );
}
