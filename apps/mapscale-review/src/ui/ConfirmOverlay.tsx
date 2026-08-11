import { useEffect, useRef } from "react";
import { Button, Icon } from "@kozmos/react";

/**
 * v9's confirmation overlay (Figma b8dqhE3CPxitYfqlXuQJTC · 7581:268934 — the `error` component
 * set): 400px card, 16px radius, a tinted header strip carrying the title and an alert-triangle
 * in the severity ink, a 16px description, and a right-aligned button footer. Olcay, 2026-08-10:
 * consequences belong in a confirmation overlay, not in subtext under the button — be loyal to
 * the design.
 *
 * Hand-rolled rather than the DS `Dialog` because that component hardcodes an ✕ close at the
 * card's top-right — exactly where this design puts the severity icon. (Another DS ↔ v9 drift for
 * the list.) Escape and the backdrop still dismiss; the confirm button takes focus on open.
 */

export type OverlayTone = "info" | "neutral" | "warning";

/** Header tint / border / icon ink per variant, straight off the v9 component's own exports. */
const TONE: Record<OverlayTone, { tint: string; border: string; icon: string }> = {
  info: { tint: "#ecf6fb", border: "#cae6f3", icon: "#2A92C6" },
  neutral: { tint: "#e3e4e8", border: "#e3e4e8", icon: "#5D626F" },
  warning: { tint: "#fffcf8", border: "#feeed0", icon: "#F9A707" },
};

export function ConfirmOverlay({
  open,
  tone = "info",
  title,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  tone?: OverlayTone;
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      // A modal owns the keyboard: Tab cycles inside the card instead of escaping into the page
      // beneath (which is inert to the mouse but not, by default, to the keyboard).
      if (e.key === "Tab" && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>("button, [href], [tabindex]");
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  const t = TONE[tone];

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 400,
          minWidth: 320,
          maxWidth: 480,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 16,
            background: t.tint,
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: "-0.2px",
              lineHeight: "22px",
              color: "#000",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
          <span style={{ color: t.icon, display: "grid", placeItems: "center", flex: "0 0 24px" }}>
            <Icon name="alert-triangle" size="lg" />
          </span>
        </div>
        <div
          style={{
            padding: "0 16px",
            fontSize: 16,
            lineHeight: "26px",
            letterSpacing: "-0.2px",
            color: "#464a53",
          }}
        >
          {children}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, padding: 24 }}>
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button ref={confirmRef} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
