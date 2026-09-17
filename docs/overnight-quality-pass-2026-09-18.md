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

## Still required before release

See the screenshot audit and owned-CSS guide. Complete the remaining CSS migration,
package types, library-wide interaction/manual accessibility/visual review, browser
floor/device/native checks and genuine product integration. No npm approval is
implied by this overnight work.
