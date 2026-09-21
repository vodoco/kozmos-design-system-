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
the bindings: 135 assertions. Against the plugin as it was, 70 fail and none crash. It is a
unit test of what a painter writes, not a picture of the file.

## 3. Verified

| Gate                                                        | Result                                                                                                                                                                                                |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm figma:painters:check`                                 | 135 passed on `8c50b97`; 70 failed on `604730c`'s plugin                                                                                                                                              |
| `pnpm components:contract:check`, `pnpm figma:plugin:check` | ok, ok                                                                                                                                                                                                |
| `pnpm figma:stamp:check`                                    | current after each commit (the hook re-stamps: `8d1312c6c6af`)                                                                                                                                        |
| `pnpm figma:verify` against the live file                   | the expected reds: presence 97 expected, 2 missing (CategoryField, AISearchButton); variant drift on CategoryTile, LocationPin and DirectionStep; 0 of 95 sets on the new build — until the run in §4 |
| Code Connect dry runs, React, SwiftUI, Compose              | every file parses; the only failures are `Tint` and `Show Count` not yet on the live sets                                                                                                             |
| `pnpm --filter @kozmos/icons typecheck`                     | ok                                                                                                                                                                                                    |
| `pnpm --filter @kozmos/react typecheck` and `lint`          | ok, ok (the Code Connect files are in the package's source tree); `@kozmos/icons` builds with the four new entries                                                                                    |

## 4. The run in Figma, in order (no importer access from a chat)

1. `pnpm figma:foundations` is committed (`docs/figma-foundations-payload.json`): run **Import
   Foundations** so the 24 category variables exist.
2. **Curated Icons → Update**: imports arrow-up, arrow-down, flip-backward and stars-01 by key.
3. **Update** CategoryTile, LocationPin, DirectionStep, POIDetailPanel, IconButton, then
   BrowseCategoriesPanel (it instances CategoryTile). Update renames the pre-Tint variants in
   place, so the node IDs Code Connect pins survive; never Rebuild.
4. **Build** CategoryField and AISearchButton. Put the node id each log prints into the three
   Code Connect files of each (`node-id=0-0` today) and add the files to
   `figma.linked.config.json`, `packages/ios/figma.linked.config.json` and
   `packages/android/figma.linked.config.json`.
5. From the terminal, with the main checkout's `FIGMA_ACCESS_TOKEN` exported (never printed):
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
5. `⇅` on RoutingInputGroup's swap; a curated shape is needed first.

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
