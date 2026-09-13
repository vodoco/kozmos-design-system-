# Web SDK Revamp Prototype And Design-System Audit

Audit date: 2026-08-05

## Executive Decision

The screenshots are a promising visual prototype, but the work is **not ready to be described as production-complete**. The main flows are recognizable and the visual hierarchy is generally strong. The remaining risk is structural: the current "missing components" note mixes Core primitives, Product / SDK components, component variants, and one-off screen compositions, while overlooking several of the largest reusable product patterns visible in the screenshots.

The repository also cannot prove that the pictured app uses the design system correctly because the app source that produced the screenshots is not present in this workspace. This audit can verify the Kozmos repository and the screenshots, but not the other agent's event handling, data integration, routing engine, map SDK integration, or rendered DOM.

Recommended release position:

- Suitable for continued prototype and design review.
- Not suitable for production sign-off yet.
- Do not add every item from the existing gap note to Core.
- Define a separate Product / SDK component contract for the map, POI, search, and route compositions.
- Require the app source, canonical Figma nodes, and real map/data integrations before visual sign-off.

## Evidence Reviewed

- Five iPhone prototype screenshots covering POI detail, filtered results, category browsing, a second POI detail state, and route preview.
- The screenshot of the current missing-component inventory.
- The local branch `codex/wave-2-figma-components` at `5978efd` plus the large existing uncommitted worktree.
- React, Vue, SwiftUI, Compose, tokens, Storybook, Code Connect, CI, contract checks, and repository status generation.

The screenshot image files were supplied outside the repository. No Figma URL, app repository, DOM snapshot, accessibility tree, or app test suite was supplied.

## What Is Working Well

- The primary map-versus-sheet hierarchy is immediately understandable.
- Primary navigation actions are visually prominent and generally use concise labels.
- POI identity, location, travel time, status, and actions have a coherent information hierarchy.
- The category browser uses large visual targets and plain-language labels.
- Route alternatives expose time and distance before the user commits.
- The map controls remain visually separated from sheet content.
- The prototype already demonstrates useful variation rather than presenting a single happy-path screen.

These strengths should be preserved while the implementation is made systematic.

## Immediate Product Blockers

| Priority | Finding                                                                                                                                      | Evidence                                                            | Required resolution                                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | The pictured map is visibly a pastel block placeholder, not evidence of a real map integration.                                              | Screens 1-5 and the repository's former dotted `MapView` treatment. | Render the supported Pointr/Web SDK map and drive markers, floors, camera state, and routes from SDK state. A design-system map host may wrap the renderer but must not impersonate it. |
| P0       | The imagery is unrelated to the POI. Baskin-Robbins shows grapes; Burger King shows plants and a swing.                                      | Screens 1 and 4.                                                    | Use licensed POI imagery with meaningful alternative text, or omit the gallery when real imagery is unavailable. Do not ship decorative stock content as venue data.                    |
| P0       | Floor state appears inconsistent. The map control shows `1F` while Baskin-Robbins is identified as `Second Floor`.                           | Screens 1 and 2.                                                    | Use one canonical floor ID with localized display labels. Results on other floors must be explicitly identified; a selected POI and the active map floor must never silently disagree.  |
| P0       | Content is clipped or collides with the iOS home-indicator area.                                                                             | The category grid in screen 3 and Service Options in screen 4.      | Apply safe-area padding, constrain sheet height, and give the sheet body its own scroll region. Verify at every supported text size.                                                    |
| P0       | The app source is not available here, so interactions and design-system consumption are unverified.                                          | Workspace inspection.                                               | Supply the app repository/branch or copy it into this workspace before implementation sign-off.                                                                                         |
| P1       | Search results leave most of the sheet empty when only one result exists.                                                                    | Screen 2.                                                           | Use content/medium/large detents or a responsive results panel. Empty space should reflect an intentional detent, not a fixed-height shell.                                             |
| P1       | Route alternatives are horizontally clipped without an explicit scroll cue or page position.                                                 | Screen 5.                                                           | Use an accessible horizontal selector with snap behavior, selected-state semantics, and a visible affordance when more options exist.                                                   |
| P1       | Media carousels show a cropped next image but no position, image count, or accessible controls.                                              | Screens 1 and 4.                                                    | Add scroll semantics, image count/position, keyboard controls on web, and meaningful alternative text.                                                                                  |
| P1       | `Customer Service` and `Information & Help` use effectively the same symbol.                                                                 | Screen 3.                                                           | Use distinct icons or consolidate the categories if the information architecture cannot distinguish them.                                                                               |
| P1       | The map's focus control says `Focus Off`, but the current state model, pressed semantics, and location-permission behavior are undocumented. | Screens 1-4.                                                        | Define off, locating, following, heading-up, permission-denied, unavailable, and error states.                                                                                          |
| P2       | POI detail content changes substantially between merchants without a documented slot/state contract.                                         | Screens 1 and 4.                                                    | Define required and optional regions so missing description, status, order, access, gallery, or service data does not cause layout drift.                                               |

## Screen-By-Screen Review

### Screen 1: Baskin-Robbins POI Detail

- The sheet needs a formal `POIDetailPanel` contract, not only a generic card.
- Favourite, bookmark, and close controls need accessible names and persistent selected states.
- The `Go` action needs a single source of truth for ETA and distance shared with route preview.
- `Access Restrictions` needs a defined status model: none, present, unknown, loading, and unavailable.
- The floor mismatch is a data/state blocker.
- The gallery is visually attractive but semantically incomplete and uses unrelated imagery.

### Screen 2: Shopping Results

- The selected Shopping filter should expose removal and selected-state semantics.
- The count badge says `1`; the result region should announce result-count changes without moving focus.
- The result needs a stable relationship with its map marker, including shared ID, number, selected state, floor, and travel-time mode.
- The result row is materially different from the current vertical `POICard`; it should not be forced through that API.
- The sheet detent should react to result count and viewport height.

### Screen 3: Category Browser

- This screen is missing from the current component-gap inventory.
- `BrowseCategoriesPanel` is a Product / SDK composition; `CategoryTile` may be reusable within that lane.
- Labels must survive localization, 200% text, and narrower 320px viewports without truncation.
- The last row must scroll above the home indicator.
- Search, filter, and the multicolor action require distinct accessible labels and predictable focus order.

### Screen 4: Burger King POI Detail

- This confirms that POI detail needs optional status, description, sharing, commerce, gallery, and service-option slots.
- `Open` must not rely on green alone and should be announced as part of availability.
- Service Options are clipped by the device safe area.
- Share and Order must have loading, disabled, error, and unavailable behavior.
- The current POI card implementations do not provide this anatomy consistently across platforms.

### Screen 5: Route Preview

- This is not covered by the current `RouteSummary`, which only models ETA/distance plus start/end actions.
- Add a `RoutePreviewPanel` with destination, route alternatives, selected route, alerts, back, and continue regions.
- `RouteOptionCard` needs selected, unavailable, loading, warning, and potentially recommended states.
- "Healthy" needs a defined routing meaning; avoid presenting an unsupported or ambiguous preference.
- The route line, destination flag, POI pin, active floor, and user location must come from the routing/map SDK rather than static geometry.
- Announce route calculation, route changes, and travel-time changes through the existing navigation announcer or an equivalent live region.

## Corrected Disposition Of The Existing Gap List

| Existing note             | Correct disposition                | Recommendation                                                                                                                                                                     |
| ------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search panel              | Product / SDK composition          | Create only if the search field, filters, collapse behavior, and results relationship recur as one contract. Compose `SearchBar`, `Chip`, `IconButton`, and disclosure primitives. |
| Featured POI card         | Product / SDK result variant       | Prefer a `POIResultCard` family with default, featured, selected, unavailable, and grouped states. Do not add it to Core.                                                          |
| Numbered result pin       | `LocationPin` variant              | Add marker content/number, selected state, accessible label, and list-result ID. It is not a separate Core component.                                                              |
| Results header            | Screen composition                 | Compose text and buttons unless multiple products prove an identical behavior contract.                                                                                            |
| Grouped result expander   | Product wrapper around `Accordion` | Keep grouping, counts, and POI data in Product / SDK; reuse Core disclosure behavior.                                                                                              |
| Language selector         | Product / form-factor control      | Build a locale control with current locale, language names, keyboard menu behavior, RTL support, and persistence. Do not treat it as a generic map primitive.                      |
| Horizontal floor selector | `FloorSelector` variant            | Add vertical-list, compact-stepper, and labelled-horizontal variants to one cross-platform family.                                                                                 |
| Labeled map pill          | New Product / SDK building block   | Introduce `MapControlButton` with icon-only and icon-plus-label forms; use it inside `MapControlsGroup`.                                                                           |
| Compact floor stepper     | Same `FloorSelector` family        | Merge with the horizontal-floor work; define previous/next availability and floor labels.                                                                                          |
| POI panel (desktop)       | Adaptive `POIDetailPanel`          | The same content contract should render as bottom sheet on small screens and side/floating panel on large screens.                                                                 |
| Pin with external label   | `LocationPin` variant              | Add label placement, collision expectations, selected state, and zoom visibility rules.                                                                                            |
| Featured flag Badge       | POI result adornment               | Keep the flag shape with `POIResultCard`; only promote a generic flag/tab badge after unrelated products need it.                                                                  |

## Important Patterns The Gap List Missed

| Candidate                                  | Lane                                  | Why it is needed                                                                                                                   |
| ------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `AdaptiveMapShell`                         | Product / SDK                         | Owns safe areas, map renderer slot, responsive panel placement, map controls, and mobile sheet versus desktop side-panel behavior. |
| `POIDetailPanel`                           | Product / SDK                         | The largest repeated pattern in screens 1 and 4; current `POICard` is not sufficient.                                              |
| `POIResultCard` and `POIResultList`        | Product / SDK                         | Connect list selection, marker selection, result numbering, floor metadata, and travel time.                                       |
| `BrowseCategoriesPanel` and `CategoryTile` | Product / SDK                         | Required by screen 3 and absent from the note.                                                                                     |
| `MapControlButton`                         | Product / SDK                         | Unifies info, focus, floor, location, compass, layers, and labelled controls without hardcoded one-off pills.                      |
| `RoutePreviewPanel`                        | Product / SDK                         | Required by screen 5; current `RouteSummary` does not model route alternatives or alerts.                                          |
| `RouteOptionCard`                          | Product / SDK                         | Provides route preference, time, distance, selected state, recommendation, and availability.                                       |
| `POIMediaGallery`                          | Product / SDK, possibly generic later | Handles real media, count, scroll, keyboard, and accessibility behavior.                                                           |
| Sheet body/header/footer anatomy           | Core `BottomSheet` enhancement        | Needed for detents, sticky actions, independent scroll, and device-safe-area behavior.                                             |

Do not create standalone components for every line of content. `AccessRestrictions`, `ServiceOptions`, result count, open status, travel time, and busy-area messaging should begin as typed regions or small internal compositions. Promote them only after reuse proves a stable API.

## Design-System Implementation Findings

### P0 / P1 Findings

1. `STATUS.md` previously looked more conclusive than its checker is. The generator counts file presence; it does not inspect assertion depth, cross-platform prop parity, visual fidelity, accessibility, or Vue. The generated report now states this limitation explicitly.
2. Product / SDK Code Connect is not complete. React has no linked Product / SDK mappings, while several native `.figma` files are literal `// Placeholder` scaffolds.
3. `POICard` is not cross-platform contract-parity:
   - React: `title`, `subtitle`, `imageUrl`, `description`, `badges`, `actions`, root `onClick`.
   - SwiftUI/Compose: `title`, `category`, builder slots, and `onClose`, with hardcoded widths.
4. The Pact test validates an HTTP fixture but its claim that the response maps directly to `POICardProps` is false: `category` does not map to React's `subtitle`, and the test never renders `POICard`.
5. The tracked `src/__tests__/POICard.consumer.spec.ts` is dead under the current Vitest include patterns and uses a second, incompatible contract schema.
6. The former React `MapView` drew a fake dotted surface. It now acts as an honest, accessible renderer host. Native versions remain renderer-agnostic containers and must receive real map content from the consuming SDK.
7. The current `POICard` root becomes a clickable `div` when `onClick` is provided. It lacks native keyboard semantics, and nested action buttons can bubble into selection. Refactor it into an article with a real primary link/button and separate secondary actions.
8. `RouteSummary` owns fixed viewport positioning. Product components should be layout-neutral and positioned by `MapOverlay`, `BottomSheet`, or `AdaptiveMapShell`.
9. `MapOverlay` hardcodes MapLibre clearance and desktop width. Replace engine-specific assumptions with safe-area/collision insets supplied by the consuming map adapter.
10. Vue is absent from the status table. It exports many React wrappers but has only one component spec and three stories, so parity is largely unverified.
11. Product stories use remote images, simulated map treatments, and console logging. These are not stable visual-regression fixtures.
12. Playground bundles exceed the 500 kB warning threshold. This is acceptable for a playground but must not be treated as evidence that a consuming SDK app is appropriately code-split.

### Corrections Applied During This Audit

- Removed the fake dotted map artwork from React `MapView` and added an accessible renderer-host label.
- Added selected-state semantics and 44px controls to the React vertical `FloorSelector`.
- Added labelled image/button roles, keyboard activation, and a 44px hit region to React `LocationPin` while preserving the `div` required by DOM-marker integrations.
- Prevented `MapControlsGroup` from rendering enabled controls with no handlers; moved it onto `IconButton` and token-based surfaces.
- Added iOS safe-area bottom padding and viewport-aware maximum height to `BottomSheetContent`.
- Changed `SearchBar` to a labelled `searchbox`, enlarged its clear target to 44px, and marked decorative icons as hidden.
- Corrected the `LocationPin` Storybook story, which passed a nonfunctional `color` arg instead of the supported `variant` prop.
- Clarified the generated implementation-status report's scope and limitations.

### Follow-up Implementation After Approval To Proceed

The React Product / SDK reference layer now includes:

- A platform-neutral `@kozmos/product-contracts` package for POI, result, floor, category, map, location, and route presentation models.
- `MapControlButton`, plus controlled location-state support in `MapControlsGroup`.
- Vertical, horizontal, and compact-stepper `FloorSelector` presentations.
- Numbered, selected, featured, disabled, off-floor, and externally labelled `LocationPin` states with result linkage.
- `POIResultCard` and `POIResultList` with one controlled POI ID shared by list and marker selection.
- `POIMediaGallery` and `POIDetailPanel` with partial-data, action-loading, action-error, availability, access, media, and service regions.
- `CategoryTile` and `BrowseCategoriesPanel` with safe-area scrolling and stable keyboard order.
- `RouteOptionCard` and `RoutePreviewPanel` with controlled alternatives, calculation/error states, warnings, and guarded continuation.
- `AdaptiveMapShell`, which is responsive and safe-area aware but deliberately accepts a real renderer slot rather than drawing fake geometry.

The legacy `POICard` now separates its primary selection button from secondary actions; `RouteSummary` is layout-neutral; and `MapOverlay` receives collision insets from the map adapter instead of hardcoding MapLibre clearance.

This is a **React reference implementation only**. It does not claim SwiftUI, Compose, Vue, Figma, real-map, or app integration parity. The missing app source and canonical Figma nodes remain release blockers.

## Required Product Contracts Before Building Components

Use one shared domain model at the app/SDK boundary. Component props should consume a presentation model derived from it rather than accepting raw API responses ad hoc.

Minimum POI presentation fields:

```ts
interface POIPresentation {
  id: string;
  name: string;
  categoryId?: string;
  floorId: string;
  floorLabel: string;
  buildingId?: string;
  buildingLabel?: string;
  logo?: { src: string; alt: string };
  media: Array<{ id: string; src: string; alt: string }>;
  availability?: "open" | "closed" | "unknown";
  description?: string;
  accessRestrictions?: "none" | "present" | "unknown";
  services?: Array<{ id: string; label: string; iconName?: string }>;
  actions: Array<"navigate" | "favourite" | "bookmark" | "share" | "order">;
}
```

Minimum synchronized result/marker state:

```ts
interface POIResultPresentation {
  poiId: string;
  resultIndex: number;
  selected: boolean;
  featured: boolean;
  floorId: string;
  travelTimeSeconds?: number;
  distanceMetres?: number;
  routeMode?: string;
}
```

Minimum route option fields:

```ts
interface RouteOptionPresentation {
  id: string;
  label: string;
  durationSeconds: number;
  distanceMetres: number;
  preference: "quickest" | "step-free" | "custom";
  selected: boolean;
  available: boolean;
  warning?: string;
}
```

Keep SDK/domain objects outside `@kozmos/react`. Add adapters in the Product / SDK package so the React, SwiftUI, Compose, and Vue-facing APIs can be compared deliberately.

## State Matrix That Must Be Designed And Tested

### Map and location

- Loading, ready, error, offline, unsupported, and permission-blocked.
- Location off, locating, follow mode, heading mode, stale location, and unavailable.
- Floor loading, selected, unavailable, cross-floor result, and automatic floor change.
- Marker default, numbered, selected, featured, disabled, clustered, labelled, and off-floor.

### Search and results

- Empty query, typing, submitting, loading, results, no results, partial results, error, and offline.
- Filters absent, applied, removable, disabled, and unavailable.
- Group collapsed/expanded and selected result synchronized with the map.
- Screen-reader announcement of result-count and selection changes.

### POI detail

- Loading, partial data, full data, unavailable, closed, action loading, action failure, saved, and unsaved.
- With/without logo, media, description, access restrictions, service options, order, and share.
- Content, medium, and large sheet detents plus desktop side/floating panel.

### Routing

- Calculating, alternatives ready, no route, inaccessible route, warning, start, active, rerouting, off-route, arrival, and end confirmation.
- Route mode available/unavailable and selected/unselected.
- Busy-area warning present/absent and updated.

### Global quality

- Light and dark themes.
- 320px mobile through large desktop.
- Portrait, landscape, split view, and browser zoom to 400% where applicable.
- Long English, translated copy, RTL, and pseudo-localization.
- Dynamic type/text scaling to at least 200%.
- Keyboard-only, VoiceOver/TalkBack/screen reader, switch control, and reduced motion/transparency.

## Acceptance Criteria

### Component acceptance

- Uses tokens rather than raw hex values, arbitrary spacing, or hardcoded light/dark surfaces.
- Has one documented owner and lane: Core, Product / SDK, or Platform / Form-Factor.
- Has explicit controlled state and events; no enabled no-op controls.
- Uses native interactive elements where the platform permits.
- Meets 44x44 touch targets and visible focus requirements.
- Separates layout positioning from component content.
- Has unit interaction, accessibility, responsive, and visual-regression coverage.
- Has equivalent presentation contracts on React, SwiftUI, and Compose before parity is claimed.
- Has a real Figma component set and Code Connect mapping before Figma parity is claimed.

### App acceptance

- Uses a real supported map renderer and route engine.
- Uses real or intentionally absent POI media.
- Synchronizes floor, result, marker, POI, and route state by stable IDs.
- Handles network, permission, empty, loading, and failure states.
- Does not overlap browser chrome, notches, home indicators, attribution, or map controls.
- Keeps sheet content reachable at large text sizes.
- Passes automated axe checks plus manual screen-reader and keyboard review.
- Has screenshot tests for every supplied reference state at the reference viewport.

## Recommended Build Order

1. Obtain the app source and canonical Figma node links. Freeze the POI, floor, marker, and route presentation contracts.
2. Build `MapControlButton`, then refactor `MapControlsGroup` and define the full focus/floor/location state model.
3. Extend `FloorSelector` and `LocationPin` as cross-platform Product / SDK families.
4. Build `POIResultCard`/`POIResultList` and list-marker synchronization.
5. Build `POIDetailPanel` with adaptive bottom-sheet/desktop-panel presentation.
6. Build `BrowseCategoriesPanel`/`CategoryTile`.
7. Build `RouteOptionCard` and `RoutePreviewPanel`.
8. Build `AdaptiveMapShell` after its child contracts are stable.
9. Add Product / SDK Figma sets, Code Connect, visual tests, accessibility tests, and native contract checks.
10. Replace all placeholder map/media fixtures and run end-to-end tests against real SDK data.

## Verification Commands

Run these from the repository root:

```bash
pnpm lint
pnpm build
pnpm --filter @kozmos/react test
pnpm components:contract:check
pnpm tokens:contrast:check
pnpm figma:plugin:check
pnpm exec tsx scripts/skills/check-completion.ts --check
pnpm figma:parse:linked
pnpm figma:parse:native:linked
```

Also run Swift and Android build/test jobs on their supported hosts. The current React Pact test needs permission to bind a local loopback socket; a sandbox failure is not an API mismatch, but CI must still execute it successfully.

## Manual Handoff Checklist

- [ ] Attach the app repository and exact commit used for screenshots.
- [ ] Attach the Figma file/node URLs for every screen and component state.
- [ ] State whether the target is React Web SDK, native SDK, or all platforms.
- [ ] Confirm the supported map engine and its attribution/safe-area contract.
- [ ] Confirm the POI, floor, search, and routing API schemas.
- [ ] Confirm locale list, RTL requirement, unit formatting, and floor naming rules.
- [ ] Confirm route preferences and whether "Healthy" is a real routing capability.
- [ ] Replace unrelated image fixtures.
- [ ] Capture 320, 375/390, tablet, desktop, dark-mode, long-copy, and large-text screenshots.
- [ ] Capture keyboard order and screen-reader announcements.
- [ ] Record Chromatic/visual baselines for Product / SDK stories.
- [ ] Do not mark Product / SDK parity complete while Code Connect remains unlinked or native files remain placeholders.
