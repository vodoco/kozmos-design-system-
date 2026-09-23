# npm foundations continuation — 2026-09-18

User approved continuing the CSS architecture and package-declaration work after
the overnight audit. Implementation: `astra/browser-compatibility` in
`/private/tmp/kozmos-browser-compat.uqPMBD`, starting at `7afe930`. Shared main and
the independently running 6006 preview are not implementation directories.
Local commits only; no push, merge, publication or new browser-support promise.

Implementation commits: `44712b0` (package declarations), `3d577e5` (token opacity,
Chip contrast and owned temporal compositions), `767b3be` (compiler-default isolation).

## Package declarations: resolved

React and icons previously attached a CommonJS-interpreted `.d.ts` graph to both
runtime formats; product-contracts exposed only ESM declarations to CommonJS
type consumers. These were real package-format mismatches, not test exceptions.

The existing Vite declaration tool now bundles each package's public declaration
graph using API Extractor. `scripts/emit-format-declarations.mjs` produces independent
`.d.mts` and `.d.cts` entries from that self-contained bundle. Conditional exports
pair them with ESM and CommonJS runtime files. The legacy `types` field retains
`index.d.ts` for older tooling. Relative declaration dependencies/file references
cause the format-emission step to fail rather than leave a half-converted graph.
Six build tests cover the emitter and these failure cases.

Product-contracts now builds both runtime formats with Vite too; each is intentionally
empty because its API consists of types. This supports normal CommonJS type imports
without claiming runtime values. Package entry names and public types are unchanged;
unexported dist internals were never supported deep-import paths.

This follows TypeScript's requirement that declarations match the runtime module
format: [TypeScript 4.7 guidance](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html).
Bundling uses the existing vite-plugin-dts 3.9.1 toolchain, added to icons/contracts
at the same version. It reports its existing API Extractor/TypeScript version warning;
strict installed-package checks pass. No unrelated toolchain upgrades are included.

### Gates and maintenance

- `pnpm test:declarations`: emitter tests; also wired into CI.
- `pnpm packages:install:check`: all four publishable tarballs, 14 export resolutions,
  four CommonJS loads, SSR Button/Icon, 12 README examples and native Button types.
- The install check now compiles `.mts` **and** `.cts` consumers in both `node16`
  and `nodenext` with `skipLibCheck` **off**, for React 18 and 19. Negative type
  assertions ensure APIs have not silently become `any`.
- `@arethetypeswrong` reports **zero** problems. The three former baseline entries
  were removed only after the report showed them fixed; zero is now enforced.

Build before packing:

```sh
pnpm install --frozen-lockfile
pnpm --filter @kozmos/product-contracts build
pnpm --filter @kozmos/icons build
pnpm --filter @kozmos/react build
pnpm test:declarations
pnpm packages:install:check
```

Build config: `packages/{react,icons,product-contracts}/vite.config.mts`; exports:
their `package.json`; format emission: `scripts/emit-format-declarations.mjs`;
consumer type assertions: `packages/react/tests/types/package-modes.ts`.

## Token opacity: the shared authoring defect is resolved

`postcss/token-alpha.cjs` wraps Tailwind's token-colour mappings in colour callbacks.
Unmodified roles keep their original `var()` values. Slash opacity uses
`color-mix(in srgb, var(--role) calc(alpha * 100%), transparent)`, retaining live
theme values and consumer overrides, including alpha already present in an RGBA
token. This applies opacity to the colour, not to children or the whole control.
Legacy separate `bg-opacity-*` utilities were not supported by the old token mapping
and are not the new authoring contract; use `/alpha`.

The compiler regression failed before the fix. All **110 scanned slash-modified
class uses now compile** (116 before temporal layout utilities moved into recipes);
the inert-use ratchet drops from **58 uses / 38 classes /
25 files to zero**. This is a build-level repair, not 58 per-component overrides.
The rule scanner still guards future regressions. Colour aliases/contrast checks
evaluate the callbacks' unmodified result rather than disabling alias checks.

Activating the old styles exposed a real destructive-Chip contrast failure at
4.41:1 idle / 4.07:1 hover. Its ink now uses the existing danger `onSurface` role
on the tinted surface; no new token, raw colour or borrowed Button token was added.
The Chip story now includes selected destructive state and the interaction matrix
checks all five enabled variants on hover in both themes.

`test:token-alpha` renders 24 colour comparisons per browser using the built package:
base/background/text/border, light/dark, nested providers, RGBA/hex overrides and an
owned portal. Chromium, Firefox and WebKit pass. `test:css-build` includes actual
Tailwind compilation tests. CI runs both. Existing owned-CSS/no-scope tests still
pass in all three engines.

The alpha treatment requires CSS `color-mix`; no old-browser fallback is pretended.
Unmodified colours do not acquire that dependency. Confirm this feature against
Pointr's agreed browser matrix before publishing; installed-engine checks do not
invent a product support floor. See [MDN's colour-mix reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix).
The remaining native `@scope` dependency elsewhere is separate, unresolved work.

## Date / DateRange / Time: complete owned-CSS composition

These three components now use `src/styles/owned-temporal-fields.css` for every
supporting layout, label, native input and decorative icon. Their base input and
FieldWrapper recipes were already owned. Native picker behavior is retained.

- Logical icon placement/reserved input padding follows the provider direction.
  The initial browser regression measured the icon 392px from the required edge.
- DateRange columns depend on available container width, not viewport width: a
  420px module has two columns and a 220px module stacks even on a desktop viewport.
- WebKit's native date segments can hold keyboard focus while not matching
  `:focus-visible`. These native fields deliberately expose the same focus ring
  on `:focus` in every engine, preserving validation-ring colours.
- DatePicker and TimePicker merge external guidance with owned helper/error IDs;
  a caller cannot conceal an explicit component error with `aria-invalid=false`.
- DateRange constrains the sibling bound **and** caller min/max, rather than
  letting an already-out-of-range value relax the caller's constraint.

Five new unit regressions failed first and pass after repair. `test:temporal-css`
uses built public exports and compares full CSS with all native scopes removed,
in all three engines. It covers geometry, host SVG resets, nested themes/directions,
focus, disabled/read-only states and narrow-container reflow. CI runs this suite.
This is three completed compositions, not completion of every component's CSS.

The final 320px visual inspection exposed an additional build-boundary defect:
Tailwind's compiler-variable initializer is not tagged as base-layer preflight, so
it still matched migrated elements and reset the icon translation to zero (8px
below center). The scoper now excludes owned targets from that initializer too,
including pseudo-elements. Local owned defaults remain, legacy components keep
their defaults, and consumer utility overrides remain enabled. A compiler test and
explicit vertical-center browser assertion failed against the previous build and
pass after repair. Owned focus-ring offsets and pressed Button transforms are also
checked in both stylesheet modes. No per-icon offset compensation was added.

### Run the added browser checks

```sh
pnpm test:css-build
for browser in chromium firefox webkit; do
  ADAPTIVE_BROWSER="$browser" pnpm test:token-alpha || exit 1
  ADAPTIVE_BROWSER="$browser" pnpm test:temporal-css || exit 1
  ADAPTIVE_BROWSER="$browser" pnpm test:owned-css || exit 1
done
pnpm components:classes:check
pnpm tokens:contrast:check
```

The public package fixture sources are in `packages/react/tests/integration/`;
assertions are in `scripts/check-{token-alpha,temporal-css}.mjs`. Build first and
do not rebuild `dist` while any browser suite is reading it.

## Verification of this batch

- React: 430 tests in 111 files; five new temporal regressions.
- Build tests: nine CSS compiler tests and six declaration-emitter tests.
- Production Storybook: 944 initial-state cases across all 236 stories / 102 groups,
  light/dark and 320/1280 widths, with zero violations, runtime errors or unintended
  overflow reported by the Chromium audit.
- Interaction matrix: 112 accessibility audits per engine, 336 across Chromium
  145.0.7632.6, Firefox 146.0.1 and WebKit 26.0, plus layout/keyboard assertions.
- Built-package token-alpha, temporal and existing owned-CSS suites pass in all
  three engines; temporal/owned suites also run with native scopes removed.
- React lint, docs typecheck, 324 documentation snippets, 194 token-contrast pairs,
  component contracts, border parity and zero-inert-class checks pass.
- The installed-tarball gate passes with zero declaration-format problems.

The broad audit still returns **48 incomplete cases in 15 stories / 62 nodes**:
38 contrast, 16 ARIA-value and eight hidden-focus nodes. These are the same entries
as `storybook-manual-review-2026-09-18.md`, not 48 additional failures and not
automated passes. Transparency/overlays still need contextual human review.
The ignored machine report is `test-results/storybook-foundations-final.json`.

### Preview and independent checkout

The separate preview checkout is `/private/tmp/kozmos-owned-css-verify.dV1etM`,
at implementation `767b3be`; shared main is still clean at `a02a008`. It rebuilt
the four publishable packages with a frozen install and the final React/Storybook
follow-up. Its React ESM/CSS match the implementation artifacts byte-for-byte.
The nine compiler/six emitter tests and zero-inert-class gate pass there too.
The final checkout repeated all 430 unit tests, the full 944-case story scan,
336 cross-engine interaction audits, all three engines' token-alpha/temporal/owned
CSS suites, React 18/19 installed-tarball checks, lint and docs typecheck. Original
form-compatibility, adaptive-layout, overlay, theme-isolation and runtime-config
suites also passed in all three engines after the compiler-boundary repair. The live
6006 preview passed the five-story strict accessibility smoke and 36 screenshot-derived
interaction/layout regression scenarios; 320px date-range and landscape Chip views were visually
inspected. The final broad report retains the same 48 incomplete cases described
above. The disposable static audit server on 6008 was stopped afterward.

Storybook runs on **http://127.0.0.1:6006/** from that checkout, bound to loopback.
If it has stopped, start it from that directory with:

```sh
pnpm --filter @kozmos/docs storybook:react --ci --host 127.0.0.1
```

Do **not** insert another `--` before `--ci`: pnpm forwards it to Storybook,
preventing the following flags from being parsed. CI's launch command now uses
the same verified form. Check `lsof -nP -iTCP:6006 -sTCP:LISTEN` and the process's
working directory before stopping/replacing any preview. Never rebuild this
checkout while its preview or built-package tests are running. Edit and commit in
the implementation checkout, stop this preview, advance this clean detached
checkout to the intended commit, rebuild, then restart.

## Release status

This closes the declaration and inert-class blockers, not the whole release. CSS migration, the
manual-review queue, physical-device/browser-floor acceptance, Figma/visual approval
and a real packaged Pointr-module integration remain. Read the overnight guide and
`storybook-manual-review-2026-09-18.md` for the earlier verified baseline and limits.

The raw-value backlog is unchanged: 32 colour occurrences across seven components/
recipes and seven radius occurrences across six components. Passing the ratchet
means no increase, not zero debt. Glass-panel semantic roles remain a foundational
follow-up. Build tooling also still reports the existing API Extractor/TypeScript
version gap, Storybook package/addon compatibility warnings, stale Browserslist data
and large documentation chunks. These were not silently resolved or waived here;
handle dependency alignment separately and rerun the gates. Installed local browser
engines and automated accessibility checks are not remote CI, physical devices,
screen-reader testing or visual approval.

Next recommended implementation: finish the selection-field family (Combobox,
MultiSelect, Select and Listbox), including their portalled content and keyboard
states, using the same complete-composition/no-scope gates. Then migrate the
remaining overlays, collections and product compositions. Do not remove legacy
scope/preflight until every remaining consumer has been migrated and host-page
isolation has been verified. Keep canonical token edits separate from CSS ownership
changes so native/Figma synchronization remains traceable.
