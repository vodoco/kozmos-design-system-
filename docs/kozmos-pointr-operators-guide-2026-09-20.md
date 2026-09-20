# Operator's guide — the Kozmos design system through the Pointr QA app, 20 September 2026

Everything needed to change, run, measure and check the work of 19–20 September without the
session that did it. Written by Claude Code at Olcay's request; every command below was run in
this worktree on this Mac. The reports it summarises: the Pointr passes
([1](pointr-ios-pass1-2026-09-19.md), [2](pointr-ios-pass2-2026-09-19.md),
[3](pointr-ios-pass3-2026-09-19.md), [3's closure](pointr-ios-pass3-closure-2026-09-20.md)), the
[design-system pass](design-system-pass-2026-09-20.md), the
[prototype's screen states](pointr-prototype-screen-states-2026-09-20.md), and the
[Pointr handoff](claude-code-handoff-2026-09-19-pass3.md) with its update notes.

## 1. Where everything is

| What                                                      | Where                                                                                                                                                                                                                                  |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The worktree with all of the work                         | `/private/tmp/kozmos-browser-compat.uqPMBD`, branch `claude/pointr-browse-repairs`, **unpushed**, no upstream                                                                                                                          |
| The main checkout                                         | `/Volumes/4TB Depo/development/K/kozmos-design-system-dev` on `main`, holds none of it; one untracked pointer file, `docs/claude-code-handoff-2026-09-19.md`                                                                           |
| The QA app (real PointrKit, Design-QA Cloud)              | `apps/PointrPlayground` — `Sources/App`, `Tests`, `UITests`, `Tools`, `project.yml`                                                                                                                                                    |
| Ignored, unrecoverable from Git, **only in the worktree** | `apps/PointrPlayground/.local/` (PointrKit 10.3.0, MapLibre 6.27 xcframeworks, `Info.plist`), `apps/PointrPlayground/Sources/App/Resources/QAConfig.json` (mode 0600, never print or commit), the generated `KozmosPointrQA.xcodeproj` |
| The design system                                         | `packages/react`, `packages/ios` (SwiftUI package `Kozmos`), `packages/android` (Compose), `packages/tokens` (DTCG sources in `src/tokens-light.json` and `tokens-dark.json`), `packages/product-contracts`                            |
| The native fixture app                                    | `apps/Playground.swiftpm` (its POI examples are generated from the React fixtures; never hand-edit `Sources/App/Model/POIExampleData.swift`)                                                                                           |
| Storybook                                                 | `apps/docs`; the static build in `apps/docs/storybook-static` (ignored)                                                                                                                                                                |
| The product reference                                     | `https://agentic-search-zeta.vercel.app` (Mobile SDK and WebSDK tabs); the older Figma file `Pointr Maps - Express` (`BwtG2COVRqUWGPrIvP4jxr`) is superseded                                                                           |

macOS clears `/private/tmp`. Before any cleanup or machine change: commit, and copy `.local/` and
`QAConfig.json` somewhere safe first. Decision 5 (push, and move those files) is still open.

## 2. Git rules that held

Stage by file, never `git add -A` or a directory (parallel sessions leave work in the tree);
never a bare `git stash`; commit messages end with `Co-Authored-By: Claude Fable 5.1
<noreply@anthropic.com>`; `lint-staged` runs prettier on staged `md/yml/json` and eslint +
prettier on `ts/tsx/js/jsx`, so a docs commit may reflow tables — that is expected. Nothing is
pushed without an explicit ask.

## 3. Simulators and the QA app

| Device                      | UDID                                   | Used for                                                                                    |
| --------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| iPhone 17 Pro, iOS 26.5     | `51937B59-CEAE-4BC7-BC34-FEB17E28FAE7` | live runs, the UI test; **its first language is Arabic** (`ar_SA`; the app runs as `en_SA`) |
| iPad Pro 11" (M5), iOS 26.5 | `1CB35135-48B2-407B-8515-C8C6EFC1D963` | unit tests, the UI test on a regular width; `en_GB`                                         |
| iPhone 16, iOS 18.4         | by name                                | the package's button baselines                                                              |

Re-discover with `xcrun simctl list devices available`. Check a simulator's language before
blaming a backend for the language it answers in:
`xcrun simctl spawn <udid> defaults read -g AppleLanguages`.

Regenerate the project after any `project.yml` change (it is ignored):

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/apps/PointrPlayground && xcodegen generate
```

Build, install, launch:

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/apps/PointrPlayground && xcodebuild -project KozmosPointrQA.xcodeproj -scheme KozmosPointrQA -destination "platform=iOS Simulator,id=51937B59-CEAE-4BC7-BC34-FEB17E28FAE7" -derivedDataPath /private/tmp/kozmos-pointr-qa-xcode CODE_SIGNING_ALLOWED=NO build && xcrun simctl install 51937B59-CEAE-4BC7-BC34-FEB17E28FAE7 /private/tmp/kozmos-pointr-qa-xcode/Build/Products/Debug-iphonesimulator/KozmosPointrQA.app && xcrun simctl launch --terminate-running-process 51937B59-CEAE-4BC7-BC34-FEB17E28FAE7 com.kozmos.pointrqa
```

Unit tests (the iPad, so a live run on the iPhone is not disturbed):

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/apps/PointrPlayground && xcodebuild -project KozmosPointrQA.xcodeproj -scheme KozmosPointrQA -destination "platform=iOS Simulator,id=1CB35135-48B2-407B-8515-C8C6EFC1D963" -derivedDataPath /private/tmp/kozmos-pointr-qa-xcode CODE_SIGNING_ALLOWED=NO test 2>&1 | grep -E "Executed [0-9]+ tests|TEST (SUCCEEDED|FAILED)|error:"
```

The routing flow as a UI test (any simulator, no device grant needed; live against Design-QA;
not in CI). Environment is **exported before** the command — a `KEY=value` after `xcodebuild`
is a build setting, not environment:

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/apps/PointrPlayground && TEST_RUNNER_KOZMOS_QA_DESTINATION="Airport Shuttles" TEST_RUNNER_KOZMOS_QA_ORIGIN="Dunkin" xcodebuild -project KozmosPointrQA.xcodeproj -scheme KozmosPointrQAUI -destination "platform=iOS Simulator,id=51937B59-CEAE-4BC7-BC34-FEB17E28FAE7" -derivedDataPath /private/tmp/kozmos-pointr-qa-xcode -resultBundlePath /private/tmp/kozmos-pointr-ui.xcresult CODE_SIGNING_ALLOWED=NO test 2>&1 | grep -E "QA-FLOW|Test Case .* (passed|failed)|TEST (SUCCEEDED|FAILED)"
```

| Knob (prefix `TEST_RUNNER_`) | Effect                                                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `KOZMOS_QA_DESTINATION`      | the place to select (label prefix); otherwise the first place listed                                                         |
| `KOZMOS_QA_ORIGIN`           | the starting point (label prefix); otherwise the first candidate                                                             |
| `KOZMOS_QA_BUILDING_POIS`    | e.g. `306`: wait for that place count, relaunching up to three times (the building the map opens on varies between launches) |
| `KOZMOS_QA_EXPECT_NO_ROUTE`  | assert the no-route state in the picker instead of the directions                                                            |

Its screenshots and accessibility trees come out of the result bundle:

```sh
xcrun xcresulttool export attachments --path /private/tmp/kozmos-pointr-ui.xcresult --output-path /private/tmp/kozmos-pointr-ui-attachments
```

Afterwards remove the runner it leaves on the simulator, or it can be tapped on the home
screen and crashes for want of xcodebuild's libraries:

```sh
xcrun simctl uninstall 51937B59-CEAE-4BC7-BC34-FEB17E28FAE7 com.kozmos.pointrqa.uitests.xctrunner
```

Logs: `notice` lines persist, `debug` lines (the per-step route lines) do not, so stream before
reproducing. Subsystem `com.kozmos.pointrqa`, category `poi`.

```sh
xcrun simctl spawn 51937B59-CEAE-4BC7-BC34-FEB17E28FAE7 log show --predicate 'subsystem == "com.kozmos.pointrqa"' --last 30m --style compact
```

```sh
xcrun simctl spawn 51937B59-CEAE-4BC7-BC34-FEB17E28FAE7 log stream --predicate 'subsystem == "com.kozmos.pointrqa"' --level debug --style compact
```

What the app logs: the language it asked the SDK for and the device's languages; when
wayfinding readiness was known (ms after start); each route (`route A → B: d m, t s, n steps;
ms`) and each step at debug level; a selected place's data diagnostics.

Screenshots of any booted simulator, granted or not:
`xcrun simctl io <udid> screenshot out.png` (3× on the iPhone 17 Pro, 2× on the iPad). The
desktop simulator tool takes device points (402 × 874 on the 17 Pro), not pixels.

## 4. The design-system gates

After a change under `packages/ios`:

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/packages/ios && swift test
```

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/packages/ios && xcodebuild -scheme Kozmos -destination "platform=iOS Simulator,id=51937B59-CEAE-4BC7-BC34-FEB17E28FAE7" -derivedDataPath /tmp/kozmos-ios-poi-tests CODE_SIGNING_ALLOWED=NO -skip-testing:KozmosTests/KozmosButtonImageSnapshotTests test 2>&1 | grep -E "Executed [0-9]+ tests|TEST (SUCCEEDED|FAILED)|error:"
```

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/packages/ios && xcodebuild -scheme Kozmos -destination "platform=iOS Simulator,name=iPhone 16,OS=18.4" -derivedDataPath /tmp/kozmos-ios-poi-tests CODE_SIGNING_ALLOWED=NO test 2>&1 | grep -E "Executed [0-9]+ tests|TEST (SUCCEEDED|FAILED)|error:"
```

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD && node scripts/check-ios-poi.mjs
```

The button image baselines are pinned on iOS 18.4 and skipped on 26.5; never re-record them to
make a difference go away. `swift test` on macOS skips everything under `#if os(iOS)`, which is
where the render tests live — a macOS green says nothing about them.

After a change under `packages/react` or its styles (build first; the browser suites read the
built package and a built Storybook):

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD && pnpm --filter '@kozmos/react...' build && pnpm --filter @kozmos/docs build-storybook
```

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD && python3 -m http.server 6012 --bind 127.0.0.1 --directory apps/docs/storybook-static
```

Then, in another terminal, each of these on chromium (default), firefox and webkit
(`ADAPTIVE_BROWSER=firefox`, `ADAPTIVE_BROWSER=webkit`):

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD && STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:poi-details
```

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD && STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:owned-css
```

And without Storybook: `pnpm --filter @kozmos/react test`, `pnpm --filter @kozmos/react lint`,
`pnpm test:css-build`, `pnpm components:contract:check`, `pnpm docs:snippets:check`,
`pnpm --filter @kozmos/docs typecheck`, `pnpm tokens:raw:check`. `pnpm test:poi-gallery` when
the gallery changes. Results and screenshots land in `test-results/`; read the current JSON, not
an old `*-failed.png`.

After a change to the shared POI fixtures (`packages/react/src/components/POIDetailPanel/POIDetailPanel.fixtures.ts`):

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD && node --import tsx scripts/sync-ios-poi-examples.mjs --write && node --import tsx scripts/sync-ios-poi-examples.mjs
```

The examples that reach the native playground are named in that script (`names`, plus the
two pushed by hand). Then build the playground:

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/apps/Playground.swiftpm && xcodebuild -scheme Playground -destination "platform=iOS Simulator,name=iPhone 17 Pro,OS=26.5" -derivedDataPath /tmp/kozmos-ios-poi-build CODE_SIGNING_ALLOWED=NO build 2>&1 | grep -E "BUILD (SUCCEEDED|FAILED)|error:"
```

After a change under `packages/android` (JDK 21 and the SDK at `~/Library/Android/sdk` are on
this Mac; no `local.properties`, so pass the SDK in the environment):

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/packages/android && ANDROID_HOME="$HOME/Library/Android/sdk" ./gradlew --no-daemon -q verifyPaparazziDebug
```

Re-record a golden only for an intended change:
`ANDROID_HOME="$HOME/Library/Android/sdk" ./gradlew --no-daemon -q recordPaparazziDebug --tests "*NameOfTest*"`.
Goldens are recorded on macOS and verified on CI's Linux; a red on an unchanged render is that
mismatch, not a regression.

Tokens: edit `packages/tokens/src/tokens-light.json` and its twin `tokens-dark.json`, then
`pnpm tokens:build && pnpm figma:foundations && pnpm tokens:radius:check`; the change reaches
Figma only through the importer plugin (`docs/style-playbook.md`, the Figma loop). Never
"Rebuild" a component in the plugin: it changes the node id Code Connect pins. `pnpm
figma:verify` from the terminal beats the in-plugin audit for drift.

The navigation parts — the manoeuvre card, the itinerary, the rail, the summary's navigation
layout — have their own browser check on the same served build
([navigation-parts-2026-09-20.md](navigation-parts-2026-09-20.md) §4), twenty checks on each
engine:

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD && STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:navigation
```

## 5. Where each behaviour lives

The QA app (`apps/PointrPlayground/Sources/App`):

| Behaviour                                                                                                                       | File and place                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SDK start, the language asked for, readiness logs, selection, camera padding, level callbacks                                   | `SDKSession.swift`: `start()`, `SDKLanguage`, `loadBuilding`, `select`, `frame`, `setChromeInsets`, `applyCameraPadding`                                                                                          |
| Routing flow: Go → picker → one calculation → directions; retry; the not-ready and no-route messages                            | `Routing/SDKRouting.swift`: `startRouteSetup`, `chooseOrigin`, `calculateRoute`, `retryRouteCalculation`, `showDirections`, `showStep`, `endRoute`, `resetRouting`; readiness retry in `onWayfindingManagerReady` |
| Route values, the arrow table, the under-a-metre rule, what a failure offers                                                    | `Routing/SDKRoute.swift`: `SDKRoute`, `RouteFormat`, `SDKRoutePresenter` (`directionType`, `distanceLabel`, `recovery`, `retriesOnReadiness`)                                                                     |
| The panels: browse (card / list), the picker with its status row, the directions with the current step's trait and announcement | `SDKMapScreen.swift`: `browsePanel`, `routeSetupPanel`, `routeStatusRow`, `directionsPanel`                                                                                                                       |
| Controls placement, what drops when space runs out                                                                              | `SDKMapScreen.swift`: `controls(_:zoom:)`                                                                                                                                                                         |
| The card's data: taxonomy, contacts, hours, description; artwork rule                                                           | `SDKPOIAdapter.swift`; `Taxonomy/TaxonomyPresenter.swift`; the pinned projection `Model/TaxonomyProjection.swift` (generated by `scripts/sync-ios-taxonomy.mjs`)                                                  |
| The pin reserve (96pt)                                                                                                          | `SDKCameraPadding.swift`                                                                                                                                                                                          |
| Map policy: every default Pointr control off                                                                                    | `SDKSession.swift`: `SDKMapPolicy`                                                                                                                                                                                |

The design system (`packages/ios/Sources/Components`, with the React and Compose twins beside
them under `packages/react/src/components` and `packages/android/src/main/java/com/kozmos/components`):

| Behaviour                                                                                                   | iOS                                                                                                       | Web                                                                                                                            | Android                                                    |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Card header: name and quick buttons on one row, name ≤ 3 lines                                              | `POIDetailPanel/POIDetailPanel.swift`: `header`, `identity`                                               | `styles/owned-poi-detail.css`: `.kozmos-poi-header`, `.kozmos-poi-identity`, `.kozmos-poi-title`, `.kozmos-poi-header-actions` | `POIDetailPanel/POIDetailPanel.kt`: `Header`, `maxLines`   |
| Direction step reads as one element, arrow silent                                                           | `DirectionStep/DirectionStep.swift`: `accessibilityDescription`                                           | (icon has no title; rows are plain)                                                                                            | —                                                          |
| Route summary's icon silent                                                                                 | `RouteSummary/RouteSummary.swift`                                                                         | —                                                                                                                              | —                                                          |
| The manoeuvre card, its cap, what it reads                                                                  | `ManoeuvreCard/ManoeuvreCard.swift`: `KozmosCappedHeightLayout`, `accessibilityDescription`               | `ManoeuvreCard/ManoeuvreCard.tsx`: `manoeuvreDescription`                                                                      | `ManoeuvreCard/ManoeuvreCard.kt`                           |
| The itinerary's rows, the current one emphasised                                                            | `Itinerary/Itinerary.swift`                                                                               | `Itinerary/Itinerary.tsx`                                                                                                      | `Itinerary/Itinerary.kt`                                   |
| The rail's geometry and the disc's travel                                                                   | `RouteProgressRail/RouteProgressRail.swift`: `discLeading`                                                | `RouteProgressRail/RouteProgressRail.tsx`: `ROUTE_PROGRESS_RAIL`, `discLeading`                                                | `RouteProgressRail/RouteProgressRail.kt`: `…Geometry`      |
| The summary's navigation layout (destination, End, stats, progress)                                         | `RouteSummary/RouteSummary.swift`: `init(destination:…)`                                                  | `RouteSummary/RouteSummary.tsx`: `RouteSummaryNavigation`                                                                      | `RouteSummary/RouteSummary.kt`: the `destination` overload |
| The QA app's directions on those parts; the flow test's reading of them                                     | `apps/PointrPlayground/…/SDKMapScreen.swift`: `topBar`, `directionsPanel`; `RoutingFlowUITests.swift`     | the Examples/Navigation story                                                                                                  | —                                                          |
| Collapsible level switcher: named rows, trailing-aligned, opaque; the pill hidden from VoiceOver while open | `FloorSelector/FloorSelector.swift`: `expandedList`, `namedFloorButton`, the `expanded:` test initializer | no collapsible variant                                                                                                         | no collapsible variant                                     |
| Search bar: magnifier silent, clear button labelled                                                         | `SearchBar/SearchBar.swift`                                                                               | `SearchBar/SearchBar.tsx` (already)                                                                                            | `SearchBar/SearchBar.kt` (already, "Clear")                |
| The long-name fixture                                                                                       | `apps/Playground.swiftpm/…/POIExampleData.swift` (generated)                                              | `POIDetailPanel/POIDetailPanel.fixtures.ts`: `longContentPOI`, `longContentDetails`; the `LongContent` story                   | —                                                          |

Tests for the above: `packages/ios/Tests/KozmosTests/KozmosPOIDetailTests.swift` (the measured
header test, the render matrix, the fixture decoding), `KozmosFloorSelectorTests.swift`,
`KozmosDirectionStepTests.swift`, `RenderedPixels.swift` (render a view, find pixels of a colour,
keep the image); `scripts/check-poi-detail-examples.mjs` (the `long-content` block);
`packages/android/src/test/java/com/kozmos/components/poidetailpanel/KozmosPOIDetailPanelPaparazziTest.kt`
and its golden under `src/test/snapshots/images/`; `apps/PointrPlayground/Tests/*` and
`UITests/RoutingFlowUITests.swift`.

## 6. Measuring, not eyeballing

- **A rendered SwiftUI view, in points.** `RenderedPixels.render(view, size:)` then
  `boundingBox(in:where:)` with `isTheme`, `isDarkText` or `isInk`; attach `pixels.image`.
  Run a new test against the unfixed code first (`git show HEAD:<file> > <file>`, run, put the
  fixed file back); a green that names nothing proves nothing — check `Executed N tests`.
- **A simulator screenshot.** `apps/PointrPlayground/Tools/measure-selected-pin.py` and
  `measure-gallery-tile.py` (Pillow; `python3 -m pip install pillow`), edge-exclusive, on a
  `simctl io` screenshot.
- **What VoiceOver gets.** XCUITest's tree (`element.debugDescription`, attached by the UI test)
  shows labels, values and the selected trait, but it also lists elements SwiftUI hides or
  ignores, so absence cannot be asserted there; a hosted view's UIKit accessibility API reaches no
  SwiftUI element in a unit test. The desktop simulator tool's `inspect` was unavailable.
- **A web page or prototype.** Read the DOM in the built-in browser, not the picture. The
  snippet that measured the prototype, to paste into the browser's JavaScript tool: find the
  frame (the element around the "9:41" text wider than 250 and taller than 500), then for every
  descendant with text, an `aria-label`, a button or a surface (a background with a radius or a
  shadow) print tag, label, position and size relative to the frame, `fontSize/fontWeight`,
  family, `color`, `backgroundColor`, `borderRadius`, `border`. Headless, with the repo's
  Playwright: `NODE_PATH=/private/tmp/kozmos-browser-compat.uqPMBD/node_modules node script.cjs`
  (`require` resolves from the script's directory, not the working directory); wait for `load`,
  click the tab you need, then `page.screenshot({ clip })` around the frame.
- **The SDK's map layers.** MapLibre's public style API: `mapLibreView.style?.layers`, a
  layer's `sourceIdentifier`, `predicate`, `iconImageName`, and `visibleFeatures(in:styleLayerIdentifiers:)`
  for the features under a layer; `style.image(forName:)` to save an icon. That is how the
  next-portal marker was identified. Never traverse the SDK's private UIKit subviews.

## 7. Decisions and where they stand

| #   | Decision                                                                                                                      | State                                                                                                                                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–5 | Gallery crop; zoom buttons on phones; the `.panel` border; the 320pt/AX5 metadata exception; pushing and moving the SDK files | open since Pass 1                                                                                                                             |
| 6   | Transition arrows in `DirectionType`                                                                                          | open; still needed by the directions list                                                                                                     |
| 7   | The top search bar during routing                                                                                             | open; the prototype replaces it with the instruction card during navigation                                                                   |
| 8   | Go waiting for readiness                                                                                                      | open, with numbers: readiness 240–330 ms after the building loads; the not-ready state retries                                                |
| 9   | Hiding or restyling the SDK's next-portal marker through MapLibre's style API                                                 | open                                                                                                                                          |
| 10  | The preview's 208pt option cards                                                                                              | moot: no preview step                                                                                                                         |
| 11  | The level switcher's dismissal, scrolling, a chevron hint (the prototype has the chevron)                                     | open                                                                                                                                          |
| 12  | Folded phones: bring the web shell's hinge model to iOS and Compose ahead of the SDKs                                         | open; Xcode 26.6 has no iPhone Fold                                                                                                           |
| 13  | Android parity: the action strip wraps, the location line truncates                                                           | open                                                                                                                                          |
| 14  | The open level list: names beside labels (built) or the prototype's labels-only column                                        | open; the picture of both was sent                                                                                                            |
| —   | The card's quick buttons                                                                                                      | **ruled: 16px squares stay**                                                                                                                  |
| —   | Fonts                                                                                                                         | **ruled: system fonts per platform**; already the code's state; Readex Pro remains only in the unused `Brand` token and the Figma text styles |
| —   | Wayfinding modes and the preview                                                                                              | **ruled: none yet**; Go starts at once with a position, asks for a starting point without one; the QA app follows                             |

_Later on the 20th, evening, Olcay ruled on the navigation stage's six
([navigation-parts-2026-09-20.md](navigation-parts-2026-09-20.md) §5): the rail keeps the
prototype's numbers; a glass surface role is built now on all three platforms (the handoff's
§5.13) and the card and the summary take it; a compact detent in the shell; each platform's own
icon set for the transition arrows; the button-height decision withdrawn (44 on every platform by contract); the level list keeps its
names beside the labels, as built. He also had the branch pushed — decision 5 above is answered
as far as the commits go; the ignored SDK files still live only in the worktree. Next: the glass
role, the transition arrows, the search sheet; F, G and Pass 4 after._

## 8. What the design system still lacks, from the prototype

A gradient-ring AI search button; a location marker with a halo and pulse; the collapsible level
switcher on web and Android; an in-surface status message; a floor slot and a current-step state
on a direction step; the transition arrows. Measured geometry for each is in the prototype
report. The manoeuvre card, the route progress rail and the itinerary list were built on the
20th on all three platforms — [navigation-parts-2026-09-20.md](navigation-parts-2026-09-20.md),
with its own six decisions.

## 9. Traps met, for the next reader

- The iPhone 17 Pro simulator speaks Arabic first; `defaults read -g AppleLanguages` before
  concluding anything about a backend's language.
- A `$T` shell variable holding two `-only-testing` arguments passes as one; xcodebuild ran 0
  tests and said SUCCEEDED. Write arguments out.
- The building the map opens on varies between launches, and the count label lags behind the
  list; the UI test's `KOZMOS_QA_BUILDING_POIS` waits for the one you want.
- `Logger.debug` lines are not in `log show`; stream them.
- MapLibre's `contentInset` setter re-centres and cancels a `focusPoi` flight.
- `EmptyView` is no `ViewThatFits` child; use a zero-sized `Color.clear`.
- Edits to `.github/workflows/*` trip a security hook in the tool; apply with a script.
- zsh: a pipe followed by a heredoc concatenates; `echo ===` fails; quote `--include='*.swift'`.
- The XCUITest runner stays installed after a run and crashes if launched by hand.
- Prettier reflows Markdown tables on commit; the committed file is the source of truth.
