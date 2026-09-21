# The Figma drift — 2026-09-21, evening

The importer plugin (`figma/foundations-importer/code.js`) had not changed since 2026-09-14
(`604730c`), so nothing the parts gained after that reached the library. Olcay chose this as the
first of the open items on the 21st. Read §1 for the inventory, §2 for what was built and how it
is modelled, §3 for the proofs, §4 for the run in Figma that finishes it, §5 for what is left.

## 1. The inventory, measured

`git log 604730c..HEAD --name-only -- packages/react/src/components` lists 60 React component
sources changed after the plugin's last commit. `pnpm figma:verify` (REST, read-only) reported the
live file matching the plugin's own registry — 95 sets, presence and variants clean — which
placed the drift in the plugin and Code Connect, not in the file. The manifest
(`pnpm figma:manifest`) and the foundations payload (`pnpm figma:foundations`) had not run since
`fc5700a`: neither knew the glass, motion or category tokens.

Since the 20th (the handoff's scope), what the plugin lacked:

| Part                    | Drift                                                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `CategoryTile`          | the 20th's geometry (64 square, 24 icon, 11/14 caption), the counter at the square's corner, the tint                                          |
| `LocationPin`           | the tint                                                                                                                                       |
| `CategoryField`         | no set at all                                                                                                                                  |
| `BrowseCategoriesPanel` | a 2 × 3 grid of placeholder slots where the React has four live tiles across, in their colours                                                 |
| `POIDetailPanel`        | the Sheet presentation drew a surface, a border and a grabber                                                                                  |
| `IconButton`            | large at 44 (the contract says 48)                                                                                                             |
| `DirectionStep`         | four typed glyphs where the code has fourteen cases and icons                                                                                  |
| `AISearchButton`        | no set at all                                                                                                                                  |
| `Counter`               | the fill (no Figma change: the tile and the field override the nested instance)                                                                |
| the tokens              | `Semantics.Category` (24 colour variables) and `Semantics.Motion` (five style-only entries) absent from the payload; the glass tokens likewise |
| glyphs                  | `pnpm figma:verify` flags 29 text nodes typing a character where an icon belongs (×, ‹, ›, →, ☆, ↗, ↑, ↓, ◉)                                   |

Also drifted, from the 15th to the 19th, and **not done here** (§5): the Tag's and Counter's
`emotion` axis (`61ddc04`), MapControlButton's toggle axes and surface (`dfbefc4`), the POI detail
panel's reference anatomy of the 18th (`a06ca47`…`ad1a23b`), the glass surface style on five
consumers and the navigation parts of the 20th.

## 2. What was built

Four commits on `claude/pointr-browse-repairs`: `c9a2f31` (the manifests), `184ad22` (the tint
on the tile and the pin, the harness), `6006614` (CategoryField, the panel, the sheet, the 48),
`8c50b97` (the direction cases, the AI button, the glyphs).

**The Tint axis.** A category's colour is a variant axis, `Tint`, with nine values — `Theme` and
the taxonomy's eight in the sprite's order (Yellow, Orange, Turquoise, Red, Blue, Navy, Green,
Pink) — on `CategoryTile` (State × Tint, 27), `LocationPin` (State × Size × Tint, 135) and
`CategoryField` (Tint, 9). Each tinted variant binds `Category/Accent/<Name>`,
`Category/Fill/<Name>` and `Category/OnFill/<Name>`, the payload's names for
`Semantics.Category`; `Theme` is the part with no category — the theme's 500 where the accent
goes, and for the field the themed button's fill and ink, the component defaults on every
platform. Fallback hexes are the tokens' (`CATEGORY_TINT_FALLBACKS`). Figma has no colour
property on a component, so an axis is the faithful model: the eight are named tokens, not free
colours, and Code Connect maps `Tint` onto `tint` on all three platforms (React takes literal
objects — its parser refuses a helper call).

**CategoryTile**, redrawn: an 88-wide tile (four across at gap 8), a 64 `Icon Square` at the
control radius with the container edge, neutral under every tint; a 24 `Icon` instance from
the Icons page in the accent (an instance-swap property, `bus` by default); the system's
`Counter` nested at the square's top-right, absolute, 4 beyond its top and right edges, brand
tone, the tint's fill on the instance and its ink on the digits, exposed so its text is edited
on the instance, hidden by `Show Count`; an 11/14 `Label Text` of two lines (`maxLines`, a
`CategoryTile / Label` text style, four component variables). Selection is the accent's 1
stroke, the accent at 5 % over the background and a 1 `Selection Ring` at 20 % outside the
square — never on the tile's frame. Disabled is the tile at 50 %.

**LocationPin**: the tint's fill is the marker and, off the floor, the hollow ring's stroke; its
ink is the number; a featured pin keeps the alert colour; disabled keeps the tint at 50 %.

**CategoryField**, new: 48 tall at the control radius, the accent at 12 % behind a 1 border of
it, 12 before the icon and 8 after the clear; a 28 `Icon` instance (its stroke scaled to
2 × 28 / 24); a 15/20 `Label Text` in the accent (`CategoryField / Label`); a 22 `Count Pill`
in the fill with the ink's digits, hidden by `Show Count`; a 32 `Clear Button` with a 16
x-close in the accent. Six component variables carry the numbers.

**BrowseCategoriesPanel**: two rows of four live `CategoryTile` instances, gap 8, each in its
category's tint with its label and count — the aviation quick access at 10.12.0, one of each of
the eight colours (Entrances & Exits green … Shopping pink) — exposed to the panel's designer.

**POIDetailPanel** in a sheet: no fill, stroke or grabber of its own (the sheet draws the
handle), only its top corners rounded at the control radius, the media and services blocks
white on the sheet's grey.

**IconButton**: `IconButton/size/large` is 48; the contract check, which pinned every listed size
at the 44 target, reads that one from the contract.

**DirectionStep**: `DIRECTION_STEP_TYPES` is the fourteen (Straight, Left, Right, Destination,
LiftUp, LiftDown, EscalatorUp, EscalatorDown, StairsUp, StairsDown, LevelUp, LevelDown,
Transition, TurnBack); each draws a 24 icon in the theme's colour on a 40 disc at 10 %
(`bg-primary/10`, `text-primary`) — arrow-up, arrow-down, arrow-left, arrow-right,
marker-pin-01, flip-backward — with the typed glyph as a fallback for a file without the icons.

**AISearchButton**, new: State (Default, Disabled); a 48 circle, a `Ring` ellipse with an
angular gradient of seven stops bound to `Data/Red`, `Data/Yellow`,
`Colors/emotional/success/500`, `Data/Teal`, `Data/Blue`, `Data/Purple`, `Data/Red` (the owned
CSS's conic gradient; the React comment naming the theme ramp is stale), a 43 `Disc` inset 2.5
in the background colour, a 16 `stars-01` icon in the theme's colour.

**The glyphs.** `productSdkControlButton` and `productSdkPanelHeader` take an `iconName` and
draw a curated instance where they typed a character, falling back to the glyph: the header's
close (x-close), the gallery's previous and next (chevrons), the POI panel's Navigate, Save and
Share (navigation-pointer-01, bookmark, share-01), back, continue, route, save, edit-note and
my-location. `⇅` (the routing swap) has no curated shape and stays typed. Four icons joined
`packages/icons/src/registry.ts` and the plugin's `KOSMOS_ICON_DEFINITIONS`: arrow-up,
arrow-down, flip-backward, stars-01.

**Measured without Figma.** `scripts/lib/figma-plugin-harness.mjs` stands in for the Plugin API
(frames, components, instances, text, vectors, auto-layout, bound paints, plugin data,
component properties, instance swaps; no layout engine) and evaluates `code.js` in a fresh
context, so every painter is reachable by name. `scripts/check-figma-painters.mjs`
(`pnpm figma:painters:check`) paints the variants above and asserts the contract's numbers and
the bindings: 149 assertions. Against the plugin as it was, 81 fail and none crash. It is a
unit test of what a painter writes, not a picture of the file.

## 3. Verified

| Gate                                                        | Result                                                                                                                                                                                                |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm figma:painters:check`                                 | 149 passed on the audit's commits; 81 failed on `604730c`'s plugin. 211 pass at `c28921a` (§9): lookups, the build, icon binding, layout sizing, the audit's wash                                     |
| `pnpm components:contract:check`, `pnpm figma:plugin:check` | ok, ok                                                                                                                                                                                                |
| `pnpm figma:stamp:check`                                    | current after each commit (the hook re-stamps: `8d1312c6c6af`)                                                                                                                                        |
| `pnpm figma:verify` against the live file                   | the expected reds: presence 97 expected, 2 missing (CategoryField, AISearchButton); variant drift on CategoryTile, LocationPin and DirectionStep; 0 of 95 sets on the new build — until the run in §4 |
| Code Connect dry runs, React, SwiftUI, Compose              | every file parses; the only failures are `Tint` and `Show Count` not yet on the live sets                                                                                                             |
| `swift test` on macOS, `./gradlew testDebugUnitTest`        | 91, ok — the Swift package and the Android module compile the new `.figma.swift` and `.figma.kt` files (both build Code Connect's library in), and their tests hold                                   |
| `pnpm --filter @kozmos/icons typecheck`                     | ok                                                                                                                                                                                                    |
| `pnpm --filter @kozmos/react typecheck` and `lint`          | ok, ok (the Code Connect files are in the package's source tree); `@kozmos/icons` builds with the four new entries                                                                                    |

## 4. The run in Figma, in order (no importer access from a chat)

_Steps 1 to 5 are done in the live file; §9 has the run for the current build._

1. `pnpm figma:foundations` is committed (`docs/figma-foundations-payload.json`): run **Import
   Foundations** so the 24 category variables exist.
2. **Curated Icons → Update**: imports arrow-up, arrow-down, flip-backward and stars-01 by key.
3. **Update** CategoryTile, LocationPin, DirectionStep, POIDetailPanel, IconButton, then
   BrowseCategoriesPanel (it instances CategoryTile). Update renames the pre-Tint variants in
   place, so the node IDs Code Connect pins survive; never Rebuild.
4. **Apply Text Styles**: two text styles are new, `CategoryTile / Label` (11/14 Regular) and
   `CategoryField / Label` (15/20 Medium, the importer's nearest weight to semibold); the
   library audit reports them until they exist.
5. **Build** CategoryField and AISearchButton. Put the node id each log prints into the three
   Code Connect files of each (`node-id=0-0` today) and add the files to
   `figma.linked.config.json`, `packages/ios/figma.linked.config.json` and
   `packages/android/figma.linked.config.json`.
6. From the terminal, with the main checkout's `FIGMA_ACCESS_TOKEN` exported (never printed):
   `pnpm figma:verify` — presence, drift and the glyph count should clear; then
   `pnpm figma:publish:linked:dry`, `figma:publish:ios:linked:dry`,
   `figma:publish:android:linked:dry`; publishing is Olcay's word.

## 5. Left, in order

1. `Surface` as a set and a `Surface` axis (Solid, Glass) on ManoeuvreCard, RouteSummary,
   SaveLocationCard, RoutingInputGroup and FeedbackCard — the 20th's glass ruling.
2. `ManoeuvreCard`, `Itinerary`, `RouteProgressRail` as sets (the navigation parts' measured
   geometry is in `navigation-parts-2026-09-20.md`).
3. `AdaptiveMapShell`'s phone sheet: the three detents, the handle, the anchored peek — a
   `Layout` or `Detent` axis, a decision for Olcay.
4. The 15th–19th drift: Tag's and Counter's `emotion` axis, MapControlButton's toggle axes and
   surface, the POI detail panel's anatomy of the 18th (the plugin's actions are still drawn
   buttons, not nested `Button` instances).
5. **Ruled by Olcay on the 21st, late** (`701f919`): the CategoryField's clear is a 32 circle to
   see in a 44 target to hit on all three platforms, as the search bar's clear beside it. The
   trailing padding drops from 8 to 2, so the circle stays 8 from the edge; on Compose the clear
   had floated inward (a weighted spacer against the weighted name) and now sits at the edge.
6. Pre-existing `pnpm figma:verify` findings, older than the 20th: DynamicIsland's compact and
   minimal slots are 26 tall in a 24 box, Dialog's and Drawer's primary-action labels 94 wide in 90. Re-verify after the run in §4; what survives is a painter's to fix.

## 6. Traps met

- A read that strips blank lines (`grep -v '^\s*$'`, a `cut`) is not the file: three exact-match
  patch anchors failed on it. Print the region verbatim with `sed -n` before anchoring, or
  splice by index between two unique markers.
- `check-component-contracts.mjs` asserts the _first_ `ring.layoutPositioning = "ABSOLUTE"`
  comes after the _first_ `target.appendChild(ring);` — a painter earlier in the file with a
  variable named `ring` breaks it. Name rings for what they are (`selectionRing`,
  `gradientRing`).
- Code Connect's React parser takes literal values in `figma.enum`; a helper call is an
  "Unknown intrinsic". The native parsers accept expressions.
- `pnpm figma:verify` derives expected axes from `const X = [...]` arrays and the
  `expectedVariantAxesForComponentSetName` table; a new axis needs both.
- The React `AISearchButton` doc comment names the theme ramp; the owned CSS draws the six data
  colours. The CSS is what renders.
- A helper that falls back to the library's default icon paints a magnifier where a close
  belongs. The default is right for a slot whose symbol is product data (a tile's, a field's)
  and wrong for a symbol with a meaning; `productSdkIconInstance` takes `fallbackToDefault`
  and a symbol's caller draws its glyph instead.
- The icon registry (`packages/icons/src/registry.ts`) and the plugin's `KOSMOS_ICON_DEFINITIONS`
  were hand-kept twins and had drifted by thirteen: the POI card's owned outlines were in the
  registry, never in the plugin, so `bookmark` and `share-01` could not have reached the Icons
  page. The definitions are now generated from the registry with the catalog's keys, and
  `pnpm components:contract:check` holds the three together.

- A lookup that searches `figma.root.children` in order walks the whole Components page before
  Icons. Read the page a component lives on first (`findComponentByName(name, [page])`).
- Update All Core resumes by build stamp. A new build makes every set unfinished, so after a
  plugin change update the sets that changed, one at a time.
- A pasted report is evidence about the build that wrote it. Read `pluginBuild` in the report and
  the build in the panel's header before trusting it.
- HUG takes an auto-layout frame or text; FILL a child of an auto-layout frame, after the
  append. A refused sizing is recorded in the run log, not thrown; the harness now refuses what
  Figma refuses.
- An unbound paint equal to a token's light value is not bound: it does not follow the mode.
- zsh does not split an unquoted `$VAR` into words; pipe a list through `xargs`.
- The linked Code Connect configs are lists, not globs. A mapping left off is never validated
  and never published, and the dry run still ends "All Code Connect files are valid"; four were
  off from the start. The contract check now refuses it.
- `figma connect publish` reports what it sent. Read it back (`pnpm figma:connect:readback`)
  before saying what Dev Mode shows.
- Figma's Dev Mode MCP server answered no tool call for an hour and a half while Figma sat in the
  background, though it still took the handshake, and answered at once when Figma was brought
  to the front. The readback times each call out and stops.
- A bound colour's own alpha does not show in this file; the paint's opacity does. Binding a
  translucent token at opacity 1 drew Button's Glass opaque (`ed50a03a1912`). A token's alpha
  rides on the paint, from its fallback; a strength laid on an opaque token goes on the layer.
- The Dev Mode server has a daily limit per account, shared with any other use of it: some 500
  calls into the 21st it answered "Rate limit exceeded, please try again tomorrow". A full
  readback is 285 calls; narrow it with `--label` and `--node`. The readback stops at the first
  refusal.
- An audit reads the file as it is. At 20:38 two of the run's nineteen sets had been updated;
  `pnpm figma:verify`'s build coverage says which sets carry which build. Read it before reading
  a warning as the code's.
- A render is the truth. DirectionStep's 1.00 was a glyph not drawn; the Selected tile's 1.92
  was an icon not drawn, measured on the fill beneath the one that shows.
- The audit's variant parsers run in a chain, and the Label parser claims any name with
  `State=Default`: a branch on a later parser's field can be dead. The Glass skip was.
- A warning's remedy is part of the warning. Surfacing FileUpload's unstyled labels put the
  panel's next step on Apply Text Styles, and it restyled the whole library. Read what a new
  warning tells the reader to run, and what that does, before shipping it.
- A literal written to a field bound to a variable drops the binding. Apply Text Styles wrote
  each text's size and leading before attaching the style; a painter binds after it writes.

## 7. The audit, the same night

Olcay asked for an adversarial pass before proceeding. Verified against the source, not
memory:

| Suspicion                                                                           | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Does Update create DirectionStep's ten new variants?                                | Yes: `updateSingleAxisComponent` creates every value it has not seen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Will the plugin's audits flag the tile's visible Counter or the new icon instances? | No: the hidden-Counter audit is Badge's alone; the icon-slot audit counts nodes named `Icon` and only asks that their paint be tintable, which it is.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| The AI ring's gradient transform                                                    | Identity is the centred default for an angular gradient; the start angle is immaterial for a ring that turns in the product.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| A missing curated icon                                                              | **Defect.** The helper fell back to `search-md` for every caller, so a file without `x-close` would have drawn a magnifier on the close. Fixed: `fallbackToDefault` for the two data slots only; symbols fall back to the typed glyph and warn.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| The POI panel's `bookmark` and `share-01`                                           | **Defect.** In the registry, not in the plugin's definitions (thirteen owned outlines were), so never on the Icons page. Fixed: the definitions are generated from the registry; a parity check in the contract check.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Glyphs still typed                                                                  | FloorSelector's steppers (chevron-up, chevron-down), MapControlsGroup's zoom and compass (plus, minus, compass-01), FeedbackCard's submit (arrow-right, loading-01) and RoutingInputGroup's swap (switch-vertical-01, curated tonight) now draw icons; no typed glyph remains in the plugin's painters.                                                                                                                                                                                                                                                                                                                                                             |
| CI                                                                                  | `pnpm figma:painters:check` and `figma:plugin:check` run beside the stamp check; the painter check reads the contract with `fs`, not an import attribute, for CI's Node 20.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| CategoryField and the contract                                                      | Added `components.categoryField` (48, 28, 15/20 semibold, 22, 32, 12 %) and assertions on the React, SwiftUI and Compose sources and on the importer's constants — the same guard the tile has.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| The clear's hit area                                                                | 32 on every platform; the search bar's clear beside it has 44. Ruled: a 44 target around the 32 circle (§5, `701f919`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| The React AISearchButton comment                                                    | Names the theme ramp; the owned CSS draws the six data colours. The Figma ring follows the CSS; the comment is a one-line fix for the next React commit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Olcay's first audit in Figma: the Button family's icons fail 3:1                    | **Defect in the file and the plugin.** Read over REST: Button Default, Size Icon has fill `#0D44C2` and an icon stroke of plain `#000000`, unbound, while the icon's stored label names the right token — an instance reset had dropped the override and left the plugin data. `syncIconSlotInstance` decided a re-tint by the label alone, so an Update would have skipped every one. Fixed: the paint decides (`iconSlotPaintIsExpected`), the repair is counted, and the check proves a black icon with the right label is re-bound. The one "transparent surface QA" issue is the same icons on the dark host; Build Surface QA after the updates refreshes it. |
| Counter's `fill`                                                                    | Now named in the Counter set's description: a host's inked fill is an override on the nested instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## 8. Change it yourself

| What                                   | Where                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The Tint axis's values and fallbacks   | `CATEGORY_TINTS`, `CATEGORY_TINT_FALLBACKS` in `figma/foundations-importer/code.js`; `categoryTintTokens()` maps a name to its three variables; `expectedVariantAxesForComponentSetName` declares the axis per set                                                                                                                                                                      |
| The tile's numbers                     | `CATEGORY_TILE_*` constants, their `COMPONENT_FLOAT_TOKENS` entries (`CategoryTile/square/size`, `/icon/size`, `/label/font-size`, `/label/line-height`), `components.categoryTile` in `packages/tokens/src/component-contracts.json`; the painter `updateCategoryTileVariant`                                                                                                          |
| The field's numbers                    | `CATEGORY_FIELD_*` constants and tokens; `components.categoryField` in the contract, asserted by `pnpm components:contract:check` on all three platforms; the painter `updateCategoryFieldVariant`                                                                                                                                                                                      |
| The pin's tint                         | `updateLocationPinVariant` (`markerFill`, `ink`); `layoutLocationPinVariants` stacks one State × Size block per tint                                                                                                                                                                                                                                                                    |
| The panel's eight example tiles        | `BROWSE_CATEGORIES_PANEL_TILES` (label, tint, count) and `browseCategoriesPanelTile()`                                                                                                                                                                                                                                                                                                  |
| The direction cases and their icons    | `DIRECTION_STEP_TYPES`, `DIRECTION_STEP_ICONS`, `DIRECTION_STEP_GLYPHS` (the typed fallback), `DIRECTION_STEP_ICON_SIZE`; the Code Connect files map every case on the three platforms                                                                                                                                                                                                  |
| The AI ring's colours and geometry     | `AI_SEARCH_BUTTON_RING_STOPS` (the owned CSS's order), `AI_SEARCH_BUTTON_*`; `angularGradientFromVariables()` binds each stop                                                                                                                                                                                                                                                           |
| A part's symbol                        | `productSdkIconInstance({ iconName, fallbackToDefault })`; `productSdkControlButton({ iconName })`; the glyph tables stay as fallbacks                                                                                                                                                                                                                                                  |
| A curated icon                         | `packages/icons/src/registry.ts` (name, node id, a Lucide component); regenerate the plugin's `KOSMOS_ICON_DEFINITIONS` from it as the audit did (names and descriptions from the registry, keys from `docs/figma-pointr-icon-catalog.json`); the parity check tells you when they differ                                                                                               |
| The POI panel in a sheet               | the `sheet` branch of `updatePOIDetailPanelVariant`; `components.poiDetailPanel.content.sheetSurface`                                                                                                                                                                                                                                                                                   |
| The large icon button                  | `IconButton/size/large` in `COMPONENT_FLOAT_TOKENS`; `components.iconButton.sizes.large`; the contract check reads it                                                                                                                                                                                                                                                                   |
| A new set                              | the six registration points (the sections list, the layout heights, the docs table, the update sequence, the message map, the expected axes) plus the `<option>` and picker block in `ui.html`; a painter with `create`/`update`/`parse`/`configure`; a section in the painter check                                                                                                    |
| Measure a painter                      | `pnpm figma:painters:check [path/to/code.js]`; a section per set in `scripts/check-figma-painters.mjs`; mocks in `scripts/lib/figma-plugin-harness.mjs` (a Counter set, the Icons page)                                                                                                                                                                                                 |
| Read the live file                     | `pnpm figma:verify` with `FIGMA_ACCESS_TOKEN` exported from the main checkout's `.env` (the guide §4 has the line)                                                                                                                                                                                                                                                                      |
| Code Connect for a tinted part         | the three `.figma.*` files beside each component; React takes literal objects per tint; the node id of a new set comes from Build's log                                                                                                                                                                                                                                                 |
| The four rulings and the open decision | the handoff's §7                                                                                                                                                                                                                                                                                                                                                                        |
| Where a component is looked up         | `findComponentByName(name, pageNames)`: the named pages first, then every page; found components are kept in `componentsFoundByName` while each is still in the file under its name; icons use `ICON_PAGE_NAME`, the slot default `UTILITIES_PAGE_NAME`                                                                                                                                 |
| HUG and FILL                           | `setHugChildSizing` gives HUG only to an auto-layout frame or text (`canHugContent`); set FILL after the node is appended; the painter check's "Layout sizing Figma accepts" measures every config painter                                                                                                                                                                              |
| What the audit reads under content     | `contrastChildBackground`: a frame's fill, then each `translucent-token-layer` child at paint alpha × layer opacity                                                                                                                                                                                                                                                                     |
| The build a run names                  | `PLUGIN_BUILD` (stamped by `pnpm figma:stamp`); the panel asks with `ui-ready` and shows `plugin-build`; the audit report's `pluginBuild`                                                                                                                                                                                                                                               |
| An icon's re-tint                      | `iconSlotPaintIsExpected`: bound to the token, or the fallback colour only when the token's variable is missing from the file                                                                                                                                                                                                                                                           |
| The field's clear target               | `categoryField.content.clearHitArea` (44) and `clearSize` (32) in the contract; React's `h-11 w-11` button around the `h-8 w-8` circle with the field's `pr-0.5`; SwiftUI's `clearHitArea` frame around the `clearSize` frame with `.padding(.trailing, …Spacing25)`; Compose's 44 `Box` around the 32 circle with `end = …Spacing25` and the name and count in an inner weighted `Row` |
| Which files Code Connect sends         | the three `figma.linked.config.json` files, which are lists: a new mapping goes in by name beside its source file, and `pnpm components:contract:check` fails on a pinned file left out                                                                                                                                                                                                 |
| A snippet's import line                | `importPaths`: `src/components/*` → `@kozmos/react` in `figma.linked.config.json` and `packages/react/figma.config.json`; `Sources/Components/` → `import Kozmos` in `packages/ios/figma.linked.config.json`; Compose prints each file's own imports                                                                                                                                    |
| What Dev Mode shows                    | `pnpm figma:connect:readback`, with Figma desktop open on the Core Library and its Dev Mode MCP server on (Preferences)                                                                                                                                                                                                                                                                 |
| A translucent token's alpha            | the fallback's alpha in the painter's config (`#FCFCFD1A`), which `paintFromVariable` puts on the bound paint; the harness keeps only that alpha and fails any other opacity on a bound paint                                                                                                                                                                                           |

- An instance's plugin data is a label, not its paint. The Button family's icons carried the
  right `foreground-token` and a black paint; a re-tint decided by the label skips them for
  ever. Decide by the paint, and count the repairs so a run says what it mended.

## 9. The audit of 14:58, and what changed after it

Olcay pasted a full Audit Library report at 14:58. It named no build; its typography rule
dated it before `fc3e915`. Read against the source and, where it could be, the live file over
REST. Nothing in the file changed after 14:56 until the run below.

| Finding                                                                                             | What it was, and what was done                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Update All Core stalled at the Tree block                                                           | **Defect** (`50ba616`). Every Tree row looked up its icons by searching the pages in order, through the whole Components page (27,459 nodes), before Icons: 1,044 lookups, 28.7 million node visits in one blocking stretch, measured in the harness with pages of the live file's size. Icons are read from Icons first and kept while each is still in the file under its name: 506 visits. The slot default is read from Utilities first.                                                        |
| The report named no build                                                                           | **Fixed** (`50ba616`). The panel's header shows the build; the report carries `pluginBuild`.                                                                                                                                                                                                                                                                                                                                                                                                        |
| Typography: 160 stale, FormField's Required Mark expected Regular                                   | The rule `fc3e915` replaced; the painter draws it Medium. The live file has none stale under the current rule.                                                                                                                                                                                                                                                                                                                                                                                      |
| Dark mode: icons at 1.0 on Badge Outline and Ghost, 1.61 on Secondary, 1.2 on Glass                 | **Defect in `414ba00`** (`3b1d226`). Those variants take `Colors/foreground/0`, whose light value is the Icons page glyph's own black; the paint check passed any unbound paint equal to the fallback, so a black glyph was never bound and stayed black in Dark. The fallback now counts only when the variable is missing. Update Button, IconButton and Badge, then Build Surface QA (the one surface QA issue is IconButton Glass).                                                             |
| DirectionStep: 28 icons at 1.0                                                                      | The disc's 10 % paint is stored at 1 in the live file. Fixed by `e070cef` (the disc is a wash layer at 0.1); Update DirectionStep.                                                                                                                                                                                                                                                                                                                                                                  |
| e070cef's premise, "Figma drops a bound paint's opacity"                                            | **Wrong as stated.** Over REST: CategoryField's 12 % wash is a bound paint that kept its opacity 0.12; CategoryTile's 5 % and 20 % and DirectionStep's 10 %, from the same helper, are stored at 1. What dropped those three is not established. Layer opacity does not depend on it, so the painters stand; the comments now say what was measured (`c28921a`).                                                                                                                                    |
| After an Update, the audit would miss the wash                                                      | **Defect** (`c28921a`). It composited only a frame's own fill; a wash is now a layer of its own. It composites each translucent-token layer at paint alpha × layer opacity: the yellow label reads 1.77, not 1.92.                                                                                                                                                                                                                                                                                  |
| FileUpload: 32 text nodes without a style                                                           | The browse text; `fc3e915` gives it the label style. Update FileUpload.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 319 layout sizing refusals in the earlier Fix Audit Issues log                                      | **Defect** (`07a28e7`). 306 were HUG on nodes that cannot hug (NavigationItem's icons, BottomSheet's handle), which stayed FIXED anyway. The rest mis-sized: FILL on the Slider track under a control without auto layout, FILL on BottomSheet's hidden Form slot. A sweep of every config painter in a harness that now refuses what Figma refuses found the same in BottomNavigation, Navbar, Sidebar, SearchBar, Tag, MetaStrip and Timeline. HUG goes only where it can; FILL after the append. |
| CategoryField, AISearchButton had placeholder Code Connect pins                                     | **Pinned** (`9edcbe1`): 1933-9257 and 1933-9270 in the six files and the three linked configs; the dry runs validate on all three platforms. Published on his word the same evening (below).                                                                                                                                                                                                                                                                                                        |
| CategoryField: 11 text and 4 icon failures; CategoryTile: 6 icon; LocationPin: 18 off-floor numbers | **Design, not paint.** Computed from the token files, they match the audit to the hundredth. The painters draw what the code draws. Decisions for Olcay below.                                                                                                                                                                                                                                                                                                                                      |
| React's pin number                                                                                  | **Defect, found here, not in the audit.** React draws the pin as an outline with a 20 % wash and inks the number with `onFill`, the ink for the solid fill: every tint fails in one mode or the other, 1.01 to 1.37, and the untinted pin's white number on a 20 % primary wash is illegible too. Native and Figma fill the pin solid, where the ink passes. A decision for Olcay below.                                                                                                            |

### The category colours, measured

From `packages/tokens/src/tokens-*.json`; a ✗ fails the threshold named.

| Tint      | Off-floor number, fill on surface (4.5) Light / Dark | React number, onFill on 20 % fill (4.5) Light / Dark | Tile icon, accent on surface (3.0) Light | Field label, accent on 12 % wash (4.5) Light / Dark | Field label as foreground/0 |
| --------- | ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------- | --------------------------------------------------- | --------------------------- |
| Yellow    | 1.92 ✗ / 10.94                                       | 15.43 / 1.15 ✗                                       | 1.92 ✗                                   | 1.77 ✗ / 9.43                                       | 19.40 / 18.09               |
| Orange    | 2.82 ✗ / 7.43                                        | 14.47 / 1.06 ✗                                       | 2.82 ✗                                   | 2.51 ✗ / 6.64                                       | 18.69 / 18.76               |
| Turquoise | 3.00 ✗ / 7.01                                        | 14.43 / 1.05 ✗                                       | 3.00 ✗                                   | 2.66 ✗ / 6.28                                       | 18.65 / 18.81               |
| Red       | 4.93 / 4.26 ✗                                        | 1.37 ✗ / 18.41                                       | 4.93                                     | 4.09 ✗ / 3.99 ✗                                     | 17.42 / 19.70               |
| Blue      | 4.57 / 4.59                                          | 1.30 ✗ / 17.96                                       | 4.03                                     | 3.48 ✗ / 4.78                                       | 18.14 / 19.25               |
| Navy      | 6.95 / 3.02 ✗                                        | 1.36 ✗ / 18.81                                       | 6.95                                     | 5.81 / 2.84 ✗                                       | 17.54 / 19.75               |
| Green     | 3.66 ✗ / 5.75                                        | 13.99 / 1.01 ✗                                       | 3.66                                     | 3.19 ✗ / 5.23                                       | 18.32 / 19.10               |
| Pink      | 4.57 / 4.60                                          | 1.30 ✗ / 17.96                                       | 4.57                                     | 3.91 ✗ / 4.24 ✗                                     | 17.97 / 19.37               |

### Ruled by Olcay, the same evening: all four as recommended (`ce6e807`)

1. **CategoryField's label** is `Colors/foreground/0` on React, SwiftUI, Compose and in Figma,
   and so is its clear's cross, a control's glyph held to 3:1. The icon, the border, the wash and
   the count pill keep the category colour. Compose takes the themed token, as the field has no
   surface of its own.
2. **LocationPin's off-floor number** is `Colors/foreground/0` on the white disc on SwiftUI,
   Compose, React and in Figma; the ring keeps the colour.
3. **The category icons** on the tile and the field are decorative: hidden from assistive
   technology on every platform (Compose's gained `clearAndSetSemantics`), marked by the
   painters (`markDecorativeIcon`), and measured apart by the audit, which reports a shortfall
   below 3:1 as an advisory with its reason, never as a failure.
4. **React's pin** is solid in its colour with the fill's ink on the number; off the floor it is
   a hollow outline with the number in the foreground and is no longer dimmed.

The contract records them (`labelColor`, `clearColor`, `iconDecorative`,
`offFloorNumberColor`), and the contract check holds every platform and the painters to them.
The CategoryField clear's hit area followed the same night: a 44 target around the 32 circle on
all three platforms (§5, 5; `701f919`). Code Connect followed on his word, published on all three
platforms (below).

### The run, with build `01f3be6891dc`

`01f3be6891dc` (`bd4afde`) paints exactly as `314962f54832` (`aa876ce`); since then only what the
audit reads and what Apply Text Styles does have changed (the audit of 20:38 and Apply Text
Styles at 21:36, below). Build `ed50a03a1912` drew a translucent token opaque: do not Update
anything on it. Do not run Apply Text Styles on the file as it is, and do not publish the
library until the audit below is clean.

1. **Undo 21:36.** In Figma, File › Show version history: restore the last version saved before
   21:36 on the 21st, after 20:42 if one is listed. That brings back the 9,914 size and leading
   bindings and the 656 sizes exactly. From a version before about 20:35, Button and Badge are
   back on their old drawings too: add them to step 3.
2. Close the plugin and run it again; the header must read **Build 01f3be6891dc**.
3. **Update**, one at a time, never Rebuild, the seventeen not yet run: DirectionStep,
   CategoryField, CategoryTile, LocationPin, ScrollArea, BottomSheet, FileUpload, IconButton,
   SearchBar, BottomNavigation, Slider, NavigationItem; then TreeItem, TreeChildItem,
   TreeParentItem, Tree and Timeline, which now take seconds.

   With no version before 21:36 to restore, run **Update All Core**, then **Update All
   Product / SDK**, instead: a new build restarts both from their first set, and together they
   redraw the 46 sets Apply Text Styles touched — each painter attaches its style and binds the
   size and leading again — as well as the seventeen. The 41 of the 46 outside the seventeen:
   Link, Button, Badge, Counter, Chip, SegmentedControl, Card, List, Table, Breadcrumb, Tabs,
   Pagination, Navbar, Sidebar, Accordion, POICard, MapControlButton, Dialog, Drawer, Menu,
   Popover, Tooltip, Checkbox, Radio, Switch, Input, Search, Select, Textarea, NumberInput,
   MultiSelect, PasswordInput, FormField, DatePicker, DateRangePicker, TimePicker, ColorPicker,
   Alert, Toast, EmptyState, Avatar.

4. **Build Surface QA**, then **Audit Library**. Expected: no warning. The advisories gain three
   from the four replayed sets, 54 if the other thirteen Updates keep theirs: CategoryField's
   host-surface one (it paints no fill of its own now, as ruled) and one each for CategoryTile
   and CategoryField, their category symbols below 3:1 measured as decorative — the tile's 7 (Light: the Default tile's yellow 1.92, orange 2.82 and
   turquoise 3.00, under 3 before rounding; the Selected tile's 1.86, 2.69 and 2.85; Dark: the
   Selected navy 2.94) and the field's 4 (Light: yellow 1.77, orange 2.51, turquoise 2.66;
   Dark: navy 2.84); 64 of 64 Surface QA instances; `pluginBuild` `01f3be6891dc`. An audit
   before a set's Update reads its old drawing: CategoryTile then fails 21 pairs at 1.00, and
   FileUpload reports 32 text nodes without a style — Update FileUpload for that.
5. From the terminal: `pnpm figma:verify`, the REST read-back of the text bindings against the
   Components page as it stood at 20:55, of the washes (layer opacity 0.12, 0.05, 0.2, 0.1,
   0.32, 0.36), and a render of DirectionStep and of a Selected CategoryTile, whose glyph and
   icon the old drawings do not show.

### Code Connect, published on his word

Olcay, late on the 21st: _"go ahead and publish Code Connect too"_. Each round went out from
`claude/pointr-browse-repairs`, clean and pushed, with only `FIGMA_ACCESS_TOKEN` taken from the
main checkout's `.env` and never printed. A publish sends a platform's whole linked set, so every
round re-sent everything, not only the two new sets.

| Round (UTC) | At        | React                    | SwiftUI   | Compose                 |
| ----------- | --------- | ------------------------ | --------- | ----------------------- |
| 16:43–16:44 | `45b06f0` | 116 mappings on 93 nodes | 115 on 94 | 110 on 94               |
| 16:51–16:52 | `9c6687d` | 118 on 95                | 116 on 95 | 111 on 95               |
| 17:09       | `ef1b68b` | 118 on 95                | 116 on 95 | not re-sent (unchanged) |

Reading the first round back found two things, fixed before the next rounds:

1. **Four mappings had never been in the linked configs** (`a534276`). Backdrop's on all three
   platforms and React's Icon were pinned to live nodes (613-4791, 15-2) but missing from the
   three `figma.linked.config.json` files, which are lists: no dry run had validated them, the
   first round did not send them, and the manifest counted them as linked. Backdrop read back
   empty on every platform. `components:contract:check` now fails when a pinned
   `*.figma.{tsx,swift,kt}` is missing from its platform's config or a listed file does not
   exist; against the old configs it names exactly those four.
2. **The import lines** (`ef1b68b`). No config set `importPaths`, so every React snippet imported
   from the mapping file's own relative path (`import { CategoryField } from "./CategoryField"`,
   131 imports over 118 mappings) and no SwiftUI snippet imported anything; `PROJECT_SCOPE.md`
   §6.2 meant them to import the package. The React configs now map `src/components/*` to
   `@kozmos/react` and the SwiftUI config maps `Sources/Components/` to `import Kozmos`; Compose
   already printed each file's package import. The contract check holds both to the package's
   name and the Swift library's, and each assertion fails with its mapping removed.

Compared with what a publish from `main` would send, Dev Mode now also shows CategoryField and
AISearchButton, the tint mappings of CategoryTile, DirectionStep and LocationPin, Backdrop and
React's Icon, and the import lines.

**Read back** through Figma desktop's Dev Mode MCP server (`get_code_connect_map`, read-only), now
`pnpm figma:connect:readback` (`98cb9de`). After the second round every linked node showed a
snippet on every platform: 95 nodes each, 1,760 variant or instance nodes carrying one on each
(SwiftUI's Sidebar failed once and read back whole when asked again). After the third, React's 95
again (1,760, every import `@kozmos/react`), and SwiftUI's CategoryField, Backdrop, Icon and Card
with `import Kozmos`. SwiftUI's whole pass after the third round counted 1,738, 22 fewer than
after the second, and hung in the Compose pass before printing which nodes fell short. Asked again
at 18:51 with Figma brought to the front (in the background it had answered nothing for an hour
and a half), 23 of the 95 nodes answered, 504 snippets, every one with `import Kozmos`, before
Figma's daily limit for the Dev Mode server refused the rest: "Rate limit exceeded, please try
again tomorrow", after some 500 calls in the day. The other 72, and the 22, wait for the limit
to reset: `pnpm figma:connect:readback -- --label SwiftUI` with Figma in front, 95 calls.

**Mind:**

- Publish from this branch, or from `main` after the merge, never from `main` before it: that
  would put back main's older CategoryTile, DirectionStep and LocationPin mappings and drop the
  import lines. CI only dry-runs.
- React's source links point at `main` on GitHub, so CategoryField's and AISearchButton's are
  dead until the merge. SwiftUI's generic components (`KozmosCategoryField<Image>`,
  `KozmosCard<AnyView>`) and every Compose mapping carry no source link; the parsers give none.
- Backdrop's old node, 606-4596, is gone from the file, so nothing is left showing on it.
- EmptyState's and Pagination's React snippets import icons from `lucide-react`, a dependency of
  `@kozmos/react`.

### The audit of 19:00 (build `ed50a03a1912`), and what changed after it

Olcay ran Audit Library at 19:00 with the header on `ed50a03a1912`. Over REST, one set carried
that build: Button. The other 90 carried `c7d1d88351a7` (`414ba00`'s build, the Update All
Core of the morning) and the Tree block's five `dd9f78a05cc0`. So most of the warnings were
the old drawing measured by the new audit, the same as at 14:58: DirectionStep's 28, LocationPin's
18, CategoryTile's 6, CategoryField's 11 and 4, Badge's 3 dark icons. The typography warning of
14:58 (160 issues) was gone because the audit's guess was fixed (`fc3e915`); the file's text did
not change — 11,186 bound size and leading fields and 6,752 styled texts at 14:58, 19:00 and
20:38 alike. (This said "after Apply Text Styles" until the 21:36 read-back below; it had not
run.) Two findings were new, and both were defects in the plugin:

1. **Button's Glass failed in Dark at 1.03** (`aa876ce`). `c28921a` had made `paintFromVariable`
   bind every paint at opacity 1, on the premise that a bound colour carries its own alpha. It
   does not show in this file. Rendered over REST: Backdrop's fill, bound to `Overlay/Scrim` at
   paint opacity 0.502, draws at 128/255, not a quarter; Button's Glass fill, bound to
   `Colors/transparent/inverted/10` at 1, draws opaque — a near-white pill under a near-white
   label in Dark, which is what the audit measured. The paint takes its token's alpha from the
   fallback again, as before `c28921a`; the audit, which reads the paint's opacity, reads what the
   file draws, and its reader says so. Only Button was painted on `ed50a03a1912`, so only Button
   needs its Update again.
2. **Surface QA drew 60 of 64** (`aa876ce`). Its spec asked Slider for
   `State=Default, Status=Default`; Slider has a Type axis, so each of the four panels drew a
   Missing placeholder. The spec names `Type=Single`.

The harness keeps a bound paint's opacity when it equals its token's own alpha (from the
importer's payload, the same in both modes) and drops any other, so a strength laid on a bound
paint still fails the check; that assertion now runs last, over every painter. The painter
check is 224 assertions; against `ed50a03a1912` exactly the five new ones fail: Glass's fill at
1, its bevel at 1, the Dark label at 1.03, Backdrop's scrim at 1, the Slider spec.

Also read: IconButton's icons were bound between 14:58 and 19:00 (their bound stroke fields
went from 90 to 102) while its stamp stayed `c7d1d88351a7`, and the Icons page's 56 sources are
unbound, so the bindings are overrides on the instances. What wrote them is not established; the
Update in the run above rewrites them either way.

### The audit of 20:38 (build `314962f54832`), and what changed after it

Olcay ran Audit Library at 20:38 with the header on `314962f54832`: 5 warnings, 51 advisories.
Over REST two sets carried that build, Button and Badge; the other seventeen of the run's
nineteen still carried `c7d1d88351a7` (twelve) and `dd9f78a05cc0` (the Tree block's five). What
the two Updates showed:

- **Glass is translucent.** Its fill is bound to `Colors/transparent/inverted/10` at paint
  opacity 0.102; rendered over REST it draws (140, 140, 140) at alpha 49, the same pixels as
  IconButton's Glass, which was always right. On `ed50a03a1912` it drew (252, 252, 252) at 255.
  Button's text reads 6.95 in Light and 8.05 in Dark at the least.
- **Badge's dark icons pass**: 6.17, where they read 1.00, 1.61 and 1.00.
- **Surface QA draws 64 of 64**, no issue; its text reads 6.1 or more and its controls 3.08 or
  more.

The five warnings are the four sets not yet updated — DirectionStep's 28, LocationPin's 18,
CategoryTile's 6, CategoryField's 11 and 4 — and two of those drawings are worse than the audit
said. Rendered over REST:

- **DirectionStep draws no glyph**, in any of its 14 types. `c7d1d88351a7` laid the disc's 10 %
  on the bound paint, the file dropped it, and the disc is solid theme blue under a theme-blue
  glyph. The audit's 1.00 was the drawing.
- **CategoryTile's nine Selected tiles draw no icon.** Each square is white under an opaque
  tint, its 5 % lost the same way, and the icon is in that tint. The audit read only a node's
  first fill, so it measured the icon on the white: 1.92, 2.82 and 3.00 for three tints, a pass
  for the other six. These nine squares are the only nodes on the Components page that stack
  two visible solid fills (the Docs page's Selected preview follows its component).

**Replayed without Figma, the Update clears all four.** Each variant is painted by
`c7d1d88351a7`'s painter, then by this build's over the same node, as Update does, and audited in
Light and Dark with the payload's token values. The old drawing alone reproduces the live audit
failure for failure — DirectionStep and CategoryTile with their strengths dropped, CategoryField
with its 12 % kept, LocationPin either way — and after the Update all four read clean:
DirectionStep's glyphs 4.85 in Light and 3.54 in Dark, LocationPin's text 4.57 or more, and the
category symbols as decorative advisories. The painter check now holds this (below).

**Fixed in the audit** (`45e4b0f` and `5639895`, build `53ac76afe679`; no painter changes):

1. **Every fill a node stacks.** The 22 colour reads — backgrounds, text, controls, the Surface
   QA panels — flatten a node's visible solid paints bottom to top, as Figma paints them
   (`visibleSolidPaintsToRgba`); one paint reads as before. On the old CategoryTile drawing the
   audit now fails 21 pairs at 1.00 where it failed 6. `pnpm figma:verify` took a text's
   background from the first fill too; it takes the topmost opaque one.
2. **Every set's text is held to a style.** FileUpload's 32 "Click to upload" labels have had no
   text style since `c7d1d88351a7` — a Medium weight set after the field text style detaches
   it; `fc3e915` fixed the painter — and no audit said so: the rule held a list of 43 sets, and
   40 of the 80 sets with text were outside it (FileUpload, the date, time, colour, number and
   OTP fields, FormField, the overlays, the Product/SDK sets). All are held now, and only
   FileUpload has such text, until its Update. A second rule, for text with neither a style nor
   bound typography, could only fire with the first and said it twice; it is gone.
3. **Glass is measured on purpose.** The contrast audit skipped a variant parsed as Glass, but
   the Label parser, earlier in the chain, claims every name with `State=Default`, so no Button
   reached the skip: Glass was always measured on Surface/0, and that reading caught the 1.03.
   The dead skip would have dropped Glass the day the chain's order changed; it is gone.

The painter check is 242 assertions. On `314962f54832` the three stacked-fill and two typography
assertions fail and nothing else does. A new section paints all 185 variants of the four sets
with the payload's tokens and audits them in both modes: it passes on `314962f54832` (the same
painters) and fails on `c7d1d88351a7` (`git show 414ba00:figma/foundations-importer/code.js`) on
exactly the live failures. A Glass button's label must be measured in both modes; with the
parser chain reordered on the old build, that assertion fails. The wash section reports a
missing layer on an old build instead of stopping the run.

**Not changed, for Olcay:** the focus-ring audit still holds a list of 26 sets. The seven form
sets outside it (NumberInput, OTPInput, DatePicker, DateRangePicker, TimePicker, FileUpload,
ColorPicker) carry fully bound Focus Visible rings and would pass. Interactive sets with no
Focus Visible property at all — Core's Accordion, Breadcrumb, Pagination, BottomNavigation, Menu
and Rating, and Product/SDK sets that draw their own controls, CategoryTile, CategoryField's
clear, AISearchButton, FloorSelector, POIResultCard and RouteOptionCard among them — are a
design decision, not an audit fix.

Also read: the file's `lastModified` moved to 20:42:52Z after the audit with no set's stamp
moving; the token cannot read the version history (403), so what changed is not established.
`pnpm figma:verify` found the structure current and only the two report-only findings of §5, 6.

### Apply Text Styles at 21:36, and the repair

After the audit on `53ac76afe679` named FileUpload's 32 unstyled labels — a warning `45e4b0f`
added — the panel's next step said to run Apply Text Styles, and it ran on the live file at 21:36.
Read back over REST against the Components page as it stood at 20:55:

- **4,957 texts in 46 sets lost their size and leading variables**, 9,914 of the 11,186 bound
  typography fields. Apply Text Styles restyled every text it could guess a style for, and it
  writes a literal size and leading before attaching the style; a literal drops a variable
  binding in Figma.
- **656 texts went from 12/16 to 14/20**: DatePicker's and DateRangePicker's weekdays (in fixed
  cells), FileUpload's description and file meta (its frames grew; 128 boxes moved), and
  ColorPicker's channel, alpha, mode and hex readouts (truncating). The guess called them field
  text; the painters draw them with the meta style.
- FileUpload's 32 browse labels took the label style, the one thing asked for.
- No set's stamp moved and none of the four warned sets' drawings changed: the audit after it read
  the same five warnings, CategoryTile's now 21 as the fixed audit reads its old squares.

That typography had not changed all day before: 11,186 bound fields and 6,752 styled texts at
14:58, 19:00 and 20:38 alike (corrected in the audit of 19:00, above).

**Fixed** (`bd4afde`, build `01f3be6891dc`; no painter changes):

1. Apply Text Styles leaves styled text as its painter drew it, styles only text without a style,
   and binds that text's size and leading back to the variables they had.
2. The guess follows the painters: measured against every styled text as the painters left it at
   20:38, it agrees on all 5,512 it can guess and differs on none, where it differed on 656.
3. The audit's warning for unstyled text and the panel's next step name the set's Update, which
   attaches the style and binds the sizes; neither sends anyone to Apply Text Styles for it.

The harness drops a text's size variable when a literal size is written, as Figma did. The
painter check is 261; on `53ac76afe679` the 15 new assertions fail — the ten guesses, the three
Apply Text Styles outcomes, its styled 12/16 text coming out 14 and unbound as in the file, and
the two remedies — and nothing else does.

**The repair** is step 1 of the run above: restore the version from before 21:36, or, failing
one, the two update sequences, which draw every touched set again. Whether the library was
published after 21:36 cannot be read with this token (403); if it was, publish again once the
audit is clean.
