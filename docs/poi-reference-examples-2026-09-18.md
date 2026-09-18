# POI SDK reference examples — 18 September 2026

## Scope and source

This slice implements the restaurant (Il Forno) and sparse entrance (Terminal 1)
references from the seven screenshots supplied in this task. Figma required
authentication, so these are screenshot-informed examples, not a claim of exact
Figma-token/asset parity. The retail, fitness, parking and all-fields catalogue
remain follow-up fixtures, not completed screens.

The result is one shared POIDetailPanel with optional rich detail data, not a
separate component for each venue type. Basic POI/action contracts remain usable.
The visual anatomy changes: titles wrap, missing logos are omitted instead of
synthesizing initials, save controls live in the header, and a bounded panel
scrolls as one surface rather than nesting a body-only scroller below an
arbitrarily tall header. Review these intentional visual changes before release.

## Where to inspect

Storybook: **Product SDK / POI Detail Examples**.

- Restaurant: rich information and controlled favourite/bookmark actions.
- Entrance: no rating, image, description or booking capability fabricated.
- On Map: AdaptiveMapShell with a clearly labelled renderer placeholder,
  non-modal bottom/side presentation and explicit expand/collapse controls.
- Missing Data: unknown hours, empty groups omitted.
- Failed Media: a deliberately invalid image exercises the labelled fallback.
- Action States: disabled route, error and loading booking state.
- Long Content: wrapping title and lengthy attribute content.

These examples do not perform routing, booking, calling, sharing, authentication
or persistence. Demo action results say so. Opening hours, ratings, travel
estimates and accessibility claims are fixture data, not live venue facts.

## Structure and editing map

- packages/product-contracts/src/index.ts: optional POIDetailsPresentation,
  summary kinds, ordered attribute groups, localized opening-hours rows,
  plain-text descriptions and tags. Book/call are supplementary capabilities;
  POIAction and its existing required label record are unchanged.
- packages/react/src/components/POIDetailPanel/POIDetailPanel.tsx: reusable
  anatomy, action wiring, optional regions, media labels and accessibility.
- POIDetailContent.tsx in that directory: semantic summary, non-interactive
  chips, native hours disclosure, description expansion. Expansion resets when
  the selected POI id changes. API text is rendered as text, never injected HTML.
- POIDetailPanel.fixtures.ts: replace illustrative content with your own
  already-localized presentation data. Keep API parsing and timezone/open-status
  calculation in the product adapter.
- POIDetailExamples.stories.tsx: example state, focus restoration and adaptive
  shell composition. No fake SDK adapter is included.
- packages/react/src/styles/owned-poi-detail.css: namespaced component anatomy
  using existing Kozmos colors, type scale and radii. No global selectors,
  hidden horizontal overflow or !important overrides.
- packages/react/src/components/POIMediaGallery/POIMediaGallery.tsx: labelled
  failed-image fallback; a changed source retries naturally. Gallery buttons no
  longer force smooth movement. Full gallery gesture/index synchronization is
  outside this slice's acceptance coverage.
- scripts/check-poi-detail-examples.mjs: responsive, interaction, focus,
  accessibility and screenshot acceptance. CI runs it in all three engines and
  uploads its evidence.

## Deliberate differences and remaining decisions

The screenshot's dark image rectangles and logos were not exported assets. They
are omitted in normal examples. Supply approved photos, alt text and logos to
check the real gallery composition. Payment methods use text, not counterfeit
brand artwork; informational chips are not clickable. Action controls wrap
instead of clipping. Header controls keep the shared 44px minimum and wrap at
large text sizes. Hours follow attribute groups in the first details model.

The visible handle from the references is not recreated as a non-functional
drag affordance. The map example provides a keyboard-operable expansion button.
Gesture snap points, velocity, dismissal behaviour and native sheet parity need
an agreed interaction specification. Physical foldable hinges, safe areas,
virtual keyboards and screen readers still need device-level acceptance.

Missing data must not imply open, accessible, inexpensive, or empty occupancy.
The adapter decides which groups and summary facts exist. Ratings/crowd/wait
values need real freshness and error rules before integrating live data.
Only applicable, available actions should be supplied. Without an
onSupplementaryAction callback, book/call controls are disabled.

The example map is not functional; real map occlusion/camera updates and routing
remain an integration task in the actual SDK repository. npm publication is
still gated by the earlier release reports.

## Reproduce

From the implementation worktree/branch:

```sh
pnpm install --frozen-lockfile
pnpm --filter "@kozmos/react..." build
pnpm --filter @kozmos/react test
pnpm --filter @kozmos/docs typecheck
pnpm components:contract:check
pnpm components:classes:check
pnpm test:css-build
pnpm test:owned-css
ADAPTIVE_BROWSER=firefox pnpm test:owned-css
ADAPTIVE_BROWSER=webkit pnpm test:owned-css
pnpm packages:install:check
pnpm --filter @kozmos/docs build-storybook
python3 -m http.server 6012 --bind 127.0.0.1 --directory apps/docs/storybook-static
```

In another terminal:

```sh
STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:poi-details
STORYBOOK_URL=http://127.0.0.1:6012 ADAPTIVE_BROWSER=firefox pnpm test:poi-details
STORYBOOK_URL=http://127.0.0.1:6012 ADAPTIVE_BROWSER=webkit pnpm test:poi-details
STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:storybook-docs
```

Use a static build for final acceptance: rebuilding package CSS while a live
Storybook audit runs can invalidate Vite modules. Screenshots and JSON reports,
including incomplete accessibility findings, live under
test-results/poi-detail-examples/engine/. Those generated files are ignored
by git; CI retains them as artifacts.

The installed-consumer gate now compiles a rich POI consumer under React 18 and
19 as well as the existing 82 displayed React recipes. The owned-CSS gate checks
detail borders/type/layout with and without legacy CSS scope, including RTL and
nested themes. A pre-existing source-contract assertion still expected the old
Heading/Text utility implementation; it now checks the owned scale and all six
heading levels, backed by runtime unit tests, rather than requiring old cva text.

## Verification result

- 453 React unit tests across 112 files; React build and Docs typecheck passed.
- 42 POI cases per engine, 126 total: seven stories, two themes and three host
  sizes (320×568, 568×320, 1280×800). Additional checks rotate the narrow map
  example to 844×390 and back without losing save state, and reflow long content
  at 200% root text size. This is not a substitute for browser zoom/device testing.
- No automated WCAG A/AA violations or incomplete findings in this POI matrix.
  This does not clear the earlier catalogue's separate manual accessibility queue.
- 99 public Docs pages at 320/1280px, 164 snippet sections, keyboard and axe passed.
- Installed tarballs pass React 18/19, strict Node16/NodeNext ESM/CJS, declarations,
  SSR, the rich POI consumer and all 82 existing React recipes.
- Owned CSS passes with and without scope in all three engines; nine CSS compiler
  tests, compiled-class validation, component-contract parity and snippet checks pass.

Visual review covered the restaurant, sparse entrance and map layout. The checks
found and fixed reset-erased detail borders, an obscured example opener,
low-contrast error text and enlarged-text header overflow. No tests were disabled
to obtain a pass. There is no npm publication, push or merge in this slice.
