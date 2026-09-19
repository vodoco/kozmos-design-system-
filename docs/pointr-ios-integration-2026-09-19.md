# Pointr iOS integration — 19 September 2026

## Status and ownership

This is a **working, browse-only integration milestone**, not a completed SDK UI
replacement or release candidate. The native app connected to Design-QA, rendered
real airport maps, loaded POIs and opened an SDK POI in a Kozmos detail panel.
No Cloud values were edited or published. No sample GitHub token was used.

The host lives in `apps/PointrPlayground`; the previous fixture playground and
Storybook remain unchanged. Worktree: `/private/tmp/kozmos-browser-compat.uqPMBD`,
branch `astra/browser-compatibility`. The main checkout is not merged or updated.

Pointr owns map rendering, data and map camera/selection. Kozmos owns the shell,
search field, result cards, detail panel, floor control and zoom/compass buttons.
SDK models are adapted in the app; `packages/ios` has no Pointr dependency.

## Supported UI integration

The downloaded 10.3.0 public Swift interface exposes
`PTRMapWidgetConfiguration.mapOnlyConfiguration()` and individual chrome flags.
`SDKMapPolicy.make()` starts with that preset and explicitly disables the default
search, detail panel, route summary/header/footer, floor selector, tracking button,
onboarding/splash, loading indicator, quick access, toast, info, exit and mark-car
controls. It does **not** traverse UIKit subviews or use private SDK interfaces.
The SDK map's layers and POI artwork are retained; map pins are not Kozmos buttons.

`PTRMapWidgetViewController` is embedded with `UIViewControllerRepresentable`.
Public map callbacks feed selection/level changes into the app state. Shell
collision insets are passed into the exposed MapLibre view's `contentInset`.
Attribution visibility and contractual branding requirements still need an
explicit review before distribution; disabling default app chrome is not a
license to remove required attribution.

The host uses a standard Xcode application target generated from `project.yml`.
The initial Swift Playgrounds host linked but failed to embed the two dynamic
frameworks, producing a launch-time dyld error. That approach was replaced with
normal Xcode framework embedding, not an after-build framework-copy workaround.

## Dependencies and credentials

- PointrKit **10.3.0**: user-supplied SDK archive.
- Pointr's MapLibre **6.27.0.1**: required by the official PointrKit podspec.
  Its framework reports `CFBundleShortVersionString` 6.27.0.
- Both have arm64 device and arm64/x86_64 simulator slices.
- The QA host targets iOS 16.6, matching the supplied SwiftUI sample target.
  This is not a claim of runtime testing on iOS 16.6.
- XcodeGen was already installed locally and generates the app project.

The user explicitly authorized the signed MapLibre artifact URL in Pointr's
official public podspec. The unsigned artifact URL returned 401. The signed URL
and credentials are **not** stored in this repository. Reference manifests:
[PointrKit 10.3.0](https://github.com/pointrlabs/public-podspecs/blob/master/PointrKit/10.3.0/PointrKit.podspec)
and [MapLibre 6.27.0.1](https://github.com/pointrlabs/public-podspecs/blob/master/MapLibre/6.27.0.1/MapLibre.podspec).

Downloaded archive SHA-256 values (recorded evidence, not a vendor signature):

```text
PointrKit: 10606818dd427901e2c3dc6f8ec44b73ca69af0322af1818bdf50b24c171b663
MapLibre: c818834e06b2c9c18e193f4282b5853122b714bfb33e9fe92e7df498df68ea5b
```

The Web SDK page supplied the QA base URL, client identifier and license key.
They were parsed as literal values without executing downloaded JavaScript and
written to ignored `Sources/App/Resources/QAConfig.json` with mode 0600. The
runtime validates the exact QA origin and required values. The SDK accepted
registration with this configuration in the simulator.

**The license is bundled into this development app.** Ignoring a file in Git does
not make an app-bundled client license secret. Do not distribute the built app,
archive or local configuration as a production artifact. Arrange approved native
client licensing, restrictions and release configuration before distribution.
Use the local file directly to update credentials; never paste them into commits,
logs, screenshots or this document. Do not reuse the vendor sample's embedded
GitHub access token. Its owner should review and rotate exposed credentials.

## Build and run

Local downloaded/extracted inputs are under `/private/tmp/kozmos-pointr-sdk.eTJWCz`.
They are temporary and not part of the repository. On a fresh checkout, obtain
the approved artifacts and save the approved Web SDK bootstrap HTML locally.
Then, from the repository root:

```sh
node scripts/prepare-pointr-ios.mjs \
  /path/to/PointrKit.xcframework \
  /path/to/MapLibre.xcframework \
  /path/to/websdk.html
cd apps/PointrPlayground
xcodegen generate
open KozmosPointrQA.xcodeproj
```

The preparation script refuses to overwrite existing frameworks/configuration.
It verifies simulator slices and the Pointr version; it does not execute sample
build scripts or reproduce the sample's credential-bearing package URL.
The generated project, local frameworks and QA configuration are ignored by Git.

Choose **KozmosPointrQA** and an iPhone simulator. CLI equivalent:

```sh
xcodebuild -project KozmosPointrQA.xcodeproj -scheme KozmosPointrQA \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.5' \
  -derivedDataPath /tmp/kozmos-pointr-qa-xcode CODE_SIGNING_ALLOWED=NO build
xcodebuild -project KozmosPointrQA.xcodeproj -scheme KozmosPointrQA \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro,OS=26.5' \
  -derivedDataPath /tmp/kozmos-pointr-qa-xcode CODE_SIGNING_ALLOWED=NO test
```

Bundle identifier: `com.kozmos.pointrqa`. Install/run for the current simulator:

```sh
xcrun simctl install 51937B59-CEAE-4BC7-BC34-FEB17E28FAE7 \
  /tmp/kozmos-pointr-qa-xcode/Build/Products/Debug-iphonesimulator/KozmosPointrQA.app
xcrun simctl launch 51937B59-CEAE-4BC7-BC34-FEB17E28FAE7 com.kozmos.pointrqa
```

## Editing map

| Concern                                                      | Source under `apps/PointrPlayground`            |
| ------------------------------------------------------------ | ----------------------------------------------- |
| SDK initialization, lifecycle, callbacks and map-only policy | `Sources/App/SDKSession.swift`                  |
| SDK POI → Kozmos presentation                                | `Sources/App/SDKPOIAdapter.swift`               |
| Shell, search, controls and panel composition                | `Sources/App/SDKMapScreen.swift`                |
| Framework embedding, app settings and test target            | `project.yml`                                   |
| Configuration and chrome-policy tests                        | `Tests/SDKIntegrationTests.swift`               |
| Local QA credentials and starting site/building              | `Sources/App/Resources/QAConfig.json` (ignored) |

Initial configuration selects Boston Logan Airport / Central Parking. The active
building and floor subsequently follow the SDK's map callbacks, so panning or
selecting a POI can move the UI to another building (Terminal B was observed).
Floor keys use building ID + SDK level index consistently across the list,
selector and detail presentation. Inherited feature identifiers are not treated
as the cross-manager floor key.

The app explicitly asks the data manager to load site content and listens for
readiness/POI changes. A rendered vector map alone does not establish POI-data
readiness. Empty-query results show the active floor; a text query searches names
across the active building's loaded POIs. It is not yet SDK-ranked category or
proximity search. Missing SDK values remain absent; no fixture rating, hours,
price or availability are filled in.

## Verification and remaining work

Verified on iPhone 17 Pro / iOS 26.5, Xcode 26.6:

- Native app build and correct embedding of both frameworks.
- QA SDK registration, map rendering and POI data loading (210 Central Parking
  POIs and 306 Terminal B POIs were observed; counts are not fixed expectations).
- Search results from real SDK data; list selection focused a real map marker
  and displayed Airport Shuttles in our Kozmos panel.
- Kozmos floor selection changed Terminal B from L1 to L2, changed the SDK map
  and produced second-floor results (Air Canada was observed).
- Independent favourite/bookmark controls changed selected appearance. They are
  explicitly session-local and are not saved to Cloud or an SDK account.
- Five focused unit tests pass: approved configuration, rejected origins/URL
  credentials, missing/blank configuration, HTTPS artwork and default chrome off.
- No cloud edits/publishing and no production credentials or SDK binaries committed.

Not yet complete or certified:

1. **Routing:** real route calculation, selectable origin, route options, preview,
   live instructions, rerouting and cancellation. No fake Go action is displayed.
2. **Rich taxonomy:** property/value dictionary mapping into highlights, icons,
   groups, opening hours and action buttons. The current native adapter renders
   basic SDK name/location/media/description and free-text tags only. It does not
   claim parity with the full fixture POI card.
3. **Search:** SDK ranking, categories, keyword matching, pagination and a polished
   results transition while an existing card is open.
4. **Failure/accessibility matrix:** timeout/offline recovery, VoiceOver, large text,
   RTL, landscape/tablet, map attribution placement and all gesture interactions.
   Retry is implemented; live failure injection is not yet verified.
5. **Positioning:** live location/Bluetooth/motion flows and physical-device/on-site
   validation. Permission delegates decline automatic requests in this browse-only
   milestone; user-facing positioning controls are intentionally absent.
6. **Release/CI:** approved artifact access for CI, native license constraints,
   signing, attribution review, privacy/analytics policy and artifact retention.
   The QA-specific tests are local, not added to public CI with bundled credentials.

Next implementation: connect an explicit start/destination route through the SDK
and our route components, then map real taxonomy properties into the card. Retain
the fixture playground as the deterministic visual/edge-case test surface.
