# @kozmos/site

The Kozmos design system's website: what Kozmos is, shown live; the
foundations, drawn from the tokens; a component reference; and page and app
examples built from Kozmos components and nothing else.

**Status, 2026-09-21:** pre-release and private. Not deployed anywhere. It
lives on its own branch, `claude/kozmos-site`, based on
`claude/pointr-browse-repairs` (where the latest components are), and
touches nothing outside `apps/site` except `pnpm-lock.yaml`.

- [Where it lives](#where-it-lives)
- [Run it](#run-it)
- [The one rule](#the-one-rule)
- [How it is built](#how-it-is-built)
- [The pages](#the-pages)
- [Add an example](#add-an-example)
- [Add or change a component demo](#add-or-change-a-component-demo)
- [Add a foundations page](#add-a-foundations-page)
- [Add or change a page](#add-or-change-a-page)
- [Styling](#styling)
- [Testing](#testing)
- [Keeping up with the component branch](#keeping-up-with-the-component-branch)
- [The day the packages are published](#the-day-the-packages-are-published)
- [Deploying](#deploying)
- [Decisions still open](#decisions-still-open)
- [Found along the way, outside the site](#found-along-the-way-outside-the-site)
- [Troubleshooting](#troubleshooting)

---

## Where it lives

| What              | Where                                                           |
| ----------------- | --------------------------------------------------------------- |
| Working copy      | `/Volumes/4TB Depo/development/K/kozmos-design-system-site`     |
| Branch            | `claude/kozmos-site` (local; not pushed)                        |
| Based on          | `claude/pointr-browse-repairs` at `f30c0f9`                     |
| The site          | `apps/site` in that working copy                                |
| Gaps it found     | [`GAPS.md`](./GAPS.md)                                          |
| The main checkout | `…/kozmos-design-system-dev`, on `main` — the site is not there |

The working copy is a git worktree of the same repository, so its commits
live in the main checkout's `.git` and survive even if the folder is deleted.
Open the folder itself in your editor to work on the site. It sits next to
the repository, not in a temporary folder, because temporary worktrees get
cleaned away.

To make a fresh working copy elsewhere:

```sh
cd "/Volumes/4TB Depo/development/K/kozmos-design-system-dev"
git worktree add ../another-folder claude/kozmos-site
```

## Run it

From the working copy's root:

```sh
pnpm install
pnpm turbo run build --filter=@kozmos/site^...   # the four Kozmos packages the site uses
pnpm --filter @kozmos/site dev                   # http://localhost:5180
```

The site reads each Kozmos package's built `dist`, so rebuild them (the
second line) after pulling component changes. Turbo only rebuilds what
changed.

| Script (`pnpm --filter @kozmos/site …`) | What it does                                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `generate`                              | Rebuilds `src/generated/` from the design system's sources (below). Run by the next three.     |
| `dev`                                   | Dev server with hot reload on port 5180.                                                       |
| `build`                                 | Generate, route types, `tsc`, then the static build into `build/client`.                       |
| `preview`                               | Serves `build/client` on 5181 the way a static host does (404s included).                      |
| `typecheck`                             | Generate, route types and `tsc` only.                                                          |
| `lint`                                  | ESLint, then `scripts/check-ds-only.mjs` (the one rule).                                       |
| `test`                                  | Unit tests: the token parser, contrast, the brand override, the generator, the rule's checker. |
| `test:e2e`                              | Playwright in Chromium, Firefox and WebKit against the build. Build first.                     |

Screenshots of every page, light and dark, desktop and phone, into
`apps/site/screenshots/` (not committed):

```sh
SCREENSHOTS=1 pnpm --filter @kozmos/site test:e2e --project=chromium tests/screenshots.spec.ts
```

Ports: Storybook holds 6006, mapscale-review 5173; the site takes 5180 and
5181 and fails loudly (`strictPort`) rather than drift to another.

## The one rule

**What is on the page is Kozmos.** Every visible part is a component from
`@kozmos/react`; every colour, radius, shadow, size and spacing value is a
Kozmos token. It is the rule `docs/ds-handoff.md` §11 set for examples,
applied to the whole site, for the same reason: the site is the best test the
system gets before it is published, and a workaround destroys the evidence.

One allowance, decided on 2026-09-21: **site CSS may set typography from the
typography tokens** — a size, line height, family or spacing named by a token
variable, never a literal. The tokens carry a 60px heading the `Heading`
component cannot reach (GAP-21), and a landing page needs it. Colour tokens
are allowed in site CSS on the same footing.

When Kozmos cannot express something:

1. **Do not approximate it.** No hand-made div standing in for a component, no
   raw colour, no class that quietly reinvents a part.
2. **Write it in [`GAPS.md`](./GAPS.md)** — the component and part, what was
   tried, the lane, the evidence — and give it the next `GAP-nn`.
3. If a Kozmos composition can stand in honestly (a footer made of Container,
   Stack, Text and Link), build it, mark the entry _composed_, and say so in a
   comment naming the gap. If not, the part is left out and the entry stays
   _open_.
4. A gap parks **that** example or part, not the site.

`pnpm --filter @kozmos/site lint` enforces the mechanical half of this with
`scripts/check-ds-only.mjs`, which reads every file in `src` (except the
generated data):

- **Imports** only from `react`, `react-dom`, `react-router`, the Kozmos
  packages (including a stylesheet's text through `?raw`), or the site itself
  (`node:` built-ins in tests only). No other UI library, icon set or class
  helper.
- **Elements:** no raw `div`, `span`, `p`, `h1`–`h6`, `a`, `button`, `input`,
  `select`, `textarea`, `label`, `ul`/`ol`/`li`, `table`, `hr`, `svg` or `img` —
  the message names the Kozmos component to use. Allowed, because Kozmos has
  no equivalent and they carry meaning: `main`, `section`, `article`, `aside`,
  `header`, `footer`, `nav`, `form`, `pre`, `code`, `kbd`, `strong`, `em`,
  `br`, `time`, `abbr` (and the document's `html`/`head`/`body`/`meta`/`link`).
- **`style`** may only pass CSS custom properties — how data reaches CSS,
  such as a pin's position on the map or a swatch's token.
  `src/lib/css-custom-properties.d.ts` lets TypeScript accept them.
- **Strings** may not hold a colour (`#1051e8`, `rgb(…)` and the like); a unit
  test's sample colours are exempt.
- **CSS:** no colour literals or named colours, no `!important`; typography
  only through typography tokens; radii and shadows only from tokens; fixed
  spacing (`gap`, `margin`, `padding`, `inset`) only from tokens — percentages
  are allowed, since they place rather than space — and no selector that
  reaches into Kozmos (`.kozmos-*`, `[data-slot]`).

The checker has its own tests (`scripts/check-ds-only.test.mjs`) that feed it
bad code, so a green run means something.

## How it is built

- **React Router 7, framework mode, pre-rendered.** `ssr: false` with
  `prerender`: every route is rendered to HTML at build time and hydrated in
  the browser; nothing runs on a server afterwards. Output: `build/client`.
  React Router 8 needs Node 22, and CI runs Node 20; all five `v8_` future
  flags are already on, so the upgrade is small.
- **React 19** with `@kozmos/react` from the workspace (`workspace:*`).
- **`@react-router/node` and `isbot`** are dependencies even though nothing
  serves the site from Node: the pre-render step needs them, and React Router
  only looks in `dependencies`.
- **Generated data.** `scripts/generate-reference.mjs` reads the design
  system's own sources and writes `src/generated/` (gitignored; `pnpm
generate` runs before dev, build and typecheck):
  - `components.json` and `components/<slug>.json`: every component folder
    under `packages/react/src/components`, its lane from the sets in
    `scripts/skills/check-completion.ts` (the same ones that build
    `STATUS.md`), its description and its React, Vue, SwiftUI and Compose
    snippets from its `.mdx`, and its parts and props read from the
    TypeScript source with the compiler API: every component the package
    exports from that folder (re-exports followed), its props type resolved
    through `forwardRef`, `React.FC`, function parameters and aliases, unions
    merged, and only the props declared in this repository or by a Radix
    primitive (those carry `source`), with defaults from destructuring and
    `cva`'s `defaultVariants`. `react-docgen-typescript` was tried first and
    read the wrong symbols (`Surface`'s "props" came out as string methods).
  - `contrast-contract.json`: a copy of `packages/tokens/src/contrast-contract.json`,
    so the colour page can measure the same pairs CI does.
- **Tokens at runtime.** `src/lib/tokens.ts` imports the tokens package's
  light and dark stylesheets as text and parses every variable, its two values
  and the description beside it. The foundations pages are drawn from that
  list, so they cannot drift from what the components use.

```
apps/site/
├── react-router.config.ts   static build; pre-renders /404 and copies it to 404.html
├── vite.config.ts           dedupes React; ports 5180 / 5181
├── tsconfig.json            maps React's types to this app's (see Troubleshooting)
├── turbo.json               the site's build and test inputs for Turbo's cache
├── eslint.config.js
├── GAPS.md                  what Kozmos cannot do yet, measured
├── public/media/            three colour-free illustrations the gallery demos show
├── scripts/
│   ├── check-ds-only.mjs    the one rule, enforced (+ its tests)
│   ├── generate-reference.mjs  the generated data (+ its tests)
│   └── serve-static.mjs     `preview` and the e2e tests' server
├── tests/
│   ├── site.spec.ts         end-to-end: every page, axe, themes, navigation, the live parts
│   └── screenshots.spec.ts  pictures for people (SCREENSHOTS=1)
└── src/
    ├── root.tsx             document, stylesheets, ThemeProvider, error page
    ├── routes.ts            the route table: plain pages, examples, foundations
    ├── routes/              home, get-started, examples, not-found, the two layouts,
    │                          foundations/ (one file per page), components/ (the
    │                          index and the page for one component)
    ├── site/                the frames (SiteShell, DocsShell), header, footer, links,
    │                          code block, copy button, reveal, miniature, example page
    ├── home/                the hero scene, the live tiles, make it yours, the pipeline
    ├── foundations/         the page list, shared parts (swatches, tables, specimens),
    │                          the motion, glass and direction demos
    ├── examples/            manifest.ts (data, no React), registry.tsx (lazy components),
    │                          one folder per example
    ├── reference/           the component reference: types, the demo registry, the
    │                          sidebar's sections (nav.ts), the generated-data loader,
    │                          the shared sample data, demos/ (one file per component)
    ├── snippets/            the code Get started shows, type-checked
    ├── lib/                 site facts, tokens, contrast, brand overrides, CI gates,
    │                          the import parser, CSS custom-property typing
    ├── generated/           written by `pnpm generate`, gitignored
    └── styles/site.css      layout, and type sizes from tokens
```

**Theming.** One `ThemeProvider` wraps the app (`defaultTheme="system"`,
remembered under `kozmos-site-theme`). Kozmos scopes its tokens to the
provider, so the document itself would have none; the site also loads the
tokens package's own light and dark stylesheets and mirrors the resolved theme
onto `<html data-theme>`, so the page canvas and scrollbars follow too. A
pre-rendered page starts light for a dark-mode visitor until it hydrates —
GAP-03.

**Lazy demos are cached per slug.** `src/reference/registry.ts` makes one
`React.lazy` component per slug and keeps it. A lazy component made during a
render (`useMemo(() => lazy(…))`) is thrown away when that render suspends,
so a same-route navigation — Tree to Tooltip — made a new one on every retry
and never settled: the address changed and the page did not.

**Nested providers paint nothing.** A `ThemeProvider` is `display: contents`;
put a `Surface` inside a nested provider, or its content sits on the outer
theme's background (the tokens tile learned this from axe).

**Links.** Kozmos's `Link` and `NavigationItem` render a real `<a href>`;
`src/site/links.tsx` adds React Router's `useLinkClickHandler`, so a plain
click navigates in the app and a modified click or no JavaScript behaves like
any link. Use `SiteLink` for text links, `SiteNavItem` in the header and
sidebar, and `ButtonLink` for links that look like buttons. After a
navigation, focus moves to `<main>` so a screen reader lands on the new page.

**Two frames.** `SiteShell` is header, main, footer. `DocsShell` adds
Kozmos's `Sidebar` beside the content — kept outside `<main>` so it is a
top-level landmark — and, below 64rem, a `Drawer` with the same navigation,
opened from a button above the content.

**Revealed on scroll.** `Reveal` wraps the home page's sections; they fade
and rise on the motion tokens as they come into view, only after hydration
(the pre-rendered page shows everything) and never under reduced motion.

## The pages

| Page           | What it shows                                                                                                                                                                                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`            | A hero scene made of map parts in its own theme; twelve live tiles (tokens, type, emotions, the adaptive shell under a slider, three-platform code, themes, contrast, motion, direction, glass, icons, Figma); "Make it yours"; the examples as live miniatures; the platforms; the CI pipeline as a Timeline.                                                  |
| `/get-started` | Install, set-up, dark mode, right to left, button-styled links, tokens, analytics, browser support, iOS and Android.                                                                                                                                                                                                                                            |
| `/foundations` | Seven pages, each drawn from the tokens: colour (every ramp and role, the contrast contract measured in both themes, the component layer), typography, layout, elevation and effects, motion, icons, theming.                                                                                                                                                   |
| `/components`  | The reference: 104 pages, one per component, in four lanes. Each page has live examples with their source, the React, SwiftUI and Compose code from the component's docs, and a props table per part read from the TypeScript source. The index searches and filters by lane and shows each component's first example, live but inert, as it scrolls into view. |
| `/examples`    | The index; each example on its own canvas with its source, its Kozmos parts and its gaps.                                                                                                                                                                                                                                                                       |

## Add an example

An example is a page or an app, built from Kozmos only, shown on its own
canvas with its source, the components it uses and the gaps it hit.

1. **Register it** in `src/examples/manifest.ts`: `slug`, `title`, `kind`
   (`"page"` or `"app"`), a one-sentence `summary`, and `gaps` (empty to
   start). The route is created from this entry.
2. **Add its component** to `src/examples/registry.tsx` as a lazy import, so
   the home page and the index can show it as a miniature without pulling it
   into their chunks.
3. **Make the folder** `src/examples/<slug>/` with:
   - `<Name>.tsx` — the example, a default export. It must not render `<main>`
     (the page already has one) and its top heading is an `h2` (the page's
     `h1` is the example's title).
   - `<Name>.css` — layout only, class names prefixed `ex-<slug>-`. Import it
     from `<Name>.tsx`.
   - `route.tsx` — copy `account-settings/route.tsx` and change the names. It
     imports the example's own files with `?raw`, so the "Source" tab always
     shows what runs.
4. **App examples** (`kind: "app"`) get a canvas of definite height, as
   `AdaptiveMapShell` needs; fill it with `block-size: 100%`.
5. **Gaps:** add each to `GAPS.md` and list it in the entry's `gaps`, as
   `"GAP-nn · what differs"`. The page shows them under "Where Kozmos falls
   short".
6. **Check:** `pnpm --filter @kozmos/site lint`, `build`, then `test:e2e`.
   Add the new path to `pages` in `tests/site.spec.ts` (axe in both themes,
   no sideways scroll at 320px) and a test for what the example does.

Data in examples is invented and must look it (`sam.rivera@example.com`);
nothing submits anywhere.

## Add or change a component demo

A component's page comes from two places: the generated data (name, lane,
description, parts, props, snippets — nothing to write) and its demo file.

- **The file** is `src/reference/demos/<slug>.tsx`, where the slug is the
  component folder's name in kebab case (`POIDetailPanel` →
  `poi-detail-panel`). It exports `demos: DemoModule["demos"]`, a list of
  `{ title, description?, Component, tall? }`. A component without a file
  still gets its page, with the props and code and a note that no example
  has been written; `pnpm generate` does not care either way. The registry
  (`src/reference/registry.ts`) finds the files with `import.meta.glob`, so a
  new file is a new set of examples, and the file's source is what the
  "Examples" code tab shows, so write it as you would want it read.
- **A demo is a small component**, built from Kozmos parts and the site's
  layout classes only (the one rule applies; `pnpm lint` runs it). The stage
  is a `Card`; `tall: true` gives it room for a map, a sheet or a shell.
  `src/reference/sample-data.ts` has the venue, places, categories, floors,
  routes and an itinerary, all invented, so demos agree with one another.
- **The first demo is also the preview** on `/components`: it mounts inside
  an `aria-hidden`, `inert` frame as the card scrolls into view. So the first
  demo must not mount anything fixed to the viewport (a toast viewport, a
  fixed action button, `DynamicIsland`), must not need a click to show
  something, and should be the plainest state — put the interactive or
  fixed things in a later demo, behind a button.
- **Several of one landmark on a page** need different names: three
  `AdaptiveMapShell`s each name their map region and their panel with the
  demo's name, or axe's `landmark-unique` fails the page (the tests run axe
  on every component page).
- **Status text** beside a demo uses `Text` with `aria-live="polite"`, so a
  screen reader hears what a click did.
- **Props tables** show what the TypeScript source declares in this
  repository, plus a Radix primitive's own props (marked as such). Native
  HTML attributes are left out on purpose: they are the element's, not the
  component's. If a prop looks wrong, the reader is
  `scripts/generate-reference.mjs` (`readParts`), with tests beside it.

## Add a foundations page

1. Add it to `foundationPages` in `src/foundations/nav.ts` (`slug`, `title`,
   `summary`): the sidebar, the index card and the route come from that.
2. Create `src/routes/foundations/<slug>.tsx`: export `meta()` through
   `foundationMeta(page)` and a default component wrapped in `DocsPage`, with
   `Section`s inside. Read tokens through `tokensWithPrefix`, `ramp` and
   `token` from `src/lib/tokens.ts`, never by restating values; draw them with
   the parts in `src/foundations/parts.tsx` (`Ramp`, `Swatch`, `SwatchList`,
   `TokenTable`, `Specimen`).
3. Give the index a preview in `routes/foundations/index.tsx`'s `Preview`.
4. Add the path to `pages` in `tests/site.spec.ts`.

## Add or change a page

- A page is a file in `src/routes/` registered in `src/routes.ts`. It exports
  `meta()` (title through `pageTitle()`, and a description) and a default
  component starting with `PageHeader` (its `h1`), then `Section`s (`h2`).
- **Facts said in more than one place** live in `src/lib/site.ts`:
  `PACKAGES_PUBLISHED`, `SITE_INDEXABLE`, the public package list, the theme
  storage key. The CI pipeline's steps are in `src/lib/ci-gates.ts`, worded
  from `.github/workflows/ci.yml`.
- **Code on Get started** lives in `src/snippets/` as real modules, checked by
  `tsc` against the built packages and shown with `?raw`. Change the snippet,
  not a string in the page. Component snippets on the home page and the
  theming page come from the generated data, that is, from each component's
  own docs.
- **Claims** on the home page are sourced from the repository (package
  READMEs, `ci.yml`, `STATUS.md`, `Package.swift`). Numbers on the page are
  computed from data (token counts, contrast ratios), not typed in.

## Styling

- `src/styles/site.css` arranges components: widths, grids, gaps. It reads
  spacing through aliases (`--site-space-200` is
  `calc(var(--primitives-layout-spacing-200) * 1px)`; the layout tokens are
  unitless) and radii through `--site-radius-*`.
- **Type from tokens.** `.site-display` (the token h1, 60px), `.site-title`
  (h2, 48px) and `.site-headline` (h3, 38px) go on a `Heading`; the weight
  stays the Heading's. `.site-specimen` renders any token size the page sets
  through `--size` and `--lh`. `.site-mono` is the mono family token.
- **Put layout classes on `Box` or on elements you own, not on utility-based
  Kozmos components** (Grid, Stack, Container, Card, Sidebar …) for a property
  the component sets itself: Kozmos scopes its utilities as `:scope .x`,
  which outranks your class (GAP-04). Adding a property the component does
  not set is fine. A class on a `Text` or `Heading` can override its size and
  colour, because those classes are unscoped and `site.css` loads later.
- Never select into a Kozmos component; the checker refuses it.
- **Single-column grids say `grid-template-columns: minmax(0, 1fr)`.** An
  implicit column grows to its widest child's minimum width — a row of tabs,
  a line of code — and pushes the page sideways on a phone.
- **A frame with `aspect-ratio` must not also have a minimum height**, or its
  width follows its height and overflows a narrow column; give it a height.
- **Examples sit in a frame** (`.site-example-canvas`) of definite height that
  scrolls inside. An app needs the height; a page needs the frame, because its
  own Navbar is always sticky (GAP-19).

## Testing

| Layer         | Command                    | What it proves                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types         | `typecheck`                | Pages, examples, tiles and every snippet compile against the built packages and the generated data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Lint and rule | `lint`                     | ESLint with the React hooks rules; the one rule.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Unit          | `test`                     | The token parser, the contrast maths, the brand override's matching, the generator's parsers (slugs, lanes, descriptions, snippets, prop types), the import parser; the checker refuses what it should.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| End to end    | `test:e2e` (after `build`) | Every page in both themes: status, one `h1`, `noindex`, axe (WCAG 2.2 AA and best practices) after a full scroll, no console errors, no sideways scroll at 320px; the drawer navigation on a phone; 404; theme kept across a reload; in-app navigation and focus through the header, an example and the sidebar; the skip link; the hero scene; the tiles; the brand override; miniatures inert; the colour contract; icons search and copy; the measured type scale; the motion race; both examples; the component index (search, lanes, previews), six sampled component pages in every browser, and every component page in Chromium (status, name, a live example, axe, no console errors), with the sidebar, the drawer, the prev/next links, the code tabs and a few demos driven. |

The e2e tests wait for the page to hydrate **and** for finite animations to
finish before measuring: a dark-mode page animates from light (GAP-03), and
axe would otherwise measure contrast mid-transition. The location marker's
pulse never ends and is ignored.

A violation that comes from inside a Kozmos component is listed, with its
gap, in `knownViolations` in `tests/site.spec.ts`: a rule id for the whole
page, or `{ id, only }` where `only` is a pattern every flagged node must
match, so the known finding cannot hide a new one under the same rule (the
warning colour on a field message, GAP-31, does not excuse a contrast failure
elsewhere on the page). A contrast finding is reported with its colours and
ratio. Today: GAP-17 on the venue explorer, the home page and the
`AdaptiveMapShell` page; GAP-28, GAP-30, GAP-31 and GAP-12 on the pages that
show them. The tests expect exactly those, so a new violation fails — and so
does a known one that disappears, which is the signal to close its gap. The
same holds for GAP-20: the search-field test is marked `test.fail` in WebKit
only, so Playwright reports it the day Kozmos fixes the field.

**In CI, once merged:** the workflow runs `pnpm lint`, `pnpm build` and
`pnpm test` across the workspace, so the site's lint (with the rule), build
(with the generator) and unit tests become blocking checks without editing
`ci.yml`. The e2e suite is not in CI yet — a decision for the workflow's
owner.

## Keeping up with the component branch

The site is built on `claude/pointr-browse-repairs`, which another session is
still changing. The site never commits to that branch. To take its latest
work, from the working copy:

```sh
git fetch origin
git rebase claude/pointr-browse-repairs     # the site's commits only touch apps/site and the lockfile
```

If the lockfile conflicts, take the component branch's version and let pnpm
add the site back:

```sh
git checkout --ours pnpm-lock.yaml         # in a rebase, "ours" is the branch being rebased onto
pnpm install
npx prettier --write pnpm-lock.yaml        # the repository commits the lockfile prettier-formatted
git add pnpm-lock.yaml && git rebase --continue
```

Then rebuild the packages, run `generate` (a component's docs or props may
have changed), and run `lint`, `build`, `test:e2e`: a component change can
break an example or a tile, and that breakage is the point.

**When the component branch merges into `main`:** rebase onto `main`
(`git rebase --onto origin/main claude/pointr-browse-repairs claude/kozmos-site`),
push the branch, and open the site's pull request against `main`.

## The day the packages are published

1. In `src/lib/site.ts`, set `PACKAGES_PUBLISHED = true`. Every "not yet on
   npm" note, the home page's status tags and the Get started install note
   follow from it.
2. Keep `workspace:*`: the site lives in the repository and builds from its
   source. Deploy it from the release commit, so what it shows is what was
   published.
3. Check the install command on Get started against a clean project, as
   `pnpm packages:install:check` does for the packages.

## Deploying

Nothing is deployed, on purpose: a public page telling people to install a
package that does not exist yet would be worse than no page. When it is
time, the build is plain static files:

- **Output:** `apps/site/build/client` — one `index.html` per route, assets
  under `assets/`, and `404.html` for unknown addresses.
- **Vercel:** like `apps/mapscale-review` (which deploys prebuilt because its
  workspace dependencies cannot be installed on their own): build locally or
  in CI with the commands above, then deploy `build/client` as a static site.
  Vercel serves `404.html` for misses by itself.
- **Until the launch** every page says `noindex` (`SITE_INDEXABLE` in
  `src/lib/site.ts`), so a preview deploy is not found by search engines.
- **Before it is public:** a brand mark and favicon (GAP-10), the canonical
  domain, a sitemap and `robots.txt`, then `SITE_INDEXABLE = true`.

## Decisions still open

These need someone to decide; the site does not guess:

1. **The public address**, and where it is hosted (Vercel, like
   mapscale-review, is the obvious choice).
2. **A brand mark** for the header and favicon (GAP-10).
3. **Linking the source.** The repository is private; the site links to no
   GitHub page.
4. **Whether each gap is fixed in Kozmos** (the fixes are in `GAPS.md`), and
   whether GAP-09's underline may be hidden meanwhile.
5. **Figma counterparts** for the examples, as the SDK examples have on the
   `Examples` page — out of this site's scope so far.
6. **Running the e2e suite in CI.**

## Found along the way, outside the site

Measured while building the site; none of it is the site's to fix.

- **`@kozmos/react` is not tree-shaken.** Components the site never uses ship
  in its bundle: the shared chunk is 514 kB minified, 151 kB gzipped, plus
  38 kB of gzipped CSS. The package's 185 top-level `displayName` writes are
  the likely cause (unverified). This is also why Vite warns about a chunk
  over 500 kB.
- **`@kozmos/react` develops against React 19 but `@types/react` 18.** In the
  workspace, a React 19 app's `ReactNode` does not fit Kozmos's props; the
  site maps the types to its own (tsconfig `paths`). Installed from npm, the
  declarations would read the consumer's types and this does not arise.
- **`STATUS.md` is out of date on the component branch.**
  `check-completion.ts --check` fails there: Core counts 75 components after
  the internal exclusion (69 in the file), five with platform or Code Connect
  gaps. The site's generator reads the same sets, so its counts are current.
- **`eslint-plugin-react-hooks` 7.0.1 cannot load in this workspace.** It
  requires `zod-validation-error/v4`, but the lockfile resolves 3.5.4, which
  has no such export (7.1.1 still declares the same range). The site uses the
  5.x line. mapscale-review and playground-web list 7.0.1 but never load it.
- **CI runs Node 20,** which reached end of life on 2026-04-30.
- **`@kozmos/vue` is private**, an internal harness, so the site presents the
  web, iOS and Android only.
- **iOS and Android are not distributable yet.** The Swift package sits in
  `packages/ios`, not at the repository root, so it cannot be added by URL,
  and its library target depends on Figma's `code-connect` package. The
  Compose module has no Maven publishing configured.
- **17 of 103 component docs have no SwiftUI or Compose snippet**, so those
  reference pages will show React only until the docs carry the others.

## Troubleshooting

- **`Cannot find module '@kozmos/react'` or stale components** — build the
  packages: `pnpm turbo run build --filter=@kozmos/site^...`.
- **`Cannot find module '../generated/…'`** — run
  `pnpm --filter @kozmos/site generate` (dev, build and typecheck do it
  themselves).
- **`Type 'React.ReactNode' is not assignable to type 'ReactNode'`
  (`bigint`)** — the `paths` mapping in `tsconfig.json` is missing or its
  `node_modules/@types/react` does not exist; run `pnpm install`.
- **`Could not determine server runtime. Please install @react-router/node`**
  — it must be in `dependencies`, not `devDependencies`.
- **`Cannot find module 'zod-validation-error/v4'`** — something loaded
  `eslint-plugin-react-hooks` 7.x; the site's config must use 5.x.
- **A class on a Kozmos component does nothing** — GAP-04: wrap in a `Box`
  and style that.
- **Light text on a dark card inside a nested provider** — the provider
  paints nothing; put a `Surface` inside it.
- **A phone scrolls sideways** — a grid's implicit column grew to a wide
  child (`minmax(0, 1fr)`), or a frame with `aspect-ratio` also has a minimum
  height. `pnpm test:e2e` checks every page at 320px.
- **An e2e test times out waiting for animations** — something on the page
  animates forever; `hydrated()` in `tests/site.spec.ts` ignores infinite
  animations, so a new one needs that check, not a longer timeout.
- **Port 5180 or 5181 is in use** — another dev server; stop it or change the
  port in `vite.config.ts` and `playwright.config.ts`.
- **A change in `src` does not show in a Turbo build** — the site's inputs are
  in `apps/site/turbo.json`; add any new top-level folder there.
- **The lockfile shows thousands of changed lines** — pnpm writes it with
  single quotes and the repository commits it prettier-formatted; run
  `npx prettier --write pnpm-lock.yaml` (the pre-commit hook does too).
