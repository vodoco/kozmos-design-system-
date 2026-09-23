# @kozmos-ds/react

## 0.1.0

### Minor Changes

- a06ca47: Add optional platform-neutral POI detail sections, summaries, opening hours,
  descriptions, tags and supplementary book/call capabilities. Keep the existing
  required POI action labels unchanged. Update the detail anatomy for wrapping
  titles, optional logos, controlled header save actions and reachable actions.
  Add labelled media-error fallback and remove forced smooth gallery movement.
- eb68e53: Support decorative POI asset icons, generic highlighted properties, semantic metadata tones and price scales. Demonstrate taxonomy-driven attribute labels/icons/order with a pinned Pointr 10.12.0 dictionary outside the public component runtime.

### Patch Changes

- 0cf155f: `AISearchButton`'s gradient ring is a band two and a half wide all the way
  round. It was drawn as a 43 disc stacked inside a 48 circle, and Chromium
  painted the disc's rounded rect about 0.44px right and down of the ring's — at
  every device pixel ratio, animated or frozen — so the band ran 1.9 on one side
  and 3.1 on the other. WebKit and Firefox drew it evenly, which is why it looked
  like nothing, and the only check on it read `offsetWidth` and `offsetLeft` and
  called the difference the band.

  The band is cut out of the ring itself now, by a radial mask, so nothing else
  decides where it ends; the disc behind it moves to inset 2, inside the band, and
  is painted first. Measured in the paint on 36 rays at eight device pixels to the
  CSS pixel: a spread of 0.24 in Chromium and Firefox and 0.21 in WebKit, against
  1.33 before.

  No API change: the button is the same 48 circle with the same gradient and the
  same turn.

- 7775c73: Button keeps 8px between its icon and its label, as Figma's Button and iOS's
  always have (GAP-56). `.kozmos-button` takes the spacing scale's 100 as a gap,
  and the loading spinner loses its own `mr-2`, which spaced it on one side only:
  in right-to-left the spinner touched the label. An icon passed to a Button no
  longer needs `mr-2`; one that keeps it sits 16px away, so remove it.
- 71e31bd: Keep scoped preflight at zero specificity so it does not override consumer
  heading styles. Move Text and Heading to component-owned typography recipes,
  preserving their public type scale and props without requiring native CSS scope.
- 1edef7b: The package declares the browsers it actually works in: Chrome and Edge 118,
  Safari and iOS 17.4, Firefox 128, Android WebView 118. It declared nothing
  before, which promised everything.

  The floor is `@scope`, which fences the component styles off from a host page.
  A browser below those versions discards the whole block rather than ignoring
  the rule, and 955 of the stylesheet's 1,227 rules live inside one. What that
  costs is not all or nothing: measured across 43 elements, 30 render identically
  without `@scope` and 13 do not — the 31 components carrying their own CSS are
  unaffected, the 73 styled by utilities lose their layout and colour.

  Declaring it also narrows what autoprefixer emits: `-moz-user-select` and
  `-moz-column-gap` go, both unprefixed in Firefox long before 128. Nothing else
  in the stylesheet changes, and it is 1,189 bytes smaller.

  Lowering the floor is the work of moving the remaining components to owned CSS.
  Raising one would be a breaking change, so it starts where the code is.

- 42fbe70: Emotion text reads on every neutral surface. `Semantics.Emotion.*.Text` was
  measured on white alone, and four of six failed 4.5:1 on the greys a panel,
  card or sheet paints (background/50 and /100): success and alert move from 800
  to 900, informative from 700 to 800, danger from 600 to 700; themed and neutral
  already passed. The contrast contract now holds every emotion's text on
  background/0, /50 and /100 in both themes.

  React draws status text and glyphs with the new Tailwind `*-text` roles
  (`text-success-text`, `text-warning-text`, `text-info-text`,
  `text-destructive-text`), which read those tokens; `success`, `warning`, `info`
  and `destructive` stay the fills, edges and rings they were.

- de7a409: The map sheet's drag handle is a 16px row again, with a 40 × 4 grip (GAP-38).
  Its three declarations read layout tokens straight — `height:
var(--primitives-layout-spacing-200)` — and those tokens are bare numbers
  (`16`, `6`, `40`). A bare number is not a length, so every browser dropped all
  three: the handle rendered 4px tall, the grip 0px wide, in every engine since
  `AdaptiveMapShell` shipped. Each now converts with `calc(var(…) * 1px)`, the
  conversion the owned blur and slide rules already make, and iOS's grabber row
  and Android's `SheetHandle` already matched.

  `pnpm tokens:unitless:check` is new and fails on any owned length that reads a
  bare-number token without converting it.

- 3bedd72: AdaptiveMapShell's bottom sheet eases only between detents — after a new
  detent or a drag's release — and takes its first placement and a change of
  the host's size at once; it no longer flies in from the shell's top when it
  mounts. A panel with no room is hidden again (its flex display had outranked
  the `hidden` attribute), and map controls a bottom sheet leaves no band for
  are hidden rather than drawn under the sheet, where a keyboard or a screen
  reader still reached them; they no longer pad the camera then.
- 1d4e323: Use the shared 16px control radius throughout POI detail surfaces, chips and
  gallery media. IconButton now inherits Button's control radius instead of
  forcing a circular pill. Edge-attached POI sheets retain square bottom corners.
- c7c35d6: Synchronize the media gallery's controlled/default index, keyboard and native
  scroll position without scrolling ancestor panels. Preserve selection through
  resize and RTL changes, clamp stale indices, localize the controls group, and
  give the gallery component-owned CSS. Reset detail scroll when the POI changes
  and omit failed logos until their source changes.
  Reflow detail summary cells before normal words fragment on narrow hosts.
- ddb2656: Align POI navigation typography/icon sizes and compact informational chips with
  the supplied SDK measurements. Reuse Pointr action glyphs and show controlled
  save selection with a themed fill and outline icon. Detail group items now
  accept the existing optional service iconName field; unknown icons preserve text.
- ad1a23b: Keep POI action buttons on one horizontally scrollable row. Add a localizable action-group name, keyboard scrolling and visible focus, while preserving native button tab navigation and resetting scroll on POI changes.
- a9e9cb3: Compose POI summary facts with the shared MetaStrip instead of a wrapping
  duplicate. Keep facts on one keyboard-scrollable row and align icon/text groups
  and primary-action text. MetaStrip now owns its CSS and allows its minimum 64px
  height to grow with content instead of clipping enlarged text.
- 95ccf34: Cap POI highlighted metadata at three priority-ordered items and share the available width equally. Reflow labels/details within cells instead of scrolling the strip; keep the generic MetaStrip behavior unchanged.
- a03d3fd: The ES build ships one file per module, so an app's bundler keeps only what it
  imports. Importing `Button` alone cost an app 48.7 KB gzip of Kozmos code,
  nearly the whole library, because the build was one file its bundler could not
  trim; it now costs 1.1 KB, and the heaviest single component, POIDetailPanel,
  6.2 KB. Import paths do not change, and `require()` still gets one UMD file.
- 550b561: Every animation that loops now rests when the visitor has asked for less
  motion, and by either route (GAP-50). `Skeleton`'s pulse read neither the
  preference nor the design config; the spinner and the assistant's ring read the
  preference only. One owned rule governs all three, last in the owned block
  because they are all a single class and source order is what decides.

  The design config's `motion: reduced` reaches them too. It scales
  `--semantics-motion-duration-scale` to 0.001, which turns a transition into a
  cut — and a one-second spin into a strobe, so an animation that loops has to be
  told to stop rather than scaled. `DesignConfigProvider` marks its scope
  `data-kozmos-motion="reduced"` and the rules read the mark.

  On the natives the same: SwiftUI's skeleton holds its sheen still under
  `accessibilityReduceMotion`, and Compose's under the system's animation scale,
  as the spinner and the ring already did on both.

  `ToggleButton` keeps 8 between an icon and its label, and `Tag` 4 (GAP-75).
  `ToggleButton` is a Radix Toggle styled on its own, so `Button`'s fix left it at
  zero while SwiftUI and Compose had been drawing 8 all along; `Tag` takes
  arbitrary children on React alone, where an icon beside its text touched, and 4
  is the spacing SwiftUI's `Tag` uses. `Chip` is unchanged: its 6 is `Chip/gap`,
  bound to `Layout/spacing/75` in Figma.

- b9dd0d6: Keep Navbar context, navigation and actions available in narrow containers using
  content-driven wrapping. Navbar now has a minimum rather than fixed 64px height;
  hosts must allow it to grow. Add an optional navigation landmark label.

  Allow SearchBar inputs to shrink beside their controls. Make UserLocationMarker
  SVG gradient IDs instance-local and respect reduced-motion preferences for rings.

- 81812c4: `SearchBar` takes a `trailing` slot, and owns the row it makes. The field is as
  wide as its container and always has been, so a caller composing the assistant's
  button beside it got the field on one line and the button on the next, unless
  they happened to know to pass `flex-1` through `containerClassName`. Storybook's
  example knew; the reference site's did not, and neither would an integrator's.

  ```tsx
  <SearchBar placeholder="Search this building" trailing={<AISearchButton />} />
  ```

  The row's rules are owned CSS — `.kozmos-search-row` — not utilities, because
  the utility layer does not reach a browser without `@scope`, and a promise that
  holds only where Tailwind's layer applies is not one. `rowClassName` styles the
  row; `containerClassName` still styles the field inside it.

  The same slot on SwiftUI (`KozmosSearchBar(text:placeholder:) { … }`) and on
  Compose (`trailing = { … }`), where a row never wraps but the one-call form
  should be the same shape on every platform. Vue needs nothing: the adapter
  already bridges a named slot to the React prop of the same name, so
  `<template #trailing>` works.

- 4ef471f: The spinner is one drawing on every platform. It was four: lucide's `Loader2`
  in React, `ProgressView().tint(.blue)` on iOS — a hard-coded blue that ignored
  the theme, at a size the caller could not set — material3's
  `CircularProgressIndicator` on Android, and in Figma an ellipse with
  `dashPattern: [8, 4]`, a dashed ring standing in for motion a static node
  cannot show. No two matched.

  `Spinner` now draws the system's arc: three quarters of a circle of radius 9 in
  the icons' own 24 box, round caps, stroke 2, so its weight scales with its size
  as every Kozmos icon's does, in `currentColor` so it follows the text around it.
  `size` reaches iOS and Android for the first time — 16, 24, 32, 48 — and
  `label` names the wait for assistive technology. `Button`'s loading state draws
  the same arc, as do `KozmosButton` on SwiftUI and Compose.

  The turn now rests under `prefers-reduced-motion` (part of GAP-50), on one
  owned rule, so `Spinner` and a loading `Button` cannot drift apart; the status
  role keeps announcing the wait when the turn stops.

- Updated dependencies [42fbe70]
- Updated dependencies [c5ec97c]
- Updated dependencies [ddb2656]
- Updated dependencies [a06ca47]
- Updated dependencies [eb68e53]
  - @kozmos-ds/tokens@0.1.0
  - @kozmos-ds/icons@0.1.0
  - @kozmos-ds/product-contracts@0.1.0
