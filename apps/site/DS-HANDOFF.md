# Design-system fixes the website needs — a handoff

**For:** the agent that changes Kozmos itself (`packages/`).
**From:** the Kozmos website, `apps/site` on the local branch `claude/kozmos-site`
(worktree `/Volumes/4TB Depo/development/K/kozmos-design-system-site`).
**Written:** 2026-09-22, after a design critique of the site. Every number
below was measured on the site's production build.

The site is built from Kozmos components and tokens only. Where Kozmos fell
short, the site did not work around it: the gap is recorded in
[`GAPS.md`](./GAPS.md) (GAP-01 to GAP-44, with the evidence), and the site
either composed an honest stand-in from Kozmos parts or left the defect
visible. This document turns those gaps into work for `packages/`, in
priority order, with the file and line, the change, and the site check that
proves it.

## Ground rules

- **Change `packages/`, not the site.** The site's own fixes are done.
- **Where:** the packages the site uses are those of the component branch
  `claude/pointr-browse-repairs` (the site is based on it at `f30c0f9`; the
  packages are unchanged since). Work in your own worktree of that branch, or
  wherever its owner says; the site rebases afterwards (its README,
  "Keeping up with the component branch").
- **Parity:** a part that exists in SwiftUI, Compose or Figma changes there
  too, as `docs/ds-handoff.md` and `pnpm components:contract:check` require.
- **CI:** everything the workflow runs must stay green — the list is on the
  site at `/get-started#checks` (`pnpm lint && pnpm build && pnpm test`, the
  contract, token, class, install, Figma and browser checks).
- **Proof on the site:** each fix below names the site check it flips. The
  site pins today's defects on purpose (`tests/site.spec.ts`: the
  "design-system gaps, measured" tests, the `knownViolations` table, one
  `test.fail`), so a fix makes that check fail. Then flip it — change the
  expectation to the fixed one, or delete the entry — and set the gap to
  _fixed_ in `GAPS.md`.

To run the site against your packages:

```sh
cd "/Volumes/4TB Depo/development/K/kozmos-design-system-site"
pnpm install
pnpm turbo run build --filter=@kozmos/site^...     # rebuild the Kozmos packages
pnpm --filter @kozmos/site build
pnpm --filter @kozmos/site test:e2e                 # Chromium, Firefox, WebKit
```

## At a glance

| Priority | Gap                        | Part                                                     | One line                                                                                         |
| -------- | -------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| P0       | GAP-38                     | AdaptiveMapShell sheet                                   | The drag handle is 4 px tall and its grip 0 px wide: three rules use unitless tokens as lengths. |
| P0       | GAP-40                     | MapView, MapOverlay, Navbar                              | Map overlays draw over the sticky header: equal z-index, and MapView does not isolate.           |
| P1       | GAP-09                     | Button (as a link)                                       | `buttonVariants` on an anchor keeps its underline.                                               |
| P1       | GAP-03                     | ThemeProvider                                            | A dark-mode visitor sees a white page until the scripts run (1.9 s on fast 3G, 4× CPU).          |
| P1       | GAP-41                     | Navbar                                                   | No narrow-screen pattern: the header was 227 px on a phone.                                      |
| P1       | GAP-31                     | Tokens                                                   | Alert text 4.29:1 on a card, success text 4.48:1 on the muted background.                        |
| P1       | GAP-37, GAP-20             | SearchBar                                                | Two clear buttons; unstyled in WebKit.                                                           |
| P1       | GAP-42                     | CardTitle                                                | Line height 1.0: wrapped titles touch.                                                           |
| P1       | GAP-43                     | Slider, Tabs, Rating, SearchBar                          | Targets under 44 px; the slider thumb is 20 × 20.                                                |
| P1       | GAP-39                     | RouteSummary                                             | Its title is always an `h2`.                                                                     |
| P1       | —                          | The React package                                        | Not tree-shaken: 155 kB gzipped in the site's bundle, whatever it imports.                       |
| P2       | GAP-24, 29, 34, 36         | DynamicIsland, BottomNavigation, Backdrop, ToastViewport | Always fixed to the viewport.                                                                    |
| P2       | GAP-17, 28, 30, 32         | AdaptiveMapShell, SearchBar, Sidebar, ChipGroup          | Landmarks and groups that cannot be named or placed.                                             |
| P2       | GAP-44 and the rest        | see the table below                                      | API and structure.                                                                               |
| P3       | GAP-05, 06, 07, 08, 15, 33 | new parts, icons, tokens                                 | Additions.                                                                                       |

## P0 — broken for people using it

### GAP-38 · The map sheet's handle is 4 px tall and its grip invisible

- **Where:** `packages/react/src/styles/owned-components.css`, lines 156, 157
  and 166:
  `height: var(--primitives-layout-spacing-200)`,
  `padding-top: var(--primitives-layout-spacing-75)`,
  `width: var(--primitives-layout-sizing-500)`.
- **Why it breaks:** layout tokens are unitless (`16`, `6`, `40`); a unitless
  number is not a length, so the browser drops all three declarations. The
  handle (`role="slider"`, "Panel height") measures 388 × 4 px and its grip
  0 × 4 px, in every engine. These are the only three such declarations in
  the owned stylesheets (checked with a grep over `src/styles/*.css`).
- **Change:** `calc(var(--primitives-layout-spacing-200) * 1px)` and so on,
  as every other owned rule does. Give the handle a 44 px hit area while
  you are there (GAP-43).
- **Proof:** the site's test "GAP-38: the map sheet's handle is 4px tall and
  its grip has no width" fails; change it to expect a height ≥ 24 (44 if you
  add the hit area) and a grip width of 40.
- **Guard:** add a check to the package that no owned rule uses a
  `--primitives-layout-*` token without `calc(… * 1px)`.

### GAP-40 · Map overlays draw over the sticky header

- **Where:** `MapOverlay/MapOverlay.tsx:66` (`z-50`),
  `styles/owned-navbar.css:5` (`sticky top-0 z-50`), and
  `MapView/MapView.tsx:19`, whose root creates no stacking context.
- **Why it breaks:** equal z-index, and the map comes later in the document,
  so its overlays paint over the header as the page scrolls. Seen on the
  site's hero scene, the MapOverlay reference page and the kiosk example;
  `AdaptiveMapShell` is safe because its root is `isolate`.
- **Change:** `isolate` on `MapView`'s root. Then give the layers an order
  in the tokens (`--primitives-layer-*`) in which a page's sticky
  navigation sits above a map's own overlays.
- **Proof:** "GAP-40: MapView does not isolate its overlays" fails; flip it
  to expect `isolate`. The site's own `isolation: isolate` on its frames can
  then go (`src/styles/site.css`, the comments name GAP-40).

## P1 — visible on the site's first screens

### GAP-09 · A link drawn as a button keeps its underline

- **Where:** `styles/owned-components.css:261`, `.kozmos-button`; the React
  README tells consumers to put `buttonVariants` on their router's link.
- **Change:** `text-decoration: none` on `.kozmos-button` (and its hover and
  focus states).
- **Proof:** "GAP-09: a link drawn as a button keeps its underline" fails;
  flip it to expect `none`.

### GAP-03 · A dark-mode visitor sees a white page first

- **Where:** `ThemeProvider/ThemeProvider.tsx` — the stored choice is read at
  line 69 and `data-theme` is set on the provider's root at line 115, both
  in React, so a pre-rendered or server-rendered page paints light first.
  Measured: 63 ms of white on a fast line, 1.9 s on fast 3G with a 4×
  slower CPU.
- **Change:** export a pre-paint script — a string or a `<ThemeScript>` for
  the document's head — that resolves the theme exactly as the provider
  does (its `storageKey`, `defaultTheme`, the system preference) and sets
  it on `<html>` before the first paint. Document it in the React
  package's README, beside the provider.
- **Proof:** "GAP-03: a dark-mode visitor's page is light until the scripts
  run" keeps passing until the site adds the script to `src/root.tsx`; then
  it fails, and flips to expect `dark`.

### GAP-41 · `Navbar` has no narrow-screen pattern

- **Where:** `styles/owned-navbar.css:13–15` (`.kozmos-navbar-leading`,
  `flex: 1 1 32rem`) and `:29–31` (`.kozmos-navbar-navigation`, which wraps
  its links into rows).
- **Why:** the leading group's 32rem basis pushes `actions`, `utilities` and
  `account` onto a second row on any screen narrower than about 32rem plus
  their width, and nothing collapses the links. The site's header was 227 px
  tall and sticky on a 390 px phone.
- **Change:** a narrow-screen mode — a `collapseBelow` breakpoint that moves
  `navigation` into a `Drawer` behind a menu button — and a trailing group
  that stays on the first row.
- **Proof:** the site's "the header is one row at …" tests keep passing; the
  site can then go back to passing links as `navigation` and tools as
  `utilities` (`src/site/SiteHeader.tsx` explains the current arrangement).

### GAP-31 · Emotion text under 4.5:1 on a card and on the muted background

- **Where:** the tokens (`packages/tokens`):
  `--semantics-emotion-alert-text` `#a06b04` measures 4.29:1 on the card
  (`#f7f8fa`); `--semantics-emotion-success-text` `#197f4c` measures 4.48:1
  on the muted background (`#f1f2f4`). Both pass on white only.
- **Change:** a darker step for both roles (tune against the card and the
  muted background, not only white), and add those pairs to
  `packages/tokens/src/contrast-contract.json` so CI measures them.
- **Proof:** the `knownViolations` entries in `tests/site.spec.ts` for
  `/components/alert`, `/components/input`, `/components/date-picker` and
  `/components/tag` report "no longer occurs"; delete them.

### GAP-37 and GAP-20 · SearchBar

- **Where:** `SearchBar/SearchBar.tsx:68` renders `type="search"`.
- **GAP-37:** the browser's own cancel button shows beside Kozmos's 44 px
  clear. Hide `::-webkit-search-cancel-button` (and
  `::-webkit-search-decoration`) in the field's owned CSS.
  **Proof:** "GAP-37: SearchBar keeps the browser's own clear button" fails
  (Chromium); flip it to expect `none`.
- **GAP-20:** WebKit (Safari, iOS) does not apply the `@scope`d utilities to
  the input, so the field is drawn unstyled. Move its styling to owned CSS,
  as `Input` did. **Proof:** the `test.fail` in "the search field is drawn
  as Kozmos draws it" reports an unexpected pass in WebKit; remove the
  `test.fail`.

### GAP-42 · `CardTitle`'s line height is 1.0

- **Where:** `Card/Card.tsx:38`, `text-2xl font-semibold leading-none`.
- **Change:** the line height the heading tokens give that size, as
  `Heading` uses.
- **Proof:** "GAP-42: a CardTitle's line height equals its font size" fails;
  flip it to expect about 1.33.

### GAP-43 · Touch targets under 44 px

- **Where and what:** `Slider/Slider.tsx:174`, thumb `h-5 w-5` (20 × 20);
  `Tabs/Tabs.tsx:45`, trigger `py-1.5` (32 px tall); `Rating/Rating.tsx:64`,
  star `w-6 h-6` (24 × 24); `SearchBar`'s input is 23 px tall inside its
  44 px bar; the sheet handle of GAP-38.
- **Change:** a 44 px hit area around each (padding or a pseudo-element),
  keeping the drawn size; the search input filling its bar.
- **Proof:** "GAP-43: the Slider's thumb is 20px square" fails; flip it to
  expect a 44 px hit area (or a 20 px thumb inside a 44 px target, measured
  on the thumb's hit element).

### GAP-39 · `RouteSummary`'s title is always an `h2`

- **Where:** `RouteSummary/RouteSummary.tsx:70`.
- **Change:** a `titleLevel` prop like `POIDetailPanel`'s, with a way to
  render no heading at all (for a scene or a preview, where the summary is
  not a section of the page).
- **Proof:** none automatic; the site then passes it in
  `src/home/HeroScene.tsx`.

### The React package is not tree-shaken

- **Where:** `packages/react` — `sideEffects` is already `["**/*.css"]`,
  yet everything ships. The likely cause, not yet verified: the 183
  top-level `Component.displayName = …` writes and the unannotated
  `React.forwardRef(…)` calls, which a bundler must treat as side effects.
- **Measured:** the site's `kozmos-react-*.js` chunk is 155 kB gzipped
  whatever the page imports; with about 290 kB of script preloaded, the
  home page's first paint was 7.1 s on fast 3G with a 4× slower CPU.
- **Change:** annotate the component factories `/* @__PURE__ */` (or build
  with a pure-annotation step) and move `displayName` into a pure form.
- **Proof:** a one-component consumer (`import { Button }`) bundles far less
  than 155 kB gzipped; the site's chunk shrinks on the next build.

## P2 — API and structure

| Gap                                         | Where                                                | Change                                                                                          | Site check                                                                           |
| ------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| GAP-24 DynamicIsland fixed                  | `DynamicIsland/DynamicIsland.tsx:38`                 | One `placement` API for the four viewport-fixed parts: `"viewport"` (default) or `"container"`. | Demos mount them only on request; drop that once placement exists.                   |
| GAP-29 BottomNavigation fixed               | `BottomNavigation/BottomNavigation.tsx:40`           | As above.                                                                                       | As above.                                                                            |
| GAP-34 Backdrop fixed                       | `Backdrop/Backdrop.tsx:12`                           | As above.                                                                                       | The kiosk example's attract screen can use Backdrop.                                 |
| GAP-36 ToastViewport fixed                  | `Toast/Toast.tsx:16`                                 | As above.                                                                                       | The dashboard and inbox can use toasts.                                              |
| GAP-17 shell panel is an `aside`            | `AdaptiveMapShell/AdaptiveMapShell.tsx:627`          | Let the host choose the panel's element or role.                                                | `knownViolations` `landmark-complementary-is-top-level` entries.                     |
| GAP-28 search landmark unnamed              | `SearchBar/SearchBar.tsx:54`                         | Name the `role="search"` wrapper (`landmarkLabel`, or from the field's label).                  | `knownViolations` for `/components/search-bar` and `/components/adaptive-map-shell`. |
| GAP-30 Sidebar navigation unnamed           | `Sidebar/Sidebar.tsx:57`                             | `navigationLabel`, as `Navbar` has.                                                             | `knownViolations` for `/components/sidebar`.                                         |
| GAP-32 ChipGroup has no role                | `Chip/Chip.tsx:175`                                  | `role="group"` on the wrapper.                                                                  | The site's `role="group"` props can go.                                              |
| GAP-35 categories grid fixed at 4           | `BrowseCategoriesPanel/BrowseCategoriesPanel.tsx:63` | `repeat(auto-fill, minmax(5.5rem, 1fr))` or a `columns` prop.                                   | The kiosk's directory column can narrow.                                             |
| GAP-44 Switch and Checkbox full width       | `Switch/Switch.tsx:27`, `Checkbox/Checkbox.tsx:28`   | Size the wrapper to its content.                                                                | The hero's `.site-scene-toggle` boxes can go.                                        |
| GAP-26 Text cannot inherit colour           | `Text/Text.tsx:31`                                   | `color="inherit"`, or no colour class unless asked.                                             | The DynamicIsland demo can use `Text`.                                               |
| GAP-27 useTheme has no direction            | `ThemeProvider/ThemeProvider.tsx:140`                | Return `dir`.                                                                                   | —                                                                                    |
| GAP-11 EmptyState title not a heading       | `EmptyState/EmptyState.tsx`                          | A `titleLevel`.                                                                                 | —                                                                                    |
| GAP-12 Alert role and AlertTitle            | `Alert/Alert.tsx:32`, `:43`                          | Default role for a static note; an `AlertTitle` level.                                          | Pages pass `role="status"` and use bold text today.                                  |
| GAP-13 SelectTrigger label, Textarea helper | `Select/Select.tsx:34`, `Textarea/Textarea.tsx:8`    | A `label` on the trigger; `helperText` on Textarea.                                             | Pages wrap them in `FieldWrapper` and add a `Text`.                                  |
| GAP-14 CardTitle always `h3`                | `Card/Card.tsx:31`                                   | A level.                                                                                        | Examples use `Heading` in cards.                                                     |
| GAP-16 TabsList neither wraps nor scrolls   | `Tabs/Tabs.tsx:23`                                   | Scroll or wrap on overflow.                                                                     | The site wraps TabsList in ScrollArea.                                               |
| GAP-19 Navbar always sticky                 | `styles/owned-navbar.css:5`                          | A `sticky` prop.                                                                                | Examples frame their Navbar in a canvas.                                             |
| GAP-21 Heading scale tops out at 36 px      | `Heading/Heading.tsx:11`                             | Reach the tokens' 60 px heading.                                                                | The site sets display sizes from tokens.                                             |
| GAP-25 MapView insists on 400 px            | `MapView/MapView.tsx:19`                             | A smaller minimum, or none.                                                                     | Map demos get 400 px frames.                                                         |
| GAP-01 NavigationItem `asChild` throws      | `NavigationItem/NavigationItem.tsx:87`               | Make `asChild` work.                                                                            | `src/site/links.tsx` uses a click handler instead.                                   |
| GAP-02 reset.css ships raw `theme()`        | `dist/reset.css` (8 occurrences)                     | Process the preflight the build copies.                                                         | —                                                                                    |
| GAP-04 Grid cannot reflow                   | `Grid/Grid.tsx:9`                                    | Responsive columns.                                                                             | The site lays grids out in its own CSS.                                              |
| GAP-18 POIDetailPanel on the shell's panel  | `POIDetailPanel`                                     | A presentation for AdaptiveMapShell's panel.                                                    | —                                                                                    |
| GAP-22 font-weight tokens are names         | tokens                                               | Numeric weights.                                                                                | —                                                                                    |
| GAP-23 component colours are baked          | tokens                                               | Aliases to the ramps, so a brand override reaches all 45 themed tokens (32 today).              | "Make it yours" reports the count.                                                   |

## P3 — additions

| Gap    | What Kozmos lacks                                                                                                                             | Suggested                                                                                                             |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| GAP-05 | A code block; `Text` has no monospace                                                                                                         | `CodeBlock` with copy, and `Text font="mono"`.                                                                        |
| GAP-06 | A skip link and visually hidden text                                                                                                          | `SkipLink` and `VisuallyHidden`.                                                                                      |
| GAP-07 | Icons: sun, moon, display, copy, external link                                                                                                | Add them; the site's theme menu then gets an icon.                                                                    |
| GAP-08 | A footer                                                                                                                                      | `Footer`.                                                                                                             |
| GAP-15 | Venue icons: food and drink, toilets, accessible facilities, parking, first aid                                                               | Add them; three examples leave those categories out today.                                                            |
| GAP-33 | A token for the route line on a map                                                                                                           | `semantics-map-route` (line, casing, walked part), both themes, in the contrast contract.                             |
| —      | Docs: 37 component `.mdx` files open with the placeholder "Displays the X interface topology natively"; 17 have no SwiftUI or Compose snippet | Write one real sentence and the missing snippets; the site picks them up on `pnpm generate`. The README lists the 37. |
