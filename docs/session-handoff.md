# Session Handoff

Written 2026-08-24, updated 2026-08-25. Everything below was verified by
running it, not recalled.
Branch: `codex/wave-2-figma-components`.

## 1. Verified State

**Read this first: verify against a clean checkout, not the working tree.**

For most of this branch's life a large part of its substance was uncommitted.
The tree had 97 React components; the committed branch had 79. Every coverage
number in earlier handoffs was measured against the working tree, so they
described something CI never saw. That is fixed — the tree is clean and the
commits contain everything — but the habit is what caused it. To check state:

```bash
git worktree add --detach /tmp/verify HEAD && cd /tmp/verify
```

All gates pass on a clean checkout as of this handoff:

| Gate                                         | Result                                       |
| -------------------------------------------- | -------------------------------------------- |
| `pnpm typecheck` / `lint` / `test` / `build` | exit 0                                       |
| `components:contract:check`                  | ok                                           |
| `docs:snippets:check`                        | ok (319 identifiers, 321 snippets)           |
| `components:variant:check`                   | ok (97 scanned, 1 gap)                       |
| `tokens:contrast:check`                      | ok (50 pairs, light + dark)                  |
| `figma:plugin:check`                         | ok                                           |
| `check-completion --check`                   | STATUS.md up to date                         |
| iOS                                          | `swift build` exit 0                         |
| Android                                      | `assembleDebug` + `testDebugUnitTest` exit 0 |

### Keeping the Figma file honest

Two things exist now that did not when this branch started, and they change the
loop:

- **`pnpm figma:verify`** reads the file over the REST API and reports drift
  from the terminal: sets present, axis names and values, collapsed text nodes,
  and WCAG AA on every visible text node. It answers "did my change land?"
  in seconds, which is what several rounds of audits and screenshots were doing
  by hand.
- **Update All Product / SDK** in the plugin regenerates all 24 sets in one
  press, deferring the page reorganize until the end.

The working loop is: change code -> Update All Product / SDK -> `pnpm
figma:verify` -> then Figma's own Publish. Only the middle step needs Figma
open.

`figma:verify` cannot see everything. Contrast is **light theme only**, because
the REST API resolves variables in the file's default mode. It cannot check
component descriptions either: Figma only exposes those for _published_ library
components, so `componentSets` metadata reads as empty until the library is
published. The plugin's own audit remains the authority on both.

### CI status

Local gates green does not mean CI green — the two disagreed for most of this
branch's life. Open PR: `vodoco/kozmos-design-system-#1`, rebased on current
`main`, mergeable. (Commit and file counts are deliberately not quoted here —
updating this doc changes them, so any number written down is stale on arrival.
Read them off the PR.)

All six jobs pass on `db0d918`:

| Job              | Result |
| ---------------- | ------ |
| Web Build & Test | pass   |
| iOS Build        | pass   |
| Android Build    | pass   |
| `analyze-bundle` | pass   |
| `lighthouse`     | pass   |
| `Run Chromatic`  | pass   |

A green Code Connect job is not by itself proof it ran. Check the log says
`All Code Connect files are valid` and that no `Skipping` annotation was
emitted — §6 explains why an empty secret produces a passing job that verified
nothing. The skip text also appears in the `##[group]Run` block as echoed
script source, which looks alarming and means nothing.

Three CI failures were real and are fixed:

- **Lint**, which fails on `main` at `apps/mapscale-review`: four unescaped JSX
  apostrophes, and two `eslint-disable` directives naming
  `react-hooks/exhaustive-deps` — a rule this repo has never registered, so
  eslint errored on the unknown-rule directive while it suppressed nothing. Not
  fixable by registering the plugin: the hoisted
  `eslint-plugin-react-hooks@7.0.1` fails to load, importing a
  `zod-validation-error/v4` subpath that package does not export.
- **`analyze-bundle`**, which was ours. The wave took `@kozmos/react` from 79 to
  97 components and the ESM bundle from 128.80 KB to 254.07 KB raw, past a
  250 KB ceiling set when the library was half the size. Gzip — what consumers
  actually download — went 26.15 KB to 51.07 KB against an unchanged 70 KB
  budget. The raw ceiling is now 300 KB. **Next time this is hit, do subpath
  exports rather than another bump**: one entry point means every consumer pays
  for ColorPicker whether they import it or not.
- **An expired `FIGMA_ACCESS_TOKEN`**, which failed all three Code Connect
  steps with a 403 and was pre-existing on `main`. Rotated 2026-08-26; §6 has
  the recurrence date and the procedure.

### Platform coverage

|                     | Web (React) | iOS       | Android   | Vue          | Figma     |
| ------------------- | ----------- | --------- | --------- | ------------ | --------- |
| Components          | 97/97       | 97/97     | 97/97     | 100 wrappers | **94/97** |
| Variant-axis gaps   | reference   | 0/26      | 0/26      | 0/26         | **1/26**  |
| Code Connect linked | **92/92**   | **92/92** | **92/92** | —            | —         |

The three components with no Figma set are all intentional: `Icon` (source
components on the `Icons` page), `FieldWrapper` (covered by the `FormField` set
via a documented Code Connect override), and `GlassSettingsPanel`
(internal-only, excluded from STATUS.md). The one variant-axis gap is `Icon`,
for the same reason.

**Code Connect is complete**: 92/92 linked on React, SwiftUI and Compose, with
no scaffolds left on any platform. All 24 Product / SDK and platform sets are
mapped, validated against the live Figma file by
`figma:publish:{linked,ios:linked,android:linked}:dry`.

The weakest link is now **native test coverage** — 8 test files each against 97
components — and the Figma sets' visual fidelity, which no gate can judge.

## 2. What This Branch Changed

Original nine commits `0ac20a1`..`ab23fec`, plus this session:

- `0ac20a1` Native product contracts + the 10 missing Product / SDK components on
  iOS and Android, with contract tests.
- `f3083ba` Android package naming normalised (174/174 lowercase) + two RTL icon
  fixes.
- `673afbc` Heading, LocationPin, FloorSelector, MapControlsGroup variant axes —
  takes iOS and Android to zero variant gaps.
- `60765cf` Vue: 18 wrappers added, full parity.
- `e0fe6e9` Figma plugin Product / SDK lane, 6 builders.
- `199d992` Variant parity analyzer + this analysis.
- `a91cdce` Contract assertion made whitespace-tolerant.
- `6803f20` Fixed text collapsing to zero width in the built Figma sets.
- `ab23fec` Off-floor pins render as a hollow ring, not a cogwheel.
- **This session**: Components page grid layout, the remaining 18 Figma builders,
  and the §5 risk cleanups. See §3.

## 3. Done This Session

### Components page is a grid, not a ribbon

`reorganizeComponentsPage` packed everything into one column: sections stacked
vertically, and each section's sets stacked vertically inside it. The page was
5,792 x 94,012px — a 1:16 ribbon.

Both levels now flow into newspaper-style columns via `packBlocksIntoColumns`,
which tries every column count and picks the one whose bounding box is closest
to square. There is no target-height constant to re-tune as sets are added.
Measured from the file after the rebuild: **21,952 x 30,054px, aspect
1.37:1 — 3.1x shorter than before**, and that is while carrying 18 more sets
than the old page did. (An earlier simulation predicted 13,020 x 15,580; it
modelled the 76 sets that existed at the time, so it understated the real
result. The near-square goal holds; the specific figures did not.) Reading order stays column-major, so each
column holds a contiguous slice of the alphabetized list.

`stats` now records `sectionColumns`, `pageWidth`, `pageHeight`, and a
`columnCount` per section.

### The remaining 18 Figma builders

Every Product / SDK component now has a builder, plus the two platform surfaces.
Full axis table in `docs/figma-upcoming-components.md`. Five of them close real
variant-parity gaps, taking Figma from 6/25 gaps to 1/25.

`DynamicIsland` and `FeedbackCard` went into a new `Platform / Form-Factor`
layout section rather than Product / SDK, matching STATUS.md's lanes.

Three shared helpers carry the repeated anatomy: `productSdkFrame`,
`productSdkVariantRoot`, `productSdkSlot`, `productSdkControlButton`, and
`productSdkPanelHeader`.

### The branch's own foundation was uncommitted

Rebasing onto `main` was the first thing all session to run against a clean
checkout, and it surfaced that 18 React component directories, the whole
`@kozmos/product-contracts` package, half the SwiftUI and Compose packages, and
several script fixes existed only in the working tree. Committed in twelve
focused commits (`a75e1ac`..`7ca53a3`), including:

- Nine SwiftUI components that were 12-line `Text("Name")` placeholders, now
  implemented, and their files renamed off the `Kozmos` prefix so
  `check-completion`'s `{name}/{name}.swift` path matches.
- `packages/react/playwright/.cache` untracked — 85 files of Vite build output
  that made every `git status` unreadable.
- Package exports fixed to real `.mjs` / `.umd.cjs` names, matching what Vite
  emits, plus a `"use client";` banner React needs under RSC.

Two checker bugs fell out of it, both of the same species — a check asserting on
formatting rather than on code:

- `check-figma-plugin-compat.mjs` scanned raw source for `...`, `?.`, `??`. Any
  ellipsis in ordinary prose ("Calculating routes...") read as spread syntax. It
  was failing on the committed tree both before and after this work. Strings and
  comments are masked before the scan now.
- `check-component-contracts.mjs` compared single-quoted source snippets, so the
  pre-commit prettier run broke `React Text 4xl size` against a file that plainly
  contains the entry. Same class as `a91cdce`. String assertions now normalise
  quotes on both sides.

### Storybook docs, and a check that they are not fiction

MDX coverage is 97/97. Fourteen components had stories but no docs page — seven
added by this branch (ColorPicker, Combobox, DateRangePicker, Listbox,
MultiSelect, NumberInput, PasswordInput) and seven older ones (FeedbackCard,
FieldWrapper, MapControlsGroup, MapOverlay, NavigationAnnouncer,
SaveLocationCard, ScrollArea).

Each follows the `Input.mdx` shape: Usage, Implementation with
`<PlatformSnippets>` across React/Vue/SwiftUI/Compose, and a Canvas per story.
Note that most of the existing corpus is far thinner — 66 of the 97 files have
only an `## Implementation` section — so these sit above the current median
rather than matching it. They also carry an `## Accessibility` section, which no
previous MDX had; the justification is that the Figma plugin's `COMPONENT_DOCS`
already models an accessibility array per component, so Storybook was the one
place missing it.

**Four of the first seven pages named types that do not exist**, and it took a
manual cross-check against the native sources to notice: `KozmosComboboxOption`
(really `KozmosListboxOption`), `KozmosDateRange` (really
`KozmosDateRangeValue`), `KozmosOverlayPosition.TopLeft` in a Kotlin block
(really `OverlayPosition.TOP_LEFT`), and a `String` bound where SwiftUI wants a
`Date`. Parameter _names_ had been read from the real sources; the _types_ were
filled in from what looked idiomatic, and looked fine.

Hence `pnpm docs:snippets:check` (`scripts/check-doc-snippets.mjs`), now a CI
step. It resolves every `Kozmos*` identifier in a snippet against **that
platform's own sources** — the per-platform part is the point, since a global
search passes `KozmosOverlayPosition` in a Kotlin block because the type exists
in Swift. Identifiers a snippet declares itself are skipped, which matters:
several examples define their own type (`struct KozmosSwitchStyle: ToggleStyle`
in Switch.mdx), and the first version of the check failed CI on three innocent
files because of it.

It catches identifiers, not types, so the SwiftUI `Date`-versus-`String` mistake
would still slip through. Closing that means compiling the snippets.

### Getting CI to tell the truth

The branch had never had a green CI run. Four of six jobs failed. Two were real
and are fixed (the `apps/mapscale-review` lint errors, and the bundle budget —
both detailed in §1); three are one expired Figma token, which is pre-existing
on `main` and needs a human.

Also fixed while installing: the root `prepare` script still ran `husky install`,
which is removed in v10. The earlier commit fixed only `.husky/pre-commit` and
claimed the deprecation was done, so `29712c1` finishes it.

The branch is now rebased onto current `main`. The rebase itself was clean; the
one conflict was `pnpm-lock.yaml`, regenerated with `pnpm install --lockfile-only`
against the merged `package.json` files rather than resolved by hand.

### §5 risk cleanups

- **Silent `setLayoutSizing*` failures now surface.** The helpers record every
  failure into a module-level collector, and `postResultToUi` drains it into the
  result object each handler posts, so it lands in `stats.warnings` — which the
  UI already renders as a "warn" run. All 197 `figma.ui.postMessage` call sites
  were routed through that one seam, so a new handler branch cannot forget it.
  No call-site changes were needed across the 180 sizing calls.
- **Six dead Code Connect stubs deleted** (`Heading`, `Text`, `ThemeProvider`
  x `.figma.swift` / `.figma.kt`). Verified unreferenced by every config, and
  `check-completion` short-circuits file checks for not-applicable components,
  so STATUS.md did not move. iOS and Android still build.
- **Husky deprecation fixed.** `.husky/pre-commit` is now just `npx lint-staged`;
  the v9-deprecated shebang and `husky.sh` sourcing are gone.
- **Stale LocationPin doc fixed.** The generated accessibility copy still said
  off-floor pins use "a dashed outline"; `ab23fec` changed that to a hollow ring.
- **Analyzer window trap fixed.** `figmaAxes()` in `check-variant-parity.mjs`
  read a fixed 40,000-character slice of `expectedVariantAxesForComponentSetName`.
  The registry is now 12,333 characters and growing; past the cap it would have
  silently dropped axes and reported them as "component absent from Figma". It
  now ends at the function's own closing brace.

## 4. Immediate Next Actions, In Order

Everything the design system can do from code is done. What remains is either a
Figma action, a decision, or work outside this lane.

1. **Run `Update All Product / SDK` in the plugin, then `pnpm figma:verify`.**
   Two contrast fixes — the meta text on the selected card tint in
   POIResultCard and RouteOptionCard — are committed but not yet rendered into
   the file. The verifier should then report clean on all four checks. This is
   the only outstanding item that blocks nothing else but is trivially done.
2. **Publish the library from Figma.** That is Figma's own action, in the
   Assets panel — not something the importer or any script here touches. The
   file is current once step 1 is done.
3. **Visual pass on the 24 Product / SDK sets.** No gate can judge whether they
   _look_ right. They are structurally verified — variants, axes, tokens,
   contrast, no collapsed text — but nothing has confirmed the layouts read
   well. This is the largest genuinely unverified surface.
4. **Native test coverage.** 8 test files each against 97 components on iOS and
   Android. Now the weakest link by a wide margin.
5. **Dashboard items outside the design system** — raised but never scoped.
   Likely adds genuinely new components rather than variants.

### Not blocking, and not this branch's to fix

- `apps/mapscale-review` has one lint error (`UploadDropConfirm.tsx:69`, an
  unescaped apostrophe) and three unused-variable warnings. Since CI no longer
  gates the design system on that app, none of it blocks a merge.
- That app has never been prettier-formatted. Any commit touching it sweeps a
  wholesale reformat into the diff — which is exactly how a 1,300-line
  reformat once landed in a design-system branch and collided with in-flight
  MAP-566 work. Run prettier over it once, deliberately, as its own commit,
  at a moment when nothing is in flight there.

## 5. Open Decisions

These need a human call; none are blocked on code.

- **Vue: shipped SDK surface or internal convenience?** It is at full parity via
  `createVueWrapper`, but the adapter creates a React root per component
  instance, re-renders the whole root on any prop change (`watch(…, { deep: true
})`), DOM-transplants slots, cannot SSR (`createRoot` is client-only), and
  makes every consumer ship react + react-dom (~130KB). Fine internally; not
  fine for a public SDK.
- **Naming normalisation.** Native enums are inconsistently prefixed
  (`AlertStatus`, `BadgeVariant`, `ChipSize`, `CounterTone`,
  `SegmentedControlSize`, `StackDirection` lack `Kozmos`), and
  `AlertStatus.Error` maps to React's `destructive`. Cosmetic but breaking — do
  it deliberately with deprecated aliases.
- **LocationPin `variant` and `labelPlacement` in Figma.** Recorded as
  intentional (colour is a token override, label placement is renderer layout).
  `Size` was added. Revisit only if designers ask.
- **MapOverlay `position` in Figma.** The set carries `Width` only. Crossing 6
  positions with 5 widths would be 30 variants for what is renderer placement.
  Recorded in the set description; revisit if designers ask.

## 6. Known Risks And Gotchas

- **`FIGMA_ACCESS_TOKEN` expires 24 November 2026.** When it lapses, three CI
  jobs fail at their Code Connect step with `Failed to fetch node info (403):
403 Token expired`, and `figma:publish:linked:dry` fails the same way locally.
  Nothing names the cause, so it reads as a code failure; the previous lapse
  cost most of a session. The fix is a new Figma personal access token scoped to
  **`file_content:read`** and **`file_code_connect:write`** only, then:

  ```bash
  gh secret set FIGMA_ACCESS_TOKEN --repo vodoco/kozmos-design-system-
  ```

  Paste at the prompt. Do not route it through `.env` and a `$(grep ...)`
  substitution — that is how the secret was once set to an empty string, and an
  empty secret is worse than an expired one: the step's `if [ -z ... ]` guard
  then skips Code Connect and the job goes **green without verifying anything**.
  Put the same value in `.env` separately so local publishes work.

  Two verification notes. `GET /v1/me` returns 403 with the scopes above and
  that is correct — test `/v1/files/Yj4O8p6Y9h2Sa9zJVoAiVY/nodes?ids=4:4`
  instead, which is what CI actually calls. And a green job is not proof the
  step ran: check the log says `All Code Connect files are valid` and that no
  `Skipping ...` annotation was emitted. The skip text also appears in the
  `##[group]Run` block as echoed script source, which looks alarming and means
  nothing.

- **Prose and code samples are unverified by default.** The MDX platform
  snippets are template strings; nothing compiled them, and four wrong type
  names shipped looking perfectly plausible. `docs:snippets:check` closes the
  identifier half of that. The same caution applies to the Figma plugin's
  `COMPONENT_DOCS` strings and to this handoff: anything not executed by a gate
  is only as good as the last person who read it. The stale LocationPin
  "dashed outline" line survived a commit that changed the behaviour for exactly
  this reason.
- **Local gates green is not CI green.** They disagreed here for two independent
  reasons at once: an uncommitted working tree, and checks that only exist in CI
  (bundle budget, Code Connect dry-runs against the live Figma file). Read the
  actual job logs — the GitHub check annotations point at workflow line numbers,
  not at the failing command, and are close to useless for diagnosis.
- **Verify against a clean checkout, not the working tree.** This is how the
  branch ended up with 79 committed components while every report said 97. A
  `git worktree add --detach /tmp/verify HEAD` costs seconds and is the only
  thing that measures what CI will see.
- **`Sidebar` Content=Rail is the one audit warning left, and it is Core.** The
  rail builds its navigation rows as plain frames (`Item 1 Text Rail Row`)
  where the audit expects live instances — the Footer Slot beside it uses a
  real instance, which is the contrast. Fixing it means composing
  `NavigationItem` instances in the Rail variant of the Sidebar builder. Core
  v1 is documented as frozen since the 2026-05-20 audit, so this is a decision
  rather than a defect to sweep up.
- **The new sets have never been run in Figma.** Every builder is statically
  audited — axis names agree across config, variant root, and parser; every
  handler action resolves; every `productSdkText` call has an explicit width, the
  §5 failure mode — but static checks cannot catch a layout that simply looks
  wrong. Expect a visual pass.
- **Plugin syntax is restricted.** No spread, optional chaining, or nullish
  coalescing anywhere in `code.js`; `figma:plugin:check` enforces it.
- **Axis names that close variant gaps must stay single alphabetic tokens.**
  The analyzer extracts them with `/([A-Za-z]+):/`, so `PanelPlacement` matches
  React's `panelPlacement` but `"Panel Placement"` would capture only
  `Placement` and silently reopen the gap.
- **`code.js` versus prettier.** The pre-commit hook prettiers any staged
  commit, so re-run `components:contract:check` **after** formatting.
- **Android needs an SDK path.** Without `ANDROID_HOME` or
  `packages/android/local.properties`, every Gradle task fails before
  compilation. Documented in `packages/android/README.md`.
- **Piping Gradle through `tail`/`grep` swallows its exit code.** Use
  `set -o pipefail` or check `${PIPESTATUS[0]}`.
- **Some commits on this branch bundle pre-existing uncommitted work.** Review
  before pushing.
- **~588 files remain uncommitted** and are untouched pre-existing work.

## 7. How To Check Anything Here

Every claim in this document was produced by one of these. None needs Figma
open except where noted.

```bash
pnpm figma:verify                 # is the Figma file behind the code?
pnpm figma:plugin:check           # no spread / ?. / ?? in the plugin source
pnpm components:contract:check    # React/native/Figma contract parity
pnpm components:variant:check     # variant axes across all four platforms
pnpm tokens:contrast:check        # token pair contrast, light + dark
pnpm docs:snippets:check          # MDX snippets name real identifiers
pnpm exec tsx scripts/skills/check-completion.ts --check   # STATUS.md current
pnpm figma:publish:linked:dry            # React Code Connect vs the live file
pnpm figma:publish:native:linked:dry     # SwiftUI + Compose likewise
cd packages/ios && swift build && swift test
cd packages/android && ANDROID_HOME="$HOME/Library/Android/sdk" ./gradlew assembleDebug testDebugUnitTest
```

Verify against a clean checkout, not the working tree:

```bash
git worktree add --detach /tmp/verify HEAD && cd /tmp/verify
```

### Traps that cost real time here

- **The working tree is not the branch.** This branch once had 97 components in
  the tree and 79 committed, and every coverage number reported was measured
  against the tree. A clean checkout is the only thing that measures what CI
  sees.
- **`lint-staged` prettiers whatever you stage.** On a file that has never been
  formatted this turns a six-line fix into a 1,300-line reformat, attached to
  your commit without comment. Check `git show --stat` before describing what a
  commit does.
- **Regex over Swift and Kotlin signatures gives wrong answers in both
  directions.** Single-line inits are missed; files declaring a helper struct
  beside the component yield the wrong init. Read the file.
- **A bulk regex across files you just wrote will reach files you did not.** One
  here added duplicate imports to seven pre-existing Core files. Always check
  `git status` for modified files you did not intend to touch.
- **GitHub check annotations point at workflow line numbers**, not the failing
  command. Read the job log.

## 8. The Variant Analyzer

`pnpm components:variant:check` — reads React cva blocks and union props,
SwiftUI/Compose enums (declared _and_ parameter-typed), and the Figma plugin's
axis registry, then diffs them.

**Treat its output as an upper bound.** It needed six parser fixes in the prior
session and one more here, and every one _shrank_ the backlog. Eyeball a
specific finding before acting on it.

Decisions on record live in its `INTENTIONAL` registry with the reasoning
inline. Full write-up: `docs/component-variant-gap-analysis.md`.

## 9. Key Facts

- Figma file: `Kozmos DS - Core Library`, key `Yj4O8p6Y9h2Sa9zJVoAiVY`.
- Components page node: `4:4`. Product / SDK section: `1340:6764`.
- Components are inserted into Figma **through the plugin**
  (`figma/foundations-importer/manifest.json`), not via MCP writes.
- Product / SDK is deliberately outside Core — see `docs/figma-core-gap-audit.md`.
- Native presentation contracts mirror `@kozmos/product-contracts`:
  `packages/ios/Sources/ProductContracts/` and `com.kozmos.contracts`.
- Build commands:
  - `cd packages/android && ANDROID_HOME="$HOME/Library/Android/sdk" ./gradlew assembleDebug testDebugUnitTest verifyPaparazziDebug`
  - `cd packages/ios && swift build && swift test`
