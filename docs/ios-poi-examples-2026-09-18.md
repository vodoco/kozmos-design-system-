# Native POI card review — 18 September 2026

## What changed

The SwiftUI `KozmosPOIDetailPanel` now supports the rich POI example composition,
without embedding raw SDK or taxonomy parsing in the component:

- Header name, optional logo, independently controlled favourite/bookmark, close.
- Floor/building and availability on a separate adaptive line.
- Horizontal action scroller, leading Go icon and optional travel estimate.
- Core and supplementary actions with disabled/loading/selected/message states.
- At most three equal-width metadata cells in a single row. Each cell centers
  the intrinsic icon/text cluster; a primary/detail pair uses one line when it fits.
- Grouped property tags with optional supplied SF Symbol or HTTPS icon artwork.
  No artwork is invented for text-only values. Monochrome artwork uses template
  rendering; full-color artwork preserves its colors. Failed artwork retains text.
- Disclosure-style opening hours, expandable description, trailing tags.
- 16pt card/control/tag radius; no circular quick-action buttons. Dynamic Type,
  RTL-aware layouts and semantic theme colors are retained. Large text increases
  content height and scrolls rather than being scaled down or truncated.

The original map workflow uses the same upgraded card and its real fixture-route
estimate. Its office POIs do not acquire fabricated restaurant ratings or hours.
A new **POI examples** tab provides Restaurant, Retail, Fitness, Entrance, Parking
and All properties. The Action states toolbar toggle demonstrates blocked Go and
loading supplementary actions. Those example actions are explicitly local demos,
not bookings, phone calls, copied links or production routes. The Map tab retains
the original local wayfinding flow.

## Data ownership and edits

| Change                                       | File                                                                          |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| Native card/header/actions                   | `packages/ios/Sources/Components/POIDetailPanel/POIDetailPanel.swift`         |
| Native metadata, tags, hours and description | `packages/ios/Sources/Components/POIDetailPanel/POIDetailContent.swift`       |
| Native rich presentation models              | `packages/ios/Sources/Components/POIDetailPanel/POIDetailsPresentation.swift` |
| Example navigation and controlled actions    | `apps/Playground.swiftpm/Sources/App/Views/POIExamplesScreen.swift`           |
| Canonical example content                    | `packages/react/src/components/POIDetailPanel/POIDetailPanel.fixtures.ts`     |
| Taxonomy interpretation                      | `packages/react/src/components/POIDetailPanel/POITaxonomy.fixtures.ts`        |
| Native fixture generator                     | `scripts/sync-ios-poi-examples.mjs`                                           |
| Native model/render tests                    | `packages/ios/Tests/KozmosTests/KozmosPOIDetailTests.swift`                   |

Do not hand-edit `POIExampleData.swift`: it is a generated Swift JSON literal
from the same fixtures and taxonomy 10.12.0 adapter used by Storybook. No second
taxonomy icon map or live taxonomy fetch was introduced. SF Symbols are used for
native action/generic fallback glyphs; property/value PNGs come from the dictionary.
The existing system-font policy remains: SF Pro on iOS, with Dynamic Type, not an
unbundled Readex Pro font. No invented logos or photos were added.

```sh
node --import tsx scripts/sync-ios-poi-examples.mjs --write
node --import tsx scripts/sync-ios-poi-examples.mjs
```

The generator's default command checks for stale native fixtures and fails on
adapter diagnostics. The native decode test checks all six examples.
`KozmosPOIDetailsPresentation` consumes localized presentation values; its Codable
conformance is not a promise to deserialize an arbitrary upstream SDK object.
Encode the array fields (`summary`, `groups`, `tags`, `supplementaryActions`),
including empty arrays. The Swift initializer provides defaults for code callers.

Existing `KozmosPOIDetailPanel` initializers continue to compile: rich details are
optional. Supplementary actions use a string intent and a separate callback;
the shared `KozmosPOIAction` enum has not changed. Supply localized read-more,
read-less, tags and action labels when integrating a different locale.

## Build and verify

Open `apps/Playground.swiftpm` in Xcode, select **Playground**, then an iOS simulator
and Run. The implementation remains iOS 16 compatible. This review used Xcode
26.6 and iPhone 17 Pro / iOS 26.5. From the app directory:

```sh
xcodebuild -scheme Playground \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.5' \
  -derivedDataPath /tmp/kozmos-ios-poi-build CODE_SIGNING_ALLOWED=NO build
```

From `packages/ios`:

```sh
xcodebuild -scheme Kozmos \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.5' \
  -derivedDataPath /tmp/kozmos-ios-poi-tests \
  -only-testing:KozmosTests/KozmosPOIDetailTests \
  -only-testing:KozmosTests/ProductContractsTests \
  CODE_SIGNING_ALLOWED=NO test
```

Tests cover metadata cap/priority/missing items, icon ownership and URL validation,
model round trips, shared fixture decoding, 1/2/3 metadata items at 320/375/430/768pt,
and native card renders in small-phone, phone, tablet-width, dark and maximum
accessibility-text/RTL configurations. Images are kept as XCTest attachments.
The full card uses a UIHostingController snapshot: ImageRenderer alone gives a
blank ScrollView bitmap and is not valid evidence for this surface. These are
render smoke tests with manual image review, not approved pixel-diff baselines.

Results: app build succeeded; 20 focused POI/contract tests passed; the broader
native suite passed 64 tests. The existing button pixel baselines were excluded
from the iOS 26.5 run because they are pinned to iOS 18.4; they were not rewritten
or silently approved. Run them on their documented simulator before release.
The broader command replaces the two `-only-testing` arguments above with
`-skip-testing:KozmosTests/KozmosButtonImageSnapshotTests`.

## Remaining verification / boundaries

- Live Simulator tapping/swiping and VoiceOver review were blocked by the locked
  Mac during this pass. Unlock before the final hands-on check; do not equate
  render tests with interaction/a11y certification.
- In the examples, check independent save toggles, close/back, horizontal action
  scrolling, opening-hours disclosure, read more/less and Action states. In Map,
  check POI → Go → route preview → navigation → return.
- Remote property icons require network access. Review actual loading, failure,
  cache/offline policy and licensing in the consuming product before release.
- Taxonomy schema/tone discrepancies documented in `poi-taxonomy-display-2026-09-18.md`
  remain upstream decisions. No rating thresholds or hours schema were invented.
- Existing media-gallery behavior is reused; the supplied examples intentionally
  have no imagery. This pass does not certify gallery paging or real SDK integration.
- The generic `KozmosMetaStrip` remains unchanged. The three-item cap is specific
  to POI details. React's separately diagnosed rating-centering bug is not changed
  by this native-only pass.
