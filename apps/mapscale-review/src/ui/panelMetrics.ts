/**
 * **The feature panel's geometry**, in the one place both the panel and its popovers can read it.
 *
 * ⚠️ **These do not live in `FeaturePanel` and must not.** `TypePicker` needs the content width and
 * `FeaturePanel` renders `TypePicker`; putting the constants in the panel makes the two import each
 * other. That exact cycle was created and fixed once already this week for `SectionHeading` — shared
 * values belong to neither of their callers, and a module of plain numbers can never cycle with
 * anything.
 */

/**
 * The panel's width over the map.
 *
 * The map's camera padding, the Map Settings control's offset and the geometry focus all derive from
 * this — so it is changed here and nowhere else. Was 360 (the width `FeaturePanel` shipped at, §143)
 * until Olcay asked for 40 more on 2026-09-10.
 */
export const FEATURE_PANEL_WIDTH = 400;

/**
 * **The column the fields actually get** — the panel less its two 20px gutters, which are the
 * running panel's own (`14px 20px 16px` on the body, taken from the code rather than chosen).
 *
 * ⚠️ **Exported because popovers kept carrying their own numbers.** The type picker was a literal
 * `320`: the content width when the panel was 360, and no longer the content width the moment the
 * panel moved. A popover anchored to a full-width field should be as wide as the field, and that is
 * a relationship rather than a coincidence to re-type.
 */
export const PANEL_CONTENT_WIDTH = FEATURE_PANEL_WIDTH - 40;
