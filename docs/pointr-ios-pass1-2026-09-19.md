# Pointr iOS — Pass 1: the native browse experience, 19 September 2026

Claude Code, continuing [Astra's handoff](claude-code-handoff-2026-09-19.md). Branch
`claude/pointr-browse-repairs`, cut from `astra/browser-compatibility` at `663cde1` in the same
worktree, `/private/tmp/kozmos-browser-compat.uqPMBD`. Local commits only: nothing is merged,
pushed or published, and no Cloud content was touched.

Every "measured" below comes from the real QA app on an iPhone 17 Pro simulator (iOS 26.5),
connected to Design-QA, with Dunkin' (Terminal B, Second Floor) as the case the handoff reported.
Positions are window points, read from 3× simulator screenshots.

## Commits

| Commit    | What                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| `21c7cbf` | Astra's handoff, committed verbatim so the branch carries it                          |
| `7e03485` | Native map shell saturates opposing insets at the map's size, as React does           |
| `4061d92` | QA host: controls anchored (A), selected pin kept in view (B), sheet presentation (D) |
| `aa4a6c0` | QA host: a selected place stays framed when the sheet settles mid-flight (B)          |
| `7b4a868` | Native gallery: one index for strip, buttons and counter; real states (C)             |

## A. Map controls — fixed

**Cause.** `.bottom` gives the controls slot the map's full width and leaves the corner to the
caller. The host passed an unanchored `HStack`, so the cluster sat centred over the map.

**Fix.** The cluster is anchored to the trailing edge above the sheet, with the levels outermost,
as in the fixture playground. At a tall detent the cluster no longer fits between the top bar and
the sheet, and it had overflowed upward over the search bar. The shell proposes the slot only the
height that is left, so a `ViewThatFits` drops zoom first, then everything. Its last child is a
zero-size view: `EmptyView` adds no child at all, and `ViewThatFits` then fell back to the floor
selector, which still covered the search bar.

**Measured.** Trailing in left-to-right, and on the left in right-to-left. At the large detent
nothing is drawn over the search bar. Collapsed and medium show the full cluster.

**Open.** The fixture playground has no zoom buttons on phones ("the map is pinched and dragged").
The QA host keeps zoom and compass because the handoff asked for anchoring, not removal. That
choice is Olcay's.

## B. Selected marker under the search bar — fixed

**Measured first.** MapLibre's `automaticallyAdjustsContentInset` is off, so nothing was overwriting
the host's padding. `focusPoi` centres the place's anchor exactly in the inset viewport: the window
point was (201, 213.78), the viewport's centre. The highlighted pin is drawn upward from that anchor.
It is a 72pt disc whose top sits 95.2pt above the anchor. At the medium detent the free band above
the anchor was 79.8pt: a 778pt map, less a 72pt top bar, a 373.4pt sheet and a 173pt controls band,
leaves 159.6pt. So the pin's head went about 15pt under the search bar.

**Fix.** The session owns camera padding. While a place is selected it adds the pin's height to the
top padding, which centres the pin rather than its anchor (`SDKCameraPadding`). A band shorter than
the pin rests the anchor on the band's lower edge. The pin height, 96pt, is measured, not read from
an API: PointrKit exposes no marker geometry. Re-measure it after a PointrKit or style update.

The native shell also reported more inset than the map had height at the large detent: 72pt top and
857.6pt bottom on a 778pt map. React's `resolveMapInsets` saturates opposing edges, and the native
shell now does too (`7e03485`, two tests that fail on the old shell).

**Found while testing, and fixed.** Select a place from a fresh launch, then move the sheet before
the camera lands, and the place ended off-centre at a lower zoom. Logged: the sheet's inset change
arrived after `focusPoi` and before it landed, the flight ended at zoom 15.07 (its start), and the
padding change re-centred there. MapLibre's `contentInset` setter re-centres on the current centre,
which cancels a flight. Until the visitor moves the map, a padding change now focuses the selected
place again. PointrKit's own events say when they move it, measured: a pan reports
`mapDidReceivePan`, a pinch `didZoom`, and a `focusPoi` flight neither. The zoom buttons end the
framing too.

**Measured after.**

| Case                                 | Pin top         | Anchor                   | Room below the search bar |
| ------------------------------------ | --------------- | ------------------------ | ------------------------- |
| Before, medium                       | about 118.6     | 213.8                    | −15.4 (under the bar)     |
| Medium                               | 166.0           | 261.3 (predicted 261.78) | 32.0                      |
| Collapsed                            | 282.7           | 378.0                    | 148.7                     |
| Medium → large → collapsed           | 282.7           | 378.0                    | same as undisturbed       |
| Sheet moved mid-flight, fresh launch | 282.7           | 378.0                    | same as undisturbed       |
| Panned, then detent changed          | follows the pan | 187.7 (predicted 187.6)  | not re-framed, by design  |

Right-to-left frames the same way (screenshot; not measured with the script).

## C. Native gallery — fixed

Every gap in the handoff is closed. The contract is React's, not its implementation.

- **One index.** Scrolling moves it, from the tile nearest the leading edge (the web's rule). That
  rule stays right at the end of the strip, where the last tile cannot reach the edge. Buttons, a
  controlled value, a width change and new media move the strip. A non-zero starting index is
  scrolled to.
- **Paged.** View-aligned snapping on iOS 17 and later. iOS 16 scrolls freely and still tracks the
  index.
- **States.** Loading, loaded and unavailable are distinct. A failed load retries on tap and by
  accessibility action. Media addresses follow the property-icon rule; anything else is unavailable
  at once.
- **Layout.** Tiles are 85% of the width so the next shows, 4:3, with the 16pt control radius and
  outline arrows that mirror with the strip. A fill-scaled image used to widen its own tile to 370pt.
  The tile's surface now takes the tile size and the image is an overlay (measured 314.5pt).
- **Labels.** `KozmosPOIDetailPanel` passes the gallery the same labels React's panel does.

**Measured live, left-to-right and right-to-left.** Forward and back update the counter, the strip
and the arrows' disabled states. A finger swipe updates the counter; this is the defect the handoff
could only confirm in source. A 130pt swipe snaps to the next tile. A vertical drag that starts on
the gallery scrolls the card, not the gallery. Neither gesture moves the map.

**Tests.** Ten new. Eight are geometry and address rules, run on macOS and iOS. One measures that a
right-to-left strip reports physical coordinates: the nearest-tile rule rests on this, and the live
app cannot show it because both readings agree at rest. One renders refused media in both
directions. The package suite runs 82 tests on iOS 18.4 (iPhone 16), including the button image
baselines, and 80 on iOS 26.5 (iPhone 17 Pro) with those two methods skipped, as before. All pass.

**Not verified.** The controlled-parent refusal path (no caller in either app controls the gallery).
Retry after a real network failure: the Dunkin' images load, and only refused addresses are
rendered, in a test snapshot. VoiceOver, including reaching tiles `LazyHStack` has not built yet.
The iOS 16 path: it compiles, but no iOS 16 runtime is installed.

**Policy question, not patched.** The Dunkin' brand image arrives in `imageUrls`, not `logoUrl`, so
it is photography by contract and is cropped to fill. The web crops it the same way. Showing brand
artwork whole is a decision for both platforms: `contain` for every image, or a role in the data.

## D. Card inside the sheet — fixed on phones; a finding on iPad

The host now passes `.sheet` when the panel is docked and `.panel` when it floats. This is the
rule the React handoff documents, and the fixture playground already uses it. On a phone the inner
bordered card is gone (measured on screen).

In regular width (iPad), a hosted render of the shell shows the card's 1pt border drawn inside the
shell's floating container. Present on the left, right and bottom edges, it has to disappear within
about 19pt of each corner: the card's 16pt corners fall outside the shell's 24pt clip. `.sheet` there
draws no border. The fixture playground composes the same way. The fix is an ownership decision
(does the shell or the card own a floating panel's chrome?), so it is reported here, not changed.
Access to the iPad simulator was not granted, so the live iPad app was not driven.

## Also found

- **SpringBoard crashes on iOS 18.4 simulators.** Three reports (17 Sep 12:45, 19 Sep 12:27 and
  19:11) all show the same `dispatch_assert_queue` trap in `SBRecentAppLayoutsPersister` during
  SpringBoard start-up, on iOS 18.4 devices booted headless by `xcodebuild`. There are no app frames.
  It is a simulator runtime issue on this Xcode/macOS, not a QA app crash.
- The native POI fixtures carry no media ("No invented logos or photos were added"). So apart from
  the live SDK, the gallery's only evidence is its tests.

## Not started

E (rich live data), F (search and selection lifecycle), G (floor certification), and Passes 2–4.
The keyboard was not exercised: the simulator uses a hardware keyboard. Landscape was not driven.

## Reproduce

```sh
cd /private/tmp/kozmos-browser-compat.uqPMBD/apps/PointrPlayground
xcodegen generate
xcodebuild -project KozmosPointrQA.xcodeproj -scheme KozmosPointrQA \
  -destination 'platform=iOS Simulator,id=51937B59-CEAE-4BC7-BC34-FEB17E28FAE7' \
  -derivedDataPath /private/tmp/kozmos-pointr-qa-xcode CODE_SIGNING_ALLOWED=NO test   # 11 tests
cd ../../packages/ios && swift test                                                   # macOS, 75 tests
xcodebuild -scheme Kozmos -destination 'platform=iOS Simulator,name=iPhone 16,OS=18.4' \
  CODE_SIGNING_ALLOWED=NO test                                                        # 82 tests
```

Force right-to-left for a live check by launching with
`-AppleTextDirection YES -NSForceRightToLeftWritingDirection YES`.
