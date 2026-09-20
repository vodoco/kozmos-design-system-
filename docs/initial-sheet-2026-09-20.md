# The initial sheet, built: detents, a drag anywhere, an anchored peek, the QA app's tiles — 20 September 2026

Olcay's four rulings on the night of the 20th, after
[the prototype's initial sheet was driven and measured](pointr-prototype-initial-sheet-2026-09-20.md):
re-base the shell's named detents to the prototype's 20 / 54 / 94 % on all three platforms;
make the whole sheet drag with the prototype's scroll handoff, on all three, iOS first; let the
sheet's content mark the row its smallest detent rests on; and give the QA app the taxonomy's
aviation quick-access tiles, a tile searching the SDK's places by words until the SDK exposes a
place's type. All four are built. Branch `claude/pointr-browse-repairs`, worktree
`/private/tmp/kozmos-browser-compat.uqPMBD`.

## 1. The shells

The rule is one on all three platforms, and the prototype's, driven
([§1–§2 there](pointr-prototype-initial-sheet-2026-09-20.md)):

- **Detents.** Collapsed is a fifth of the shell (never under 112 pt, never over 40 % of a short
  shell), medium 54 %, large 94 %; a fraction is clamped to 12–94 %; the content detent fits the
  content between collapsed and large and reads as medium until measured. **An anchored peek:**
  when the content marks a row, collapsed is that row's bottom edge plus 16, within a quarter and
  three quarters of the shell — the prototype's place card resting on its header and Go.
- **The drag.** The whole sheet drags. What a drag does is decided once, at its first move past
  6 px: a drag that starts on the handle is the handle's (iOS, which keeps the handle's tap-cycle);
  a move more sideways than vertical is the content's; at the largest detent an upward drag scrolls
  the content and a downward one scrolls it back to its top before the sheet moves; below the
  largest detent every vertical drag moves the sheet. The content scrolls only at the largest
  detent. A release snaps to the nearest detent, the flick's velocity counted (the shells' own
  improvement on the prototype's distance-only rule); a tap that ends a drag is swallowed.
- **The handle** stays: a 16 tall row with a 40 × 4 capsule; a tap cycles the detents; it is an
  adjustable control for assistive technology on every platform.

| Platform | Where                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iOS      | `KozmosMapPanelDetent.height(in:)` re-based; `anchoredCollapsedHeight`; `KozmosPanelScrollView` (a scroll view the shell disables below the largest detent and reads the offset of, through `kozmosPanelScrollEnabled` and a preference; it runs under the home indicator as a scroll view should); `View.kozmosPanelPeekAnchor()` (an anchor preference the sheet resolves in its own space); `KozmosPanelDragKind.decide` (the pure rule); `KozmosSheetPanCatcher`, a UIKit pan recogniser on the hosting view that begins only for a drag the rule gives the sheet and, by beginning, cancels the touches of the tile the drag started on — SwiftUI's own drag cannot fail on a rule or cancel a button's touch, and disabling the content mid-touch cancels the drag itself (both tried, live); on macOS the SwiftUI drag stays |
| Web      | `panel-detents.ts` (`PanelDetent`, `panelDetentHeight`, `orderPanelDetents`, `nearestPanelDetent`, `decidePanelDrag`); the shell's `panelDetents` / `panelDetent` / `defaultPanelDetent` / `onPanelDetentChange`; pointer events on the `<aside>` with capture; the content scroller's `overflow-y` and `touch-action` (`none` below large; `pan-down` at the list's top, `pan-y` once scrolled); `panelPeekAnchorProps`; the handle as a `slider`; `.kozmos-map-sheet` eases 280 ms                                                                                                                                                                                                                                                                                                                                                |
| Compose  | `PanelDetents.kt` (`KozmosMapPanelDetent`, `height`, `orderPanelDetents`, `nearestPanelDetent`, `decidePanelDrag`); the shell's `panelDetents` / `panelDetent` / `onPanelDetentChange`; `draggable` on the sheet plus a `NestedScrollConnection` (a child scrolling up grows the sheet first; a child at its top hands a downward drag back); `Modifier.kozmosPanelPeekAnchor()` as an alignment line the sheet's own `Layout` reads in the same frame                                                                                                                                                                                                                                                                                                                                                                              |

The web's controls no longer reserve height under the sheet: the largest detent is reachable with
controls shown, as the prototype's full is; the sheet still never covers a top bar. The web's
default changed from one 48 % panel to the three detents resting at medium; `panelFraction` and
`panelSizing="content"` remain as single-detent shorthands. The Compose default changed from
"as tall as its content up to 64 %" to the same three detents; the content detent is offered
explicitly where that was wanted.

## 2. The parts

- `POIDetailPanel` (iOS) scrolls in a `KozmosPanelScrollView` and marks its action strip as the
  peek anchor: in a sheet, collapsed shows the header, the location and Go.
- `BrowseCategoriesPanel` (iOS) gains `presentation: .sheet` — no surface and no rule of its own
  inside the shell's sheet — scrolls its grid in a `KozmosPanelScrollView`, and sets its rows 12
  apart as the prototype's are (columns stay 8).
- `SearchBar` (iOS) takes a `focused:` binding, so a host can open the sheet when the field is
  tapped and end the search from a Cancel of its own.
- `AISearchButton` (all three) is the prototype's 48 circle: its gradient ring a band two and a
  half wide around a 43 white disc, nothing outside the button. It had been a 66 ring around a 44
  disc — an 11-wide collar, from a wrong first reading of the prototype — which also made the
  search row 66 tall and pushed the tiles down; Olcay called it thick, the prototype was
  re-measured by DOM and pixels (ring 48, disc inset 2.5, spin 3.6 s), and the iOS render test
  asserting the thin band failed against the collar first.
- The category grid aligns its cells at the top on iOS (`GridItem(alignment: .top)`): a one-line
  label beside a two-line one kept its square half a line lower, as Olcay saw in the first
  screenshot. A render test with "Gates" beside "Entrances & Exits" failed against the old grid and
  passes now; the web's grid and Compose's already aligned at the top, and `pnpm test:search-sheet`
  measures the web's row on three engines.
- The AI search ring's gradient turns in place, the prototype's 3.6 seconds a turn, on all three
  platforms, at Olcay's ask: SwiftUI's `rotationEffect` under `repeatForever`, still under Reduce
  Motion; a CSS keyframe on `.kozmos-ai-search-ring`, `none` under `prefers-reduced-motion`
  (measured by the same check, on three engines, with reduced motion emulated); Compose's
  `rememberInfiniteTransition`, still when the system's animator scale is off. Paparazzi and the
  iOS render tests see the first frame, so the goldens hold; on the iPhone two screenshots half a
  second apart show the ring's hues moved and the field beside it unchanged.

### The shells run edge to edge

Olcay, on the QA app: _"the map and bottom sheet should expand to the edges. not cut off."_ The
shell had laid the map out inside the safe areas — a band under the status bar — and the sheet's
content stopped above the home indicator. Now, on all three platforms, the map runs under the
status bar and the home indicator and the sheet's surface reaches the bottom edge, while the
chrome keeps the safe areas: the top bar and the controls sit inside them, a floating panel keeps
them around it, and the sheet's content keeps the bottom and side ones — a summary above the home
indicator, a `KozmosPanelScrollView` running under it with its content inset. The detents are
shares of the whole height, as the prototype's are of its frame. The camera's reported insets keep
the safe areas the map now runs under.

- iOS: an outer reader takes the safe areas, the shell ignores them, and `KozmosSheetSafeArea`
  gives the sheet's content its own. Two render tests inside a simulated 59 / 34 device failed
  against the old shell first: the map's red at the very top, the sheet a fifth of the whole
  height with its surface at the edge and plain content 34 above it, scrolling content under it.
- Web: the device's `env()` safe areas are `chromeInsets` to the layout resolver — the map is the
  whole shell, the floating panel and the top bar keep them, the sheet's content pads by them —
  while the host's `safeAreaInsets` (a keyboard) stay exclusions the map keeps out of. Tested on
  the resolver.
- Compose: the chrome and the sheet's content take `WindowInsets.safeDrawing`, the map does not;
  an activity that calls `enableEdgeToEdge()` shows it, a padded one loses nothing. Paparazzi has
  no insets, so the goldens hold.

### Olcay's four points on the category state (the 21st)

_"The transition between component states are instant"; "check taxonomy.json for quick access
search"; "check the prototype for the AI search button"; "observe the quick access search states
when the user chooses one."_ Measured first, then built:

- **The prototype's own row switches are instant** — its field wrap and Cancel carry no
  transition; only its sheet (280 ms), its chip colours (180 ms), its field's border (150 ms) and
  its AI dock (460 ms) move. The animation is a design decision beyond it, and the system had no
  motion tokens to make it with: `Semantics.Motion` held only an enter/exit scale and two slide
  lengths. Now it holds **three durations** — quick 150 ms, standard 280 ms, deliberate 460 ms —
  and **two easings** — standard `cubic-bezier(0.4, 0, 0.2, 1)`, emphasised
  `cubic-bezier(0.34, 1.56, 0.64, 1)` — the prototype's own curves, emitted natively as
  `KozmosMotion` for iOS and Compose and as CSS variables, held together by
  `pnpm tokens:motion:check`. On them, three transitions on each platform (`KozmosTransitions`,
  `.kozmos-pop` / `-reveal` / `-crossfade`): a part taking another's place pops (from 90 %, a little
  left, fading in — the prototype's chip keyframe), a control appearing beside another reveals, and
  content replacing content crossfades. The sheets snap between detents on the standard motion
  instead of their own spring; the search bar's clear circle comes on the quick one; the QA app's
  row and what follows it animate on the standard one through every form. The iOS shell also
  animates a detent a host sets — the field's focus opening the sheet — as it animates a snap,
  keyed on the detent rather than on the height: an animation keyed on the height also eased the
  anchored peek's measurement into place, and the peek render tests caught it in a mid-motion
  frame (103 for 136) before the key changed. The web's transition and Compose's
  `animateDpAsState` already did. Measured on the iPhone from a screen recording split into
  frames with AVFoundation: after the tap, the field's right edge eased from 330 to 242 over
  eight successive frames, and the sheet's top rose from 705 to 58 pt over seven — 1112, 673,
  423, 282, 208, 178, 175 px at 3× — where each had been one frame's jump.
- **The icon button's large size is 48**, the prototype's Filters and AI search beside a 44 field;
  it had been 44 like the others (the web's `lg` changed nothing at all). The component contract
  names it, the check holds all three platforms to it, and the QA app's Filters uses it. A decision
  for Olcay if 44 was wanted everywhere.
- **The taxonomy's words.** `taxonomy.json` carries, per type, a `displayName` and an
  `alsoKnownAs` list — a boarding gate is "gate", "gates", "flight gate"; a restroom "toilet",
  "washroom", "wc" — and no colours or search fields. `scripts/sync-ios-quick-access.mjs` joins
  the quick-access matchers to those (a matcher with service types names the service, not the
  whole office type) into a vendored terms file and a Swift literal; a tile now matches by phrase
  running whole through a place's name, tag or keyword. Gates no longer carries "office" or
  "transportation".
- **The AI search's ring is the prototype's rainbow** — red, amber, green, cyan, blue, violet —
  drawn from the system's own data colours and its success green (`semantics-data-red`, `-yellow`,
  `emotional-success-500`, `-teal`, `-blue`, `-purple`), the same six stops on iOS, web and
  Compose; the web check reads the resolved red and blue back.
- **A chosen category** in the prototype: the field becomes a 48-tall field in the category's
  colour — a 12 % fill, a 1-pixel border, the icon at 28, the name at 15 semibold, a 22-tall count
  pill, a 32 clear — Filters and the AI search beside it, the sheet at the same detent, and the
  map's other pins faded to 22 %. Built as **`CategoryField` / `KozmosCategoryField`** on all
  three platforms with the category's tint (the taxonomy names each quick-access icon by colour;
  each maps onto a data colour, the theme for the personal tiles), measured on iOS by pixels, on
  the web on three engines, on Compose by golden. The QA app's row uses it, and asks the SDK to
  show the category's places alone (`poisToShow`; its per-place style has no opacity to fade with).

## 3. The QA app's sheet

[SDKMapScreen.swift](../apps/PointrPlayground/Sources/App/SDKMapScreen.swift) `searchSheet`:
the search row pinned first, then what the row's state calls for. At rest, the tiles: the two
personal ones (favourites, bookmarks) and the taxonomy's sixteen for aviation, vendored from the
published `quick-access/aviation.json` of release 10.12.0 with the icons it names
(`Resources/QuickAccess`), drawn in the theme's colour. The field's focus opens the sheet to
large and, with an empty query, lists the places opened this session ("Recently visited", at most
three); a query lists places on every floor; Clear drops the query and the focus; Cancel drops
both and keeps the detent. A tile becomes a chip in the field's place, with the count beside it and
a × back to the tiles, at the same detent. A row opens the card at medium and remembers where the
search sheet was; the card's × returns there, query and results intact; so does the end of a
route. The top slot is empty while browsing. Filters and the AI search have no flow in this
milestone; they are where the prototype puts them.

**A tile's match is a stand-in.** `PTRPoi` carries a name, tags and keywords, not the taxonomy's
`mainType` / `subType` / `serviceTypes` a category's matchers name. `QuickAccess.terms` derives
each category's words from its name and its matchers (the words of the type slugs and service
names, three letters or longer, without "space", "and" and the other stop words) and
`QuickAccess.matches` accepts a place when any of those is a whole word of the place's name, tags
or keywords. "Gate 122" is a gate and not a restroom; "Gateway Lounge" is neither. The
favourites and bookmarks tiles read this session's marks. When the SDK exposes a place's type,
the derivation goes and the matchers are applied as published.

The design system lacks one thing the row needed: a chip with a count badge inside it. The chip
and the counter are two parts beside each other for now.

## 4. Measured

Every new rule was made to fail before it passed.

| Check                                                                         | Result                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iOS, `KozmosMapShellPeekAnchorTests`, against a shell that ignores the anchor | the three render tests failed (the sheet stayed a fifth; the anchor row cut to 143 of 250)                                                                                                                                                                                                                                                                                         |
| iOS, the same, fixed                                                          | a 250 row rests at 282 with 16 under it; a 40 row at a quarter; a 700 row at three quarters                                                                                                                                                                                                                                                                                        |
| iOS, `KozmosPanelDragKindTests`; the fractions; the scroll permission         | 5 rules; 20 / 54 / 94 on an 800 shell; scrolling allowed only at large                                                                                                                                                                                                                                                                                                             |
| iOS package                                                                   | macOS 90; iOS 26.5 and 18.4 in §5                                                                                                                                                                                                                                                                                                                                                  |
| Web, `panel-detents.test.ts` and the shell's tests                            | 11 + 11: the numbers, the anchor, the snap thresholds from the prototype's frame, the handle's keys and tap, the scroll lock                                                                                                                                                                                                                                                       |
| Web, `pnpm test:map-sheet` (chromium, firefox, webkit)                        | the drag ladder (+100 stays, +160 half, +200 full, −250 half, −200 collapsed), the wheel free only at large, a drag on a row at medium growing the sheet, the handle's tap and keys, collapsed on the Go row; on chromium a finger's handoff through touch events: up at medium grows, up at large scrolls, down on a scrolled list scrolls back, down at its top lowers the sheet |
| Web, the rest                                                                 | lint, typecheck, 540 unit tests, `test:navigation` 20/20, `test:poi-details`, `test:owned-css`, classes, css-build, raw values, glass parity, snippets                                                                                                                                                                                                                             |
| Compose, `PanelDetentsTest`                                                   | 9 rules                                                                                                                                                                                                                                                                                                                                                                            |
| Compose, Paparazzi                                                            | the sheet at medium under its handle; collapsed on a 250 anchor row with 16 of what follows — in the first frame, through the alignment line; every other golden unchanged but the two the default's change re-recorded                                                                                                                                                            |
| QA app, unit                                                                  | 46, of which `QuickAccessTests` 6: the vendored file, the icons, the derivation, the whole-word match                                                                                                                                                                                                                                                                              |
| QA app, `BrowseSheetUITests` and `RoutingFlowUITests`, iPhone 17 Pro          | §5                                                                                                                                                                                                                                                                                                                                                                                 |
| Fixture playground                                                            | builds                                                                                                                                                                                                                                                                                                                                                                             |

## 5. The last gate

After the stage's four rulings and Olcay's three later ones — the tiles' top edge, the thin
turning ring, the shells edge to edge — everything was run again:

| Gate                                                                 | Result                                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iOS package, iPhone 17 Pro (iOS 26.5), button baselines skipped      | 124 (three new edge tests, one for the tiles' top edge, the thin ring's)                                                                                                                                                                                                     |
| iOS package, iPhone 16 (iOS 18.4), baselines on                      | 126                                                                                                                                                                                                                                                                          |
| iOS package, `swift test` on macOS                                   | 90 (the render tests and the UIKit catcher are iOS-only)                                                                                                                                                                                                                     |
| QA app unit, iPad Pro 11                                             | 46, of which `QuickAccessTests` 6                                                                                                                                                                                                                                            |
| QA app UI, iPhone 17 Pro: `BrowseSheetUITests`, `RoutingFlowUITests` | both pass on the edge-to-edge build: the sheet from rest to the chip and back; the route through the sheet's field to its directions (the first edge-to-edge build ignored the keyboard's region too, and the picker's rows sat under the keyboard — `.container` only, now) |
| Fixture playground                                                   | builds                                                                                                                                                                                                                                                                       |
| Web: lint, typecheck, unit                                           | ok; ok; 541 in 121 files                                                                                                                                                                                                                                                     |
| Web: `test:map-sheet` on chromium / firefox / webkit                 | 3 of 3 (with the touch handoff) / 2 of 2 / 2 of 2                                                                                                                                                                                                                            |
| Web: `test:search-sheet` on the three engines                        | 3 of 3 each: the tiles' top edge, the 48 ring with its 2.5 band and 43 disc, the turn, the rest under reduced motion                                                                                                                                                         |
| Web: `test:navigation`, `test:poi-details`, `test:owned-css`         | 20 of 20; ok; ok                                                                                                                                                                                                                                                             |
| Web: classes, css-build, raw values, glass parity, snippets          | ok, all five                                                                                                                                                                                                                                                                 |
| Compose: `PanelDetentsTest`; `verifyPaparazziDebug`                  | 9; ok — two shell goldens re-recorded for the new default, the search sheet's for the thin ring, two new                                                                                                                                                                     |
| Live, iPhone 17 Pro                                                  | a finger on a tile at rest raises the sheet to medium and the tile stays closed; two screenshots half a second apart differ only in the ring; at rest the map's grey is under the status bar and the sheet's surface at the bottom edge                                      |

Not run: Chromatic; Android on a device or emulator; the Figma side (no importer access).

After the category-state batch (the 21st) everything ran again: iOS package 127 on iOS 26.5 and
127 on 18.4 (the rainbow band, the category field, the tiles' top edge, the edges), 90 on macOS;
QA app unit 46 (`QuickAccessTests` on the taxonomy's words); both UI tests; the playground builds;
web 544 unit tests, `test:search-sheet` 4 of 4 on chromium, firefox and webkit (the tiles, the
ring's turn and rest, the category field's colour, pill, clear and the row's 48 buttons),
`test:map-sheet`, `test:owned-css`, `test:navigation`, `test:poi-details`, classes, css-build,
raw values, `tokens:motion:check`, `components:contract:check`; Compose `verifyPaparazziDebug`
with the category field's golden new and the search sheet's re-recorded; live on the iPhone, the
recorded focus transition's frames.

## 6. Change it yourself

| What                                     | Where                                                                                                                                                                                               |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The numbers, on any platform             | iOS `KozmosMapPanelDetent.height(in:)`; web `PANEL_DETENT_RULES`; Compose `KozmosMapPanelDetent.Companion`                                                                                          |
| The drag rule                            | iOS `KozmosPanelDragKind.decide`; web `decidePanelDrag`; Compose `decidePanelDrag` and the `NestedScrollConnection`                                                                                 |
| A sheet's peek                           | iOS `.kozmosPanelPeekAnchor()`; web `{...panelPeekAnchorProps}`; Compose `Modifier.kozmosPanelPeekAnchor()`                                                                                         |
| Content that scrolls in a sheet (iOS)    | `KozmosPanelScrollView` in place of `ScrollView`; a plain `ScrollView` scrolls at every detent and never hands off                                                                                  |
| The QA app's tiles and their words       | `apps/PointrPlayground/Sources/App/Model/QuickAccess.swift`; the vendored file and icons in `Sources/App/Resources/QuickAccess`                                                                     |
| The QA app's sheet and its detent memory | `SDKMapScreen.swift`: `searchSheet`, `searchRow`, the three `onChange`s                                                                                                                             |
| Drive the web sheet                      | `STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:map-sheet` (`ADAPTIVE_BROWSER=firefox\|webkit`), on a served Storybook build                                                                         |
| Measure the web's tiles and the AI ring  | `STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:search-sheet`, the same way                                                                                                                          |
| Drive the QA app's sheet                 | the `KozmosPointrQAUI` scheme, `-only-testing:KozmosPointrQAUITests/BrowseSheetUITests`, with the two `TEST_RUNNER_KOZMOS_QA_*` names                                                               |
| Re-drive the prototype                   | `node scripts/measure-prototype-sheet.cjs <out-dir>`                                                                                                                                                |
| The motion tokens and their native files | `packages/tokens/src/tokens*.json` `Semantics.Motion`; `build.mjs` `ios-swift/motion`, `android-compose/motion`; `pnpm tokens:build`, copy `KozmosMotion.swift` / `.kt`; `pnpm tokens:motion:check` |
| The transitions                          | iOS `KozmosTransitions.swift`; web `owned-components.css` (`pop`, `reveal`, `crossfade`); Compose `Motion/Transitions.kt`                                                                           |
| The quick-access words                   | `node scripts/sync-ios-quick-access.mjs --fetch --write`; `Resources/QuickAccess/aviation-terms-10.12.0.json`; `Model/QuickAccessTerms.swift`                                                       |
| The category field                       | `CategoryField/` on each platform; the QA app's `searchRow`; `scripts/check-search-sheet.mjs`                                                                                                       |
| Re-record the Compose goldens            | `ANDROID_HOME="$HOME/Library/Android/sdk" ./gradlew --no-daemon -q recordPaparazziDebug --tests "*KozmosAdaptiveMapShellPaparazziTest*"` in `packages/android`                                      |

## 7. Left as found, and for Olcay

- The rubber band (30 below min, 10 above full in the prototype) is not drawn; the sheets clamp.
- A drag that starts in a text field moves the sheet on iOS and Compose; the web leaves fields
  alone, as the prototype does.
- The chip has no count slot (§3).
- Firefox does not honour `pan-down`, so a finger at the list's top scrolls natively there and
  the sheet does not lower until the finger starts outside the list; chromium and WebKit hand off.
- The Figma side of all of this is untouched: no importer access in this session.
- Chromatic and Android on a device: not run.
