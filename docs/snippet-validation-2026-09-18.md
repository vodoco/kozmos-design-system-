# Executable snippet validation — 18 September 2026

## Outcome and boundaries

The first executable-reference slice covers **all 82 existing React recipes** in
81 component Docs files. Their exact displayed code compiles against packed,
installed packages with React 18 and 19. This is a compiler gate, **not** a
runtime, accessibility, platform-parity or npm-readiness certificate.

The first strict run after making JSX fragments into exported components reported
62 compiler diagnostics across 22 recipes: missing required props, undefined
state/callbacks/imports, and a documented `useToast` export that does not exist.
Those errors are repaired in the displayed MDX itself. Empty compound examples
(Menu, Tabs, BottomSheet, Breadcrumb, Pagination, Table, Popover) now show usable
compositions. Controlled examples include actual state updates, and callbacks
owned by the product are explicit typed props rather than invented globals or
no-op stubs. Map engines, persistence and routing are not fabricated.

All React snippets now export a component. Read the React package README for
CSS imports and provider setup; these are component recipes, not entire app
bootstraps. Three recipes now use Kozmos Icon rather than requiring direct Lucide
imports. NumberInput preserves controlled empty input with `value={threshold ?? ""}`;
its callback's `null` does not mean its native value prop accepts `null`.

No runtime component API, dependencies or release versions change in this slice.
No push, merge or publication.

## How the gate works

- `scripts/lib/doc-snippets.mjs` reads static JSX attributes with TypeScript,
  decodes template escapes as the Docs renderer does, rejects dynamic/malformed/
  duplicate/empty attributes, and preserves exact recipe text.
- Each React recipe is a separate TSX module in an isolated temporary consumer.
  No JSX transformation at validation time, source aliases, application ambient
  declarations, compiler suppression comments or injected imports.
- `scripts/check-package-install.mjs` already packs all four public packages
  and installs them into fresh npm projects. Recipes use those installed
  declarations, not the repository's source tree.
- Compiler settings: strict, NodeNext, React JSX transform, ES2022,
  `skipLibCheck: false`. Existing Node16/NodeNext ESM/CJS, exports, SSR Button,
  README and package-content checks remain.
- A separate negative fixture intentionally names a nonexistent export, supplies
  an invalid Button emotion and references missing application state. The gate
  must observe all three diagnostics, on both React majors.
- Four unit tests cover extraction/rejection, exact fixture text, isolated
  configuration and suppression rejection.
- CI's package-install step runs this automatically. It also runs the helper's
  unit tests. It does not need a second install job.

Successful temporary installs are removed by the existing harness. Failed
installs are retained and their path printed. `doc-snippets-map.json` maps each
generated filename to its MDX file and section line. Compiler line numbers point
into the retained `doc-snippets/*.tsx` files.

## Run and maintain

From `astra/browser-compatibility` (the implementation checkout is
`/private/tmp/kozmos-browser-compat.uqPMBD`):

```sh
pnpm install --frozen-lockfile
pnpm --filter "@kozmos/react..." build
pnpm test:doc-snippets
pnpm docs:snippets:check
pnpm docs:snippets:compile
pnpm --filter @kozmos/docs typecheck
pnpm --filter @kozmos/docs build-storybook

# Separate terminal:
python3 -m http.server 6011 --bind 127.0.0.1 --directory apps/docs/storybook-static

# First terminal:
STORYBOOK_URL=http://127.0.0.1:6011 pnpm test:storybook-docs
```

`docs:snippets:compile` is an alias for the full `packages:install:check` gate;
do not run both expecting different coverage. It requires npm registry access,
built local packages and Node/pnpm. It installs dependencies with lifecycle
scripts disabled and never publishes.

To edit a recipe, change its `react={\`...\`}`attribute in`packages/react/src/components/<Component>/<Component>.mdx`. New recipes are
discovered automatically. Keep each module self-contained; import all used
symbols, declare state, and accept product integration callbacks through typed
props. Fix the recipe or the real API when compilation fails—do not add ambient
reader shims or suppressions. Update this dated inventory and the support guide
when coverage changes.

## Coverage still missing

- **80 Vue + 81 Swift + 81 Kotlin references are not compiler-checked.**
  The identifier scan remains a much weaker check. Native implementation
  excerpts can shadow real package types; compile package-consumer recipes
  separately before calling them usable.
- **17 of 98 component MDX pages contain no PlatformSnippets block.**
  Existing live stories and ordinary fenced examples are not part of this
  recipe gate. Absence is not a claim that the component is unsupported.
- Recipe compilation does not execute handlers, mount examples, validate CSS,
  catch missing context providers, or prove screen-reader/device behaviour.
- Native package builds, Vue harness tests and Figma parity were not rerun.
  No change to the existing 48 incomplete accessibility cases.
- The product-module pilot, browser/device support floor, remaining CSS ownership,
  peer-version drift, full CI and publication approval remain release gates.

Next: keep React's recipe gate enforced, then validate a representative real
product module against installed packages. Native recipe conversion/compiler
fixtures and a true implementation/support matrix remain separate follow-up
work; the table below is only a **documentation compilation inventory**.

## Inventory at this change

“Checked” means the indicated number of React recipes passes both installed-package
compiler runs. “Reference” means text exists but has no compiler validation.
“—” means no PlatformSnippets recipe, not unsupported. It does not enumerate every
exported API or establish native/Vue implementation status.

| Component Docs        | React     | Vue         | Swift       | Kotlin      |
| --------------------- | --------- | ----------- | ----------- | ----------- |
| Accordion             | 1 checked | 1 reference | 1 reference | 1 reference |
| AdaptiveMapShell      | —         | —           | —           | —           |
| Alert                 | 1 checked | 1 reference | 1 reference | 1 reference |
| Avatar                | 1 checked | 1 reference | 1 reference | 1 reference |
| Backdrop              | 1 checked | 1 reference | 1 reference | 1 reference |
| Badge                 | 1 checked | 1 reference | 1 reference | 1 reference |
| BottomNavigation      | 1 checked | 1 reference | 1 reference | 1 reference |
| BottomSheet           | 1 checked | 1 reference | 1 reference | 1 reference |
| Box                   | 1 checked | 1 reference | 1 reference | 1 reference |
| Breadcrumb            | 1 checked | 1 reference | 1 reference | 1 reference |
| BrowseCategoriesPanel | —         | —           | —           | —           |
| Button                | 2 checked | 1 reference | 2 reference | 2 reference |
| Card                  | 1 checked | 1 reference | 1 reference | 1 reference |
| CategoryTile          | —         | —           | —           | —           |
| Checkbox              | 1 checked | 1 reference | 1 reference | 1 reference |
| Chip                  | —         | —           | —           | —           |
| ColorPicker           | 1 checked | 1 reference | 1 reference | 1 reference |
| Combobox              | 1 checked | 1 reference | 1 reference | 1 reference |
| Container             | 1 checked | 1 reference | 1 reference | 1 reference |
| Counter               | 1 checked | 1 reference | —           | —           |
| DatePicker            | 1 checked | 1 reference | 1 reference | 1 reference |
| DateRangePicker       | 1 checked | 1 reference | 1 reference | 1 reference |
| Dialog                | 1 checked | 1 reference | 1 reference | 1 reference |
| DirectionStep         | 1 checked | 1 reference | 1 reference | 1 reference |
| Drawer                | 1 checked | 1 reference | 1 reference | 1 reference |
| DynamicIsland         | —         | —           | —           | —           |
| EmptyState            | —         | —           | —           | —           |
| FeedbackCard          | 1 checked | 1 reference | 1 reference | 1 reference |
| FieldWrapper          | 1 checked | 1 reference | 1 reference | 1 reference |
| FileUpload            | 1 checked | 1 reference | 1 reference | 1 reference |
| FloatingActionButton  | 1 checked | 1 reference | 1 reference | 1 reference |
| FloorSelector         | 1 checked | 1 reference | 1 reference | 1 reference |
| Grid                  | 1 checked | 1 reference | 1 reference | 1 reference |
| Heading               | 1 checked | 1 reference | 1 reference | 1 reference |
| Icon                  | 1 checked | 1 reference | 1 reference | 1 reference |
| IconButton            | 1 checked | 1 reference | 1 reference | 1 reference |
| Input                 | 1 checked | 1 reference | 1 reference | 1 reference |
| Label                 | 1 checked | 1 reference | 1 reference | 1 reference |
| Link                  | 1 checked | 1 reference | 1 reference | 1 reference |
| List                  | 1 checked | 1 reference | 1 reference | 1 reference |
| Listbox               | 1 checked | 1 reference | 1 reference | 1 reference |
| LocationPin           | 1 checked | 1 reference | 1 reference | 1 reference |
| MapControlButton      | —         | —           | —           | —           |
| MapControlsGroup      | 1 checked | 1 reference | 1 reference | 1 reference |
| MapOverlay            | 1 checked | 1 reference | 1 reference | 1 reference |
| MapView               | 1 checked | 1 reference | 1 reference | 1 reference |
| Menu                  | 1 checked | 1 reference | 1 reference | 1 reference |
| MetaStrip             | —         | —           | —           | —           |
| MultiSelect           | 1 checked | 1 reference | 1 reference | 1 reference |
| Navbar                | 1 checked | 1 reference | 1 reference | 1 reference |
| NavigationAnnouncer   | 1 checked | 1 reference | 1 reference | 1 reference |
| NavigationItem        | 1 checked | —           | 1 reference | 1 reference |
| NumberInput           | 1 checked | 1 reference | 1 reference | 1 reference |
| OTPInput              | 1 checked | 1 reference | 1 reference | 1 reference |
| POICard               | 1 checked | 1 reference | 1 reference | 1 reference |
| POIDetailPanel        | —         | —           | —           | —           |
| POIMediaGallery       | —         | —           | —           | —           |
| POIResultCard         | —         | —           | —           | —           |
| POIResultList         | —         | —           | —           | —           |
| Pagination            | 1 checked | 1 reference | 1 reference | 1 reference |
| PasswordInput         | 1 checked | 1 reference | 1 reference | 1 reference |
| Popover               | 1 checked | 1 reference | 1 reference | 1 reference |
| Progress              | 1 checked | 1 reference | 1 reference | 1 reference |
| Radio                 | 1 checked | 1 reference | 1 reference | 1 reference |
| Rating                | 1 checked | 1 reference | 1 reference | 1 reference |
| RouteOptionCard       | —         | —           | —           | —           |
| RoutePreviewPanel     | —         | —           | —           | —           |
| RouteSummary          | —         | —           | —           | —           |
| RoutingInputGroup     | —         | —           | —           | —           |
| SaveLocationCard      | 1 checked | 1 reference | 1 reference | 1 reference |
| ScrollArea            | 1 checked | 1 reference | 1 reference | 1 reference |
| Search                | 1 checked | 1 reference | 1 reference | 1 reference |
| SearchBar             | 1 checked | 1 reference | 1 reference | 1 reference |
| SegmentedControl      | 1 checked | 1 reference | 1 reference | 1 reference |
| Select                | 1 checked | 1 reference | 1 reference | 1 reference |
| Separator             | 1 checked | 1 reference | 1 reference | 1 reference |
| Sidebar               | 1 checked | 1 reference | 1 reference | 1 reference |
| Skeleton              | 1 checked | 1 reference | 1 reference | 1 reference |
| Slider                | 1 checked | 1 reference | 1 reference | 1 reference |
| Spinner               | 1 checked | 1 reference | 1 reference | 1 reference |
| SplitButton           | 1 checked | 1 reference | 1 reference | 1 reference |
| Stack                 | 1 checked | 1 reference | 1 reference | 1 reference |
| Stepper               | 1 checked | 1 reference | 1 reference | 1 reference |
| Switch                | 1 checked | 1 reference | 1 reference | 1 reference |
| Table                 | 1 checked | 1 reference | 1 reference | 1 reference |
| Tabs                  | 1 checked | 1 reference | 1 reference | 1 reference |
| Tag                   | 1 checked | 1 reference | 1 reference | 1 reference |
| Text                  | 1 checked | 1 reference | 1 reference | 1 reference |
| Textarea              | 1 checked | 1 reference | 1 reference | 1 reference |
| ThemeProvider         | 1 checked | 1 reference | 1 reference | 1 reference |
| TimePicker            | 1 checked | 1 reference | 1 reference | 1 reference |
| Timeline              | 1 checked | 1 reference | 1 reference | 1 reference |
| Toast                 | 1 checked | 1 reference | 1 reference | 1 reference |
| ToggleButton          | 1 checked | 1 reference | 1 reference | 1 reference |
| Tooltip               | 1 checked | 1 reference | 1 reference | 1 reference |
| Tree                  | 1 checked | 1 reference | 1 reference | 1 reference |
| UserLocationMarker    | —         | —           | —           | —           |
| WayfindingCard        | 1 checked | 1 reference | 1 reference | 1 reference |
