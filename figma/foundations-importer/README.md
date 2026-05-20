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
5. Run **◆ Kozmos DS Foundations Importer**.
6. Choose `docs/figma-foundations-payload.json` in the file picker.
7. Click **Import Foundations**.

The plugin creates the planned library pages and local variables with Light/Dark modes. It uses Figma's Plugin API inside the open file, so it does not need Figma Variables REST scopes.

After importing foundations, use the **Components** picker to select a builder, then click **Build** or **Update**. Build is for the first creation pass. Update patches an existing component in place so Code Connect node IDs stay stable. The status row above the log shows which selected action is running and whether it finished.

Typography primitives such as Text, Heading, and Label are published as local Figma text styles rather than component sets. Use **Apply Text Styles** after component updates to create or refresh those styles and attach them to generated component text layers. The React package still exposes `Text`, `Heading`, and `Label` primitives for semantic code composition.

Select **Link** and click **Build** after text styles are available. It creates Default/Subtle visual variants with Default/Focus states and editable `Link Text`, using the accessible brand and muted foreground tokens from the Core v1 contrast pass.

Select **Separator** and click **Build** for the layout boundary primitive. It creates Horizontal and Vertical orientation variants with variable-bound length/thickness and the same foreground boundary color used by the contrast-safe Core v1 controls.

Select **Skeleton** and click **Build** for loading placeholders. It creates Line, Block, and Circle shapes with variable-bound dimensions; runtime animation stays in React and product code.

Select **Box** and click **Build** before heavier composition work. It creates Transparent, Surface, and Outlined examples with editable `Box Text`, sharing the same radius, padding, and boundary tokens used by Core surfaces.

Select **Stack** and click **Build** after Box. It creates canonical Row and Column layout examples across Gap 2, 4, and 6; broader alignment, justification, and wrapping remain product-code choices for now to avoid variant explosion.

Select **Container** and click **Build** after Stack. It creates centered and fluid page-container examples with editable `Container Text`; responsive breakpoints and max-width behavior remain runtime CSS concerns.

Select **Breadcrumb** and click **Build** for navigation trails. It creates Basic and Ellipsis examples with editable item text while keeping separators and the ellipsis as composition primitives.

Select **Accordion** and click **Build** for disclosure groups. It creates Closed and Open examples with editable trigger/content text while leaving Radix interaction behavior, collapsibility, and animation in product code.

Select **Curated Icons** and click **Build** to create the curated Kozmos icon source set on the `Icons` page. The first pass imports the 38 icons from `@kozmos/icons` / `docs/figma-pointr-icon-catalog.json` by Pointr component key, then applies them as preferred values for Button and IconButton `Icon` instance-swap slots.

Select **Curated Icons** and click **Update** when the curated registry or Pointr source components change. It updates icon source components in place, preserves their node IDs, and keeps each nested `Pointr Source` stretched to the 24px icon bounds so resized Button/IconButton slots do not clip or overflow the source artwork.

Select **Button** and click **Build** to create the first code-aligned component set on the `Components` page. The result log includes both the internal Figma node ID and URL-safe node ID for Code Connect.

Select **Button** and click **Update** after token changes or safe Button polish. It updates the existing `Button` component set in place so the Code Connect node ID stays stable.

Component updates also ensure component-level float variables for fixed geometry that is not present in the foundations payload yet: widths, heights, padding, gap, radius, stroke width, icon size, spinner size, and text size/line-height where applicable. Interactive component bounds are kept at 44px minimum across all generated sizes so Figma, React, Vue, iOS, and Android share the same touch-target contract. The repo-level source for this contract is `packages/tokens/src/component-contracts.json`; run `pnpm components:contract:check` after platform or generator changes to catch drift. Where an existing primitive/layout token has the same value, the component token aliases to it instead of duplicating a raw number. The updater applies geometry variables to generated component roots and child icon/spinner layers where the Figma runtime supports numeric variable bindings. Text, Button, Counter, Badge, Card, and Tabs text use the primary typography family (`Readex Pro`, with Inter fallback if unavailable) and bind font size and line height to component variables. Figma does not expose font family and weight as normal variable bindings, so those remain token-aligned direct typography values.

Click **Reorganize Components** after creating or updating multiple component sets if the `Components` page starts to overlap. It moves existing top-level component-set nodes into one generous measured column, using visible child bounds plus extra safety gaps for dense or wide variant sets. It does not delete, duplicate, detach, or recreate nodes, so Figma node IDs and Code Connect anchors remain intact.

Button icon-size variants expose a single `Icon` instance-swap slot. If the curated icon set exists, the slot defaults to `Icon / search-md` and prefers all local `Icon / ...` source components. If the icon set has not been built yet, the slot falls back to `Icon / Slot Default` on the `Utilities` page. Button and IconButton now recolor icon instances through direct Figma fill/stroke overrides, so the slot stays a normal swappable icon instance instead of a mask wrapper.

Select **IconButton** and click **Build** after Button is stable. It creates `IconButton` with `Variant`, `Size`, and `State` axes plus the same `Icon` instance-swap slot. Use **Update** after token or slot changes to preserve the Code Connect node ID.

Select **Counter** and click **Build** before refreshing Badge. It creates a standalone count primitive with `Tone`, `Size`, and editable `Counter Text`, so counts can be reused without being baked into Badge anatomy.

Select **Badge** and click **Build** after Counter and the Button/IconButton icon slots are stable. It creates `Badge` with `Variant` and `Size` axes from the React Badge API. Use **Update** after token or visual changes to preserve the Code Connect node ID. Badge exposes `Label Text`, an `Icon` instance-swap slot for icon-sized badges, and an opt-in `Show Counter` property that toggles a hidden live `Counter` nested instance.

Select **Card** and click **Build** after the core content/status primitives are stable. It creates `Card` with `Content` variants for Basic, Header, and Full card anatomy plus editable title, description, and body text. Full cards compose live `Button` instances for footer actions instead of hand-drawn button frames. Use **Update** after token or documentation changes to preserve the Code Connect node ID.

Select **Tabs** and click **Build** after Card is stable. It creates `Tabs` with `Count`, `Active`, and `State` axes plus editable trigger labels. Use **Update** after token, copy, or focus-state changes to preserve the Code Connect node ID.

Select **Tooltip** and click **Build** after Tabs is stable. It creates `Tooltip` with `Side` variants, editable `Content Text`, and a side-aware triangular `Tip` layer that points toward the trigger, matching the React `TooltipContent` surface, radius, border, padding, shadow, arrow, and side offset contract. Use **Update** after token or copy changes to preserve the Code Connect node ID.

Select **Dialog**, **Popover**, then **Menu** for the next overlay pass. Dialog exposes Basic, Form, and Footer content variants with editable title, description, and body text; Form composes live `Input` instances and footer actions compose live `Button` instances. Popover exposes `Side` variants plus editable title and description text. Menu exposes Basic, Checkbox, Radio, and Submenu content variants with editable label, item, and shortcut text. Use **Update** after token, copy, or composition changes to preserve each Code Connect node ID.

After the core controls are stable, build the next field/control batch one component at a time: **Textarea**, **Search**, **Select**, then **Slider**. Textarea and Search mirror the Input field contract with `State` and `Status` axes plus editable label and placeholder text. Select maps to the React `SelectTrigger` API, so its Figma component exposes `Placeholder Text` but not a standalone label. Slider exposes `Label Text`, `State`, and `Status`, with focus visible shown on the thumb to match the React focus ring.

After that batch is green, build the display/feedback primitives: **Progress**, **Spinner**, **Avatar**, **Alert**, then **Toast**. Progress exposes a `Value` axis for common determinate examples. Spinner exposes `Size`. Avatar exposes `Content` plus editable `Image URL`, `Alt Text`, and `Fallback` strings for Code Connect. Alert exposes `Variant`, `Title`, and `Description` and composes the React `AlertTitle` and `AlertDescription` subcomponents. Toast exposes Basic and Action content variants with editable title, description, and action text.

Click **Document Components** after the component audit is green. This creates a generated `Docs` page with a side-by-side documentation grid for every generated component set, adds title, category, usage, properties, Code Connect, accessibility notes, and a small live preview, and refreshes each component set's Figma description field from the same documentation source. The docs preview uses representative examples instead of blindly sampling the first variants, so Badge previews avoid icon-size label clipping. The source component sets stay on the `Components` page so existing node IDs and Code Connect links remain stable. If an older run created split `Docs / ...` pages, the next documentation run removes those generated pages.

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
