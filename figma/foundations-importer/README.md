# Kozmos DS Foundations Importer

Development-only Figma plugin for importing the generated Kozmos foundations payload into `Kozmos DS - Core Library`.

## Use

1. Generate the payload:

   ```bash
   pnpm figma:foundations
   ```

2. In Figma desktop or browser, open `Kozmos DS - Core Library`.
3. Open **Plugins > Development > Import plugin from manifest...**.
4. Select `figma/foundations-importer/manifest.json`.
5. Run **Kozmos DS Foundations Importer**.
6. Choose `docs/figma-foundations-payload.json` in the file picker.
7. Click **Import Foundations**.

The plugin creates the planned library pages and local variables with Light/Dark modes. It uses Figma's Plugin API inside the open file, so it does not need Figma Variables REST scopes.

After importing foundations, use the **Components** picker to select a builder, then click **Build** or **Update**. Build is for the first creation pass. Update patches an existing component in place so Code Connect node IDs stay stable. The status row above the log shows which selected action is running and whether it finished.

Select **Curated Icons** and click **Build** to create the curated Kozmos icon source set on the `Icons` page. The first pass imports the 38 icons from `@kozmos/icons` / `docs/figma-pointr-icon-catalog.json` by Pointr component key, then applies them as preferred values for Button and IconButton `Icon` instance-swap slots.

Select **Curated Icons** and click **Update** when the curated registry or Pointr source components change. It updates icon source components in place, preserves their node IDs, and keeps each nested `Pointr Source` stretched to the 24px icon bounds so resized Button/IconButton slots do not clip or overflow the source artwork.

Select **Button / v1** and click **Build** to create the first code-aligned component set on the `Components` page. The result log includes both the internal Figma node ID and URL-safe node ID for Code Connect.

Select **Button / v1** and click **Update** after token changes or safe Button polish. It updates the existing `Button / v1` component set in place so the Code Connect node ID stays stable.

Component updates also ensure component-level float variables for fixed geometry that is not present in the foundations payload yet: widths, heights, padding, gap, radius, stroke width, icon size, spinner size, and text size/line-height where applicable. Interactive component bounds are kept at 44px minimum across all generated sizes so Figma, React, Vue, iOS, and Android share the same touch-target contract. The repo-level source for this contract is `packages/tokens/src/component-contracts.json`; run `pnpm components:contract:check` after platform or generator changes to catch drift. Where an existing primitive/layout token has the same value, the component token aliases to it instead of duplicating a raw number. The updater applies geometry variables to generated component roots and child icon/spinner layers where the Figma runtime supports numeric variable bindings. Button, Badge, Card, and Tabs text use the primary typography family (`Readex Pro`, with Inter fallback if unavailable) and bind font size and line height to component variables. Figma does not expose font family and weight as normal variable bindings, so those remain token-aligned direct typography values.

Button icon-size variants expose a single `Icon` instance-swap slot. If the curated icon set exists, the slot defaults to `Icon / search-md` and prefers all local `Icon / ...` source components. If the icon set has not been built yet, the slot falls back to `Icon / Slot Default` on the `Utilities` page. Button and IconButton now recolor icon instances through direct Figma fill/stroke overrides, so the slot stays a normal swappable icon instance instead of a mask wrapper.

Select **IconButton / v1** and click **Build** after Button is stable. It creates `IconButton / v1` with `Variant`, `Size`, and `State` axes plus the same `Icon` instance-swap slot. Use **Update** after token or slot changes to preserve the Code Connect node ID.

Select **Badge / v1** and click **Build** after Button/IconButton are stable. It creates `Badge / v1` with `Variant` and `Size` axes from the React Badge API. Use **Update** after token or visual changes to preserve the Code Connect node ID. Badge is generated as a text/content component; the React API owns arbitrary children, so the Figma build exposes `Label Text` rather than a dedicated icon prop.

Select **Card / v1** and click **Build** after the core content/status primitives are stable. It creates `Card / v1` with `Content` variants for Basic, Header, and Full card anatomy plus editable title, description, and body text. Full cards compose live `Button / v1` instances for footer actions instead of hand-drawn button frames. Use **Update** after token or documentation changes to preserve the Code Connect node ID.

Select **Tabs / v1** and click **Build** after Card is stable. It creates `Tabs / v1` with `Count`, `Active`, and `State` axes plus editable trigger labels. Use **Update** after token, copy, or focus-state changes to preserve the Code Connect node ID.

Select **Tooltip / v1** and click **Build** after Tabs is stable. It creates `Tooltip / v1` with `Side` variants, editable `Content Text`, and a side-aware triangular `Tip` layer that points toward the trigger, matching the React `TooltipContent` surface, radius, border, padding, shadow, arrow, and side offset contract. Use **Update** after token or copy changes to preserve the Code Connect node ID.

Select **Dialog / v1**, **Popover / v1**, then **Menu / v1** for the next overlay pass. Dialog exposes Basic, Form, and Footer content variants with editable title, description, and body text; Form composes live `Input / v1` instances and footer actions compose live `Button / v1` instances. Popover exposes `Side` variants plus editable title and description text. Menu exposes Basic, Checkbox, Radio, and Submenu content variants with editable label, item, and shortcut text. Use **Update** after token, copy, or composition changes to preserve each Code Connect node ID.

After the core controls are stable, build the next field/control batch one component at a time: **Textarea / v1**, **Search / v1**, **Select / v1**, then **Slider / v1**. Textarea and Search mirror the Input field contract with `State` and `Status` axes plus editable label and placeholder text. Select maps to the React `SelectTrigger` API, so its Figma component exposes `Placeholder Text` but not a standalone label. Slider exposes `Label Text`, `State`, and `Status`, with focus visible shown on the thumb to match the React focus ring.

After that batch is green, build the display/feedback primitives: **Progress / v1**, **Spinner / v1**, **Avatar / v1**, **Alert / v1**, then **Toast / v1**. Progress exposes a `Value` axis for common determinate examples. Spinner exposes `Size`. Avatar exposes `Content` plus editable `Image URL`, `Alt Text`, and `Fallback` strings for Code Connect. Alert exposes `Variant`, `Title`, and `Description` and composes the React `AlertTitle` and `AlertDescription` subcomponents. Toast exposes Basic and Action content variants with editable title, description, and action text.

Click **Document Components** after the component audit is green. This creates a generated `Docs` page with a side-by-side documentation grid for every v1 component set, adds title, category, usage, properties, Code Connect, accessibility notes, and a small live preview, and refreshes each component set's Figma description field from the same documentation source. The docs preview uses representative examples instead of blindly sampling the first variants, so Badge previews avoid icon-size label clipping. The source component sets stay on the `Components` page so existing node IDs and Code Connect links remain stable. If an older run created split `Docs / ...` pages, the next documentation run removes those generated pages.

Click **Build Surface QA** after the component audit is green and before closing Core v1. It creates or refreshes the generated `QA / Transparent Surfaces` page with Light/Dark `Surface/0` panels and representative product-map panels labeled `fill-extrusion` and `symbol_label`. The page uses live instances from the canonical component sets so Button, IconButton, Badge, fields, selection controls, Progress, and Spinner can be reviewed on the surfaces that produced the audit advisories without changing component node IDs. `Audit Library` also checks those live QA instances against their host surface fills, so dark-on-dark transparent or glass regressions are reported as `surface-contrast` issues.

Use **Audit Library** after designer edits or component builds. It produces a JSON report in the plugin log with:

- Page counts
- Top-level page node samples and unexpected top-level nodes on the `Components` page
- Variable collection summaries
- Component set summaries
- Variant axes
- Component property keys
- Variable binding counts
- Bound variable field coverage for color, layout, sizing, spacing, radius, and typography fields
- Accessibility warnings
- Light/Dark contrast checks for text and icon/control layers
- Icon source count and icon slot integrity
- Icon source sizing and constraint issues
- Transparent surface QA page coverage when the generated QA page exists
- Composition integrity warnings for composite components that still contain cloned Button/Input frames instead of live nested instances

Use **Copy Log** to copy that JSON for review. If the Figma iframe blocks the Clipboard API, the plugin falls back to legacy copy and then selects the log text so `Cmd+C` still works.

## Expected Payload

The payload is generated by `scripts/figma-build-foundations-payload.mjs` and contains:

- Target file metadata
- Planned pages
- Variable collections and modes
- Figma variable candidates with CSS, iOS, and Android syntax metadata
- Style/documentation-only token records

Run the plugin again after regenerating the payload to update existing variables in-place.
