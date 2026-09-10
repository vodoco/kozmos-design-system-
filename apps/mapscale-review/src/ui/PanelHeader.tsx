import { IconButton, Icon, Text } from "@kozmos/react";

/**
 * The padding of the block a `PanelHeader` sits in — **the thing that decides where the ✕ lands**,
 * since the header aligns it to `flex-start` and the panel's own right edge.
 *
 * It is a constant because it drifted (Olcay, 2026-08-11: *"position of the close button should be
 * consistent"*): Manual Review used `18px` where every other panel used `16px`, and — far worse —
 * three of the four screens had the header **inside** their scrolling area, so a 15px scrollbar
 * pushed the ✕ left on exactly the long screens that grow one, and scrolling took it off the top of
 * the panel altogether. Put the header in its own non-scrolling block with this padding, and the
 * scroller beneath it.
 */
export const PANEL_PAD = "16px 20px 8px";

/**
 * The panel header every drawer-shaped screen wears: title block on the left, the v9 drawerHeader
 * **✕ on the right** (Olcay's standing rule — panels close from the header, footers keep only the
 * concluding action). Figma `12929:243939`'s `drawerHeader` / `x-close` anatomy.
 *
 * One component because it was four copies (Version History, Editing Level, Manual Review, the
 * Building wizard) plus a drifted fifth in the lightbox — and two of them rendered the same icon
 * in *different greys* (`MUTED` #5d626f vs `--review-muted` #737373) because each screen reached
 * for whichever muted constant was nearest. Tokens, not constants, settle it.
 */
export function PanelHeader({
  eyebrow,
  leading,
  title,
  subtitle,
  onClose,
  closeLabel = "Close",
  tone = "plain",
}: {
  /** The small muted line above the title — a breadcrumb or the parent's name. */
  eyebrow?: string;
  /**
   * An icon before the text — its own column, deliberately (Olcay, 2026-08-16: *"alignent issue at
   * the feature header"*).
   *
   * ⚠️ It used to be composed *into* the title node by the caller, which meant only the **title**
   * carried the icon's width and gap while the eyebrow and subtitle stayed flush with the panel's
   * padding. Measured: title at 45px, subtitle at 21px, body at 21px — the title alone hanging 24px
   * to the right of its own subtitle. Worse when the sprite failed to load, because the box
   * collapsed to nothing and left an 8px indent with visibly nothing to explain it.
   *
   * As its own column the icon leads the whole block, so title and subtitle share one left edge and
   * the icon lines up with the body beneath.
   */
  leading?: React.ReactNode;
  /** A plain string gets the standard title type; pass a node to compose your own (S3 does). */
  title: string | React.ReactElement;
  /** The muted line below the title, where a screen explains itself. */
  subtitle?: string;
  onClose?: () => void;
  /** Accessible name for the ✕ — say what closes, not just "close". */
  closeLabel?: string;
  /**
   * `band` is C's header (Workbench `589:1079`, Olcay 2026-09-10): a `theme-0` strip, 8/16 padding,
   * a 13px title over a 10px line, and a 14px ✕. It carries its own padding — do not wrap it in
   * `PANEL_PAD`. ⚠️ So its ✕ sits 8px higher and 4px further right than a `plain` panel's.
   */
  tone?: "plain" | "band";
}) {
  return (
    <div
      style={
        tone === "band"
          ? {
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              flex: "0 0 auto",
              background: "var(--primitives-colors-theme-0)",
            }
          : { display: "flex", alignItems: "flex-start", gap: 8 }
      }
    >
      {leading != null && (
        <span style={{ flex: "0 0 auto", marginTop: 3 }}>{leading}</span>
      )}
      {/* `anywhere`: a feature name with no break in it (an ID, a URL) wraps inside the band instead
          of running out past the ✕. Inherited by the title and subtitle alike. */}
      <div style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>
        {eyebrow != null && (
          <Text
            style={{
              fontSize: 12,
              color: "var(--primitives-colors-foreground-400)",
              display: "block",
            }}
          >
            {eyebrow}
          </Text>
        )}
        {typeof title === "string" ? (
          <Text
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--primitives-colors-theme-900)",
              display: "block",
              marginTop: 2,
            }}
          >
            {title}
          </Text>
        ) : (
          title
        )}
        {subtitle != null && (
          <Text
            style={{
              fontSize: tone === "band" ? 10 : 12.5,
              color: "var(--primitives-colors-foreground-400)",
              display: "block",
              marginTop: tone === "band" ? 4 : 2,
              lineHeight: tone === "band" ? "13px" : 1.4,
            }}
          >
            {subtitle}
          </Text>
        )}
      </div>
      {onClose && (
        <IconButton
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label={closeLabel}
          title="Close"
          style={{ flex: "0 0 auto" }}
        >
          {tone === "band" ? (
            <Icon name="x-close" style={{ width: 14, height: 14 }} />
          ) : (
            <Icon name="x-close" />
          )}
        </IconButton>
      )}
    </div>
  );
}
