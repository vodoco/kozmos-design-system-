# Overnight quality pass — 2026-09-18

Authorized: continue local design-system repairs, plan the work and commit verified
batches. Not authorized: push, merge, publish, credentials, account settings or
guessing design decisions. Worktree: `/private/tmp/kozmos-browser-compat.uqPMBD`,
branch `astra/browser-compatibility`; starting commit `df47b53`.

## Plan and acceptance criteria

1. Fix Select's exposed focus/accessibility failure without suppressing axe rules.
   Verify controlled/uncontrolled opening, nested Dialog, custom portal, unmount,
   exact restoration of pre-existing inert state and keyboard focus in three engines.
2. Discover failures across every indexed Storybook group, then repair reproduced
   accessibility/layout/component-state defects in bounded batches. Add stateful
   tests: initial-story scans alone cannot certify interactive components.
3. Address shared stylesheet and package declaration debt where changes can be
   verified safely; document incomplete work rather than manufacturing a clean gate.
4. Rebuild the completed commits in the separate preview checkout, refresh Storybook
   on port 6006, and leave a source/command/result handoff and explicit release gates.

## Baseline discovery

`node scripts/audit-storybook.mjs` against the production Storybook built from
`df47b53`: **408 cases, 102 groups, 50 failing cases across 15 distinct groups**.
Two themes and 320/1280px widths, Chromium. The first progress message mistakenly
said 16 groups; 15 is the count from the report. This selects Default (or the first
story if no Default exists), not every story/interactive state.

Local generated evidence: `test-results/storybook-baseline-df47b53.json` (ignored).
Findings: ColorPicker invalid ARIA; unnamed Select/Slider/Progress and POICard story
actions; unnamed WayfindingCard actions; inaccessible scrolling in ScrollArea,
MetaStrip, Table, POIMediaGallery and MapSearch; narrow Pagination/SegmentedControl/
Wayfinding layouts; Stack story contrast; and a portal-only POI example which the
first scanner's inline-ready check did not understand. Reproduce and distinguish
harness errors from product defects before counting a repair.

## Batch 1: document-modal Select interaction

Select's existing primitive hides the background from assistive technology but did
not make its focusable content inert. `utils/modal-inert.ts` now owns only HTML
`inert` attributes, independently of Radix's ARIA counters. It preserves live
announcements, supports newly inserted roots, tracks the latest popup, and restores
exact original attributes. A stable SelectContent ref acquires/releases ownership;
cleanup occurs before the primitive restores trigger focus. No ARIA role is changed.

New browser test failed first on both host and trigger `aria-hidden-focus`, then
passed five lifecycle cases in Chromium, Firefox and WebKit. Unit tests cover
ownership, stacking, mutation and idempotent/out-of-order cleanup. Tests await actual
finite opening animations before measuring contrast rather than sampling a partially
transparent fade. The original focus-trapping primitive is retained.

Native inert support in the tested engines is proven, not certification of Pointr's
still-unagreed minimum browsers. Do not claim polyfilled legacy inert support, or
independent modality for arbitrary simultaneous third-party modals. Existing
document-modal semantics remain document-wide.

Commands: `pnpm test:select-accessibility` and the same command with
`ADAPTIVE_BROWSER=firefox` / `webkit`; unit file
`packages/react/src/utils/modal-inert.test.ts`. CI runs all three engines.

## Batch 2: library-wide discovery and repairs

The scan was widened to **all 236 indexed React stories**: 944 initial-render
cases (light/dark, 320×568 and 1280×800, Chromium). This exposed additional
variant-only failures beyond the original 15 groups. The first all-story run
after the initial repairs still had 23 failing cases; the generated reports are
retained locally under `test-results/`. These are observations, not waivers.

Repairs and their source locations (relative to this worktree):

| Area                | What changed / where to edit                                                                                                                                                                                                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Progress            | `components/Progress/Progress.tsx`: pass the value to Radix and normalize the visual fill against `max`. Determinate semantics now agree with the picture.                                                                                                                                                                              |
| Input accessibility | `components/{Slider,Select,ColorPicker}/`: merge caller descriptions with errors, preserve invalid state, send Slider names/descriptions to thumbs, and keep popup state on ColorPicker's actual toggle.                                                                                                                                |
| Icon-only controls  | Badge icon size has image semantics; WayfindingCard/WayfindingInputRow have localizable `closeLabel`, `originLabel`, `destinationLabel`, `swapLabel`. Story authors supply meaningful names for Select, Slider, Progress and POICard actions.                                                                                           |
| Scrollable content  | `components/{ScrollArea,MetaStrip,Table,POIMediaGallery}/`: keyboard entry points. `ScrollArea.viewportProps` names/customizes the actual viewport while the existing ref stays on its wrapper. `utils/keyboard-scroll.ts` handles horizontal keys on focused semantic lists, including RTL, without consuming descendant-control keys. |
| Narrow layouts      | Pagination wraps; SegmentedControl scrolls within its host and reveals the focused segment; disabled segments remain inspectable by keyboard. MetaStrip contains its visually hidden labels. Wayfinding fields shrink correctly and reserve room for their swap action. SaveLocationCard actions wrap.                                  |
| Examples/themes     | RTL examples follow the toolbar; map placeholders and Stack use paired theme roles; DynamicIsland inherits its inverse foreground; POICard's open status uses Tag's existing success emotion.                                                                                                                                           |

All component paths above are under `packages/react/src/`. Story-only layout
changes remain in `.stories.tsx`; they are not global consumer resets. Existing
background/surface choices have not been hidden with `overflow: hidden` on the
page. Scrollable content stays reachable.

### Button contrast is a token repair, not a CSS patch over a bad palette

The old gate covered 50 checks but missed emotional button states. It now checks
**194** pairs/aliases, including every enabled emotion in idle/hover/pressed/focus.
The new assertions failed before the repairs. Existing palette aliases replace
34 problematic component-token values (30 light, 4 dark), preserving token names
and Figma variable IDs. Light success/alert fills become darker; neutral, success,
danger and informative text treatments use readable steps. Secondary emotion
hover surfaces use the muted role rather than inheriting a themed blue background
under unrelated coloured text. All 18 showcased emotion treatments are also
measured in real-browser hover states in both themes.

Edit canonical values in `packages/tokens/src/tokens-{light,dark}.json`, never in
`dist`. `scripts/check-token-contrast.mjs` is the expanded guard; the React hover
recipe is in `packages/react/src/styles/owned-components.css`. Generated native
colour copies and `docs/figma-foundations-payload.json` were refreshed. The Figma
file itself was **not** mutated: import/review the payload through the established
plugin workflow before declaring design/code parity.

### How to change and verify this work yourself

Work from `/private/tmp/kozmos-browser-compat.uqPMBD` on
`astra/browser-compatibility`, **not shared main**. First check `git status` and
`git log -5 --oneline`. Do not overwrite someone else's edits or run the release
command merely to test a build.

```sh
pnpm install --frozen-lockfile
pnpm tokens:build
pnpm --filter @kozmos/react build
pnpm --filter @kozmos/react test
pnpm --filter @kozmos/react lint
pnpm --filter @kozmos/docs typecheck
pnpm tokens:contrast:check
pnpm tokens:raw:check
pnpm components:classes:check
pnpm components:contract:check
pnpm packages:install:check
pnpm --filter @kozmos/docs build-storybook
```

Build dependencies first in a completely fresh checkout using
`pnpm turbo run build --filter="./packages/*"`. Tarball checks require network
access. The native check uses Xcode/Swift and an Android SDK; point `ANDROID_HOME`
at your installed SDK, then run `pnpm native:check`. A successful compile does not
certify mobile layout, screenshots, screen readers or real foldables.

Serve the **completed** production Storybook in a separate terminal:

```sh
python3 -m http.server 6008 --bind 127.0.0.1 --directory apps/docs/storybook-static
```

Then run the browser evidence (install the three Playwright engines if absent):

```sh
STORY_SCOPE=all STORYBOOK_URL=http://127.0.0.1:6008 pnpm test:storybook-audit
STORYBOOK_URL=http://127.0.0.1:6008 pnpm test:storybook-interactions
STORYBOOK_URL=http://127.0.0.1:6008 ADAPTIVE_BROWSER=firefox pnpm test:storybook-interactions
STORYBOOK_URL=http://127.0.0.1:6008 ADAPTIVE_BROWSER=webkit pnpm test:storybook-interactions
STORYBOOK_URL=http://127.0.0.1:6008 pnpm test:storybook-regressions
STORYBOOK_URL=http://127.0.0.1:6008 pnpm exec tsx scripts/skills/check-a11y.ts
pnpm test:select-accessibility
```

Repeat the last Select command with `ADAPTIVE_BROWSER=firefox` and `webkit`.
`STORY_FILTER='components-colorpicker|components-select'` narrows discovery; omit
`STORY_SCOPE=all` for one representative per group. `AUDIT_OUTPUT` changes the JSON
report path. Do not confuse a filtered pass with a whole-library pass. The audit
retains axe `incomplete` results for manual review; these are not proven passes.
CI now runs every initial story in Chromium and the new focused interaction matrix
in all three engines. No axe rules are disabled.

The first zero-violation all-story report still contains **70 cases needing manual
review**, across 21 stories: 44 uncertain contrast nodes, 28 multiple-label nodes,
20 ARIA-value nodes and 8 hidden-focus nodes. These are not 70 confirmed defects,
but neither are they verified accessible. The report retains targets and subsequent
runs also include axe's explanations. Review these before accessibility sign-off;
image/transparent surfaces, date ranges and closed overlay states feature in this
list. Do not remove the incomplete results to make a report look cleaner.

For preview development use `pnpm --filter @kozmos/docs storybook:react -- --ci
--host 127.0.0.1`. The user-facing port 6006 is owned by the separate clean preview
checkout `/private/tmp/kozmos-owned-css-verify.dV1etM`. Stop its exact process before
advancing that checkout or rebuilding its package outputs. Never rebuild `dist`
under a running browser verification suite. Port 6008 is a disposable audit server,
not a second product preview.

### Verification record

At the repair stage: 424 React tests across 110 files; React lint and docs types;
194 token contrast checks; component contracts; tarball installs and README/native
Button types against React 18 and 19; iOS and Android compilation passed. Final
clean-checkout browser results and preview revision are recorded below after the
last verification run.

## Still required before release

See the screenshot audit and owned-CSS guide. Complete the remaining CSS migration,
package types, library-wide interaction/manual accessibility/visual review, browser
floor/device/native checks and genuine product integration. No npm approval is
implied by this overnight work.

- **CSS architecture:** only the previously documented slices are component-owned.
  Much of the library still depends on native `@scope`. This pass does not claim a
  full migration. 59 inert utility uses / 39 classes / 25 files remain. Fix the
  token/opacity authoring contract and migrate component families; do not add
  browser sniffing, fake fallbacks or raise the ratchet.
- **Raw values:** reduced from 35 to **32** colours across 7 components; 7 raw radii
  across 6 remain. SaveLocationCard's green action now uses the actual success
  emotion. The missing glass-surface role remains a design decision.
- **Package declarations:** the three previously recorded `FalseCJS` / types-only
  ESM-resolution problems remain. Passing installed React samples is not equivalent
  to resolving those problems. Fix dual-format declaration graphs before npm.
- **Manual/product acceptance:** no screen-reader, switch-control, zoom/reflow,
  forced-colours, reduced-motion, physical-foldable or browser-floor certification
  is claimed. Initial-story scanning does not exercise every possible interaction.
  Verify one real product module using only the packaged system, then expand.
- **Release/design operations:** Figma import and visual review are pending;
  Chromatic's account/plan gate is not bypassed. No package published, no push or
  merge. No new design ruling or browser support minimum was invented.
