# POI reference implementation: follow-up review

## Latest clarification — three-item metadata cap

The 22:29 user clarification supersedes this report's earlier horizontal-scroll
recommendation **for POI detail highlights**. At most three priority-ordered items
now share the panel width equally. Values/details reflow naturally; one or two
items use a single text line when they fit. Narrow and enlarged-text cells can
stack their icon above text. No hidden fourth item or scrolling metadata strip.
The generic MetaStrip keeps its existing behavior. See
`poi-taxonomy-display-2026-09-18.md` for selection policy and edit locations.

Verification of this correction: 491 React tests; all 198 POI examples across
Chromium, Firefox and WebKit with zero axe violations/incomplete results;
owned-CSS checks with and without legacy scope in all three engines; React
build/lint, Docs build/typecheck and component/compiled-class contracts.
Browser assertions cover the three-item cap, equal cell widths, no overflow,
one-line text for the spacious one/two-item examples, and 200% text reflow.

## Verdict and scope

This pass found functional defects and a narrow-layout readability problem, not
just polish. They are repaired with regression coverage. It also completes the
remaining venue examples supplied in the screenshots. This is a review of the
POI reference slice and its shared dependencies, **not certification of the entire
design system, SDK, or an npm release**. No software review can prove perfection.

Work continues on `astra/browser-compatibility` in
`/private/tmp/kozmos-browser-compat.uqPMBD`. The shared main checkout is untouched.
The independent port-6006 preview is updated after the local commit. Nothing is
pushed, merged or published by this pass.

## Findings and repairs

| Finding                                    | Repair and evidence                                                                                                                                                                                                                                 |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gallery index was not the visible image    | A built-package reproduction announced “Controlled image 3 of 3” while scrollLeft remained zero. Default/controlled values, buttons, Home/End, directional arrows and native scrolling now agree with actual image geometry.                        |
| Gallery alignment could move its parent    | Alignment targets only the gallery scrollport, not `scrollIntoView`. The browser gate verifies the enclosing panel does not scroll.                                                                                                                 |
| Stale/invalid gallery selection            | Finite integer clamping, shrink/empty handling, resize and inherited RTL direction changes are covered. Controlled parents can accept or reject requests; repeated rejection is checked. Selection remains positional, not identity-based.          |
| Intermittent command/native-scroll race    | Delayed acknowledgements of programmatic alignment no longer schedule redundant realignment that could undo the next native scroll. Repeated rapid keyboard/native transitions are required; three consecutive WebKit runs passed after the repair. |
| POI selection retained old scroll          | Changing `poi.id` resets the panel's own scroll. Refreshing the same POI preserves it. Forwarded refs remain supported; focus still belongs to the host.                                                                                            |
| Failed logo displayed a broken image       | Failed logos are omitted without losing the title. A changed source retries. No fabricated replacement brand.                                                                                                                                       |
| Summary words fragmented at 320px          | Summary cells now wrap with a readable basis and separators that work across rows. The browser gate measures room for an ordinary accessibility word, in addition to overflow checks.                                                               |
| Missing venue coverage                     | Added retail, fitness, parking and full-field catalogue examples. Fixture tests enforce unique collection keys and prevent restaurant-only groups/actions leaking into unrelated venues.                                                            |
| Geometry tests used an invalid global stub | Removed the DOMRect replacement whose edges were always zero; tests now use jsdom's actual DOMRect. Full React suite passes without that shortcut.                                                                                                  |
| Gallery styling/localization gaps          | Component-owned CSS works without CSS scope; control-group label is localizable, failure labels handle empty alt text, and the synthetic story SVG has a valid fill.                                                                                |

The frontend-design skill guided the visual work: retain the supplied anatomy
and existing Kozmos tokens, inspect actual rendered output, and prefer readable
reflow over clipping, tiny targets or invented media.

## What is implemented

### Measured-detail pass (21:51 screenshot references)

The latest screenshots clarify the compact information-tag spec and navigation
hierarchy. They supersede the earlier suggestion to enlarge informational tags
to 44px: that would conflate non-interactive information with action targets.

- Go: 16px/24px semibold label, 24px navigation glyph, 16px horizontal padding,
  and the existing ~11px/14px estimate token. The button remains at least 44px
  tall (56px with the estimate). Text may grow instead of being line-clamped.
- Information chips and hashtags: 32px minimum height, ~13px/16px type, 12px
  horizontal padding, 16px corners and vertically centered content. The screenshot
  also says 8px vertical padding plus a 1px border; that sums to 34px with its
  16px line box, not 32px. We use 7px inner vertical padding to honor the 32px
  border-box height, rather than clip text. Long text and zoom can increase height.
- Favourite/bookmark: Pointr's existing exported outlines, with a themed filled
  selected state rather than just filling the glyph. Unselected state stays
  outlined and `aria-pressed` remains controlled. Existing press feedback stays;
  no extra bounce/autoplay is introduced from an annotation alone.
- Share, booking, order and phone use the repository's Pointr icons. Navigation
  keeps the matching registered Lucide pointer. No paths were traced/redrawn.
- Dietary and crowd summaries reuse Pointr's feather and clock-plus glyphs.
- Optional attribute/service icons: group items reuse POIServicePresentation's
  `iconName` field. WiFi fixtures demonstrate the 16px decorative glyph and 4px
  gap. Missing, unknown or inherited-property names preserve text safely. Icons
  are assigned explicitly, never inferred from translated labels. This additive
  contract is checked in installed React 18/19 consumers.
- The Step-free reveal story incorrectly showed a focus/crosshair icon. It now
  uses the existing wheelchair-style accessibility glyph at 24px. Exact source
  wheelchair artwork is not available; it has not been fabricated.

Frontend-design and Figma-to-code guidance informed this pass. Figma's design
context tool was unavailable; measurements come from the user-provided inspector
screenshots, not a claim of a fresh authenticated Figma inspection. Readex Pro
is not shipped in this repository. The deliberate system-font policy remains;
changing that requires approved font assets and a separate cross-product metrics
review. The source tag's 17px radius is also intentionally superseded by the
user's explicit 16px instruction. Metadata still has exactly one row of cells.

The changes are confined to SDK POI composition and its optional data, plus the
Step-free story. They do not silently redesign the standalone Tag/Chip catalogue.
Real map/route integration, approved media, brand-font choice and device/manual
acceptance remain open; UI test counts do not settle those questions.

Verification for this measured-detail pass: 475 React tests, 198 POI cases across
Chromium/Firefox/WebKit, owned-CSS gates with/without scope in all three engines,
installed React 18/19 consumers, builds, lint/type checks, compiled classes and
CSS compiler tests passed. Browser checks now assert the actual Go text/icon
metrics, 32px WiFi tag height, 16px decorative icon, and selected fill/outline.
The selected fill comparison moves the pointer off the button first: comparing a
hovered save button with an idle navigation button would compare different
intentional tokens. No accessibility rule was disabled. Step-free's 24px glyph,
controlled reveal and narrow/reduced-motion behavior were smoke-tested in both
themes. The earlier catalogue-wide Docs results are not a new full visual audit.

### User-directed single-row metadata correction

The requested interaction is one row of metadata cells, never a wrapped second
row. This supersedes the earlier wrapping-cell repair: that avoided fragmented
words but did not meet the product's layout requirement. POI summary facts now
compose the existing MetaStrip/MetaStripItem primitives rather than maintaining a
separate layout. At constrained widths or enlarged text the strip scrolls locally
with touch/trackpad or keyboard (arrows, Home/End); it does not hide facts, shrink
type, or expand the document width. Labels may occupy multiple text lines within
a single cell, as in the source reference, but cells never form a second row.

MetaStrip's styles are now component-owned, including its description-list
labels, separators and focus treatment. Its 64px minimum height can grow for
readable text. Cells center the icon/text group; text within the group uses
logical start alignment. The POI header vertically aligns title and controls;
Go/estimate text shares a starting edge. Palette and 16px corners are unchanged.
The frontend-design skill guided the rendered alignment check against the brief.

The POI browser gate checks one-row geometry and keyboard access to overflow;
the owned-CSS gate checks the same composition with and without scope, in nested
themes and RTL. Unit coverage verifies that the POI uses the shared primitive.
The follow-up passes 473 unit tests, 198 POI browser cases, the three-engine
owned-CSS gate, Chromium Storybook interactions, React/Docs builds and type/lint
checks. Installed React 18/19 consumers also pass. The earlier whole-Docs and
gallery-specific results below belong to the preceding review, not a new claim
that every catalogue state was re-audited for this small alignment correction.

### User-directed corner correction

The follow-up screenshot exposed a missed shape requirement: the panel used
20px container corners, while icon buttons and information chips used the pill
token. POI surfaces, chips, gallery media and controls now use the existing
16px control-radius token. Shared React IconButton no longer overrides Button
with a pill radius; its hit area remains 44×44px. Edge-attached sheet bottoms
remain square. This is component styling, not a Storybook decorator override.

The POI browser gate now asserts all four rendered corners of relevant elements;
the installed-build owned-CSS gate checks the panel, header button, chips and
hours in both themes, with and without scope. Visual inspection confirmed the
header controls are rounded squares. The frontend-design skill guided this
correction to the user's explicit shape direction, without changing the palette.

Scope: POI detail/gallery compositions and shared React IconButton. The global
Container (20px), Panel (24px) and Pill roles are not rewritten by this correction.
Extending a uniform 16px policy across the entire catalogue is a separate design
decision, including genuine-circle exceptions and native/Figma parity. Existing
native reference snippets are not proof of that cross-platform change.

### Reference compositions

One reusable `POIDetailPanel`, not separate restaurant/retail/parking components.
Eleven Storybook acceptance stories: Restaurant, Entrance, Retail, Fitness,
Parking, Full Field Catalogue, On Map, Missing Data, Failed Media, Action States
and Long Content. The full-field catalogue is a synthetic schema exercise, not a
claim that a single venue has every attribute.

Optional detail data supplies summaries, ordered groups, opening hours,
plain-text descriptions, tags and book/call capabilities. No new venue-specific
public contract was needed in this pass. Two optional labels were added:
`POIMediaGallery.controlsLabel` and `POIDetailPanel.mediaControlsLabel`.

Changing POIs resets detail expansion and gallery selection as well as panel
scroll. The story host resets its demo state by POI ID. Production save state
must instead be owned/persisted by the product, normally keyed by POI ID.

## Verification

Results from the final implementation:

- 472 React tests in 113 files passed; React production build, React lint and
  Docs typecheck passed.
- 198 POI browser cases passed: 11 stories × two themes × three host sizes
  (320×568, 568×320, 1280×800) × Chromium/Firefox/WebKit. Zero automated WCAG A/AA
  violations and zero incomplete findings in this matrix. Map rotation and 200%
  text reflow checks are included, but not physical device/zoom certification.
- 36 built-package gallery cases passed: two CSS modes × two directions × three
  widths × three engines. Each repeats command-to-native-scroll transitions and
  rejected controlled requests. The final WebKit implementation also passed three
  consecutive full runs. Native events are exercised without relying on screenshots
  or only checking the announced counter.
- Owned-CSS regression gates passed in all three engines, with and without scope.
- Static Storybook build, 99 public Docs pages at two widths, 164 snippet-section
  checks, keyboard navigation and axe passed. The existing Chromium Storybook
  interaction regression suite passed.
- Installed tarballs passed React 18/19, strict Node16/NodeNext ESM/CJS consumers,
  SSR, public declarations, rich POI usage and all 82 existing React recipes.
- Component contracts, compiled-class validation, nine CSS compiler tests and
  source snippet validation passed. A stale-CSS refusal during development was
  resolved by rebuilding, not bypassed. Storybook's large-chunk warning remains
  visible; it is not reported as a clean bundle-size review.

Generated screenshots and JSON live in ignored `test-results/poi-detail-examples/` and
`test-results/poi-gallery/`; CI uploads both directories. Old screenshots can
remain locally: use the current JSON report, not an old `*-failed.png` filename,
to determine the latest result.

## How to change it yourself

All paths below are repository-relative; work from the implementation checkout
above, or check out its branch in your chosen clean worktree.

- **Venue content:** `packages/react/src/components/POIDetailPanel/POIDetailPanel.fixtures.ts`.
  Add a typed `POIPresentation` and `POIDetailsPresentation`; do not copy a whole
  component. Use stable IDs, already-localized labels, and only supported actions.
  Omit unknown facts; an unknown opening/accessibility state is not “open” or
  “accessible”. These fixtures are illustrative, not production defaults.
- **New example:** import that pair into `POIDetailExamples.stories.tsx` beside
  the fixtures and export a story with `args: { poi, details }`. Add its kebab-case
  story suffix to `scripts/check-poi-detail-examples.mjs` and add meaningful
  capability assertions. Add the fixture to `POIDetailPanel.fixtures.test.ts`.
- **Public API:** `packages/product-contracts/src/index.ts`; React props and
  action wiring in `POIDetailPanel.tsx`. Review downstream consumer compatibility
  before altering required fields. Keep network calls, mapping, venue timezone,
  data freshness, authentication and business rules outside the component.
- **Section rendering:** `POIDetailContent.tsx`. Attribute chips are semantic
  list items, not pretend buttons. Descriptions are plain text, not injected HTML.
- **Visual anatomy:** `packages/react/src/styles/owned-poi-detail.css` and
  `owned-poi-gallery.css`. Use existing tokens. Do not introduce app-wide CSS,
  hide overflow to pass tests, reduce targets, or add Tailwind safelist patches.
- **Media behavior:** `POIMediaGallery.tsx` and its unit test. Preserve the
  controlled contract, reduced-motion behavior and gallery-only scrolling.
  If media order changes and a particular ID must stay selected, the host maps
  that ID to the new `activeIndex`.
- **Documentation:** both component MDX files, this report, and
  `docs/poi-reference-examples-2026-09-18.md`. Update the patch changeset when
  changing published behavior; do not run version/publish merely to test it.

For a real consumer, import from `@kozmos/react` and load its exported
`style.css`; use `ThemeProvider`, not internal source paths. Follow the installed
consumer examples in `scripts/check-package-install.mjs`. Wire `onAction`,
controlled action states and `onSupplementaryAction` to the product adapter.
Book/call without a handler stay disabled. Supply translated media controls,
position/failure labels, close/read-more labels and venue-local hours. Define
focus entry/restoration at the actual navigation surface; a non-modal map panel
must not silently become a focus-trapping dialog.

### Reproduce the checks

```sh
pnpm install --frozen-lockfile
pnpm --filter "@kozmos/react..." build
pnpm --filter @kozmos/react test
pnpm --filter @kozmos/react lint
pnpm --filter @kozmos/docs typecheck
pnpm components:contract:check
pnpm components:classes:check
pnpm test:css-build
pnpm docs:snippets:check
pnpm packages:install:check
pnpm test:poi-gallery
ADAPTIVE_BROWSER=firefox pnpm test:poi-gallery
ADAPTIVE_BROWSER=webkit pnpm test:poi-gallery
pnpm test:owned-css
ADAPTIVE_BROWSER=firefox pnpm test:owned-css
ADAPTIVE_BROWSER=webkit pnpm test:owned-css
pnpm --filter @kozmos/docs build-storybook
python3 -m http.server 6012 --bind 127.0.0.1 --directory apps/docs/storybook-static
```

Keep that server terminal open. In another terminal at the same checkout:

```sh
STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:poi-details
STORYBOOK_URL=http://127.0.0.1:6012 ADAPTIVE_BROWSER=firefox pnpm test:poi-details
STORYBOOK_URL=http://127.0.0.1:6012 ADAPTIVE_BROWSER=webkit pnpm test:poi-details
STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:storybook-docs
STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:storybook-interactions
```

If browsers are missing, run `pnpm exec playwright install chromium firefox webkit`.
For interactive editing run `pnpm --filter @kozmos/docs storybook` on a free port.
Build React CSS before testing; do not rebuild while auditing a source-backed
Storybook. A stale-style failure means rebuild and retry, never bypass the gate.

## Remaining decisions before production

1. **Actual assets and approved visual parity.** The screenshots contain media
   placeholders, not exportable photos. Supply licensed photos, alt text and logo
   assets. Payment methods are text, not recreated trademarks. Figma inspection
   needs authenticated access. Current typography, target sizes, wrapping actions
   and hours-after-groups order deliberately differ from screenshot pixels.
2. **Real SDK adapter and one installed-package pilot.** Identify the end-user
   SDK repository and test environment. Validate the actual data contract,
   map/camera occlusion, selection lifecycle, save persistence, permissions,
   route/share/call/book flows and failure/loading states. The map remains an
   explicitly labelled placeholder; demo action messages do not perform work.
3. **Sheet and rich-content contract.** Approve whether actual drag/snap/dismiss
   gestures are required. The example uses an honest expand/collapse button, not
   a decorative drag handle. Decide on section ordering, optional attribute icons
   and any sanitized rich-description schema before freezing the public API.
4. **Manual device/accessibility acceptance.** Physical portrait/landscape and
   fold/unfold, hinges, safe areas, virtual keyboard, browser zoom, touch/trackpad
   inertia, VoiceOver/TalkBack and meaningful translated content. Desktop WebKit
   emulation and axe do not replace this. Native scrolling is exercised
   programmatically; actual finger gestures are not certified.
5. **Existing release gates remain.** This pass does not clear the earlier 48-case
   manual accessibility queue, native/Vue reference compilation/support gaps,
   minimum-browser decision or authenticated product acceptance. Review
   `production-readiness-recheck-2026-09-18.md`,
   `snippet-validation-2026-09-18.md`, `installed-product-pilot-2026-09-18.md` and
   `public-catalogue-guide-2026-09-18.md` for their latest scoped evidence. CI must
   pass remotely after an authorized push; review package versions, changesets,
   documentation and publishing permissions before an explicit npm release.

Recommended next step: approve these five venue compositions with real assets,
then integrate one real SDK detail flow from installed tarballs. Another unlimited
catalogue pass is less useful than completing those specific acceptance gates.
