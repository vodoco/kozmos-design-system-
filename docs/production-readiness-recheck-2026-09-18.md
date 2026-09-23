# Production readiness recheck — 18 September 2026

## Verdict

**The inspected defects are repaired or explicitly clarified. This is not approval
to publish to npm or replace production product modules yet.** The remaining
release work is listed below, with concrete acceptance criteria. Do not substitute
another unbounded visual pass for those gates.

This continues the single-public-catalogue commit `9274fa3`. Work is isolated on
`astra/browser-compatibility`; the shared main checkout is not modified. The
independent port-6006 preview is updated to the resulting repair commit after
verification. No push, merge or publication is part of this batch.

## What changed and why

| Earlier finding                      | Current disposition                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1: blank MapSearch                  | Replaced the collapsed, app-utility-dependent mock with a self-contained composition of SearchBar, MapView, POICard, Tag, Button and Icon. Search, Open now, selection and demo-route feedback work. External placeholder images, missing Material Symbols glyphs and nonfunctional mock controls are removed. It explicitly says no live location/routing service is connected. |
| F2: missing narrow Navbar actions    | Container-driven wrapping preserves context, primary action, navigation and utilities. No viewport-based hiding, duplicate stateful slots or JS width listeners. Header height can grow. The new 280px-container story also runs inside a 1280px viewport.                                                                                                                       |
| F3: overlapping/clipped POI overlays | The example now uses one bounded, vertically scrollable result stack. Cards fit the overlay width and do not shrink over each other. Every action is hit-tested, including the second card after scrolling.                                                                                                                                                                      |
| F4: unstyled snippet tabs            | Fixed in `9274fa3`; retained and rechecked. Only the Kozmos controls belong inside its theme boundary, not Storybook's code viewer.                                                                                                                                                                                                                                              |
| F5: overflowing Docs pages           | All 73 explicit Controls imports use one labelled, focusable horizontal table wrapper. Long headings and inline code wrap. The gate now checks whole-document width on every Docs page, not only snippet width. No global overflow hiding is used.                                                                                                                               |
| F6: screen-height Docs canvases      | Fixed in `9274fa3`; Docs examples use content height while standalone stories retain screen-height surfaces.                                                                                                                                                                                                                                                                     |
| F7: orphaned/missing live Docs       | DynamicIsland, RouteSummary and RoutingInputGroup attach to their canonical story modules. Those three plus Chip, EmptyState and UserLocationMarker now have live previews. Fixed-position DynamicIsland is bounded by a story host so it cannot escape over the Docs page.                                                                                                      |
| F8: Button table/stale colours       | Fixed in `9274fa3`: supported HTML table, semantic descriptions instead of copied hex values, actual native usage signatures rather than incomplete duplicate implementations.                                                                                                                                                                                                   |
| F9: distorted Skeleton               | The avatar cannot shrink; the text column is flexible. The 48px circle is measured at every tested width.                                                                                                                                                                                                                                                                        |
| F10: obsolete product gap claims     | OpeningHours uses Tag's success emotion. POIDetailCard no longer claims heart/bookmark or MetaStrip are missing. Its remaining product-data/callback integration is identified accurately, not claimed complete.                                                                                                                                                                 |
| F11: outdated DateRange guidance     | Helper text describes available container width, not a viewport breakpoint.                                                                                                                                                                                                                                                                                                      |

Additional findings addressed:

- SearchBar's input needed `min-width: 0` to yield space to its icon/clear button.
- Every UserLocationMarker shared the SVG ID `coneGradient`. IDs now use React's
  instance-local `useId`, preventing paint references from resolving to another
  marker (including a differently themed instance).
- Marker rings respect reduced motion. The example no longer rotates forever on
  a timer; its heading changes only through an explicit demo control.
- DynamicIsland's green Radio icon was arbitrary demo content. The example now
  uses an accessible navigation indicator and explains that no device status is
  being read. This is not ActivityKit integration.
- The Docs gate could inspect a heading before all snippets mounted: one run
  counted 163 rather than 164 section/viewport checks. Expected counts are now
  derived from each MDX source and awaited exactly; missing sections fail.

## Consumer-visible compatibility notes

`Navbar` is now **minimum 64px high, not fixed 64px**. Let its containing layout
grow; do not reserve a hard-coded 64px and overlay content underneath it. Custom
navigation groups should wrap and avoid fixed widths larger than their host.
`navigationLabel` optionally names the navigation landmark; its default is
“Main navigation”. Existing slots and the deprecated `site` alias remain.

The choice to wrap, rather than silently invent a mobile menu contract, keeps
existing stateful slots mounted once and all existing actions reachable. A product
that requires a single-row compact menu should define that product interaction
explicitly; it must not restore CSS-only hiding of essential content.

The React changes have a patch changeset at
`.changeset/responsive-navigation-and-markers.md`. No release version is applied
and no npm publish is run.

Three pre-release Docs URLs have canonical replacements:

| Old Docs ID                          | New Docs ID                    |
| ------------------------------------ | ------------------------------ |
| `components-dynamicisland--docs`     | `platform-dynamicisland--docs` |
| `components-routesummary--docs`      | `map-routesummary--docs`       |
| `components-routinginputgroup--docs` | `map-routinginputgroup--docs`  |

Update bookmarks/links; this source change does not configure redirects on an
external documentation host.

## Verification and its limits

- React unit suite: **436 tests / 112 files passed**.
- React production build and Docs typecheck passed; generated public types include
  the optional navigation label.
- Public Storybook production build passed.
- **99 Docs pages at 320px and 1280px**, with zero document overflow and exactly
  **164 snippet section/viewport checks**. Property tables remain locally
  scrollable; keyboard scrolling is asserted. Six newly connected live previews
  are required by the gate.
- Responsive regression gate: seven scenarios × three viewports × two themes,
  run in Chromium, Firefox and WebKit. It asserts visible geometry, hit targets,
  action availability, keyboard order, search/filter behaviour, reduced motion,
  and automated WCAG A/AA rules in the tested states.
- Nine CSS compiler tests passed. A stale-build refusal in the compiled-class
  check was resolved by rebuilding, not bypassed. All 110 slash-modified classes
  compile, with no newly inert class.
- The existing Chromium screenshot-derived regression scenarios and interaction
  suite also passed against the built site after these repairs.
- Tarball installation checks passed for React 18 and 19: package contents,
  exports, CommonJS loading, strict Node16/NodeNext ESM and CJS consumers, SSR
  Button rendering and the existing consumer documentation fixtures.
- Source-name validation: 327 identifiers / 324 snippets passed. **This does not
  mean the reference snippets compile.**
- Targeted screenshots reviewed: narrow/full Navbar, narrow pane within desktop,
  portrait/landscape MapSearch, the POI stack and the clarified activity capsule.

These checks do not certify every state of all 237 story variants, screen-reader
behaviour, native apps, physical foldables, all translated content or production
integrations. The earlier 48 incomplete accessibility cases remain a manual queue;
they were not reclassified as passing. Keyboard tests use WebKit's Option-Tab
behaviour to include links under the default macOS-style preference. Colour
assertions wait for finite transitions to settle; infinite loading indicators do
not block the suite. No accessibility rule is disabled to obtain these results.

## Commands you can run yourself

Run from the implementation checkout (or the branch after checkout elsewhere):

```sh
pnpm install --frozen-lockfile
pnpm --filter @kozmos/react build
pnpm --filter @kozmos/docs typecheck
pnpm --filter @kozmos/react test
pnpm test:css-build
pnpm components:classes:check
pnpm docs:snippets:check
pnpm packages:install:check
pnpm --filter @kozmos/docs build-storybook

# In a separate terminal, serve the built catalogue:
python3 -m http.server 6011 --bind 127.0.0.1 --directory apps/docs/storybook-static

STORYBOOK_URL=http://127.0.0.1:6011 pnpm test:storybook-docs
STORYBOOK_URL=http://127.0.0.1:6011 pnpm test:storybook-audit-fixes
STORYBOOK_URL=http://127.0.0.1:6011 ADAPTIVE_BROWSER=firefox pnpm test:storybook-audit-fixes
STORYBOOK_URL=http://127.0.0.1:6011 ADAPTIVE_BROWSER=webkit pnpm test:storybook-audit-fixes

# Public development catalogue; Vue is opt-in, not required by this command:
pnpm --filter @kozmos/docs storybook
```

Build React **before** trusting Storybook: its examples import React source, but
the preview stylesheet is built output. The compiler check deliberately rejects
outdated CSS. If Playwright browsers are missing, install them with
`pnpm exec playwright install chromium firefox webkit`.

## Where to edit

- Navbar behaviour: `packages/react/src/components/Navbar/Navbar.tsx`;
  owned styling: `packages/react/src/styles/owned-navbar.css`;
  examples/tests/docs alongside the component.
- Search composition: `apps/docs/stories/examples/MapSearch.stories.tsx` and
  `MapSearch.css`. Story-only layout belongs here, not in Tailwind safelists.
- POI layout example: `packages/react/src/components/POICard/POICard.stories.tsx`.
- Docs tables: `packages/react/src/components/DocumentationControls.tsx` and
  `apps/docs/.storybook/preview.css`. New MDX Controls imports should use the
  shared helper. Do not make the entire Docs page horizontally scrollable.
- Snippet UI/support policy: `PlatformSnippets.tsx` and
  `apps/docs/src/platform-support.mdx`; see the earlier
  `docs/public-catalogue-guide-2026-09-18.md` for platform/build separation.
- Live preview attachments: each component MDX's `Meta of` and `Canvas of`.
- Regression assertions: `scripts/check-storybook-audit-fixes.mjs` and
  `scripts/check-storybook-docs.mjs`. CI runs both against the built public site,
  with responsive regressions in all three engines.

## Remaining release gates, in recommended order

1. **Executable reference examples and support matrix.** Convert legacy native
   implementation excerpts into consumer fixtures and compile them against their
   actual packages. Track each component/platform as implemented, tested or not
   supported using evidence. Identifier lookup is not a compiler.
2. **One real product-module pilot.** Integrate the installed tarballs, not source
   aliases. Verify routing/data ownership, overlays, errors/loading/empty states,
   keyboard/screen reader use, localization and narrow-container layouts. The
   MapSearch example is intentionally not this production integration.
3. **Browser/device support decision.** Approve an explicit minimum browser
   matrix and complete the remaining legacy CSS ownership/`@scope` migration as
   required by it. This batch migrates Navbar; it does not make the entire library
   independent of `@scope`. Verify rotation, safe areas, virtual keyboards and
   foldable configurations on the supported devices, not only resized viewports.
4. **Accessibility/manual acceptance.** Resolve the existing incomplete queue;
   review focus visibility/order, zoom, long translations and screen readers.
   The whole Docs layout gate is not a full axe audit of every Storybook-owned
   property table or standalone fenced code block.
5. **Native and Figma parity.** Re-run native builds/tests and review design parity
   after agreed API/layout changes. Neither a React story nor a native snippet
   establishes this. These were not rerun in this batch.
6. **Release operations.** Resolve the recorded Storybook/Vue peer-version drift,
   run the full required CI/visual gates, review the package version/changelog and
   publishing access, then explicitly approve publication. The private Vue bridge
   stays internal unless a separate native Vue/SSR plan is approved.

The recommended next engineering work is executable snippet validation plus the
first installed-package product pilot—not npm publication yet.
