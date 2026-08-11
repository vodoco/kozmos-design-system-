import { IconButton, Icon, Text } from "@kozmos/react";

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
  title,
  subtitle,
  onClose,
  closeLabel = "Close",
}: {
  /** The small muted line above the title — a breadcrumb or the parent's name. */
  eyebrow?: string;
  /** A plain string gets the standard title type; pass a node to compose your own (S3 does). */
  title: string | React.ReactElement;
  /** The muted line below the title, where a screen explains itself. */
  subtitle?: string;
  onClose?: () => void;
  /** Accessible name for the ✕ — say what closes, not just "close". */
  closeLabel?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow != null && (
          <Text
            style={{
              fontSize: 12,
              color: "var(--primitives-colors-background-600)",
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
              fontSize: 12.5,
              color: "var(--primitives-colors-background-600)",
              display: "block",
              marginTop: 2,
              lineHeight: 1.4,
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
          <Icon name="x-close" />
        </IconButton>
      )}
    </div>
  );
}
