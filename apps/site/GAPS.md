# What the site found Kozmos cannot do yet

The site is built from `@kozmos/react` and its tokens only (see README.md,
"The one rule"). Where that was not enough, the gap is written here instead of
being worked around, following the method in `docs/ds-handoff.md` §11: the
component and the part, what was tried, the lane, and the evidence. Every entry
was measured on `claude/pointr-browse-repairs` at `ef1b68b` (2026-09-21), the
branch the site is built on; its packages are unchanged at `f30c0f9`, the
site's current base.

**Lanes** are the handoff's: Core (domain-neutral components), Product / SDK,
or Site (a need of this website, not of a product).

**Status** is one of: _open_ (nothing done), _composed_ (the site builds it
from Kozmos parts and says so), _left visible_ (the defect shows on the page on
purpose, because hiding it would hide the evidence).

| ID     | What                                                          | Lane                   | Status       |
| ------ | ------------------------------------------------------------- | ---------------------- | ------------ |
| GAP-01 | `NavigationItem` `asChild` throws                             | Core                   | open         |
| GAP-02 | `reset.css` ships raw Tailwind `theme()` calls                | Core                   | open         |
| GAP-03 | A pre-rendered page starts in the light theme                 | Core                   | left visible |
| GAP-04 | `Grid` cannot reflow, and a caller cannot make it             | Core                   | composed     |
| GAP-05 | No code block; `Text` has no monospace option                 | Core                   | composed     |
| GAP-06 | No skip link or visually-hidden text                          | Core                   | composed     |
| GAP-07 | Icons a website needs: theme, copy, external link             | Core                   | open         |
| GAP-08 | No footer                                                     | Core                   | composed     |
| GAP-09 | `buttonVariants` on a link keeps the link's underline         | Core                   | left visible |
| GAP-10 | No brand mark                                                 | Site                   | open         |
| GAP-11 | `EmptyState`'s title is not a heading                         | Core                   | open         |
| GAP-12 | `Alert` is always `role="alert"`, `AlertTitle` always an `h5` | Core                   | composed     |
| GAP-13 | `SelectTrigger` has no label; `Textarea` no helper text       | Core                   | composed     |
| GAP-14 | `CardTitle` is always an `h3`                                 | Core                   | composed     |
| GAP-15 | No icons for a venue's everyday categories                    | Product / SDK          | open         |
| GAP-16 | `TabsList` neither wraps nor scrolls                          | Core                   | composed     |
| GAP-17 | `AdaptiveMapShell`'s panel is an `<aside>`                    | Product / SDK          | open         |
| GAP-18 | `POIDetailPanel` has no presentation for the shell's panel    | Product / SDK          | left visible |
| GAP-19 | `Navbar` is always sticky                                     | Core                   | composed     |
| GAP-20 | `SearchBar`'s field is unstyled in WebKit (Safari, iOS)       | Product / SDK          | left visible |
| GAP-21 | `Heading` cannot reach the tokens' heading scale              | Core                   | composed     |
| GAP-22 | Font-weight tokens carry names, not weights                   | Core                   | open         |
| GAP-23 | Component-layer colours are baked values, not ramp aliases    | Core                   | left visible |
| GAP-24 | `DynamicIsland` pins itself to the viewport                   | Platform / form factor | open         |
| GAP-25 | `MapView` insists on 400px of height                          | Product / SDK          | composed     |
| GAP-26 | `Text` cannot inherit its colour                              | Core                   | composed     |
| GAP-27 | `useTheme` does not report the direction                      | Core                   | composed     |
| GAP-28 | `SearchBar`'s search landmark cannot be named                 | Product / SDK          | left visible |
| GAP-29 | `BottomNavigation` is always fixed to the viewport            | Core                   | composed     |
| GAP-30 | `Sidebar`'s navigation landmark cannot be named               | Core                   | left visible |
| GAP-31 | The alert emotion's text reads 4.29:1 on a card               | Core                   | left visible |
| GAP-32 | `ChipGroup` carries no role                                   | Core                   | composed     |
| GAP-33 | No token for the route line on the map                        | Product / SDK          | composed     |
| GAP-34 | `Backdrop` pins itself to the viewport                        | Core                   | composed     |
| GAP-35 | `BrowseCategoriesPanel` is four columns at any width          | Product / SDK          | composed     |

---

## GAP-01 · `NavigationItem` `asChild` throws

- **What:** `NavigationItem` declares `asChild`, the usual way to render a
  router's link with the item's look. It cannot work: with `asChild` the item
  passes its own spans (icon, label, badge) to Radix `Slot`, which needs exactly
  one child element.
- **Tried:** `<NavigationItem asChild><a href="/docs">Docs</a></NavigationItem>`,
  with and without `icon`. Rendered with `renderToString` against the built
  package: both throw _"React.Children.only expected to receive a single React
  element child."_ `href` alone renders.
- **Lane:** Core. The same defect `Button` had before its `asChild` was removed
  (the React README records that).
- **Now:** the site passes `href` plus React Router's `useLinkClickHandler` as
  `onClick` (`src/site/links.tsx`). That is the router's documented API for
  custom links, so navigation stays client-side without the prop.
- **Fix in Kozmos:** either implement `asChild` with `Slottable` around the
  label, or remove the prop, as was done for `Button`.

## GAP-02 · `reset.css` ships raw Tailwind `theme()` calls

- **What:** `@kozmos/react/reset.css`, the documented opt-in global reset, is
  Tailwind's `preflight.css` copied verbatim by the `kozmos-opt-in-reset` plugin
  in `packages/react/vite.config.mts`. It still holds eight `theme(…)` calls —
  the base font family, font features and variations, the default border
  colour, the monospace family and the placeholder colour. Browsers drop each
  as invalid, so those eight declarations never apply.
- **Tried:** `grep -c "theme(" packages/react/dist/reset.css` → 8. The only test
  (`scripts/check-theme-isolation.mjs`) asserts a heading's margin, which does
  not use `theme()`, so it passes.
- **Lane:** Core (build).
- **Now:** the site does not import `reset.css`; the provider's scoped preflight
  covers everything inside it, and `site.css` sets `body { margin: 0 }`.
- **Fix in Kozmos:** run the reset through PostCSS with the Tailwind config,
  like `style.css`, and assert a `theme()`-dependent value in the test.

## GAP-03 · A pre-rendered page starts in the light theme

- **What:** on a server, or when pre-rendering, `ThemeProvider` renders
  `defaultSystemTheme` (light) and only reads the stored choice and the system
  preference after hydration. A visitor whose system is dark sees the light page
  first, and the components' colour transitions then animate the change. The
  React README says so ("An initial colour change is possible").
- **Tried:** there is no pre-paint hook. The provider's element is Kozmos's own,
  so the site cannot mark it before hydration without editing the component's
  DOM behind React's back, which it will not do.
- **Evidence:** every pre-rendered page's HTML carries `data-theme="light"` on
  the provider root. In the end-to-end tests, axe measured failing contrast in
  the dark theme until the tests waited for running animations to finish —
  the transition caught mid-way.
- **Lane:** Core.
- **Now:** client-side navigation (GAP-01's workaround) keeps it to the first
  page of a visit.
- **Fix in Kozmos:** let the provider honour a theme already on an ancestor
  (`<html data-theme>`, set by a tiny inline script before paint), or give
  `system` a `prefers-color-scheme` fallback in CSS.

## GAP-04 · `Grid` cannot reflow, and a caller cannot make it

- **What:** `Grid`'s `cols` is a fixed count (1–6, 12) with no responsive or
  auto-fit value. A caller cannot supply one either: Kozmos's utility classes
  compile as `:scope .grid-cols-none{grid-template-columns:none}` inside
  `@scope ([data-kozmos-root])`, specificity (0,2,0), which beats any single
  class the caller adds — and `grid-cols-none` is `Grid`'s default.
- **Tried:** `<Grid className="site-grid-auto">`. The template never applied.
- **Lane:** Core. This applies to every utility-based component (Stack,
  Container, Card and more): a caller's class cannot change any property the
  component's own utilities set. The README says only the migrated components
  accept overrides.
- **Now:** the site's card grids are a `Box` laid out in `site.css`, with
  auto-fit or auto-fill columns of a minimum width.
- **Fix in Kozmos:** a `minColumnWidth` (auto-fit) axis on `Grid`, or responsive
  `cols`.

## GAP-05 · No code block; `Text` has no monospace option

- **What:** a documentation page needs code. Kozmos has no code block, `Text`
  has no family option, and `Text asChild` on a `<pre>` adds `kozmos-reset`,
  which sets `font-family: inherit` and so removes the monospace family the
  provider's scoped preflight gives an unclassed `<pre>`.
- **Now:** `src/site/CodeBlock.tsx` composes `Surface`, `ScrollArea`,
  `Separator`, `Text` and `Button` around a bare `<pre><code>`; the family comes
  from the preflight. No syntax colours — there are no token roles for them.
- **Lane:** Core (a documentation component a product may never need; a
  decision for the design system).

## GAP-06 · No skip link or visually-hidden text

- **What:** a page with a header needs a "Skip to content" link that appears on
  focus. Kozmos has no skip link and no visually-hidden primitive (components
  use Tailwind's `sr-only` internally; it is not exported).
- **Now:** the skip link is a Kozmos `Link`; `.site-skip-link` in `site.css` only
  positions it off-screen until focused.
- **Lane:** Core (accessibility).

## GAP-07 · Icons a website needs: theme, copy, external link

- **What:** the 56 icons have no sun, moon or display (a theme switch), no copy
  (a code block) and no external-link glyph.
- **Now:** the theme switch and the copy button use words.
- **Lane:** Core (icons).

## GAP-08 · No footer

- **What:** no footer component. The product coverage scan already lists
  `Footer` as partial, covered only by `Navbar`.
- **Now:** `src/site/SiteFooter.tsx` composes `Container`, `Stack`, `Separator`,
  `Text` and `Link`.
- **Lane:** Core.

## GAP-09 · `buttonVariants` on a link keeps the link's underline

- **What:** the React README's pattern for navigation that looks like a button
  is `buttonVariants` on your own anchor or router link. On an `<a>`, the label
  stays underlined: `kozmos-reset` and `kozmos-button` never reset
  `text-decoration`, and a `<button>` simply never had one.
- **Evidence:** in Chromium, the same classes compute
  `text-decoration-line: underline` on `a.kozmos-button` and `none` on
  `button.kozmos-button`. Visible on the home page's two hero buttons.
- **Now:** left visible on purpose. Hiding it in site CSS would be exactly the
  workaround the rule forbids.
- **Lane:** Core.
- **Fix in Kozmos:** `text-decoration: none` on `.kozmos-button` (and the link
  variant decides its own underline).

## GAP-10 · No brand mark

- **What:** the repository has no Kozmos logo or favicon, so the header shows
  the name in `Text`, and the page declares an empty icon to avoid a 404.
- **Lane:** Site (a brand decision, not a component).

## GAP-11 · `EmptyState`'s title is not a heading

- **What:** `EmptyState` renders its `title` as a paragraph with no heading
  level, so a full-page empty state (not found, an error) has no `h1`.
- **Now:** `src/site/StatusPage.tsx` uses `Heading` and `Text` instead.
- **Lane:** Core.

## GAP-12 · `Alert` is always `role="alert"`; `AlertTitle` always an `h5`

- **What:** `Alert` hard-codes `role="alert"`, an assertive live region, which
  is wrong for a note that is on the page from the start and too loud for a
  "saved" confirmation. `AlertTitle` is always an `h5`, which breaks the heading
  outline anywhere below an `h2`.
- **Now:** the site passes `role="note"` for static notes and `role="status"`
  for confirmations (props reach the element after the default), and never
  uses `AlertTitle`.
- **Lane:** Core.
- **Fix in Kozmos:** a `live` or `tone` prop that picks the role, and a title
  level (or no heading).

## GAP-13 · `SelectTrigger` has no label; `Textarea` has no helper text

- **What:** `Input`, `Textarea`, `Switch`, `Checkbox` and `RadioGroup` take
  `label`; `SelectTrigger` does not. `Input` and `PasswordInput` take
  `helperText`; `Textarea` does not.
- **Now (account settings example):** each select sits in a `FieldWrapper` whose
  `label` points at the trigger's `id`; the bio's character count is a `Text`
  joined to the field with `aria-describedby`.
- **Lane:** Core.

## GAP-14 · `CardTitle` is always an `h3`

- **What:** a page that lists cards straight under its `h1` skips a level.
  axe reports `heading-order` on the examples index.
- **Now:** the index puts its cards under an `h2` ("Pages and apps").
- **Lane:** Core. (Same shape as GAP-12's `AlertTitle`.)

## GAP-15 · No icons for a venue's everyday categories

- **What:** the icon set's 56 glyphs have nothing for food and drink, toilets,
  accessible facilities, parking or first aid — the categories an indoor map
  shows first. The accessibility glyph is already on record as missing
  (`docs/ds-handoff.md` §6.5: drawn 1,213 times across 7 surfaces).
- **Now (venue explorer):** those categories are left out rather than drawn
  with a stand-in icon. The six it has (shops, information, transport, events,
  offices, Wi-Fi) use Kozmos icons.
- **Lane:** Product / SDK (icons; the Pointr taxonomy's own sprites may be the
  source).

## GAP-16 · `TabsList` neither wraps nor scrolls

- **What:** `TabsList` is a fixed `inline-flex` row. Three file names overflow a
  320-pixel phone and push the whole page sideways.
- **Now:** `src/site/ExamplePage.tsx` puts the list in a horizontal
  `ScrollArea`.
- **Lane:** Core.

## GAP-17 · `AdaptiveMapShell`'s panel is an `<aside>`

- **What:** the shell renders its panel as `<aside aria-label>`, a
  complementary landmark. A shell placed in a page's `<main>` — a module in a
  larger app, or this site — nests it there, and axe reports
  `landmark-complementary-is-top-level` (best practice, moderate).
- **Evidence:** axe on `/examples/venue-explorer`, in both themes and all three
  engines. The site's tests expect exactly this violation there, so they will
  fail — and point here — once Kozmos changes it.
- **Lane:** Product / SDK.
- **Fix in Kozmos:** a `section` with the same label (a region landmark), or an
  option for hosts that embed the shell.

## GAP-18 · `POIDetailPanel` has no presentation for the shell's panel

- **What:** `presentation="panel"` draws its own card, which sits inside
  `AdaptiveMapShell`'s panel as a second surface. `presentation="sheet"` paints
  none, as documented, but is designed for a grey sheet: on the shell's
  page-coloured panel, its inset blocks (the action message) lose their
  container — white on white, or black on black.
- **Now (venue explorer):** `sheet`, the documented pairing. The message text
  stays readable and is announced; only its block is invisible.
- **Lane:** Product / SDK.

## GAP-19 · `Navbar` is always sticky

- **What:** `.kozmos-navbar` is `position: sticky; top: 0`, with no option. A
  second Navbar in a page — an embedded module's, or the account settings
  example's inside this site — sticks over the first while the page scrolls.
- **Now:** every example sits in a frame of definite height that scrolls
  inside (`.site-example-canvas`), so an example's Navbar sticks within its
  frame.
- **Lane:** Core.

## GAP-20 · `SearchBar`'s field is unstyled in WebKit (Safari, iOS)

- **What:** in WebKit, `SearchBar`'s `<input>` gets none of its classes: native
  search-field appearance, 11px text, a 2px border and a filled background,
  148px wide inside the bar. Chromium and Firefox draw it as designed (15px,
  no border, transparent, filling the bar).
- **Evidence:** measured in Playwright's WebKit 26.0 against Chromium and
  Firefox. The same classes on a `<div>` in the same place compute correctly in
  WebKit; on an `<input>` (search or text) they do not. So WebKit is not
  applying the `@scope`-d utilities to form controls — the regression CI already
  names ("Keep the original WebKit form regression"), and why `Input`,
  `Textarea`, `PasswordInput` and `NumberInput` were moved to component-owned
  CSS (the React README lists them). `SearchBar` was not moved. The account
  settings fields, which are migrated, render correctly in WebKit.
- **Why it matters:** Safari and iOS web views are WebKit, and the Pointr SDK's
  iOS hosts are among them. Visible on the home page's demo and in the venue
  explorer.
- **Now:** left visible. `tests/site.spec.ts` expects the field's style to fail
  in WebKit only, so the test tells us when it is fixed.
- **Lane:** Product / SDK (`SearchBar`).
- **Fix in Kozmos:** move `SearchBar`'s field to component-owned CSS like
  `Input`, and add it to the WebKit form-compatibility checks. Confirm in a real
  Safari too.

## GAP-21 · `Heading` cannot reach the tokens' heading scale

- **What:** the tokens carry a heading scale — h1 60px, h2 48, h3 38, h4 30,
  h5 24, h6 20 (`--primitives-typography-font-size-headings-*`) — as Figma
  draws it. The React `Heading` maps levels 1–6 onto `Text`'s `4xl`…`base`,
  which are Tailwind's rem sizes: 36, 30, 24, 20, 18, 16px. The two scales
  disagree at every level, and nothing in the React package can render the
  token's 60px. `Text` has no family option either, so the mono family token
  is unreachable through a component too.
- **Evidence:** `.kozmos-text-4xl{font-size:2.25rem}` in the built stylesheet
  against `--primitives-typography-font-size-headings-h1: 60` in the token
  CSS; the typography page measures the component scale live and lists the
  tokens beside it.
- **Now:** the site's display, page and section titles are `Heading`s with a
  class that sets the token size and line height from the tokens (`site.css`,
  `.site-display`, `.site-title`, `.site-headline`); the rule allows
  token-driven typography in site CSS for this reason. The line-height
  pairings are the site's own, since the tokens pair none.
- **Lane:** Core.
- **Fix in Kozmos:** either drive `Text`'s sizes from the tokens, or add a
  `display` size and a `family` prop, and say which scale is the product's.

## GAP-22 · Font-weight tokens carry names, not weights

- **What:** `--primitives-typography-font-weight-main-regular: Regular`,
  `-bold: SemiBold`, `-light: Light` — Figma's style names. CSS `font-weight`
  does not accept them, so the declaration is dropped; Swift and Kotlin would
  need a lookup too. `Text`'s weights are Tailwind's numbers (400–700),
  unconnected to the tokens.
- **Evidence:** the token CSS; the typography page's weight table.
- **Lane:** Core (tokens).
- **Fix in Kozmos:** emit numeric weights (400, 600, 300), or map the names in
  the token build.

## GAP-23 · Component-layer colours are baked values, not ramp aliases

- **What:** the 283 `--components-*` variables are generated with the theme's
  hex values written in (`--components-primary-buttons-themed-button-background-idle: #0d44c2`)
  rather than as aliases of the ramp (`var(--primitives-colors-theme-700)`).
  A product that re-points the theme ramp through `ThemeProvider`'s `tokens`
  — the documented way to brand a module — changes the utilities and leaves
  every migrated component (Button, Input, the fields) in the old blue.
- **Evidence:** the home page's "Make it yours" section re-points the ramp
  and, for the component layer, matches each themed token to the ramp step
  whose values it carries in both themes. On `f30c0f9` there are 45 themed
  component tokens: 32 re-point (the backgrounds and borders), and 13 — the
  content colours, white text and its disabled and pressed states — match no
  ramp step and keep their baked value. The page prints the counts; the
  `brandOverrides` unit test covers the matching.
- **Now:** left visible: the section says how many tokens it could not reach.
- **Lane:** Core (tokens build).
- **Fix in Kozmos:** generate the component layer as aliases of the semantic
  or primitive tokens it was derived from, so one override reaches everything.

## GAP-24 · `DynamicIsland` pins itself to the viewport

- **What:** `DynamicIsland` renders `position: fixed; top: 1rem; left: 50%`,
  so it can only ever sit at the top of the browser window. It cannot be
  placed in a map scene, a card or an example's frame.
- **Now:** the hero scene shows the manoeuvre in a glass `Surface` around
  `DirectionStep` instead.
- **Lane:** Platform / form factor.
- **Fix in Kozmos:** let the host decide the position (a `position` or
  `portalContainer` prop), fixed by default.

## GAP-25 · `MapView` insists on 400px of height

- **What:** `MapView` carries `min-h-[400px]` in its own classes, and a
  caller's class cannot lower it (GAP-04). A small map — a tile, a thumbnail,
  a phone in landscape — is not possible.
- **Now:** the hero scene and the adaptive tile give their frames 400px or
  more.
- **Lane:** Product / SDK.

## GAP-26 · `Text` cannot inherit its colour

- **What:** every `Text` sets a colour class (`kozmos-text-default` by
  default), so it cannot take the colour of an inverted host. `DynamicIsland`
  paints the foreground colour as its background and expects its content to
  be the background colour; a `Text` inside it disappears in the light theme.
  The same holds for anything on a filled button or a tinted category fill.
- **Now:** the `DynamicIsland` demo puts plain strings and a `Box` in the
  island's slots, without `Text`'s sizes and weights.
- **Lane:** Core.
- **Fix in Kozmos:** a `color="inherit"` value (or no colour class when
  `color` is not given), so `Text` can sit on any surface a component paints.

## GAP-27 · `useTheme` does not report the direction

- **What:** `ThemeProvider` takes `dir`, and `useTheme()` returns `theme`,
  `resolvedTheme` and `setTheme` only. A component that must know whether it
  sits in a right-to-left subtree — to mirror an icon, order a pair of
  buttons — cannot ask the provider and has to read the DOM.
- **Now:** the `ThemeProvider` demo passes the direction it set to the sample
  beside the provider.
- **Lane:** Core.
- **Fix in Kozmos:** return `dir` from `useTheme()`, resolved from the
  nearest provider.

## GAP-28 · `SearchBar`'s search landmark cannot be named

- **What:** `SearchBar` wraps its field in `role="search"`, a landmark, and
  gives the landmark no name: `aria-label` goes to the input. Two search bars
  on one page — a venue search in the top bar and a search inside a browse
  sheet, or the reference's inline and floating examples — are two search
  landmarks a screen reader lists as the same thing (axe `landmark-unique`).
- **Now:** the SearchBar and AdaptiveMapShell pages carry the violation, named
  in `knownViolations` in `tests/site.spec.ts`.
- **Lane:** Product / SDK.
- **Fix in Kozmos:** a `landmarkLabel` prop on the wrapper, or name the
  landmark from the field's label.

## GAP-29 · `BottomNavigation` is always fixed to the viewport

- **What:** `BottomNavigation` renders `fixed bottom-0 left-0 right-0`, as
  `DynamicIsland` does at the top (GAP-24). It cannot sit in a phone frame,
  a card or an example, and two of them overlap.
- **Now:** its demo mounts one bar on request, over the site's footer, and
  says so.
- **Lane:** Core.
- **Fix in Kozmos:** a `placement` prop as `FloatingActionButton` has, fixed
  by default.

## GAP-30 · `Sidebar`'s navigation landmark cannot be named

- **What:** `Sidebar` puts its `navigation` slot in a `<nav>` with no way to
  name it; only the `<aside>` takes `aria-label`. A page with the site's own
  sidebar and a demoed one has two unnamed navigation landmarks (axe
  `landmark-unique`); `Navbar` has `navigationLabel` for exactly this.
- **Now:** the Sidebar page carries the violation, named in
  `knownViolations`.
- **Lane:** Core.
- **Fix in Kozmos:** a `navigationLabel` prop, as `Navbar` has.

## GAP-31 · The alert emotion's text reads 4.29:1 on a card

- **What:** `--semantics-emotion-alert-text` is `#a06b04` (alert 800), chosen
  because the ramp reaches 4.5:1 there — on the app background: 4.57:1 on
  white. On the card (`#f7f8fa`) it measures 4.29:1, under WCAG's 4.5:1, so
  `Alert`'s warning variant, an outlined `Tag` with `emotion="alert"`, and
  every field message with `status="warning"` (`Input`, `DatePicker`,
  `TimePicker`, `Textarea`…) fail on a card, where alerts and forms usually
  sit. The contrast contract's 22 pairs do not
  include the emotion text roles on the card.
- **Now:** the Alert, Tag, Input and DatePicker pages show the state and
  carry the finding, with the numbers, in `knownViolations`.
- **Lane:** Core.
- **Fix in Kozmos:** a darker step for the alert text role (alert 900, or a
  tuned value), and the card pairs added to the contract so CI measures them.

## GAP-32 · `ChipGroup` carries no role

- **What:** `ChipGroup` is a plain `div`; an `aria-label` on it names
  nothing, so a group of filter chips has no name a screen reader can read.
- **Now:** the components index passes `role="group"` to it.
- **Lane:** Core.
- **Fix in Kozmos:** `role="group"` on the wrapper.

## GAP-33 · No token for the route line on the map

- **What:** a wayfinding product draws the route on the map — a line the map
  engine renders in a colour the design system should own, as it owns the
  category tints and the emotion colours. The tokens carry no route, path or
  wayfinding role (`variables-light.css` has none), so every product picks
  its own.
- **Now:** the wayfinding example draws its stand-in route in dots coloured
  with the theme's 600, and says so.
- **Lane:** Product / SDK.
- **Fix in Kozmos:** a `semantics-map-route` role (line, casing, and the
  walked part), in both themes, with its contrast on the map's own surface
  in the contract.

## GAP-34 · `Backdrop` pins itself to the viewport

- **What:** `Backdrop` renders `fixed inset-0`, so it can only ever cover the
  browser window. A scrim over one module — a kiosk's attract screen, a map
  panel while it loads, a card while a dialog inside it is open — cannot use
  it; like `DynamicIsland` (GAP-24) and `BottomNavigation` (GAP-29), the host
  cannot decide where it goes.
- **Now:** the kiosk directory's attract screen is a glass `Surface` laid over
  the directory by the example's own CSS.
- **Lane:** Core.
- **Fix in Kozmos:** a `placement` prop (`viewport` | `container`), fixed by
  default, with the scrim colour and blur unchanged.

## GAP-35 · `BrowseCategoriesPanel` is four columns at any width

- **What:** the panel lays its tiles out with `grid-cols-4`, whatever its
  width. In a column narrower than about 22rem — a kiosk's directory rail, a
  tablet's side panel — each tile is under 5rem and a one-word name such as
  "Information" is cut ("Informatio"): `CategoryTile` clamps its label to two
  lines, and a single word cannot wrap.
- **Now:** the kiosk directory keeps its directory column at 22–24rem, so
  the names fit.
- **Lane:** Product / SDK.
- **Fix in Kozmos:** `repeat(auto-fill, minmax(5.5rem, 1fr))`, or a
  `columns` prop, so a narrow host gets three columns.
