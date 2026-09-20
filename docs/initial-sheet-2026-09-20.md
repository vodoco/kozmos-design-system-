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

### Olcay's tile rulings and the Filters button (the 21st, later)

Olcay, with a screenshot of the QA grid: _"If no result it should drop from the list. Also it
would be great to show counter on top right of the boxes for item count."_ Then: _"let's remove
the filter button. I'd like the ai to handle all filters."_

- **The tile's count is the system's counter.** `CategoryPresentation` already carried
  `resultCount` and `resultCountLabel`; the tile drew the label as a caption under its name and
  ignored the number. Now `resultCount` draws as `Counter` — brand tone, the default 20 size — at
  the icon square's top-right, 4 beyond its top and right edges so the icon stays clear, on all
  three platforms; `resultCountLabel` is the spoken form (the iOS accessibility value, the
  Compose state description, a visually hidden span on the web) and draws nothing. The contract
  names it (`components.categoryTile`, `counterOverhang` 4) and `pnpm components:contract:check`
  holds the three sources to it: set the overhang to 5 and the check fails on the React tile.
  Proof on each platform: the iOS render test reads the counter 20 tall with its right edge at
  100 and its top at 16 around a square at 32–96 × 20–84 (it failed first with "no counter at
  the square's top-right", then on the canvas centring the guide now records); the web test and
  the Playwright check measure the counter's box against the square's (20 tall, +4 right, +4 top,
  the spoken form 0 wide); the Android golden, re-recorded after a red of 3.46 % against the old
  caption, measures the counter 31 px tall at 1.5625 px/dp (19.8 dp), its right edge 6 px past
  the square's and its top 6 px above (3.8 dp each).
- **A tile without a place leaves the grid.** The QA app counts every taxonomy tile's places in
  one pass over the loaded venue (`QuickAccess.counts(of:places:)`, unit-tested to agree with the
  one-by-one match and to keep "gates level" from counting as "gate"), keeps the count per tile
  (`SDKSession.tileCounts`, `count(of:)`) and shows `visibleTiles`: every tile until the places
  are counted, then those with at least one — the personal tiles too, so an empty Favourites or
  Bookmarks is not offered. Tiles leave on the standard motion. Driven on the iPhone with 306
  places loaded, 9 of the 18 tiles remained — Check-in & Baggage 9, Gates 2, Customer Service 1,
  Parking & Ground Transport 13, Dining 3, Wellness & Spirituality 2, Restrooms 52, Kid-Friendly
  1, Pet-Friendly 5 — every one with a count of at least one, and the chosen tile's chip carried
  the tile's own number (Check-in & Baggage, 9). The SDK delivers the venue in steps
  (`mapDidEndLoading`, `onPoiManagerChangedPois`, `onDataManagerReady`: 210 places, then 306 a
  moment later when it comes); a launch that stayed at 210 kept one tile, Parking & Ground
  Transport with 3. The counts follow what the SDK has delivered — the content's truth, not a
  rule of ours — so the grid can change once after launch.
- **No Filters button.** Removed from the row in every form; the UI test asserts its absence with
  a query and with a tile chosen. The prototype still draws one (48 × 48, outline); the icon
  button's large size stays a component size.
- **The AI as the filter — what is true today.** On-device Apple Intelligence is iOS 26's
  Foundation Models framework: `SystemLanguageModel.default` and a `LanguageModelSession` that
  answers with a typed value (`@Generable`, guided generation) or calls a `Tool` the app defines.
  That is the shape of "the user asks for vegan restaurants and the results alter": the model
  turns the request into a place request (kind, requirements, near) and a tool searches the venue
  the way a tile does. `scripts/check-foundation-models.swift` is that check; it compiles and
  runs on this Mac (macOS 26.6.2) and answers _unavailable, reason: appleIntelligenceNotEnabled_
  — Apple Intelligence is off in System Settings, which is Olcay's to switch on (the simulators
  use the Mac's model). Two facts bound what the AI could say: taxonomy 10.12.0 has no vegan
  type (its nearest fuzzy hit is vending-machine), and the Design-QA venue's places carry
  **almost no tags or keywords**: a building's 210 or 306 places had none (`QA-DATA … 0
distinct tags and keywords`), and the whole site's 1196 places have five words, all of them
  the cell phone lot's (`cell | cell phone lot | cellphone | cellphone lot | phone`) — so
  "vegan" can only come from a name, a description or the model's own knowledge of a chain,
  never from the content. The prototype's own AI flow, driven and read
  (`docs/pointr-prototype-ai-companion-2026-09-21.md`, `scripts/measure-prototype-ai.cjs`): the
  AI button opens a full-frame Assistant chat page over everything (a circle growing from the
  button in 0.46 s, a puck flying to the header's ring); a typed request is answered locally by
  ten regexes in a fixed order with a canned sentence and place cards inside the chat after a
  fixed 700 ms "Thinking" bubble — no API, no fetch (122 requests over 55 steps, none of them
  xhr, fetch or websocket), no speech (the mic types one of four scripted phrases); the chat
  never alters the sheet's list, the chip or the pins; and the Filters button is nowhere in the
  AI flow — it is a separate full-frame page whose 81 chips do narrow the list, though only four
  of them match the tag table. So "the AI handles all filters" is a step beyond the prototype,
  which presents options in the chat and filters on a page.

### Olcay's colours, pins, card surface and site-wide results (the 21st, later still)

Four more, each with a screenshot: _"I'd like the colors of each category to match. I also would
like to add color-matching markers on the map to show the locations."_ — _"POI card look like
it's within another card. It should have the same bg as initial bottom sheet."_ — _"search and
quick search results should be site wide. not per level."_

- **A tile in its category's colour.** `CategoryTile` takes a `tint` on all three platforms: the
  icon and the counter's fill wear it, the square stays neutral — the chosen-category field's
  colour on its tile; `Counter` gains a fill override (white digits) for it, and
  `BrowseCategoriesPanel` passes a tint per category, as it passes an icon. The QA app's one
  mapping (`QuickAccessCategory.Tint.color`, the taxonomy's icon colour name → the system's
  data colour) now feeds the tiles, the field and the map. Proof: the iOS render test reads the
  tinted tile's icon and counter in the data red and no theme blue anywhere (red first: "extra
  argument tint"); the web test reads the tint variable on the square and the counter's fill;
  the Android golden's Gates tile is red where it was blue. The contract names `tint` and the
  check holds the three sources to it.
- **A pin in a category's colour.** `LocationPin` takes a `tint` for its marker on all three (a
  featured pin keeps the alert colour); the iOS render test reads the 32 pin's 28 fill in the
  tint (its 2 white stroke is inside the diameter — the Compose golden's 44 px at 1.5625 is the
  same 28), the web test reads the colour and the 20 % fill, the Android golden holds a red pin.
- **The map's markers.** The SDK's map draws its own markers and no view of ours: `PTRMapMarker`
  views (a hosted SwiftUI pin, then a rendered `UIImageView`) added through `addMarkers` drew
  nothing on any level, and `PTRPoiMapStyle(poi:image:)` through `updatePoiStyles` restyled the
  category's places but drew the SDK's own icon, not the image. What does work is that restyle:
  a chosen category's places wear the SDK's round quick-access marker with the category's icon
  and name, in the taxonomy's colour — `updatePoiStyles` on choosing, `resetAllPoiStyles` on
  clear — and the map **follows the category**: when none of its places is on the level shown,
  the level of the first, zoomed to it, as opening a place does (Gates: L0 → L2, Terminal A).
  Measured on the iPhone: the SDK's gate marker is `#ECA71E` (236, 167, 30); the tile and the
  chip wear the system's data yellow `#D97706` — the same name, not the same colour. **For
  Olcay:** the taxonomy's eight icon colours as tokens of their own (`Semantics.Category.*`,
  the published values) would make tile, chip and marker one colour by construction; the data
  colours stay for charts. The Kozmos pin with its tint is ready for the web's and Compose's
  own map views, and for the SDK's if its marker API takes an image one day.
- **The POI card on the sheet's surface.** In the sheet presentation `POIDetailPanel` paints no
  surface, border or shadow of its own on any platform — it sits on the sheet's, as the browse
  panel does. Proof: the iOS render test reads the sheet's grey at the panel's top edge where
  inline reads white (red first, "paints its own white surface"); the Compose golden on the
  sheet's grey reads (227, 228, 232) at the panel's edge and centre, where the pre-fix golden
  read white (verify failed against it before re-recording); the web check reads
  `rgba(0, 0, 0, 0)` and no border on the Sheet story. The contract names `sheetSurface: none`.
- **Site-wide results.** The session's places are the site's (`poisForSite:` — every building
  and level: 1196 places, where the loaded building gave 210 or 306), so search, the tiles'
  counts and a category's list cover the whole site; each row says its floor and building, and
  the map follows a chosen category to its first place's level.

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

| What                                             | Where                                                                                                                                                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The numbers, on any platform                     | iOS `KozmosMapPanelDetent.height(in:)`; web `PANEL_DETENT_RULES`; Compose `KozmosMapPanelDetent.Companion`                                                                                          |
| The drag rule                                    | iOS `KozmosPanelDragKind.decide`; web `decidePanelDrag`; Compose `decidePanelDrag` and the `NestedScrollConnection`                                                                                 |
| A sheet's peek                                   | iOS `.kozmosPanelPeekAnchor()`; web `{...panelPeekAnchorProps}`; Compose `Modifier.kozmosPanelPeekAnchor()`                                                                                         |
| Content that scrolls in a sheet (iOS)            | `KozmosPanelScrollView` in place of `ScrollView`; a plain `ScrollView` scrolls at every detent and never hands off                                                                                  |
| The QA app's tiles and their words               | `apps/PointrPlayground/Sources/App/Model/QuickAccess.swift`; the vendored file and icons in `Sources/App/Resources/QuickAccess`                                                                     |
| The QA app's sheet and its detent memory         | `SDKMapScreen.swift`: `searchSheet`, `searchRow`, the three `onChange`s                                                                                                                             |
| Drive the web sheet                              | `STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:map-sheet` (`ADAPTIVE_BROWSER=firefox\|webkit`), on a served Storybook build                                                                         |
| Measure the web's tiles and the AI ring          | `STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:search-sheet`, the same way                                                                                                                          |
| Drive the QA app's sheet                         | the `KozmosPointrQAUI` scheme, `-only-testing:KozmosPointrQAUITests/BrowseSheetUITests`, with the two `TEST_RUNNER_KOZMOS_QA_*` names                                                               |
| Re-drive the prototype                           | `node scripts/measure-prototype-sheet.cjs <out-dir>`                                                                                                                                                |
| The motion tokens and their native files         | `packages/tokens/src/tokens*.json` `Semantics.Motion`; `build.mjs` `ios-swift/motion`, `android-compose/motion`; `pnpm tokens:build`, copy `KozmosMotion.swift` / `.kt`; `pnpm tokens:motion:check` |
| The transitions                                  | iOS `KozmosTransitions.swift`; web `owned-components.css` (`pop`, `reveal`, `crossfade`); Compose `Motion/Transitions.kt`                                                                           |
| The quick-access words                           | `node scripts/sync-ios-quick-access.mjs --fetch --write`; `Resources/QuickAccess/aviation-terms-10.12.0.json`; `Model/QuickAccessTerms.swift`                                                       |
| The category field                               | `CategoryField/` on each platform; the QA app's `searchRow`; `scripts/check-search-sheet.mjs`                                                                                                       |
| Re-record the Compose goldens                    | `ANDROID_HOME="$HOME/Library/Android/sdk" ./gradlew --no-daemon -q recordPaparazziDebug --tests "*KozmosAdaptiveMapShellPaparazziTest*"` in `packages/android`                                      |
| The tile's count                                 | `CategoryTile` on each platform (`Counter`, brand tone, offset 4); `components.categoryTile` in the contract; `check-search-sheet.mjs`                                                              |
| The QA app's tile counts and the empty-tile rule | `SDKSession.countTiles()` / `count(of:)` / `visibleTiles`; `QuickAccess.counts(of:places:)` / `visibleTiles(counts:)`                                                                               |
| The venue's own words                            | the `QA-DATA` log lines (the command in the guide)                                                                                                                                                  |
| On-device Apple Intelligence                     | `scripts/check-foundation-models.swift`                                                                                                                                                             |
| A tile's or a pin's tint                         | `CategoryTile` / `LocationPin` `tint` on each platform; `Counter` `fill`; the QA app's `QuickAccessCategory.Tint.color`                                                                             |
| The category's places on the map                 | `SDKSession.showPins(at:tint:)` (`updatePoiStyles`) and the map following the category in `choose(category:)`                                                                                       |
| The POI panel's sheet surface                    | `POIDetailPanel` sheet presentation on each platform; `owned-poi-detail.css`; the Sheet story                                                                                                       |
| Site-wide places                                 | `SDKSession.refreshPOIs()` (`pois(for: building.site)`)                                                                                                                                             |

## 7. Left as found, and for Olcay

- The rubber band (30 below min, 10 above full in the prototype) is not drawn; the sheets clamp.
- A drag that starts in a text field moves the sheet on iOS and Compose; the web leaves fields
  alone, as the prototype does.
- The chip has no count slot (§3).
- Firefox does not honour `pan-down`, so a finger at the list's top scrolls natively there and
  the sheet does not lower until the finger starts outside the list; chromium and WebKit hand off.
- The Figma side of all of this is untouched: no importer access in this session.
- Chromatic and Android on a device: not run.

- **The personal tiles.** Favourites and Bookmarks now leave the grid while empty, like every
  other tile; the prototype keeps a Bookmarks chip with its count. Whether they should stay as
  entry points while empty is Olcay's call — one line in `SDKSession.visibleTiles`.
- **The AI companion.** Before any building: Apple Intelligence on in this Mac's System Settings
  (the check then runs guided generation on two phrases), the device floor (iOS 26 on an Apple
  Intelligence-capable iPhone, iPhone 15 Pro and later, so the QA app needs a fallback or a floor),
  and what the DS lacks for it — a companion surface (the prototype's chat, its listening and
  thinking states) — which the prototype measurement names.
- **The category palette.** Tile, chip and the SDK's marker share a colour name, not a value
  (data yellow `#D97706` against the marker's `#ECA71E`). The taxonomy's eight icon colours as
  `Semantics.Category` tokens would make them one; Olcay's call, since it is a token set.
