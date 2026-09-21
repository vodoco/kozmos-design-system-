# What the site found Kozmos cannot do yet

The site is built from `@kozmos/react` and its tokens only (see README.md,
"The one rule"). Where that was not enough, the gap is written here instead of
being worked around, following the method in `docs/ds-handoff.md` §11: the
component and the part, what was tried, the lane, and the evidence. Every entry
was measured on `claude/pointr-browse-repairs` at `ef1b68b` (2026-09-21), the
branch the site is built on.

**Lanes** are the handoff's: Core (domain-neutral components), Product / SDK,
or Site (a need of this website, not of a product).

**Status** is one of: _open_ (nothing done), _composed_ (the site builds it
from Kozmos parts and says so), _left visible_ (the defect shows on the page on
purpose, because hiding it would hide the evidence).

| ID     | What                                                          | Lane | Status       |
| ------ | ------------------------------------------------------------- | ---- | ------------ |
| GAP-01 | `NavigationItem` `asChild` throws                             | Core | open         |
| GAP-02 | `reset.css` ships raw Tailwind `theme()` calls                | Core | open         |
| GAP-03 | A pre-rendered page starts in the light theme                 | Core | left visible |
| GAP-04 | `Grid` cannot reflow, and a caller cannot make it             | Core | composed     |
| GAP-05 | No code block; `Text` has no monospace option                 | Core | composed     |
| GAP-06 | No skip link or visually-hidden text                          | Core | composed     |
| GAP-07 | Icons a website needs: theme, copy, external link             | Core | open         |
| GAP-08 | No footer                                                     | Core | composed     |
| GAP-09 | `buttonVariants` on a link keeps the link's underline         | Core | left visible |
| GAP-10 | No brand mark                                                 | Site | open         |
| GAP-11 | `EmptyState`'s title is not a heading                         | Core | open         |
| GAP-12 | `Alert` is always `role="alert"`, `AlertTitle` always an `h5` | Core | composed     |
| GAP-13 | `SelectTrigger` has no label; `Textarea` no helper text       | Core | composed     |
| GAP-14 | `CardTitle` is always an `h3`                                 | Core | composed     |

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
- **Now:** the site's card grids are a `Box` with `repeat(auto-fit | auto-fill,
minmax(…))` in `site.css`.
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
