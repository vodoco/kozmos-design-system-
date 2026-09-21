# Claude Code handoff — the initial sheet, the category state, the colours, the audit, and the Figma drift (2026-09-21)

For the next chat. Everything below is on disk or in git; nothing depends on this conversation.
Read section 1, then open `docs/initial-sheet-2026-09-20.md` and
`docs/kozmos-pointr-operators-guide-2026-09-20.md`, and you have the whole state.

## 1. Read this first

**What this is.** The Kozmos design system (React, SwiftUI package `Kozmos`, Compose, DTCG
tokens, product contracts) seen through two apps: the Pointr QA app (`apps/PointrPlayground`,
PointrKit 10.3.0, the Boston Logan Design-QA venue, live SDK data) and the fixture playground
(`apps/Playground.swiftpm`). The reference for how screens look is the live prototype
`https://agentic-search-zeta.vercel.app`, driven and measured, never eyeballed.

**Olcay's standing directions, verbatim where it matters.**

- _"Focus on the design system and what is missing — not on making the app most functional."_
- _"No hacks - no cheats - do it properly and perfectly."_ An adversarial self-audit before
  "done"; a green test proves nothing unless it names what you added and failed first.
- Measure, don't eyeball: DOM, bundle, pixels, recordings split into frames.
- Provide everything he needs to change things himself (the operators' guide is that).
- The last word of the 21st, on the SDK's map: _"I only wanted to render simple markers with
  icons that shows the selected pre-defined quick search items. No need to alter fill layers."_

**Rules in force.** Nothing merged; nothing published but Code Connect, on Olcay's word late on
the 21st (`docs/figma-drift-2026-09-21.md` §9); no Cloud content edits; never print, copy or
commit `QAConfig.json`, licence keys or tokens (the main checkout's `.env` holds a Figma token —
never print it); never use the vendor sample's embedded GitHub token; SDK models and parsing stay
in the host, no JavaScript evaluation in native code, never traverse the SDK's private UIKit
subviews; preserve handoff docs before any `/tmp` cleanup; never delete project directories; a
metadata row at most three cells; never label fixture or simulator wayfinding as live
navigation. Git: stage by file, never `git add -A` or a directory, never bare `git stash`;
commit messages end with the attribution the session's system reminder gives (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` at the end of the 21st); ask before a
push to a new branch (pushes to this branch were authorised and are the practice).

### Exact working state

| What                   | Where / value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Worktree               | `/private/tmp/kozmos-browser-compat.uqPMBD` (a git worktree of `/Volumes/4TB Depo/development/K/kozmos-design-system-dev`; the main checkout stays on `main`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Branch                 | `claude/pointr-browse-repairs`, pushed to `origin`, **nothing merged**. `98cb9de` is the last change commit (the Code Connect readback, after `ef1b68b`, the snippets' imports, and `a534276`, the linked configs; before them `701f919`, the clear's 44 target, after `ce6e807`, Olcay's four rulings on the category colours); plugin build **`ed50a03a1912`**. After `414ba00` (the Figma drift, its audit, the re-tint fix): the panel's progress line `fdb88cc`, Backdrop's pins `dd37134`, washes as layers `e070cef`, the typography guess `fc3e915`, then from Olcay's second audit (14:58) the Icons-first lookup that ends the Tree stall and the build in the panel and the report `50ba616`, dark-mode icon binding `3b1d226`, Code Connect pins for CategoryField and AISearchButton `9edcbe1`, layout sizing Figma accepts `07a28e7`, the audit reading content on its wash `c28921a` (`docs/figma-drift-2026-09-21.md` §9), and the four rulings `ce6e807`; `2dbd440` regenerated the variant gap analysis, stale since the 17th; then Code Connect, published on Olcay's word on all three platforms: Backdrop and React's Icon into the linked configs with a gate `a534276`, the contract check's formatting `9c6687d`, the snippets' imports `ef1b68b`, `pnpm figma:connect:readback` `98cb9de` (drift §9) |
| Commits since the 20th | 27 from `e2d5afd`: the category-state batch `7598786`…`5631b3f`; the tile batch `07aba83`…`4880f35`; the colours batch `bb13a15`…`6b58c87`; the audit batch `537a4cb`…`5d1760a`; the fill correction `8ac3616` + `52ab955`; the evening's Figma drift `c9a2f31`, `184ad22`, `6006614`, `8c50b97`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Tree                   | clean                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Gates, all green       | iOS package 130 tests on iOS 26.5 (the button image snapshots skipped there, as CI does), 132 on iOS 18.4, 91 on macOS; CI's simulator step 52; the playground builds; the QA app's unit tests 48+8+8, both UI tests; web 548 unit tests, lint, typecheck, search-sheet 6/6 and map-sheet on chromium, firefox and webkit, navigation 20/20, poi-details (its two webkit dark-1280 stories time out on `page.goto` only when the machine is under full load, and pass alone every time); Android every Paparazzi golden verified + unit tests; contract parity, classes, owned CSS, raw values, contrast (218 pairs), motion parity, snippets, docs typecheck; and from the evening, `pnpm figma:painters:check` 149 (81 red on the plugin as it was), `figma:plugin:check`, `figma:stamp:check`, the Code Connect dry runs on three platforms parsing, `@kozmos/icons` typecheck and build, the React package's typecheck and lint after the Code Connect files; at the end of the 21st, contract parity with the linked-config and import gates, and the Code Connect dry runs at 95 nodes on each platform                                                                                                                                                                                                                 |
| Ignored files there    | `apps/PointrPlayground/.local/PointrKit.xcframework` (the SDK; its `Modules/…swiftinterface` and `Headers/` are the API reference), `apps/PointrPlayground/QAConfig.json` (0600), the generated `KozmosPointrQA.xcodeproj` — ask before any cleanup, preserve first                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Simulators             | iPhone 17 Pro `51937B59-CEAE-4BC7-BC34-FEB17E28FAE7` (iOS 26.5; **English since the evening of the 21st** — `AppleLanguages (en-GB)`, `AppleLocale en_GB`, reset on Olcay's word and read back; it was Arabic-first, `(ar, en-GB)`, until then); iPad Pro 11 `1CB35135-48B2-407B-8515-C8C6EFC1D963` (app unit tests); iPhone 16 iOS 18.4 (package tests, button baselines)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

## 2. What Olcay asked for on the 20th and 21st, and what was done

In order, each measured against the prototype and closed with proofs on all three platforms.

1. **The initial sheet, analysed and rebuilt** (`docs/pointr-prototype-initial-sheet-2026-09-20.md`,
   then `docs/initial-sheet-2026-09-20.md` §1–4). The prototype's sheet driven state by state:
   detents 20 / 54 / 94 % of the frame, the whole sheet drags with a scroll handoff (content
   scrolls only at the largest detent, a downward drag empties the scroll first), an anchored
   peek the content marks (`.collapsed` = the first row's bottom + 16, within 24–72 %), snap by
   distance, no velocity. Built on iOS (`KozmosPanelScrollView`, `KozmosSheetPanCatcher`,
   `.kozmosPanelPeekAnchor()`), web (`panel-detents.ts`, pointer capture, `touch-action`) and
   Compose (`PanelDetents.kt`, `draggable` + `NestedScrollConnection`, an alignment line).
2. **Tiles aligned at the top; the AI ring animated in place** (a 48 circle, a 2.5 band on a 43
   disc, the prototype's rainbow from the six data colours, 3.6 s a turn, Reduce Motion
   respected).
3. **The shells run edge to edge** (map under the status bar and home indicator; the sheet's
   surface to the bottom; chrome and content keep the safe areas; `.ignoresSafeArea(.container)`
   keeps the keyboard avoidance).
4. **Transitions between states.** There were no motion tokens: `Semantics.Motion` now has
   `duration.{quick 150, standard 280, deliberate 460}` and `easing.{standard, emphasised}`,
   emitted as `KozmosMotion.swift/.kt` and CSS variables, `pnpm tokens:motion:check`;
   `KozmosTransitions` (pop, reveal, crossfade) on each platform; the iOS sheet animates a
   host-set detent **keyed on the detent, never on the height** (keyed on the height it eased the
   peek's measurement too and the render tests read a mid-motion frame). The prototype's own row
   switches are instant — the animation is Olcay's ask.
5. **The quick-access words** from `taxonomy.json` 10.12.0 (`alsoKnownAs` + `displayName`,
   `scripts/sync-ios-quick-access.mjs` → vendored terms), matched by phrase; the chosen category is
   `CategoryField` / `KozmosCategoryField` (48 tall, the category's colour) on all three.
6. **Counts and empty tiles** (`docs/initial-sheet-2026-09-20.md`, "Olcay's tile rulings"): a
   tile's count is the system's `Counter` at the icon square's top-right, 4 beyond its edges
   (web `-right-[5px]`: an absolute offset counts from inside the 1px border); the spoken form is
   never drawn; a tile without a place leaves the grid; **no Filters button** ("the AI handles all
   filters").
7. **The AI companion, assessed, not built.** On-device Apple Intelligence is iOS 26's Foundation
   Models framework (`SystemLanguageModel`, `LanguageModelSession`, `@Generable`, tools);
   `scripts/check-foundation-models.swift` compiles and runs on this Mac and answers
   `appleIntelligenceNotEnabled` — Olcay's System Settings switch. Taxonomy 10.12.0 has no vegan
   type; the site's 1196 places carry five tag words, all the cell phone lot's. The prototype's
   AI flow is measured in `docs/pointr-prototype-ai-companion-2026-09-21.md` (a full-page
   Assistant, ten regexes and canned sentences, cards in the chat that never alter the results).
8. **Each category in its colour; markers on the map; the POI card on the sheet; site-wide
   results** (the "colours, pins, card surface and site-wide" section): `CategoryTile`,
   `LocationPin`, `CategoryField` take a category tint, `Counter` a fill,
   `BrowseCategoriesPanel` a tint per category; the POI panel paints no surface in a sheet; the
   session's places are the site's (`pois(for: building.site)`: 1196, where a building gave 210
   or 306); the map follows a chosen category to its first place's level.
9. **The audit** ("The audit of the 21st"): ten findings, fixed — digits on a fill went black in
   dark mode and white fails contrast on half the palette, so a fill carries its ink; the tiles
   wore the chart palette, so the taxonomy's eight colours are `Semantics.Category` tokens; the
   web panel had never received its tint callback; the SDK's markers were measured three ways;
   the selection's stroke, the POI panel's inset blocks, stories, notes and the contract followed.
10. **The fill correction.** The per-place SDK style kept for a rounder marker painted every
    room's fill black. Removed: a chosen category's places show through `poisToShow` alone, the
    SDK's own icon markers, no fill layer touched.
11. **The Figma drift** (the evening; `docs/figma-drift-2026-09-21.md`). The importer had not
    changed since the 14th. Now: the manifests regenerated; a `Tint` axis (Theme + the taxonomy's
    eight) on CategoryTile, LocationPin and the new CategoryField set, each binding the category
    tokens; the tile on the 20th's geometry with its nested Counter; the panel's grid of eight
    live tiles; the POI panel surfaceless in a sheet; IconButton large 48; DirectionStep's
    fourteen cases as curated icons; the new AISearchButton set with its bound conic gradient;
    the library's typed glyphs drawn as icons; four icons curated. Painters are measured without
    Figma (`pnpm figma:painters:check`, 135). Code Connect follows on three platforms. The run in
    Figma is Olcay's (§4 of the stage doc); the file still shows the old sets until then.

## 3. The design system as it stands (the parts touched)

### Tokens (`packages/tokens/src/tokens*.json`, built by `pnpm tokens:build`)

- `Semantics.Motion.duration.{quick, standard, deliberate}` (150 / 280 / 460 ms),
  `easing.{standard, emphasised}` — `KozmosMotion` on iOS and Compose, CSS variables on the web.
- `Semantics.Category.Accent.{Yellow, Orange, Turquoise, Red, Blue, Navy, Green, Pink}` — the
  taxonomy's quick-access colours, measured from the published 10.12.0 sprite atlas's
  `-section` markers, identical in the light and dark themes: `#F9AC17 #E5801A #37A4A4 #D92626
#2080DF #4D4DB2 #339933 #B24DB2`.
- `Semantics.Category.Fill.*` — the accent, except blue darkened 7 % to `#1E77CF` (no ink
  reaches 4.5:1 on the accent itself). `Semantics.Category.OnFill.*` — the ink on that fill:
  white on red, navy, pink and blue; the dark ink `#17191C` on yellow, orange, turquoise and
  green. `scripts/check-token-contrast.mjs` holds the eight pairs to 4.5:1.
- Generated names: Swift and Kotlin `semanticsCategoryAccentRed`, `semanticsCategoryFillRed`,
  `semanticsCategoryOnfillRed` (one capital); CSS `--semantics-category-on-fill-red`.
- The generated `KozmosColors.swift` and `KozmosColors(Dark).kt` are copied into the packages
  by hand after a build; the web reads `packages/tokens/dist/css/variables-*.css` at build.

### Value types

- iOS `KozmosInkedFill(fill:ink:)`, `KozmosCategoryTint(accent:fill:)`; web
  `CategoryTint { accent, fill, onFill }` (exported from `CategoryTile`); Compose
  `KozmosInkedFill(fill, ink)`, `KozmosCategoryTint(accent, fill)`.

### Parts and their new parameters

| Part                     | iOS                                                                                       | Web                                                     | Compose                                                     | Behaviour                                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Counter`                | `fill: KozmosInkedFill?`                                                                  | `style` (the tile passes `backgroundColor` and `color`) | `fill: KozmosInkedFill?`                                    | The fill over the tone's and the emotion's, with its ink.                                                                                              |
| `CategoryTile`           | `tint: KozmosCategoryTint?`                                                               | `tint?: CategoryTint`                                   | `tint: KozmosCategoryTint?` (before the trailing `icon`)    | Accent on the icon and the selection's stroke; the inked fill on the counter at the square's top-right (4 beyond its edges); the square stays neutral. |
| `BrowseCategoriesPanel`  | `tint: (KozmosCategoryPresentation) -> KozmosCategoryTint?`                               | `tint?: (category) => CategoryTint \| undefined`        | `tint: (KozmosCategoryPresentation) -> KozmosCategoryTint?` | A tint per category, as `renderIcon` gives an icon.                                                                                                    |
| `LocationPin`            | `tint: KozmosCategoryTint?`                                                               | `tint?: CategoryTint`                                   | `tint: KozmosCategoryTint?`                                 | The fill is the marker, its ink the number; a featured pin keeps the alert colour.                                                                     |
| `CategoryField`          | `tint: KozmosCategoryTint` (default: the theme's, the themed button's fill), `countLabel` | `tint?: CategoryTint`                                   | `tint: KozmosCategoryTint`                                  | 48 tall; the accent on icon, label and 1px border, at 12 % behind; the inked fill on the 22 count pill; a 32 clear.                                    |
| `POIDetailPanel`         | `presentation: .sheet`                                                                    | `presentation="sheet"`                                  | `KozmosPOIDetailPanelPresentation.Sheet`                    | Paints no surface, border or shadow of its own in a sheet; its inset blocks (restrictions, message, logo, media) turn white on the sheet's grey.       |
| `POIMediaGallery` (iOS)  | `surface: Color`                                                                          | —                                                       | —                                                           | The tile's surface behind an image or its placeholder.                                                                                                 |
| `IconButton`             | `.lg` = 48                                                                                | `lg` = 48                                               | `Lg` = 48                                                   | The prototype's Filters/AI size; a decision for Olcay if 44 was wanted everywhere.                                                                     |
| `AdaptiveMapShell` (all) | detents 20/54/94, drag anywhere, anchored peek, edge to edge, standard motion             | same                                                    | same                                                        | See §1–2 of the stage doc.                                                                                                                             |

The contract (`packages/tokens/src/component-contracts.json`) names `categoryTile` (square 64,
counter overhang 4, tint), `locationPin` (sizes, tint), `poiDetailPanel` (sheet surface none),
`counter.fill`, `iconButton.sizes.large`; `pnpm components:contract:check` reads each platform's
source for them and fails when a value or a string drifts (proven: overhang 5 fails the React
assertion).

## 4. The QA app as it stands (`apps/PointrPlayground`)

- **Places are the site's**: `SDKSession.refreshPOIs()` reads `pois(for: building.site)`; the
  SDK delivers in steps and calls `onPoiManagerChangedPois` / `onDataManagerReady` /
  `mapDidEndLoading`, each refreshing.
- **Tiles**: `QuickAccess.tiles` (two personal + the taxonomy's sixteen), counted in one pass
  (`QuickAccess.counts(of:places:)`), shown only with a place (`SDKSession.visibleTiles`), each
  in its category's colours (`QuickAccessCategory.Tint` = the taxonomy's eight names, mapped
  by `Tint.kozmos` onto the category tokens; the personal tiles wear the theme's). Every tile
  shows until the places are counted; 12 of 18 have places at Boston Logan.
- **A chosen tile**: the field becomes `KozmosCategoryField` in the category's colours; the list
  is the category's places site-wide (each row says floor and building); the map shows those
  places alone through `poisToShow` — the SDK's own icon markers, in the SDK's palette — and
  follows to the first place's level when none is on the level shown. **No `updatePoiStyles`,
  no `PTRMapMarker`.**
- **No Filters button.** The AI button is drawn and does nothing yet.
- The `QA-DATA` log lines list the venue's distinct tags and keywords once per load; the
  routing flow and the browse sheet are driven by `KozmosPointrQAUI` (both pass).

## 5. The SDK, learned the hard way (PointrKit 10.3.0)

- `poisToShow` / `poisToHide` filter the SDK's own POI markers; that is the whole marker story.
- `PTRMapMarker(view:position:reuseIdentifier:)` through `addMarkers` **draws nothing** — a
  hosted SwiftUI pin, a rendered `UIImageView`, before or after a level switch, one reuse
  identifier each. `showQuickAccessPois(_:)` draws numbered theme-blue pins at any zoom.
  `PTRPoiMapStyle(poi:image:…)` through `updatePoiStyles` ignores the image, gives a rounder
  marker, and **paints the place's polygon fill black** — plain on a room, invisible on a gate.
  Never restyle.
- The camera has `focusPoi(_:shouldZoom:)` and `zoomToCoordinate(_:)`, no fit-to-many;
  `showLevel(_:shouldZoomToLevel:)` shows a level.
- The SDK's sprite atlas carries two palettes: per-type bubbles (boarding-gate `#ECA71E`,
  restroom `#1D95EC`) and quick-access sections (the eight colours the tokens carry). A tile
  and its chip match each other exactly; the map's marker is the SDK's own — a note for Pointr.

## 6. How to run everything (the operators' guide has each command in full)

- iOS package: `xcodebuild -scheme Kozmos -destination "platform=iOS Simulator,id=<iPhone 17 Pro>" -derivedDataPath /tmp/kozmos-ios-poi-tests CODE_SIGNING_ALLOWED=NO -skip-testing:KozmosTests/KozmosButtonImageSnapshotTests test` in `packages/ios`; the same on `name=iPhone 16,OS=18.4` without the skip; `swift test` on macOS.
- QA app: `xcodegen generate` after adding files (or a UI test runs 0 tests); build, install
  and launch with `xcrun simctl`; unit tests on the iPad; the UI tests with
  `TEST_RUNNER_KOZMOS_QA_DESTINATION="Airport Shuttles" TEST_RUNNER_KOZMOS_QA_ORIGIN="Dunkin"` on the
  `KozmosPointrQAUI` scheme.
- Web: `pnpm --filter '@kozmos/react...' build`, `pnpm --filter @kozmos/docs build-storybook`,
  serve `apps/docs/storybook-static` on 127.0.0.1:6012, then `STORYBOOK_URL=http://127.0.0.1:6012
ADAPTIVE_BROWSER=<chromium|firefox|webkit> pnpm test:search-sheet` (and `test:map-sheet`,
  `test:poi-details`), `pnpm test:navigation`, `pnpm components:classes:check` (refuses a stale
  `dist/style.css`), `pnpm test:owned-css`, vitest, eslint, tsc.
- Android: `ANDROID_HOME="$HOME/Library/Android/sdk" ./gradlew --no-daemon -q verifyPaparazziDebug`
  and `testDebugUnitTest` in `packages/android`; `recordPaparazziDebug --tests "*Name*"` to
  re-record one golden, then verify, then measure the PNG.
- Tokens: `pnpm tokens:build`, copy the three generated colour files, `pnpm tokens:contrast:check`,
  `tokens:raw:check`, `tokens:motion:check`; `pnpm components:contract:check`.
- Measuring: `simctl recordVideo` split into frames by the AVFoundation tool in the session's
  scratchpad (its source is in the guide); the sprite atlas from the browser pane (the snippet is
  in the guide); Playwright checks measure the DOM; Paparazzi goldens are measured with PIL.

## 7. Decisions still Olcay's

- **Ruled on the 21st, evening:** the personal tiles leave the grid while empty, as built; the
  icon button's large size stays 48; the iPhone 17 Pro simulator is English.
- **Ruled on the 21st, late:** the CategoryField's clear is a 32 circle in a 44 target on all
  three platforms, as the search bar's clear beside it (`701f919`); the trailing padding is 2,
  so the circle stays 8 from the edge, and Compose's clear, which had floated inward, sits at
  the edge.
- **Ruled on the 21st, late, all four as recommended** (`ce6e807`; numbers in
  `docs/figma-drift-2026-09-21.md` §9): CategoryField's name and its clear's cross are
  `Colors/foreground/0`; LocationPin's off-floor number is `Colors/foreground/0` on the white
  disc; the category icons on the tile and the field are decorative, hidden from assistive
  technology and reported by the Figma audit as advisories; React's pin is solid, and hollow
  with a foreground number off the floor. Code Connect he gave the word for the same night; it
  is published on all three platforms (drift §9).
- The AI companion: the device floor (iOS 26 on Apple Intelligence-capable iPhones), Apple
  Intelligence on in his Mac's System Settings for the simulators, and the companion surface the
  DS lacks (the prototype's chat is measured).

## 8. Open, in order

1. **The run in Figma** with build `ed50a03a1912` (`docs/figma-drift-2026-09-21.md` §9): relaunch
   and read the build in the panel's header; Update, one at a time, the nineteen sets listed
   there (not Update All Core, which a new build restarts at Link); Build Surface QA; Audit
   Library; then `pnpm figma:verify` and the REST read-back of the washes. The §4 steps before
   it are done. Code Connect is published (drift §9); publish again only from this branch or
   from `main` after the merge, then `pnpm figma:connect:readback` with Figma in front. Still to
   read back: 72 of SwiftUI's 95 nodes, refused by Figma's daily Dev Mode limit on the 21st —
   `pnpm figma:connect:readback -- --label SwiftUI` once it resets.
2. **The Figma remainder** (stage doc §5): `Surface` and its axis on five sets; ManoeuvreCard,
   Itinerary and RouteProgressRail as sets; the shell's phone sheet (a decision); the 15th–19th
   drift — Tag's and Counter's `emotion`, MapControlButton's axes, the POI panel's anatomy; `⇅`.
3. The prototype's rubber band on the sheet is not drawn; Firefox ignores `pan-down`.
4. Chromatic (a CI secret, Olcay's) and Android on the `pointr-a16` or `outdoor3d` emulator
   (`apps/playground-android`) not run.
5. The earlier handoff's items F (search and selection lifecycle), G (floor correctness) and
   Pass 4; MAP-595 is parked and complete.
6. A note for Pointr: the SDK draws no host view on its map and its two marker palettes differ.

## 9. Traps met today (all in the guide's list, with the fix for each)

A Python patch that asserts halfway leaves earlier files written and later ones untouched — read
each patch's own print, and grep a test's name in the log before calling a run green. A
prettier-reflowed anchor needs a whitespace-tolerant pattern. A Kotlin trailing lambda binds to
the last parameter; a blind edit of a Kotlin signature with a function-type parameter finds the
wrong `)`. `RenderedPixels.render` centres a short view (pin it with a `Spacer`); a pin's fill
measures 28 inside its 32; a capsule's bounding box includes its corners. An absolute web offset
counts from inside the border. A fast second `git add` after a hook-run commit can hit
`index.lock`. A "harmless" SDK side effect shows only on the kind of place you did not test —
test a room and a point.

From the second audit: a search of the pages in order walks the whole Components page before
Icons, so read a component's own page first; a new build restarts Update All Core, so update the
changed sets; a pasted report is evidence about its own build (`pluginBuild`, and the panel's
header); an unbound paint equal to a token's light value does not follow the mode; HUG takes
only an auto-layout frame or text, FILL only after the append; a bound paint's own opacity was
kept on one set and lost on three, so translucency lives on layer opacity; zsh does not split
an unquoted `$VAR`.

From the Code Connect publish: the linked configs are lists, not globs, so a mapping left off is
never validated or sent while the dry run still says every file is valid (the contract check
now refuses it); a publish reports what it sent, so read Dev Mode back; Figma's Dev Mode server
answers nothing while Figma sits in the background (an hour and a half, until it was brought to
the front) and has a daily limit per account (some 500 calls on the 21st), and the readback now
times out and stops at the first refusal; the worktree's publish scripts look for `.env` above the worktree and
find none, so export only `FIGMA_ACCESS_TOKEN` from the main checkout's.

## 10. The documents

| Document                                            | What it holds                                                                                         |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `docs/initial-sheet-2026-09-20.md`                  | The stage report: the rules, the proofs, every number, the audit, the "change it yourself" table      |
| `docs/kozmos-pointr-operators-guide-2026-09-20.md`  | Every command, gate, procedure and trap                                                               |
| `docs/pointr-prototype-initial-sheet-2026-09-20.md` | The prototype's sheet, driven (`scripts/measure-prototype-sheet.cjs`)                                 |
| `docs/pointr-prototype-ai-companion-2026-09-21.md`  | The prototype's AI flow, driven (`scripts/measure-prototype-ai.cjs`)                                  |
| `docs/figma-drift-2026-09-21.md`                    | The Figma drift: the inventory, the Tint model, the sets, the harness, the run in Figma, what is left |
| `docs/pointr-prototype-screen-states-2026-09-20.md` | The prototype's static measurements                                                                   |
| `docs/ds-handoff.md`                                | The running log, its 2026-09-21 entry the latest                                                      |
| `docs/claude-code-handoff-2026-09-19.md`            | The previous handoff (items F, G, Pass 4 live there)                                                  |

## 11. To resume in a new chat

1. `cd /private/tmp/kozmos-browser-compat.uqPMBD && git status && git log --oneline -8` — expect a
   clean tree with `98cb9de` as the last change commit on `claude/pointr-browse-repairs`. If the worktree is gone, check it
   out again from `origin/claude/pointr-browse-repairs`; the SDK frameworks and `QAConfig.json`
   must then be restored from Olcay (they are ignored files, never in git).
2. Read `docs/initial-sheet-2026-09-20.md` (its last three sections first) and the guide.
3. Run one gate per platform before touching anything, so the first red is yours;
   `pnpm figma:painters:check` is the Figma side's.
4. §8 item 1 is Olcay's run in Figma; ask whether it has happened, then take §8 item 2 or
   whatever he names.
