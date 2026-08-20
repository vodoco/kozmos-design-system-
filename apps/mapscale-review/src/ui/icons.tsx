/**
 * The app's symbols, taken from the **Pointr Icon Library**
 * (Figma `PpbQbvpNTMvwqCx9dD4efJ`, page `181:128951` *Line icons*, 1,175 icons at 24×24).
 *
 * ⚠️ **Why these live here and not in `@kozmos/icons`.** The DS package exposes **38 of the
 * 1,175** — and each of its entries records the library's own `figmaName` and `figmaNodeId` while
 * rendering a **`lucide-react`** component, so code and Figma ship *different drawings under the
 * same names*. Until that is resolved at the DS (`KOZMOS_DS_IMPROVEMENTS.md` §P3), this module is
 * the honest middle: the geometry is the library's own, exported from it, and every icon records
 * the node it came from — so the eventual swap to a real DS import is mechanical, not a redraw.
 *
 * **Do not hand-draw a symbol.** Search the library first, and search it **by category** — the
 * transparency glyph was recorded as "does not exist anywhere" for two days while `contrast-02`
 * sat in *Editor*. Four genuinely did not exist and were drawn into the library on 2026-08-20:
 * `combine`, `snap`, `straighten`, `square-up`.
 *
 * **The convention, read off the library's own components rather than assumed:** 24×24 viewBox,
 * stroke 2, round cap and join, no fills.
 *
 * ⚠️ **Stroke does not hold its weight as these shrink.** The library is drawn for 24px, so a
 * `size={12}` icon renders its 2px stroke at 1px on screen. The glyphs this replaced were drawn on
 * their own small viewBoxes at 1.6–1.9, i.e. visually heavier. That is the library's own behaviour
 * and it is deliberate here, but it is why the small marks read lighter than they used to.
 */
import type { CSSProperties } from "react";

type IconProps = {
  /** Rendered px. The 24-grid scales to it, stroke included — see the note above. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Set when the icon carries meaning on its own; omit to leave it decorative. */
  label?: string;
};

/**
 * One wrapper for every icon, so the convention cannot drift glyph by glyph. `currentColor` is the
 * whole colour story: nothing here names a colour, and every caller tints by setting `color`.
 */
function icon(libraryName: string, node: string, paths: string[]) {
  const Icon = ({ size = 24, className, style, label }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
  Icon.displayName = libraryName;
  /** The library component this was exported from — the address for the eventual DS import. */
  Icon.library = { name: libraryName, node };
  return Icon;
}

/* ── the geometry editor's toolbar ─────────────────────────────────────────────────────────── */

export const Reshape = icon("bezier-curve-02", "1007:11210", [
  "M10 20.26C6.91 19.52 4.48 17.09 3.74 14M20.26 14C19.52 17.09 17.09 19.52 14 20.26M14 3.74C17.09 4.48 19.52 6.91 20.26 10M3.74 10C4.48 6.91 6.91 4.48 10 3.74M3.6 14H4.4C4.96 14 5.24 14 5.45 13.89C5.64 13.8 5.8 13.64 5.89 13.45C6 13.24 6 12.96 6 12.4V11.6C6 11.04 6 10.76 5.89 10.55C5.8 10.36 5.64 10.2 5.45 10.11C5.24 10 4.96 10 4.4 10H3.6C3.04 10 2.76 10 2.55 10.11C2.36 10.2 2.2 10.36 2.11 10.55C2 10.76 2 11.04 2 11.6V12.4C2 12.96 2 13.24 2.11 13.45C2.2 13.64 2.36 13.8 2.55 13.89C2.76 14 3.04 14 3.6 14ZM19.6 14H20.4C20.96 14 21.24 14 21.45 13.89C21.64 13.8 21.8 13.64 21.89 13.45C22 13.24 22 12.96 22 12.4V11.6C22 11.04 22 10.76 21.89 10.55C21.8 10.36 21.64 10.2 21.45 10.11C21.24 10 20.96 10 20.4 10H19.6C19.04 10 18.76 10 18.55 10.11C18.36 10.2 18.2 10.36 18.11 10.55C18 10.76 18 11.04 18 11.6V12.4C18 12.96 18 13.24 18.11 13.45C18.2 13.64 18.36 13.8 18.55 13.89C18.76 14 19.04 14 19.6 14ZM11.6 6H12.4C12.96 6 13.24 6 13.45 5.89C13.64 5.8 13.8 5.64 13.89 5.45C14 5.24 14 4.96 14 4.4V3.6C14 3.04 14 2.76 13.89 2.55C13.8 2.36 13.64 2.2 13.45 2.11C13.24 2 12.96 2 12.4 2H11.6C11.04 2 10.76 2 10.55 2.11C10.36 2.2 10.2 2.36 10.11 2.55C10 2.76 10 3.04 10 3.6V4.4C10 4.96 10 5.24 10.11 5.45C10.2 5.64 10.36 5.8 10.55 5.89C10.76 6 11.04 6 11.6 6ZM11.6 22H12.4C12.96 22 13.24 22 13.45 21.89C13.64 21.8 13.8 21.64 13.89 21.45C14 21.24 14 20.96 14 20.4V19.6C14 19.04 14 18.76 13.89 18.55C13.8 18.36 13.64 18.2 13.45 18.11C13.24 18 12.96 18 12.4 18H11.6C11.04 18 10.76 18 10.55 18.11C10.36 18.2 10.2 18.36 10.11 18.55C10 18.76 10 19.04 10 19.6V20.4C10 20.96 10 21.24 10.11 21.45C10.2 21.64 10.36 21.8 10.55 21.89C10.76 22 11.04 22 11.6 22Z",
]);

export const Transform = icon("transform", "1007:11468", [
  "M19 7V17M5 7V17M17 5L7 5M17 19H7M4.6 7H5.4C5.96 7 6.24 7 6.45 6.89C6.64 6.8 6.8 6.64 6.89 6.45C7 6.24 7 5.96 7 5.4V4.6C7 4.04 7 3.76 6.89 3.55C6.8 3.36 6.64 3.2 6.45 3.11C6.24 3 5.96 3 5.4 3H4.6C4.04 3 3.76 3 3.55 3.11C3.36 3.2 3.2 3.36 3.11 3.55C3 3.76 3 4.04 3 4.6V5.4C3 5.96 3 6.24 3.11 6.45C3.2 6.64 3.36 6.8 3.55 6.89C3.76 7 4.04 7 4.6 7ZM4.6 21H5.4C5.96 21 6.24 21 6.45 20.89C6.64 20.8 6.8 20.64 6.89 20.45C7 20.24 7 19.96 7 19.4V18.6C7 18.04 7 17.76 6.89 17.55C6.8 17.36 6.64 17.2 6.45 17.11C6.24 17 5.96 17 5.4 17H4.6C4.04 17 3.76 17 3.55 17.11C3.36 17.2 3.2 17.36 3.11 17.55C3 17.76 3 18.04 3 18.6V19.4C3 19.96 3 20.24 3.11 20.45C3.2 20.64 3.36 20.8 3.55 20.89C3.76 21 4.04 21 4.6 21ZM18.6 7H19.4C19.96 7 20.24 7 20.45 6.89C20.64 6.8 20.8 6.64 20.89 6.45C21 6.24 21 5.96 21 5.4V4.6C21 4.04 21 3.76 20.89 3.55C20.8 3.36 20.64 3.2 20.45 3.11C20.24 3 19.96 3 19.4 3H18.6C18.04 3 17.76 3 17.55 3.11C17.36 3.2 17.2 3.36 17.11 3.55C17 3.76 17 4.04 17 4.6V5.4C17 5.96 17 6.24 17.11 6.45C17.2 6.64 17.36 6.8 17.55 6.89C17.76 7 18.04 7 18.6 7ZM18.6 21H19.4C19.96 21 20.24 21 20.45 20.89C20.64 20.8 20.8 20.64 20.89 20.45C21 20.24 21 19.96 21 19.4V18.6C21 18.04 21 17.76 20.89 17.55C20.8 17.36 20.64 17.2 20.45 17.11C20.24 17 19.96 17 19.4 17H18.6C18.04 17 17.76 17 17.55 17.11C17.36 17.2 17.2 17.36 17.11 17.55C17 17.76 17 18.04 17 18.6V19.4C17 19.96 17 20.24 17.11 20.45C17.2 20.64 17.36 20.8 17.55 20.89C17.76 21 18.04 21 18.6 21Z",
]);

export const Split = icon("scissors-cut-01", "1007:11444", [
  "M20 4L8.5 15.5M8.5 8.5L20 20M17.5 12H17.51M22 12H22.01M6 3C7.66 3 9 4.34 9 6C9 7.66 7.66 9 6 9C4.34 9 3 7.66 3 6C3 4.34 4.34 3 6 3ZM6 15C7.66 15 9 16.34 9 18C9 19.66 7.66 21 6 21C4.34 21 3 19.66 3 18C3 16.34 4.34 15 6 15Z",
]);

/** Drawn into the library 2026-08-20 — a union, which `intersect-square` is not. */
export const Combine = icon("combine", "2064:33", [
  "M4 4H15V9H20V20H9V15H4V4Z",
]);

/** Drawn into the library 2026-08-20 — nothing existed; `ruler` means measure. */
export const Straighten = icon("straighten", "2064:45", [
  "M5 15H9V19M5 5V19H19L5 5Z",
]);

export const Simplify = icon("pen-tool-minus", "1007:11384", [
  "M2 5H8M19 11L17.24 17.17C17.15 17.47 17.11 17.62 17.03 17.75C16.95 17.86 16.86 17.96 16.75 18.03C16.63 18.12 16.47 18.16 16.17 18.26L4 22L7.74 9.83C7.84 9.53 7.88 9.37 7.97 9.25C8.04 9.14 8.14 9.05 8.25 8.97C8.38 8.89 8.53 8.85 8.83 8.76L15 7M4 22L10.59 15.41M21.87 7.87L18.13 4.13C17.74 3.74 17.54 3.54 17.31 3.46C17.11 3.4 16.89 3.4 16.69 3.46C16.46 3.54 16.26 3.74 15.87 4.13L15.13 4.87C14.74 5.26 14.54 5.46 14.46 5.69C14.4 5.89 14.4 6.11 14.46 6.31C14.54 6.54 14.74 6.74 15.13 7.13L18.87 10.87C19.26 11.26 19.46 11.46 19.69 11.54C19.89 11.6 20.11 11.6 20.31 11.54C20.54 11.46 20.74 11.26 21.13 10.87L21.87 10.13C22.26 9.74 22.46 9.54 22.54 9.31C22.6 9.11 22.6 8.89 22.54 8.69C22.46 8.46 22.26 8.26 21.87 7.87ZM12 12C13.1 12 14 12.9 14 14C14 15.1 13.1 16 12 16C10.9 16 10 15.1 10 14C10 12.9 10.9 12 12 12Z",
]);

/** Drawn into the library 2026-08-20 — there is no `magnet`, and `target-04` says "aim". */
export const Snap = icon("snap", "2064:37", [
  "M4 10V4H10M20 14V20H14M10.9 10.9H13.1V13.1H10.9V10.9Z",
]);

export const Undo = icon("flip-backward", "1007:9436", [
  "M3 9H16.5C18.99 9 21 11.01 21 13.5C21 15.99 18.99 18 16.5 18H12M7 13L3 9L7 5",
]);

export const Redo = icon("flip-forward", "1007:9439", [
  "M21 9H7.5C5.01 9 3 11.01 3 13.5C3 15.99 5.01 18 7.5 18H12M17 13L21 9L17 5",
]);

/**
 * Reset — back to the published outline. `clock-rewind` and not `refresh-ccw-*`: a circular arrow
 * is the ROTATE idiom, and the one control that throws your work away must not look like the one
 * that nudges it 15°.
 */
export const Reset = icon("clock-rewind", "1007:11560", [
  "M22.7 13.5L20.7 11.5L18.7 13.5M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C15.3 3 18.19 4.78 19.75 7.43M12 7V12L15 14",
]);

/* ── everywhere else ───────────────────────────────────────────────────────────────────────── */

export const Help = icon("help-circle", "1007:10248", [
  "M9.09 9C9.33 8.33 9.79 7.77 10.4 7.41C11.01 7.05 11.73 6.92 12.43 7.04C13.13 7.16 13.76 7.52 14.22 8.06C14.67 8.61 14.92 9.29 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z",
]);

/** The ◐ that opens the floor-plan opacity card. Recorded for two days as existing nowhere. */
export const Opacity = icon("contrast-02", "1007:11252", [
  "M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z",
  "M12 18.5C15.59 18.5 18.5 15.59 18.5 12C18.5 8.41 15.59 5.5 12 5.5V18.5Z",
]);

export const Ellipsis = icon("dots-horizontal", "1007:9867", [
  "M12 13C12.55 13 13 12.55 13 12C13 11.45 12.55 11 12 11C11.45 11 11 11.45 11 12C11 12.55 11.45 13 12 13Z",
  "M19 13C19.55 13 20 12.55 20 12C20 11.45 19.55 11 19 11C18.45 11 18 11.45 18 12C18 12.55 18.45 13 19 13Z",
  "M5 13C5.55 13 6 12.55 6 12C6 11.45 5.55 11 5 11C4.45 11 4 11.45 4 12C4 12.55 4.45 13 5 13Z",
]);

const STAR_D =
  "M11.28 3.45C11.51 2.99 11.63 2.75 11.78 2.68C11.92 2.61 12.08 2.61 12.22 2.68C12.37 2.75 12.49 2.99 12.72 3.45L14.9 7.88C14.97 8.02 15.01 8.09 15.06 8.14C15.1 8.19 15.15 8.23 15.21 8.26C15.28 8.29 15.35 8.3 15.51 8.32L20.4 9.04C20.91 9.11 21.17 9.15 21.29 9.27C21.39 9.38 21.44 9.53 21.42 9.68C21.4 9.86 21.21 10.04 20.84 10.4L17.3 13.85C17.19 13.95 17.14 14.01 17.1 14.07C17.07 14.13 17.05 14.19 17.04 14.25C17.03 14.33 17.05 14.4 17.07 14.55L17.91 19.42C17.99 19.94 18.04 20.19 17.96 20.34C17.88 20.48 17.76 20.57 17.61 20.6C17.44 20.63 17.21 20.51 16.75 20.27L12.37 17.97C12.24 17.89 12.17 17.86 12.1 17.84C12.03 17.83 11.97 17.83 11.9 17.84C11.83 17.86 11.76 17.89 11.63 17.97L7.25 20.27C6.79 20.51 6.56 20.63 6.39 20.6C6.24 20.57 6.12 20.48 6.04 20.34C5.96 20.19 6.01 19.94 6.09 19.42L6.93 14.55C6.95 14.4 6.97 14.33 6.96 14.25C6.95 14.19 6.93 14.13 6.9 14.07C6.86 14.01 6.81 13.95 6.7 13.85L3.16 10.4C2.79 10.04 2.6 9.86 2.58 9.68C2.56 9.53 2.61 9.38 2.71 9.27C2.83 9.15 3.09 9.11 3.6 9.04L8.49 8.32C8.65 8.3 8.72 8.29 8.79 8.26C8.85 8.23 8.9 8.19 8.94 8.14C8.99 8.09 9.03 8.02 9.1 7.88L11.28 3.45Z";

export const Star = icon("star-01", "1007:10447", [STAR_D]);

/**
 * The default-level star, which has two states rather than one. The library ships the outline only,
 * so "default" fills the same path — same silhouette, no second glyph, and the pair reads as one
 * control in two states instead of two marks that happen to look alike.
 */
export function StarFilled({ size = 24, label }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={STAR_D} />
    </svg>
  );
}
StarFilled.library = { name: "star-01", node: "1007:10447" };

export const Check = icon("check", "1007:9795", ["M20 6L9 17L4 12"]);

export const Warning = icon("alert-triangle", "1007:10328", [
  "M12 9V13M12 17H12.01M10.62 3.89L2.39 18.1C1.93 18.89 1.71 19.28 1.74 19.6C1.77 19.89 1.92 20.14 2.15 20.31C2.41 20.5 2.86 20.5 3.77 20.5H20.22C21.14 20.5 21.59 20.5 21.85 20.31C22.08 20.14 22.23 19.89 22.26 19.6C22.29 19.28 22.07 18.89 21.61 18.1L13.38 3.89C12.93 3.11 12.7 2.71 12.41 2.58C12.15 2.47 11.85 2.47 11.59 2.58C11.3 2.71 11.07 3.11 10.62 3.89Z",
]);

export const Pencil = icon("edit-02", "1007:10182", [
  "M18 10L14 6M2.5 21.5L5.88 21.12C6.3 21.08 6.5 21.06 6.7 20.99C6.87 20.94 7.03 20.86 7.18 20.76C7.35 20.65 7.5 20.5 7.79 20.21L21 7C22.1 5.9 22.1 4.1 21 3C19.9 1.9 18.1 1.9 17 3L3.79 16.21C3.5 16.5 3.35 16.65 3.24 16.82C3.14 16.97 3.06 17.13 3.01 17.3C2.94 17.5 2.92 17.7 2.88 18.12L2.5 21.5Z",
]);

export const Copy = icon("copy-01", "1007:9834", [
  "M5 15C4.07 15 3.6 15 3.23 14.85C2.74 14.64 2.36 14.26 2.15 13.77C2 13.4 2 12.93 2 12V5.2C2 4.08 2 3.52 2.22 3.09C2.41 2.72 2.72 2.41 3.09 2.22C3.52 2 4.08 2 5.2 2H12C12.93 2 13.4 2 13.77 2.15C14.26 2.36 14.64 2.74 14.85 3.23C15 3.6 15 4.07 15 5M12.2 22H18.8C19.92 22 20.48 22 20.91 21.78C21.28 21.59 21.59 21.28 21.78 20.91C22 20.48 22 19.92 22 18.8V12.2C22 11.08 22 10.52 21.78 10.09C21.59 9.72 21.28 9.41 20.91 9.22C20.48 9 19.92 9 18.8 9H12.2C11.08 9 10.52 9 10.09 9.22C9.72 9.41 9.41 9.72 9.22 10.09C9 10.52 9 11.08 9 12.2V18.8C9 19.92 9 20.48 9.22 20.91C9.41 21.28 9.72 21.59 10.09 21.78C10.52 22 11.08 22 12.2 22Z",
]);

export const ChevronDown = icon("chevron-down", "1007:9364", [
  "M6 9L12 15L18 9",
]);
export const ChevronLeft = icon("chevron-left", "1007:9370", [
  "M15 18L9 12L15 6",
]);
export const ChevronRight = icon("chevron-right", "1007:9376", [
  "M9 18L15 12L9 6",
]);

export const Flag = icon("flag-01", "1007:11779", [
  "M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3L4 22",
]);
