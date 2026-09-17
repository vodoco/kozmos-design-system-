# Component-owned CSS: incremental migration

2026-09-17 · `astra/browser-compatibility` · worktree
`/private/tmp/kozmos-browser-compat.uqPMBD` · starts after investigation `f8eb957`.

## Decision and limits

Olcay approved proceeding with the recommended compatibility architecture after
another extensive audit. The direction is precompiled, namespaced component CSS,
provider-owned semantic tokens and component-local resets, without mandatory native
`@scope`. No browser minimums, npm publication, push or merge were approved here.

This is an **incremental migration, not a completed library migration or release certification**.
The original WebKit Input/Textarea failure is fixed by moving the entire component
recipe—not adding an input-only override or sniffing Safari. Every engine receives
the same stylesheet. The rest of the library still has bounded legacy utilities and
preflight inside `@scope`; therefore the package as a whole still requires that
feature. Do not publish this intermediate state as broadly compatible.

## What migrated

| Part                        | Implementation                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| Input / Textarea            | Namespaced recipes, native states, focus rings, placeholders and file-input normalization.        |
| Button                      | All existing variants/sizes/emotions, loading icon and glass treatment use owned recipes.         |
| PasswordInput / NumberInput | Entire field, toggle/steppers and icons use owned recipes; logical edges support RTL.             |
| PopoverContent / Arrow      | Owned surface, animation/state rules and arrow; existing Radix ownership/focus behavior retained. |
| FieldWrapper / Label        | Supporting layout, typography, messages, required/optional text and visually hidden labels.       |
| Foundations                 | Theme token definitions and namespaced keyframes no longer depend on native scope.                |

`inputVariants` and `buttonVariants` keep their argument/type contracts but now
return namespaced recipe classes. Their output is opaque: do not parse it or assume
Tailwind class names. Existing consumers of `inputVariants` include PasswordInput,
NumberInput, DatePicker, TimePicker, OTPInput, Combobox, ColorPicker, Search and
WayfindingCard; Pagination uses `buttonVariants`. PasswordInput and NumberInput are
now fully migrated. The other consumers gain the new base recipe, **not complete
migration of their additional styling**.

Except for removing Button's non-functional `asChild` declaration (below), React
props and package entry points are retained. No token values,
native controls, Figma assets, device breakpoints or product modules were redesigned.

## Source map: where to make changes

Paths below are relative to the repository root.

| File                                                                                | Responsibility                                                                                                     |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `packages/react/src/styles/owned-components.css`                                    | First-slice recipes; edit semantic styles here, not in built `dist`.                                               |
| `packages/react/src/styles/owned-native-fields.css`                                 | PasswordInput/NumberInput composition styles, logical edges, action targets and icons.                             |
| `packages/react/src/components/{Button,Input,Textarea,Popover,FieldWrapper,Label}/` | Props, behavior, markup, recipe selection and unit tests.                                                          |
| `packages/react/src/utils.ts`                                                       | Existing class merging and the new accessibility ID-list merger.                                                   |
| `packages/react/postcss/scoped-css.cjs`                                             | Transitional build partition: owned rules, root tokens, local Tailwind defaults, legacy scope and animation names. |
| `packages/react/postcss/scoped-css.test.cjs`                                        | Build-boundary and animation regression tests.                                                                     |
| `packages/react/tailwind.config.js`                                                 | Authoring-time token/utility mapping; includes CSS recipes in scanning.                                            |
| `packages/react/tests/integration/owned-css-host.tsx`                               | Built public API fixture; no source aliases or consumer Tailwind build.                                            |
| `scripts/check-owned-css.mjs`                                                       | Full stylesheet versus all `@scope` rules removed.                                                                 |
| `scripts/check-browser-compatibility.mjs`                                           | Original 13-check form regression, retained for all three engines.                                                 |
| `scripts/check-{raw-values,compiled-classes,component-contracts}.mjs`               | Debt and contract checks updated to see CSS recipes.                                                               |

The `@kozmos-owned` authoring block is a **build marker**, not a browser feature or
runtime dependency. Tailwind expands `@apply`; the PostCSS step unwraps the block.
It rejects a nested native `@scope` in owned recipes. The default stylesheet is
still `@kozmos/react/style.css`; there is no second legacy/browser-specific import.

The temporary legacy-preflight exclusion reads Tailwind 3's generated base-layer
metadata. This is deliberately covered by a build unit test and real compiled-CSS
tests. Do not upgrade Tailwind and assume those internals remain compatible. The
legacy scoper and this exclusion should disappear when the migration is complete.
As the remaining components migrate, colocate their recipes or split the initial
recipe file by component family; do not grow a second unrelated styling system.

## Consumer customization contract

Consumers need no Tailwind setup for component defaults. Keep importing the package
stylesheet once and wrapping modules in ThemeProvider. Prefer provider `tokens` for
theme-wide changes; they follow owned portals and nested-provider rules.

For a component-only change, pass your own CSS class and load its stylesheet after
the package stylesheet. For example:

```tsx
<Input className="product-location-input" label="Location" />
```

```css
.product-location-input {
  border-radius: calc(var(--semantics-radius-marker) * 1px);
}
```

Use an appropriate state selector for a state-specific override (for example
`.product-location-input:focus-visible`). Normal CSS specificity still applies;
inline styles take precedence over ordinary stylesheet declarations. Do not treat
an arbitrary Tailwind class as a supported customization without its compiled CSS.
Existing generated utility overrides remain during migration, but they still rely
on scope and must not become the cross-browser customization API.

Namespacing prevents accidental generic-class collisions. It is **not** Shadow DOM
or a security boundary: high-specificity host selectors and `!important` can still
override controls. `rem` still follows the document root size. Reset rules target
owned elements, not arbitrary descendants; the old preflight still affects other
content inside legacy roots until that migration is finished. Glass's existing
direct-child positioning remains part of its treatment.

One document loading different Kozmos versions has not been certified. Stable
class/token/keyframe names are not version isolation. Determine whether Pointr
requires simultaneous independently versioned SDK modules before promising it.

## Findings, including implementation mistakes

1. **Reproduced original defect:** WebKit 26.0 ignored scoped form declarations;
   ten original checks failed. All migrated form declarations now live outside scope.
2. **Reproduced customization defect:** an ordinary consumer CSS class loaded after
   the package could not change Input's radius from 16px to 7px. Owned base recipes
   now allow that override without a Tailwind compiler or `!important`.
3. **Fixed migration mistake:** old scoped preflight beat the new input's padding
   in Chromium. Legacy base rules now exclude owned targets, including pseudo-elements;
   legacy utilities remain available for existing compositions.
4. **Fixed migration mistake:** moving keyframes while walking the tree visited some
   twice, producing `kozmos-kozmos-*` while declarations referenced `kozmos-*`.
   Popover stayed mounted after Escape because its exit animation could not finish.
   Keyframes are collected before mutation; conditional definitions keep their conditions.
5. **Fixed migration mistake:** moving glass classes out of JSX purged the standalone
   `glass-bevel` utility, breaking the existing portal/configuration test in all engines.
   CSS authoring files are now scanned too; that regression test is unchanged.
6. **Fixed accessibility defect:** caller `aria-describedby` replaced the error/helper
   link in Input/Textarea, and caller `aria-invalid={false}` concealed a component error.
   Five new tests failed first. A sixth reproduced an empty error string suppressing
   helper text while leaving its description ID on the input; that is fixed too.
   IDs now merge/deduplicate; explicit component errors
   remain invalid, while caller spelling/grammar semantics survive without an error.
7. **Preserved debt, not cosmetic green:** raw-value scanning initially lost Button's
   white hover because it moved to CSS. The gate now sees `@apply`; raw colours remain
   35 across 7 source groups, radii 7 across 6. The inert-class count becomes 59/39/25
   because three dead references were removed—not because their missing visuals were
   implemented (Button secondary/ghost hover and Textarea error placeholder opacity).
8. **Test-only mistakes corrected:** the new fixture initially used an unsupported
   glass `opacity` config property, and tested MapControlButton's filled appearance
   without setting `pressed`. The fixture is now typechecked and tests the active state.
9. **Final helper audit:** `inputVariants({ status: "warning", error: true })`
   initially painted a warning because recipe order beat the error flag. A computed
   border-colour assertion reproduced it; error rules now follow other validation
   recipes, consistent with Input's own error precedence. This is covered with and
   without scope in all three engines.

### Button contract: resolved before publication

The old `ButtonProps` declared `asChild`, but Button did not implement it: built SSR of
`<Button asChild><a href="#destination">Go</a></Button>` emits a button containing an
anchor and React warns about the unrecognized `asChild` DOM prop. This predates the
migration. The continuation removes that unsupported declaration, including from
wrappers inheriting ButtonProps. No repository consumer was using `Button asChild`.

Button deliberately remains a native button with native props and an HTMLButtonElement
ref. Use Link for navigation or `buttonVariants` on an anchor/router link for button
appearance. `variant="link"` alone does not change semantics. The helper only styles:
it provides no disabled-link behavior, loading content or analytics. Do not put an
interactive link inside Button. `PopoverTrigger asChild` remains Radix's separate,
working API. Existing native form behavior (including an unspecified type's default)
is unchanged. A future polymorphic component needs a separate reviewed contract,
not an untyped Slot workaround.

`packages/react/tests/types/native-button.tsx` tests valid native events/refs/form
props and rejects asChild, anchor refs and href on Button. Three negative assertions
failed against the old declarations. The tarball install gate runs this fixture
against both supported React majors. Unit tests now exercise click/ref forwarding
and disabled/loading activation instead of asserting only that a button is enabled.

### Composed native fields continuation

The next bounded slice migrates PasswordInput and NumberInput. Eight accessibility
regressions failed first: external description IDs were discarded or replaced the
owned helper/error ID, and invalid semantics were lost or could hide an error.
They now use the same ID merger and error precedence as Input/Textarea.

Computed geometry reproduced the password toggle on the wrong edge in RTL (x269
instead of x13). Logical padding/insets/corners now follow the provider direction;
NumberInput's outside stepper corners and unstepped text alignment do too. This is
an intentional RTL correction; tokens, sizes and LTR appearance are unchanged.
NumberInput preserves normal foreground value text while applying validation tone
to borders, focus rings and stepper glyphs.

A further failing test showed native stepUp/stepDown changing a controlled field
from 2 to 3 before its parent accepted the update. The control now computes the
proposed native step, restores the displayed controlled value, then notifies the
parent. Uncontrolled stepping is unchanged. Consumer callback exceptions are no
longer caught as native stepping errors and invoked a second time. As before,
stepper changes notify `onValueChange`; typing also invokes native `onChange`.

The owned-CSS fixture now checks both complete compositions in both stylesheet modes,
including 44px targets/16px icons, validation colours, disabled/read-only behavior,
visibility toggling, keyboard stepping, RTL/LTR geometry and a 220px host reflow.
This is not physical foldable/landscape-device certification. A test initially
used foreground-900 as its expectation; the existing foreground role actually
maps to foreground-0. The test was corrected to the declared token, not the product
changed to satisfy an invented colour expectation.

## Verification and reproducibility

**Latest continuation:** React build; **400 tests in 107 files**; six CSS-build tests;
owned CSS in both modes plus the original form, adaptive, overlay, theme and runtime
configuration suites in all three engines; React 18/19 tarball installs with 12
README samples and the new Button API type fixture; Storybook build; lint, contract,
raw/class ratchets, snippet and variant checks all passed. The three known declaration
issues and existing variant gaps remain; those ratchets passing does not close them.
No native/device/Figma/remote CI or full visual/accessibility certification was run.

Original slice evidence: all five package builds; **387 React tests in
106 files**; six CSS-build tests; two browser-selection tests; 46 existing browser
checks plus 13 form checks and two owned-CSS modes in each of Chromium 145.0.7632.6,
Firefox 146.0.1 and WebKit 26.0. All passed. The form checks were not skipped or marked
as expected failures. React 18/19 tarball installs, 14 export resolutions, three CJS
entries and 11 README samples passed; three known declaration issues remain unchanged.
Storybook builds. Token parity/contrast, updated contract/debt checks and snippet/variant
checks passed. Native/device/Figma/complete visual certification were not rerun here.

An independent checkout at `/private/tmp/kozmos-owned-css-verify.dV1etM` rebuilt
implementation `7e2001d` with a frozen install: all package builds, 387 React tests,
six CSS-build tests and the owned/form/configuration browser suites passed again.
Its CSS and ESM bundle were byte-identical to the implementation worktree (`cmp`).
The final helper-precedence follow-up also passed a rebuild and all six owned-CSS
engine/mode combinations, plus the debt checks, before handoff.

Run from the worktree above, not the shared checkout, which remains on its old main.
Build before any check that consumes `dist`, and never rebuild while those checks run.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm --filter './packages/*' build
pnpm test:css-build
pnpm test:browser-selection
pnpm --filter @kozmos/react test
for browser in chromium firefox webkit; do
  ADAPTIVE_BROWSER="$browser" pnpm test:browser-compatibility || exit 1
  ADAPTIVE_BROWSER="$browser" pnpm test:owned-css || exit 1
  ADAPTIVE_BROWSER="$browser" pnpm test:adaptive || exit 1
  ADAPTIVE_BROWSER="$browser" pnpm test:overlays || exit 1
  ADAPTIVE_BROWSER="$browser" pnpm test:themes || exit 1
  ADAPTIVE_BROWSER="$browser" pnpm test:config || exit 1
done
pnpm components:classes:check
pnpm tokens:raw:check
pnpm components:contract:check
pnpm packages:install:check
pnpm --filter @kozmos/docs build-storybook
```

### Preview and edit safely

React Storybook runs at `http://127.0.0.1:6006` from the separate, verified checkout
`/private/tmp/kozmos-owned-css-verify.dV1etM`, advanced to the same continuation commit.
This keeps implementation builds from deleting `dist` underneath your preview.
The private Vue proof runs separately on 6007 and is not started; its unavailable
Storybook reference is not a React component error. The development server reports
existing addon-version/manager-api warnings; the React stories do render and the
production Storybook build passes. Toolchain cleanup remains separate work.

Useful story IDs: `components-button--emotions`, `components-passwordinput--right-to-left`,
`components-numberinput--right-to-left`, and `components-numberinput--read-only`.
Open `/?path=/story/<id>` on that server. New RTL stories use a 220px host.

To run your own preview, build first, then run in that checkout:

```sh
pnpm --filter @kozmos/docs exec storybook dev -p 6006 --host 127.0.0.1 --ci
```

Stop that specific preview before rebuilding its packages. Do not kill every Node
process or rebuild while it is serving. Source edits in a different worktree do
not appear here until that preview checkout is explicitly advanced and rebuilt.

The owned-CSS suite checks real computed styles in both modes: local resets,
host preservation, late host CSS, theme tokens, nested light-in-dark, RTL,
focus/validation/disabled states, ordinary consumer CSS, exported helper output,
loading animation, active filled map control/base field composition regressions,
portal theme updates without remounts, Escape/focus restoration and enlarged root text.
The original form fixture covers light/dark siblings and nested/owned portal forms.
Removing scope is a dependency test, **not an old-engine or physical-device emulator**.

For an independent checkout, create a new empty directory with `mktemp -d`, then
`git worktree add --detach <that-directory> astra/browser-compatibility`; install and
run the same checks there. Do not delete existing worktrees or reset shared main.
To undo this work later, revert the implementation commit on a new branch and verify
the resulting tree; do not suppress the restored failing compatibility gate.

## Remaining release gates and next work

1. Migrate remaining controls and composition styles, eliminate native scope entirely,
   then repeat the host/nested-theme/portal/consumer-override tests library-wide.
2. Audit other field primitives for the same description/invalid-state merge problem;
   the fix now covers Input, Textarea, PasswordInput and NumberInput. Button's unsupported
   `asChild` declaration is removed; do not reintroduce it without a deliberate API.
3. Establish Pointr's actual minimum browsers/WebViews, evergreen update guarantees
   and multi-version embedding requirements; test those exact engines and real devices.
4. Complete motion/forced-colours/accessibility and visual review. The suite is not
   comprehensive accessibility certification, and Chromatic remains plan-blocked.
5. Native adaptive parity, actual hinge/keyboard devices and a real map-engine adapter
   with representative Pointr flows remain outstanding.
6. Finish the known token-alpha visual debt, declaration/API backlog and package review;
   get explicit approval for a `next` prerelease only after the required gates pass.

Release safeguards are separately in PR #54: web/iOS/Android, bundle and Lighthouse
checks passed; Chromatic published stories but its UI comparison remains pending due
to its plan limit. No merge, publication, credentials or repository settings changed here.
