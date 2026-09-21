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
| CategoryField, AISearchButton had placeholder Code Connect pins                                     | **Pinned** (`9edcbe1`): 1933-9257 and 1933-9270 in the six files and the three linked configs; the dry runs validate on all three platforms. Publishing is Olcay's word.                                                                                                                                                                                                                                                                                                                            |
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
all three platforms (§5, 5; `701f919`). Still his: Code Connect publishing for the two new sets.

### The run, with build `ed50a03a1912`

1. Close the plugin and run it again; the header must read **Build ed50a03a1912**.
2. Not Update All Core: its resume stamps are per build, so a new build starts it again at Link.
   **Update**, one at a time, never Rebuild: DirectionStep, CategoryField, CategoryTile,
   LocationPin, ScrollArea, BottomSheet, FileUpload, Button, IconButton, Badge, SearchBar,
   BottomNavigation, Slider, NavigationItem; then TreeItem, TreeChildItem, TreeParentItem, Tree
   and Timeline, which now take seconds.
3. **Build Surface QA**, then **Audit Library**. Expected: no typography, DirectionStep, Button,
   IconButton, Badge, CategoryField, LocationPin or surface QA warnings; the category icons
   below 3:1 as advisories, not warnings — the tile's and the field's yellow, orange and
   turquoise in Light, the field's navy in Dark.
4. From the terminal: `pnpm figma:verify`, and the REST read-back of the washes (layer opacity
   0.12, 0.05, 0.2, 0.1, 0.32, 0.36).
