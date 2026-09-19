# Native POI card review — updated 19 September 2026

Implementation worktree: `/private/tmp/kozmos-browser-compat.uqPMBD`, branch
`astra/browser-compatibility`. The main checkout and the separate live Storybook
checkout are not updated by this native pass. Changes are committed locally;
there is no merge, push, SDK release or production integration.

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
| Simulator test runner / CI gates             | `scripts/check-ios-poi.mjs`, `.github/workflows/ci.yml`                       |

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
Missing or null array fields (`summary`, `groups`, `tags`, `supplementaryActions`)
decode as empty arrays, matching Swift initializer defaults. Incorrect field types
still throw decoding errors. IDs must be unique within each supplied collection.

Existing `KozmosPOIDetailPanel` initializers continue to compile: rich details are
optional. Supplementary actions use a string intent and a separate callback;
the shared `KozmosPOIAction` enum has not changed. Supply localized read-more,
read-less, tags, action and `loadingLabel` labels when integrating a different
locale. Supply a supplementary-action callback to enable those actions; state
alone does not enable an action with no handler.

## Findings fixed in the 19 September audit

- **RTL double mirroring:** summary cells, icon/text clusters and tag flow manually
  reversed positions that SwiftUI already reverses. They now use logical placement.
  A rendered pixel-order assertion failed for all three layouts before the fix and
  passes in LTR and RTL afterward. This follows Apple's
  [LayoutDirection behavior](https://developer.apple.com/documentation/swiftui/layoutdirection).
- **Legacy service icons:** shared Kozmos icon names now pass through the existing
  symbol resolver rather than being treated as literal SF Symbol names. Text-only
  services still have no icon.
- **Sparse presentation JSON:** omitted collections now have the same defaults as
  Swift callers; malformed types remain errors.
- **Localization and interaction geometry:** loading accessibility text is caller
  configurable. The read-more label owns its 44pt hit region rather than placing
  the minimum frame outside the button; the hours row has a minimum 44pt height.
- **Action messages:** core and supplementary message IDs have separate namespaces.
- **Missing CI coverage:** macOS `swift test` does not run tests guarded by
  `#if os(iOS)`. CI now also runs the POI/contract tests in an available iPhone
  simulator and uploads the result bundle. The web job checks generated native
  fixtures against Storybook, preventing silent example drift.
- **Raw-value checker false positive:** an owned class such as `kozmos-text-white`
  was counted as a raw utility in addition to its actual `@apply text-white` rule.
  Utility-boundary matching now distinguishes them, backed by five regression
  tests. The baseline was not increased: the pre-existing 32 raw colors and seven
  raw radii remain tracked debt, not newly approved values.

## Build and verify

Open `apps/Playground.swiftpm` in Xcode, select **Playground**, then an iOS simulator
and Run. The deployment target remains iOS 16; this is not an iOS 16 runtime
certification. This review used Xcode
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

Final results on 19 September: 70 tests passed on iPhone 16 / iOS 18.4, including
the unchanged button pixel baselines; 68 tests passed on iPhone 17 Pro / iOS 26.5
with those two baseline methods excluded; 65 macOS tests passed. No snapshots were
re-recorded. The new simulator runner was also exercised locally successfully.
This does not claim that the GitHub-hosted workflow has run: no push was made.
The final Playground build succeeded and was installed and launched on the
iPhone 17 Pro simulator. A successful process launch is not a final visual check
of that rebuilt binary while the Mac is locked.
The broader command replaces the two `-only-testing` arguments above with
`-skip-testing:KozmosTests/KozmosButtonImageSnapshotTests`.

From the repository root, run the same focused simulator gate as CI:

```sh
node scripts/check-ios-poi.mjs
# Optional explicit simulator instead of the newest installed iPhone runtime:
KOZMOS_IOS_TEST_DESTINATION='platform=iOS Simulator,name=iPhone 16,OS=18.4' node scripts/check-ios-poi.mjs
node --import tsx scripts/sync-ios-poi-examples.mjs
node --test scripts/lib/raw-value-patterns.test.mjs
pnpm tokens:raw:check
pnpm components:contract:check
pnpm tokens:radius:check
```

The runner prints its temporary results folder. Open `TestResults.xcresult` in
Xcode for attachments. CI retains it as `native-poi-test-results`. To run all
native tests including the pinned button snapshots, use the package directory:

```sh
xcodebuild -scheme Kozmos \
  -destination 'platform=iOS Simulator,name=iPhone 16,OS=18.4' \
  -derivedDataPath /tmp/kozmos-ios-poi-tests CODE_SIGNING_ALLOWED=NO test
swift test
```

Local final audit logs are `/tmp/kozmos-ios-audit-18-final.log`,
`/tmp/kozmos-ios-audit-26-final.log`, `/tmp/kozmos-ios-audit-macos-final.log`
and `/tmp/kozmos-ios-audit-build.log`. These temporary logs are not durable
repository artifacts; the tests and commands above reproduce the evidence.

## Remaining verification / boundaries

- Live Simulator review on 19 September confirmed the restaurant card, downloaded
  property icons, independent favourite/bookmark toggles and the Action states
  toggle showing disabled Go/loading Book and feedback. The UI connection then
  failed; on reconnect the Mac reported locked. Unlock before the remaining
  hands-on checks. Do not equate render tests with interaction/a11y certification.
- **Accessibility layout decision remains:** at 320pt and the largest accessibility
  size, three fixed columns keep the requested single-row structure but cause
  severe word wrapping. The RTL image was inspected and this is not considered
  polished. Recommended next change is an accessibility-size exception that lets
  the same maximum three facts stack vertically. That would change the explicit
  “never two rows” rule, so it has not been silently introduced. No font shrinking,
  truncation or hidden facts were used to conceal the constraint.
- In the examples, check independent save toggles, close/back, horizontal action
  scrolling, opening-hours disclosure, read more/less and Action states. In Map,
  check POI → Go → route preview → navigation → return.
- Remote property icons require network access. Review actual loading, failure,
  cache/offline policy and licensing in the consuming product before release.
- Test on a physical device, with VoiceOver and the oldest supported iOS runtime.
  Neither signing/release readiness nor real SDK routing/bookings are certified.
- Taxonomy schema/tone discrepancies documented in `poi-taxonomy-display-2026-09-18.md`
  remain upstream decisions. No rating thresholds or hours schema were invented.
- Existing media-gallery behavior is reused; the supplied examples intentionally
  have no imagery. This pass does not certify gallery paging or real SDK integration.
- The generic `KozmosMetaStrip` remains unchanged. The three-item cap is specific
  to POI details. React's separately diagnosed rating-centering bug is not changed
  by this native-only pass.
