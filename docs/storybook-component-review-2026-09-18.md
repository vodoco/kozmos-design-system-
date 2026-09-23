# Storybook component-by-component review — 2026-09-18

## Verdict

**There are confirmed problems. Do not treat the earlier green automated scan as visual or production approval.**

Reviewed the running React Storybook on port 6006, implementation `767b3be`, from the independent preview checkout. No component, style, configuration or published package was changed during this review. This document is the audit deliverable; diagnostic artifacts are ignored under `test-results/component-review/`.

### Coverage and limits

- All **236 story variants across 102 groups** visited and their captured initial appearance inspected: desktop light (800×600) and mobile dark (320×568), plus one representative per group at landscape light (568×320). This is 574 story captures, reviewed in 40 paired contact sheets and seven landscape sheets.
- All **98 Docs pages** visited at desktop 1280×800 and mobile 320×568: 196 captures. Document structure, overflow, theme ownership and canvas geometry inspected across every page; targeted full-size visual inspections for findings.
- **770 total render checks**, zero persistent runtime/render errors. Two initial Heading checks failed because the diagnostic locator matched both the document heading and component example; narrowing the locator and rerunning both cases resolved the diagnostic error, not a product defect.
- **37 of 98 Docs pages overflow the 320px viewport**, reaching 342–656px document widths.
- **81 Docs pages** contain platform-code tab lists outside a Kozmos provider.
- **92 Docs pages** render story canvases; all 92 inherit at least a viewport-height preview.
- The existing Chromium interaction suite (112 axe audits plus keyboard/layout assertions) and 36 screenshot-derived story regression scenarios pass again. Their coverage is targeted, not exhaustive interaction testing of all 236 variants.
- This is a rendered catalog review, not a new all-browser/all-state accessibility certification, Figma comparison, screen-reader session, native implementation audit or physical foldable test. The previously recorded 48 incomplete accessibility cases remain unresolved. Intentional scrolling, disabled-state dimming, icon-only content and the nested ThemeProvider demo were not classified as defects merely from a thumbnail.

## Findings and recommended repairs

### F1 · P1 · “Map Based Search” is visually blank

[Reproduce](http://127.0.0.1:6006/?path=/story/examples-map-based-search--default).
The outer example and map both measure **800×0px**, with `overflow:hidden`; the same blank result appears on mobile and landscape. Text and controls exist in the DOM but are not visible. The example depends on `h-screen`, which is absent from the built stylesheet. Tailwind scans React source, not `apps/docs/stories`.

Sources: [apps/docs/stories/examples/MapSearch.stories.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/apps/docs/stories/examples/MapSearch.stories.tsx:16), [packages/react/tailwind.config.js](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/tailwind.config.js:10).

Repair the example's complete layout using supported design-system composition and explicit Storybook-owned host styles. Do not merely add a safelist for one height: the example also relies on assorted app-only utility classes, external images and Material Symbols font names. Add a positive visible-content/geometry assertion.

### F2 · P1 · Navbar loses essential functionality on narrow screens

[Reproduce](http://127.0.0.1:6006/?path=/story/navigation-navbar--contextual), 320px or 568px.
Context, primary action and navigation use `hidden md:...`. Only Notifications and Account buttons remain; no menu exposes Workspace, Publish, Overview, Explore or Settings. This is a component behavior/contract gap, not just a screenshot preference.

Source: [packages/react/src/components/Navbar/Navbar.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/Navbar/Navbar.tsx:56).

Define a mobile navigation/context/action contract and show a working example. Use available module width where required, and test keyboard access to every essential action after resizing.

### F3 · P1 · POICard inside MapOverlay clips actions and overlaps cards

[Reproduce](http://127.0.0.1:6006/?path=/story/components-poicard--inside-map-overlay), 320px.
A **380px card sits in a 262px scroller** (second card: 300px in 262px). The first card's Share/Save button centers are clipped/not hit-testable initially; the cards overlap vertically by about **138.5px**. The inner scroller can reveal horizontal content, but this does not make the default composition a suitable narrow-screen layout.

Sources: [packages/react/src/components/POICard/POICard.stories.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/POICard/POICard.stories.tsx:24), [packages/react/src/components/POICard/POICard.stories.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/POICard/POICard.stories.tsx:57), [packages/react/src/components/MapOverlay/MapOverlay.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/MapOverlay/MapOverlay.tsx:80).

Constrain nested card widths to the available overlay and choose a narrow-host composition that does not obscure one card with another. Verify nested clipping and hit targets, not only document overflow. Do not hide overflow to make the test green.

### F4 · P2 · Platform-code tabs are unstyled on 81 Docs pages

The MDX `PlatformSnippets` helper renders Kozmos Tabs outside `[data-kozmos-root]`. The global decorator wraps stories, not arbitrary MDX. Consequently the tablist computes `display:block` and a transparent background; the buttons look like browser defaults rather than the actual Tabs component.

Sources: [packages/react/src/components/PlatformSnippets.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/PlatformSnippets.tsx:42), [apps/docs/.storybook/preview.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/apps/docs/.storybook/preview.tsx:24).

Give the Docs UI a deliberate theme/style boundary or use Storybook-owned presentation for the snippet switcher. Keep that boundary distinct from embedded story providers.

### F5 · P2 · 37 Docs pages overflow at 320px

[Button example](http://127.0.0.1:6006/?path=/docs/components-button--docs) measures **536px** document width in a 320px viewport. RoutePreviewPanel reaches **656px**. Controls tables and some canvas/composition widths overflow. Full affected-page details are in the checklist below and diagnostic JSON.

Repair Docs layouts and localized table/code scrolling; preserve readable content. Add Docs-mode narrow-viewport checks. The old story-only overflow check could not detect this.

### F6 · P2 · Inline Docs canvases inherit full-screen story sizing

All **92 Docs pages with rendered canvases** inherit `.kozmos-story-surface { min-height:100vh }`. A single Button gets a 568px-tall inner canvas at mobile width (800px on desktop), pushing controls and instructions far down the page.

Source: [apps/docs/.storybook/preview.css](/private/tmp/kozmos-browser-compat.uqPMBD/apps/docs/.storybook/preview.css:11).

Separate standalone canvas layout from inline Docs layout using the story context/view mode. Keep explicit host dimensions only where the example actually requires them.

### F7 · P2 · Three components have split catalog identities; six Docs pages lack live previews

Your screenshot's `Components/DynamicIsland` Docs page loaded on repeated direct checks, so a persistent blank runtime error was **not** reproduced. Its examples live under `Platform/DynamicIsland`; similarly RouteSummary and RoutingInputGroup docs are under Components but their stories are under Map. These docs use independent `Meta title` instead of attaching to their story modules.

Sources: [packages/react/src/components/DynamicIsland/DynamicIsland.mdx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/DynamicIsland/DynamicIsland.mdx:3), [packages/react/src/components/DynamicIsland/DynamicIsland.stories.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/DynamicIsland/DynamicIsland.stories.tsx:6), [packages/react/src/components/RouteSummary/RouteSummary.mdx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/RouteSummary/RouteSummary.mdx:3), [packages/react/src/components/RoutingInputGroup/RoutingInputGroup.mdx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/RoutingInputGroup/RoutingInputGroup.mdx:3).

Attach Docs to the canonical story metadata. These three plus **Chip, EmptyState and UserLocationMarker** have no live story canvas on their Docs pages; link or embed the actual examples. The Tokens/Map and three Examples groups also have no same-title Docs entries; they are example/foundation groups, not necessarily missing component documentation.

### F8 · P2 · Button Docs contain a broken table and stale token values

The Emotion Markdown table renders as literal pipes/text, not an HTML table. Its success and alert backgrounds also still say `#1E995B` and `#CD8905`; the current light-mode tokens are **#197F4C** and **#A06B04**.

Source: [packages/react/src/components/Button/Button.mdx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/Button/Button.mdx:137).

Use a supported table renderer and derive role values from the token source rather than duplicating hex values manually.

### F9 · P2 · Skeleton's mobile example distorts the avatar placeholder

At 320px, the supposedly circular `h-12 w-12` placeholder is **24×48px**, because the adjacent 256px text placeholder and 16px gap shrink it. This is a story composition defect, not proof that every Skeleton consumer is broken.

Source: [packages/react/src/components/Skeleton/Skeleton.stories.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/Skeleton/Skeleton.stories.tsx:16).

Prevent avatar shrinking and make the text column flex/min-width aware; verify shape as well as overflow.

### F10 · P2 · Product examples advertise already-resolved gaps

Opening Hours says Tag has no emotion axis, although Tag exposes `emotion`. POI Detail Card says heart/bookmark icons and MetaStrip are unavailable; the current registry contains those icons and React exports MetaStrip. The examples therefore understate current coverage and display stale warning panels.

Sources: [apps/docs/stories/examples/OpeningHours.stories.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/apps/docs/stories/examples/OpeningHours.stories.tsx:104), [apps/docs/stories/examples/POIDetailCard.stories.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/apps/docs/stories/examples/POIDetailCard.stories.tsx:305), [apps/docs/stories/examples/POIDetailCard.stories.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/apps/docs/stories/examples/POIDetailCard.stories.tsx:344).

Refresh these examples against current exports and contracts. Retain historical gap reports as dated evidence, not live assertions.

### F11 · P3 · DateRange's story helper describes the previous layout rule

The Responsive Stack story still says “Fields stack below the small breakpoint,” but the implementation now stacks according to available container width. The visual behavior is correct; the example's explanation is stale.

Source: [packages/react/src/components/DateRangePicker/DateRangePicker.stories.tsx](/private/tmp/kozmos-browser-compat.uqPMBD/packages/react/src/components/DateRangePicker/DateRangePicker.stories.tsx).

## Why the earlier green results missed this

The broad audit selected `type === "story"`, so it never opened Docs. It waited for an attached descendant, which allows an invisible zero-height example to qualify. Its overflow check examined the document boundary, not nested scrolling/clipping or overlapping controls. Accessibility checks do not establish that essential navigation remains available after responsive hiding, and identifier-only snippet checks do not validate styling or documentation claims.

Keep the existing tests, but add Docs discovery, visible-content assertions, nested geometry/hit-target checks, mobile task reachability and story/Docs identity checks. “No axe violation” is not equivalent to “looks right and usable.”

## Repair order

1. Shared Docs provider/layout and catalog attachment (F4–F7), plus visible-content/catalog gates.
2. Map Search, Navbar and the POI overlay composition (F1–F3), with failing regression examples first.
3. Skeleton and stale examples/docs (F8–F11).
4. Resume the selection-field owned-CSS migration, retaining these new catalog checks.
5. Finish the existing manual/device/product acceptance gates before npm publication.

## Every-component checklist

Every listed story variant was visually inspected in the two captured theme/viewport combinations; one representative per group was inspected in landscape. “No additional initial-state issue observed” is **not** certification of every interaction, browser or unsupported size.

Docs codes: **F4** unowned platform tabs; **F5** measured mobile overflow; **F6** viewport-height inline canvas; **F7** missing live preview or split Docs identity. These shared defects explain why an otherwise working component can look wrong on its Docs page.

| Story group                                                                                                        | Variants reviewed | Initial-state finding                                          | Docs findings                 |
| ------------------------------------------------------------------------------------------------------------------ | ----------------: | -------------------------------------------------------------- | ----------------------------- |
| [Design System/Tokens/Map](http://127.0.0.1:6006/?path=/story/design-system-tokens-map--primitive-colors)          |                 4 | No additional initial-state issue observed                     | No same-title Docs entry      |
| [Examples/Map Based Search](http://127.0.0.1:6006/?path=/story/examples-map-based-search--default)                 |                 1 | F1 — blank/collapsed example                                   | No same-title Docs entry      |
| [Examples/Opening Hours](http://127.0.0.1:6006/?path=/story/examples-opening-hours--default)                       |                 1 | F10 — obsolete missing-emotion annotation                      | No same-title Docs entry      |
| [Examples/POI Detail Card](http://127.0.0.1:6006/?path=/story/examples-poi-detail-card--default)                   |                 1 | F10 — obsolete missing-icon/MetaStrip annotations              | No same-title Docs entry      |
| [Data Display/Accordion](http://127.0.0.1:6006/?path=/story/data-display-accordion--default)                       |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Product SDK/AdaptiveMapShell](http://127.0.0.1:6006/?path=/story/product-sdk-adaptivemapshell--panel-at-end)      |                 5 | No additional initial-state issue observed                     | F5 (544px); F6                |
| [Feedback/Alert](http://127.0.0.1:6006/?path=/story/feedback-alert--default)                                       |                 5 | No additional initial-state issue observed                     | F4; F6                        |
| [Data Display/Avatar](http://127.0.0.1:6006/?path=/story/data-display-avatar--default)                             |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Feedback/Backdrop](http://127.0.0.1:6006/?path=/story/feedback-backdrop--default)                                 |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/Badge](http://127.0.0.1:6006/?path=/story/components-badge--default)                                   |                 4 | No additional initial-state issue observed                     | F4; F5 (528px); F6            |
| [Navigation/BottomNavigation](http://127.0.0.1:6006/?path=/story/navigation-bottomnavigation--default)             |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Overlay/BottomSheet](http://127.0.0.1:6006/?path=/story/overlay-bottomsheet--default)                             |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Foundations/Box](http://127.0.0.1:6006/?path=/story/foundations-box--default)                                     |                 2 | No additional initial-state issue observed                     | F4; F5 (544px); F6            |
| [Navigation/Breadcrumb](http://127.0.0.1:6006/?path=/story/navigation-breadcrumb--default)                         |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Product SDK/BrowseCategoriesPanel](http://127.0.0.1:6006/?path=/story/product-sdk-browsecategoriespanel--default) |                 1 | No additional initial-state issue observed                     | F5 (544px); F6                |
| [Components/Button](http://127.0.0.1:6006/?path=/story/components-button--default)                                 |                10 | No additional initial-state issue observed                     | F4; F5 (536px); F6; F8        |
| [Components/Card](http://127.0.0.1:6006/?path=/story/components-card--default)                                     |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Product SDK/CategoryTile](http://127.0.0.1:6006/?path=/story/product-sdk-categorytile--default)                   |                 2 | No additional initial-state issue observed                     | F5 (544px); F6                |
| [Components/Checkbox](http://127.0.0.1:6006/?path=/story/components-checkbox--default)                             |                 4 | No additional initial-state issue observed                     | F4; F6                        |
| [Data Display/Chip](http://127.0.0.1:6006/?path=/story/data-display-chip--default)                                 |                 3 | No additional initial-state issue observed                     | F7: no live preview           |
| [Components/ColorPicker](http://127.0.0.1:6006/?path=/story/components-colorpicker--default)                       |                 5 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/Combobox](http://127.0.0.1:6006/?path=/story/components-combobox--default)                             |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Foundations/Container](http://127.0.0.1:6006/?path=/story/foundations-container--default)                         |                 2 | No additional initial-state issue observed                     | F4; F5 (395px); F6            |
| [Components/Counter](http://127.0.0.1:6006/?path=/story/components-counter--default)                               |                 5 | No additional initial-state issue observed                     | F4; F5 (528px); F6            |
| [Components/DatePicker](http://127.0.0.1:6006/?path=/story/components-datepicker--default)                         |                 3 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/DateRangePicker](http://127.0.0.1:6006/?path=/story/components-daterangepicker--default)               |                 3 | F11 — helper text still describes obsolete breakpoint behavior | F4; F6                        |
| [Components/Dialog](http://127.0.0.1:6006/?path=/story/components-dialog--default)                                 |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Map/DirectionStep](http://127.0.0.1:6006/?path=/story/map-directionstep--default)                                 |                 1 | No additional initial-state issue observed                     | F4; F5 (543px); F6            |
| [Overlay/Drawer](http://127.0.0.1:6006/?path=/story/overlay-drawer--default)                                       |                 1 | No additional initial-state issue observed                     | F4; F5 (393px); F6            |
| [Platform/DynamicIsland](http://127.0.0.1:6006/?path=/story/platform-dynamicisland--compact)                       |                 3 | F7 — Docs split from stories                                   | F7: separate Components entry |
| [Components/EmptyState](http://127.0.0.1:6006/?path=/story/components-emptystate--default)                         |                 1 | No additional initial-state issue observed                     | F7: no live preview           |
| [Platform/FeedbackCard](http://127.0.0.1:6006/?path=/story/platform-feedbackcard--default)                         |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/FieldWrapper](http://127.0.0.1:6006/?path=/story/components-fieldwrapper--default)                     |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/FileUpload](http://127.0.0.1:6006/?path=/story/components-fileupload--default)                         |                 3 | No additional initial-state issue observed                     | F4; F6                        |
| [Action/FloatingActionButton](http://127.0.0.1:6006/?path=/story/action-floatingactionbutton--default)             |                 1 | No additional initial-state issue observed                     | F4; F5 (528px); F6            |
| [Product SDK/FloorSelector](http://127.0.0.1:6006/?path=/story/product-sdk-floorselector--vertical-list)           |                 3 | No additional initial-state issue observed                     | F4; F5 (562px); F6            |
| [Foundations/Grid](http://127.0.0.1:6006/?path=/story/foundations-grid--default)                                   |                 1 | No additional initial-state issue observed                     | F4; F5 (395px); F6            |
| [Foundations/Heading](http://127.0.0.1:6006/?path=/story/foundations-heading--default)                             |                 2 | No additional initial-state issue observed                     | F4; F5 (528px); F6            |
| [Foundations/Icon](http://127.0.0.1:6006/?path=/story/foundations-icon--default)                                   |                 4 | No additional initial-state issue observed                     | F4; F5 (393px); F6            |
| [Action/IconButton](http://127.0.0.1:6006/?path=/story/action-iconbutton--default)                                 |                 3 | No additional initial-state issue observed                     | F4; F5 (530px); F6            |
| [Components/Input](http://127.0.0.1:6006/?path=/story/components-input--default)                                   |                 4 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/Label](http://127.0.0.1:6006/?path=/story/components-label--default)                                   |                 2 | No additional initial-state issue observed                     | F4; F5 (528px); F6            |
| [Navigation/Link](http://127.0.0.1:6006/?path=/story/navigation-link--default)                                     |                 2 | No additional initial-state issue observed                     | F4; F5 (528px); F6            |
| [Data Display/List](http://127.0.0.1:6006/?path=/story/data-display-list--default)                                 |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/Listbox](http://127.0.0.1:6006/?path=/story/components-listbox--single)                                |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Product SDK/LocationPin](http://127.0.0.1:6006/?path=/story/product-sdk-locationpin--default)                     |                 3 | No additional initial-state issue observed                     | F4; F5 (528px); F6            |
| [Product SDK/MapControlButton](http://127.0.0.1:6006/?path=/story/product-sdk-mapcontrolbutton--icon-only)         |                 6 | No additional initial-state issue observed                     | F5 (528px); F6                |
| [Map/MapControlsGroup](http://127.0.0.1:6006/?path=/story/map-mapcontrolsgroup--default)                           |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Map/MapOverlay](http://127.0.0.1:6006/?path=/story/map-mapoverlay--default)                                       |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Map/MapView](http://127.0.0.1:6006/?path=/story/map-mapview--default)                                             |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Navigation/Menu](http://127.0.0.1:6006/?path=/story/navigation-menu--default)                                     |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Data Display/MetaStrip](http://127.0.0.1:6006/?path=/story/data-display-metastrip--default)                       |                 3 | No additional initial-state issue observed                     | F6                            |
| [Components/MultiSelect](http://127.0.0.1:6006/?path=/story/components-multiselect--default)                       |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Navigation/Navbar](http://127.0.0.1:6006/?path=/story/navigation-navbar--default)                                 |                 2 | F2 — navigation/context/action disappear on narrow screens     | F4; F6                        |
| [Utilities/NavigationAnnouncer](http://127.0.0.1:6006/?path=/story/utilities-navigationannouncer--default)         |                 1 | No additional initial-state issue observed                     | F4; F5 (342px); F6            |
| [Navigation/NavigationItem](http://127.0.0.1:6006/?path=/story/navigation-navigationitem--side)                    |                 3 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/NumberInput](http://127.0.0.1:6006/?path=/story/components-numberinput--default)                       |                 6 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/OTPInput](http://127.0.0.1:6006/?path=/story/components-otpinput--default)                             |                 3 | No additional initial-state issue observed                     | F4; F5 (543px); F6            |
| [Components/POICard](http://127.0.0.1:6006/?path=/story/components-poicard--default)                               |                 3 | F3 — nested overlay clipping and overlapping cards             | F4; F5 (545px); F6            |
| [Product SDK/POIDetailPanel](http://127.0.0.1:6006/?path=/story/product-sdk-poidetailpanel--inline)                |                 3 | No additional initial-state issue observed                     | F5 (555px); F6                |
| [Product SDK/POIMediaGallery](http://127.0.0.1:6006/?path=/story/product-sdk-poimediagallery--default)             |                 1 | No additional initial-state issue observed                     | F5 (610px); F6                |
| [Product SDK/POIResultCard](http://127.0.0.1:6006/?path=/story/product-sdk-poiresultcard--default)                 |                 2 | No additional initial-state issue observed                     | F5 (544px); F6                |
| [Product SDK/POIResultList](http://127.0.0.1:6006/?path=/story/product-sdk-poiresultlist--default)                 |                 2 | No additional initial-state issue observed                     | F5 (582px); F6                |
| [Navigation/Pagination](http://127.0.0.1:6006/?path=/story/navigation-pagination--default)                         |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/PasswordInput](http://127.0.0.1:6006/?path=/story/components-passwordinput--default)                   |                 5 | No additional initial-state issue observed                     | F4; F6                        |
| [Overlay/Popover](http://127.0.0.1:6006/?path=/story/overlay-popover--default)                                     |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Feedback/Progress](http://127.0.0.1:6006/?path=/story/feedback-progress--default)                                 |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Inputs/RadioGroup](http://127.0.0.1:6006/?path=/story/inputs-radiogroup--default)                                 |                 3 | No additional initial-state issue observed                     | F4; F6                        |
| [Input/Rating](http://127.0.0.1:6006/?path=/story/input-rating--default)                                           |                 1 | No additional initial-state issue observed                     | F4; F5 (509px); F6            |
| [Product SDK/RouteOptionCard](http://127.0.0.1:6006/?path=/story/product-sdk-routeoptioncard--selected)            |                 2 | No additional initial-state issue observed                     | F5 (466px); F6                |
| [Product SDK/RoutePreviewPanel](http://127.0.0.1:6006/?path=/story/product-sdk-routepreviewpanel--ready)           |                 2 | No additional initial-state issue observed                     | F5 (656px); F6                |
| [Map/RouteSummary](http://127.0.0.1:6006/?path=/story/map-routesummary--active)                                    |                 2 | F7 — Docs split from stories                                   | F7: separate Components entry |
| [Map/RoutingInputGroup](http://127.0.0.1:6006/?path=/story/map-routinginputgroup--default)                         |                 2 | F7 — Docs split from stories                                   | F7: separate Components entry |
| [Map/SaveLocationCard](http://127.0.0.1:6006/?path=/story/map-savelocationcard--unsaved)                           |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/ScrollArea](http://127.0.0.1:6006/?path=/story/components-scrollarea--horizontal-quick-access)         |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Inputs/Search](http://127.0.0.1:6006/?path=/story/inputs-search--default)                                         |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/SearchBar](http://127.0.0.1:6006/?path=/story/components-searchbar--default)                           |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Selection/SegmentedControl](http://127.0.0.1:6006/?path=/story/selection-segmentedcontrol--default)               |                 4 | No additional initial-state issue observed                     | F4; F5 (556px); F6            |
| [Components/Select](http://127.0.0.1:6006/?path=/story/components-select--default)                                 |                 4 | No additional initial-state issue observed                     | F4; F6                        |
| [Data Display/Separator](http://127.0.0.1:6006/?path=/story/data-display-separator--default)                       |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Navigation/Sidebar](http://127.0.0.1:6006/?path=/story/navigation-sidebar--default)                               |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Feedback/Skeleton](http://127.0.0.1:6006/?path=/story/feedback-skeleton--default)                                 |                 1 | F9 — circular placeholder becomes 24×48px                      | F4; F6                        |
| [Inputs/Slider](http://127.0.0.1:6006/?path=/story/inputs-slider--default)                                         |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Feedback/Spinner](http://127.0.0.1:6006/?path=/story/feedback-spinner--default)                                   |                 3 | No additional initial-state issue observed                     | F4; F6                        |
| [Action/SplitButton](http://127.0.0.1:6006/?path=/story/action-splitbutton--default)                               |                 1 | No additional initial-state issue observed                     | F4; F5 (545px); F6            |
| [Foundations/Stack](http://127.0.0.1:6006/?path=/story/foundations-stack--default)                                 |                 2 | No additional initial-state issue observed                     | F4; F5 (399px); F6            |
| [Navigation/Stepper](http://127.0.0.1:6006/?path=/story/navigation-stepper--default)                               |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/Switch](http://127.0.0.1:6006/?path=/story/components-switch--default)                                 |                 3 | No additional initial-state issue observed                     | F4; F6                        |
| [Data Display/Table](http://127.0.0.1:6006/?path=/story/data-display-table--default)                               |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/Tabs](http://127.0.0.1:6006/?path=/story/components-tabs--default)                                     |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Data Display/Tag](http://127.0.0.1:6006/?path=/story/data-display-tag--default)                                   |                 3 | No additional initial-state issue observed                     | F4; F6                        |
| [Foundations/Text](http://127.0.0.1:6006/?path=/story/foundations-text--default)                                   |                 3 | No additional initial-state issue observed                     | F4; F5 (528px); F6            |
| [Components/Textarea](http://127.0.0.1:6006/?path=/story/components-textarea--default)                             |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [System/ThemeProvider](http://127.0.0.1:6006/?path=/story/system-themeprovider--default)                           |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/TimePicker](http://127.0.0.1:6006/?path=/story/components-timepicker--default)                         |                 2 | No additional initial-state issue observed                     | F4; F6                        |
| [Data Display/Timeline](http://127.0.0.1:6006/?path=/story/data-display-timeline--detailed)                        |                 4 | No additional initial-state issue observed                     | F4; F5 (393px); F6            |
| [Feedback/Toast](http://127.0.0.1:6006/?path=/story/feedback-toast--default)                                       |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Action/ToggleButton](http://127.0.0.1:6006/?path=/story/action-togglebutton--default)                             |                 1 | No additional initial-state issue observed                     | F4; F5 (528px); F6            |
| [Overlay/Tooltip](http://127.0.0.1:6006/?path=/story/overlay-tooltip--default)                                     |                 1 | No additional initial-state issue observed                     | F4; F6                        |
| [Data Display/Tree](http://127.0.0.1:6006/?path=/story/data-display-tree--default)                                 |                 3 | No additional initial-state issue observed                     | F4; F6                        |
| [Components/UserLocationMarker](http://127.0.0.1:6006/?path=/story/components-userlocationmarker--default)         |                 2 | No additional initial-state issue observed                     | F7: no live preview           |
| [Components/WayfindingCard](http://127.0.0.1:6006/?path=/story/components-wayfindingcard--default)                 |                 2 | No additional initial-state issue observed                     | F4; F5 (393px); F6            |

## Evidence and reproduction

- Running preview: [Storybook](http://127.0.0.1:6006/), unchanged implementation `767b3be`.
- [Machine capture results](/private/tmp/kozmos-browser-compat.uqPMBD/test-results/component-review/results.json), [Docs measurements](/private/tmp/kozmos-browser-compat.uqPMBD/test-results/component-review/docs-diagnostics.json), [catalog](/private/tmp/kozmos-browser-compat.uqPMBD/test-results/component-review/catalog.json).
- [First visual contact sheet](/private/tmp/kozmos-browser-compat.uqPMBD/test-results/component-review/sheet-01.png); sheets 01–40 cover all 236 variants. Landscape sheets 1–7 cover all 102 groups.
- [POI overlay mobile screenshot](/private/tmp/kozmos-browser-compat.uqPMBD/test-results/component-review/components-poicard--inside-map-overlay-mobile.png), [blank map example](/private/tmp/kozmos-browser-compat.uqPMBD/test-results/component-review/examples-map-based-search--default-desktop.png), [Button Docs mobile screenshot](/private/tmp/kozmos-browser-compat.uqPMBD/test-results/component-review/components-button--docs-mobile.png).
- Diagnostic scripts and captured PNGs live in the same ignored directory. They operate on local Storybook UI and do not modify component source. Run from the implementation worktree:

```sh
node test-results/component-review/review.mjs
node test-results/component-review/docs-diagnostics.mjs
node test-results/component-review/gallery.mjs
node test-results/component-review/landscape-gallery.mjs
STORYBOOK_URL=http://127.0.0.1:6006 pnpm test:storybook-interactions
STORYBOOK_URL=http://127.0.0.1:6006 pnpm test:storybook-regressions
```

No fixes were folded into this checking request. Main, the running preview, component source, package versions and external services remain unchanged.
