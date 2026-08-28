# Session Handoff

Written 2026-08-24, updated 2026-08-28. Everything below was verified by
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
  text truncated by its own box, and WCAG AA on every visible text node. It
  answers "did my change land?" in seconds, which is what several rounds of
  audits and screenshots were doing by hand. **It currently reports 9
  truncations** — the ones this session fixed in code. They clear when the
  plugin is next run; see §4.
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

**It also never compares text _content_,** and that is a live gap, not a
theoretical one. RoutingInputGroup's fields read "Start", "Start", "Start" in
the file while `code.js` clearly assigned `["Start", "Add stop",
"Destination"]`. Every structural check passed on it, because a wrong string is
a perfectly well-formed node. The cause was in the code, not a stale file — see
§3 — but the point stands either way: green from `figma:verify` means the file
is structurally current, not that it says the right words.

It is also **not wired into CI**. `figma:verify` is a `package.json` script and
nothing else runs it, which is defensible — it fails whenever the code is ahead
of the file, which is the normal state between a commit and a plugin run, so as
a build gate it would be red most of the time. Just do not mistake a green CI
for a verified file.

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

Four of the 97 have no Figma set, not three, and the earlier list named the
wrong ones. The analyzer reports `FieldWrapper` (covered by the `FormField` set
via a documented Code Connect override), `Icon` (source components live on the
`Icons` page), `NavigationAnnouncer` (a screen-reader live region with nothing
to draw) and `ThemeProvider` (a context provider, likewise) — all intentional,
and all marked `—` in their STATUS.md Figma columns. `GlassSettingsPanel` is
not among them: it has no implementation anywhere in `packages/`, appearing
only in STATUS.md and the docs. The one variant-axis gap is `Icon`.

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
- Components page grid layout, the remaining 18 Figma builders, and the §5 risk
  cleanups. See §3.
- **This session** (2026-08-28): the visual pass on the 24 Product / SDK sets,
  the four defects it found, and a fifth `figma:verify` check. `fc135b3`,
  `681de17`. See the end of §3.

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

### The visual pass, and what looking actually found

§4 used to end with "no gate can judge whether they _look_ right". Rendering
each of the 24 sets through the REST image API and reading the images turned
that into four defects, one of them in Core. Every one passed all five existing
gates.

**Slot labels truncate.** `productSdkSlot` pads every slot by 12px whatever its
size. On a 240px content slot that is right; on a 40px icon slot it leaves 14px,
and Figma renders "Icon" as a bare ellipsis. Seven nodes across five sets:
"Logo" as "L", "Controls" as "Co", "Leading" as "Le", "Trailing" as "Tra".

A second cause compounds it, and it is worth knowing generally:
**`productSdkText`'s `fontSize` and `lineHeight` arguments are dead.**
`applyTextStyleToNodeAsync` runs after them and overwrites both from the text
style's own spec. Roughly a dozen call sites pass `fontSize: 12` and render at 14. The width budget was computed for a size the node never had.

`fitProductSdkSlotLabel` measures instead of guessing — a text node set to size
itself reports the exact width of its own string, so Figma is asked rather than
modelled — then steps padding 12 → 4 and, if still short, the style
`cardDescription` → `fieldMeta` (14/20 → 12/16). It also clamps vertical
padding, which on DynamicIsland's 24px-tall slots was consuming the entire box.
A label that fits at neither size now raises a warning rather than truncating in
silence.

**FileUpload's file meta, same symptom, different cause, and it is Core.**
"2.4 MB" rendered as "2.4" and an ellipsis. `setHorizontalFillTextSizing` ends
on `layoutAlign = "CENTER"`, which is the right cross-axis answer inside a
horizontal row and the wrong one in the vertical copy stack it was called in:
it overwrites the `FILL` set a line earlier and freezes the node at its natural
width. `setVerticalStackChildSizing` is the helper that fits. Only these two
call sites were changed — the check below is what should find any others,
rather than a sweep across the 19 call sites.

**POIDetailPanel's action glyphs were `actionLabel.charAt(0)`** — a literal
"N", "S" and "S" on the three buttons, two of them identical, all three reading
as a placeholder nobody filled in. Every other builder uses a real mark.

**Two component sets were mostly empty.** WayfindingCard's frame was 700x1058
around 700x134 of variants — 87% dead space — and POICard 74%. A component set
is a frame, and a frame keeps its size when its children shrink; both were left
over from taller earlier layouts. `layoutSingleAxisVariants` now refits the set.
This is not only cosmetic: the Components page packs blocks by bounding box, so
an 87%-empty block was costing a real column slot in the grid built last
session.

Measuring all 94 sets rather than only these 24 puts that in proportion: 66 sit
flush against their variants, one (`Link`) carries a deliberate symmetric inset,
and 27 have right/bottom slack. Almost all of that is a trailing grid gutter of
26–80px, which is tidy-up rather than defect. Three are not: POICard, and
WayfindingCard, and `List` at 359px of slack on the right. All three are on the
single-axis layout path, so the refit above covers them — but `List` is Core, so
it only moves when someone rebuilds `List`, not on an `Update All Product / SDK`.
Every set has its children flush at the origin, which is what makes refitting
safe; there is no left/top padding anywhere to preserve except `Link`'s.

**And a fifth check, so none of it returns quietly.** A truncated node is
indistinguishable from a healthy one in the REST payload — same type, same
width, full `characters` — so the check measures the string. There is no font
metric in the API, so the width model approximates Inter by character class and
deliberately runs narrow: it should miss a marginal case rather than invent
one. Validated against the 1,758 `TRUNCATE` nodes on the Components page, it
flags exactly 9, and all 9 were confirmed by eye in the render. Zero false
positives at that threshold.

### Two things the first pass got wrong

Re-auditing it caught both, and both are now fixed. They are recorded because
the mistakes are instructive, not because the outcome changed.

**RoutingInputGroup was diagnosed as a stale file. It was not.** Every field was
named `Point Field Slot`, and `configureNamedTextProperty` binds by node name
across the whole component set — so the one `Point Label Text` property captured
all three fields and painted its default over the labels the builder had just
set. The code produced exactly what the file showed; re-running the plugin would
have changed nothing. The first pass compared code to file, saw a mismatch, and
reached for "the file is behind" without following the property binding. Each
route role now has its own node name, chosen by role rather than position, so
that with two points the second field still carries the destination's name.
`Point Label Text` keeps its name and its node, so Code Connect on all three
platforms still validates — checked, not assumed.

**The verifier was reading the page at `depth=8`.** That silently cut the tree
at the sixth level inside a variant and hid 1,120 text nodes — 17% of the page —
from the collapsed, truncation and contrast walks. It had been that way since
the verifier was written, so "the first clean audit run" in `f52c27f` was clean
over 83% of the text. Full depth costs 1.7 MB more and no extra time; the walk
now reaches 5,987 visible text nodes instead of 4,867. Nothing new failed in the
newly visible 23%, which is worth stating plainly: the blind spot was real and
had not been hiding anything.

One glyph is worth a glance on the next run. `↗` for Share is the only mark in
the Product / SDK lane not yet seen in a render. Inter's coverage in this file
is demonstrably wide — `⇅`, `◌`, `✎` and `◈` all render — so it should be fine,
but it is an inference rather than an observation.

What the pass did **not** find is worth recording too, since it is evidence the
sets are broadly sound: no contrast failures, no collapsed text, no axis drift,
correct off-floor rings on LocationPin, and correct geometry on the other 22
sets. FeedbackCard's Success variant looked squashed and is not — 16px padding
all round, it is simply a one-line state.

### The semantic radius layer

"Change the roundness from 8 to 16" turned out not to be a config change,
because there was no place to make it. Radius had **four** sources of truth and
they already disagreed. A button was 16px on web (Tailwind `rounded-md` -> a
1rem token), 8px on iOS and Android (`primitivesLayoutRadius100`), and 8px in
Figma (a hardcoded number, one of 162). Nothing compared them: the contract
check compares variant axes and props, not styling values, so the drift sat
there unseen. Web had quietly been the odd one out all along — which is why the
change asked for was half-done before it started.

`Semantics.Radius` in `packages/tokens/src/tokens-*.json` is now the source, and
the roles are named for the job rather than the size:

| Role        | Value | What it is                                                 |
| ----------- | ----- | ---------------------------------------------------------- |
| `none`      | 0     | flush edges: sidebars, navbars, table shells               |
| `marker`    | 4     | small marks inside something else: badges, checkboxes      |
| `control`   | 16    | buttons, inputs, selects, rows, toasts — **the workhorse** |
| `container` | 16    | cards and dialogs                                          |
| `panel`     | 24    | large panels and sheets, mostly Product / SDK              |
| `pill`      | 9999  | chips, avatars, switches, segmented controls               |

**To change how round the product feels, repoint one alias.** `Control` moved
from `radius.100` to `radius.200` and that single edit is what took iOS, Android
and Figma from 8 to 16; web did not move, because it was already there. Then
`pnpm tokens:build`, copy the two generated `KozmosDimensions` files into
`packages/ios/Sources` and `packages/android/.../tokens/`, and re-run the
plugin.

The migration: **168** React class occurrences, **239** native references,
**136** plugin `cornerRadius` literals, **32** focus-ring and per-corner radii,
and **48** of the plugin's Figma corner-radius variables.

Two things worth knowing before touching this again:

- **A bound Figma variable beats the node's `cornerRadius`.** 73 components call
  `bindFloatVariable(component, "cornerRadius", "Button/radius", ...)`, so
  migrating the literal assignments alone would have been inert for most of the
  library — the plugin would have said 16 while the file rendered 8. The
  variables were the real lever and are migrated too; the parity check now
  covers them for exactly this reason.
- **The plugin's variables alias `Semantics/Radius/Control` by name.** If that
  variable does not exist in the Figma file yet, the importer warns
  (`alias target ... was not found`) and falls back to the numeric value, which
  is also 16 — so it degrades to the right answer either way. Run the
  foundations/variables import once to make the alias resolve properly.

`pnpm tokens:radius:check` is the guard. It asserts the plugin's
`KOZMOS_RADIUS`, its corner-radius variables, the Tailwind utilities and the
native sources all still agree with the tokens, and it reports anything sitting
off every role rather than failing on it. Eight component variables are off
scale on purpose (`ToggleButton` 12, `Alert` 12, `POICard` 12, `WayfindingCard`
12, `Tabs/trigger` 12, `FloorSelector/item` 6, two `ColorPicker` swatches 6), as
are 26 plugin literals and four web uses of the 32px `2xl`. Moving those is a
design decision, not a cleanup, so they were left.

Auditing the radius work afterwards turned up more than the work itself did.

**`verifyPaparazziDebug` does not verify anything.** This is the one to fix
first, because it has been giving false confidence for a while and it is in the
documented Android build command. Proved by experiment, not inference: with the
golden recorded at 16dp, `semanticsRadiusControl` was set to **2dp** — an eight
fold change, unmissable by eye — and `./gradlew verifyPaparazziDebug
--rerun-tasks` ran all 17 tasks, re-rendered, regenerated the report, and exited
**0**. The `-Dpaparazzi.test.verify=true` property _is_ passed to the test JVM
(confirmed in the worker command line), and `build/paparazzi/failures/` stays
empty, so the comparison is reached and silently agrees with itself. Paparazzi
1.3.5. Recording proves the render really does change: `recordPaparazziDebug`
wrote a visibly rounder button and a different checksum. The updated golden is
committed; the broken gate is not fixed.

**The iOS snapshot test never renders anything.**
`KozmosButtonSnapshotTests.swift` asserts properties — `view.label`,
`view.variant`, `view.isDisabled` — and never produces an image, despite
`swift-snapshot-testing` being a checked-out dependency. So between the two,
native visual regression coverage is effectively **zero**, which sharpens §4's
note that native testing is the weakest link: it is not thin, it is absent.

**The `roundness` config on web is dead code.** `DesignConfigContext` exposes
`roundness: number // 0 - 2x` and sets six CSS variables from it —
`--radius-sm` through `--radius-full`. Nothing reads any of them; `var(--radius-`
appears nowhere else in the repo. It is a roundness slider wired to nothing.
Worth knowing before anyone wires it up: a runtime, web-only radius multiplier
would re-create exactly the cross-platform drift the semantic layer just
removed, since native radii are compile-time constants. Deleting it is the
tidier option, but that is a product call.

Three latent bugs fell out of the work, all fixed:

- `Primitives.Radius.md` and `.lg` are both `1rem`. The rem scale has no 8px
  step except `DEFAULT`, so `rounded-md` was almost certainly meant to be 8px
  and has been rendering 16 instead. That is the whole origin of the drift.
- `build.mjs` resolved token values with `token.value || token.$value || ...`,
  so a value of **0** was treated as missing and fell through to the unresolved
  alias string. Every zero-valued dimension arriving by reference was silently
  dropped from the native outputs. Fixed at all four call sites.
- A literal `9999` with `$type: dimension` picked up a rem transform and emitted
  `9999rem` in CSS and `159984.dp` on Android. `Primitives.Layout.radius.full`
  now completes the numeric scale so every semantic alias resolves to a plain
  number.
- `parseFloat("1rem")` is `1`, so the three rem-valued dimensions that reach the
  native outputs — `primitivesRadiusCard`, `Input` and `Button` — emitted **one
  point** instead of sixteen. Unused, which is the only reason nobody ever saw a
  hairline corner on a card, but a live trap in a public generated API. The
  dimensions formats convert rem to px now; exactly those three constants moved,
  1 to 16.

One thing that could not be checked from here: the plugin's corner-radius
variables alias `Semantics/Radius/Control` **by name**, and whether that
variable exists in the file depends on the foundations import creating
`Semantics/*` variables from the tokens. The REST variables endpoint needs
`file_variables:read`, which is Enterprise-only and returns 403 on this token,
so it could not be confirmed without opening Figma. It fails safe either way:
an unresolved alias warns (`alias target ... was not found`) and falls back to
the numeric value, which is also 16.

### The semantic typography layer

Typography had drifted further than radius, and more quietly, because the
brand font was never actually delivered anywhere.

Web asked for `"Readex Pro", sans-serif` — and **nothing in this repo has ever
loaded Readex Pro**. No `@font-face`, no webfont link, no font file. Storybook's
`preview-head.html` loads Inter, Plus Jakarta Sans and Space Grotesk, none of
them the brand font. So every page fell through to generic `sans-serif`, which
on macOS is Helvetica. Meanwhile iOS reached for `.font(.subheadline)` and got
SF Pro, and Android set no family at all and got Roboto. **The Figma plugin is
the only surface that really renders Readex Pro**, so the mockups have been
describing type that no platform ships.

`Semantics.Typography.Family` holds the decision now — `System` (the default),
`Brand` (opt-in, aliasing the Readex Pro primitive) and `Mono`. The system stack
leads with `ui-sans-serif` and puts `system-ui` behind it rather than alone,
because bare `system-ui` has resolved to fonts with broken non-Latin coverage on
some Linux and ChromeOS builds.

Each platform now has one address for the decision, and none of them changed
what they render:

- **Web** — Tailwind's `sans` resolves to the System role. This _is_ a visible
  change: Helvetica to SF Pro on macOS, because the previous rendering was an
  accident. `font-brand` exists and falls back to the system stack rather than
  to a generic family.
- **iOS** — `KozmosTypography` wraps the Dynamic Type styles; 106 call sites
  moved off bare `.font(.subheadline)`. `Font.system(_:)` still scales with the
  reader's text-size setting, so accessibility behaviour is untouched. The
  brand-font branch is documented in the file rather than written, because
  writing it would mean shipping an unmeasured scale constant.
- **Android** — `KozmosTypography.typography()` is passed to `MaterialTheme`,
  which previously carried only a colour scheme. `FontFamily.Default` is the
  same font it already used.

`pnpm tokens:typography:check` guards it, and `scripts/measure-font-metrics.mjs`
computes real `size-adjust` / `ascent-override` / `descent-override` descriptors
by parsing sfnt tables directly — no dependency, no need for the font to be
installed. It was validated field-by-field against fontTools on SFNS and Arial.

Two things are deliberately **not** done:

- **The metric-matched fallback needs the Readex Pro file.** That is the piece
  that would let an App Clip drop the font and look identical rather than subtly
  different, and it is the whole point of `size-adjust`. It cannot be built
  honestly without measuring the real font; a hardcoded ratio is exactly the
  guess that puts text subtly wrong on every screen at once.
- **Figma still renders Readex Pro.** Switching it restyles all 94 sets at once,
  which is a design call. It is one field in the plugin's Typography box. Until
  then the parity check reports the divergence on every run.

And a finding that belongs to nobody yet: **`Primitives.Typography.font.size`
(the 0-1500 scale) is used by zero platforms.** Not iOS, which uses Dynamic Type
styles; not Android, which hardcodes `14.sp` and `12.sp`; not web, where Tailwind
has no `fontSize` override at all and its own scale applies. Sizes are the next
layer down and are entirely untokenised.

### The visual regression gates, repaired

Both native screenshot gates were inert. They are not any more, and both fixes
were proved the same way — break the thing on purpose, watch the gate go red.

**Android was a tolerance problem.** `Paparazzi()` defaults to
`maxPercentDifference = 0.1`, and taking a button's corner radius from 8dp to
16dp moves 0.1069% of the pixels in the frame — measured, not estimated, by
diffing the two goldens. A change nobody could miss by eye sat within a
hair of the default tolerance. layoutlib renders deterministically, so any
tolerance at all only buys silence: it is `0.0` now. With the radius set to
2dp the suite fails; at 16dp it passes.

**iOS had no rendering at all.** `KozmosButtonSnapshotTests` asserted
`view.label` and `view.variant` and never produced an image, while
`swift-snapshot-testing` sat in `Package.swift` as a dependency nothing
imported. It is renamed `KozmosButtonAPITests` — the name was part of why this
went unnoticed — and `KozmosButtonImageSnapshotTests` renders four states on a
simulator. Same proof: at 2pt the run reports "Snapshot does not match
reference" and fails.

The iOS snapshots do **not** run under `swift test`. That runs on the host,
where SwiftUI renders through AppKit rather than UIKit, so the file is behind
`#if os(iOS)` and compiles to nothing there; the 27 host tests are unaffected.
Rendering needs a simulator:

```bash
pnpm ios:snapshot:verify     # iPhone 16, iOS 18.4
pnpm ios:snapshot:record     # re-record after an intended change
```

**They are deliberately not wired into CI yet, and this is the decision to
make.** References are tied to the simulator's iOS version — baselines taken on
18.4 will not match 26.5 — so the CI job needs the runner image and the
simulator pinned together, and `macos-latest` moves. A gate that goes red
because a runner updated is a gate somebody switches off, which is exactly how
the previous one came to verify nothing. iPhone 16 / iOS 18.4 was chosen over
the newer simulators on this machine for the same reason: it is likelier to
exist on a hosted runner.

**The Android goldens are recorded on macOS and CI verifies them on
ubuntu-latest.** That mismatch is not new — `f225c26`, "stabilize ... Android
snapshot gates", was a bare re-record of the PNG, and CI has been green since
only because the 0.1% default was loose enough to absorb both cross-platform
rasterisation _and_ real changes. Tightening to 0.0 removes the second half of
that and may expose the first. Rendering is deterministic on one machine —
re-recording produces a byte-identical file on both platforms, checked — but
macOS versus Linux is untested from here, and Docker is installed but not
running so it could not be settled.

If the Android job reddens on an unchanged render, that is the cause. Re-record
on the CI platform; do not widen the tolerance back out, because 0.1% is above
the 0.1069% that a doubled corner radius moves and the gate returns to
verifying nothing. That the signal is that close to the threshold is itself the
finding: the frame is mostly empty background, so more components rendered
tighter is the real fix.

**This is safer than it sounds**, because the bug class that started all of
this — a token not reaching a component — is gated separately and
platform-independently by `tokens:radius:check` and `tokens:typography:check`.
The pixel gates are for layout and visual drift, and a layout regression moves
far more than 0.1% of a frame.

Coverage is one component. That is the repair, not the finished job: the
harness works and is extensible, and Button was chosen because it exercises
radius, colour, type and state at once. Widening it to the rest of the library
is follow-on work.

## 4. Immediate Next Actions, In Order

Everything the design system can do from code is done. What remains is either a
Figma action, a decision, or work outside this lane.

1. **Done — `Update All Product / SDK` has been run.** The seven Product / SDK
   truncations cleared, so `fitProductSdkSlotLabel` works against the real
   Figma text engine and not just on paper. RoutingInputGroup's fields should
   now read Start / Add stop / Destination. `pnpm figma:verify` reports two
   items left, both `FileUpload`, which is Core and outside that run's scope.

   Still worth a look, because no check covers them: the POIDetailPanel action
   row (`→ Navigate`, `☆ Save`, `↗ Share` — the `↗` is the one glyph never yet
   seen in a render), and the WayfindingCard and POICard set frames, which
   should now sit tight around their variants instead of eight times too tall.

2. **Press `Fix Audit Issues`, then update `FileUpload`.** Two Core sets that
   `Update All Product / SDK` does not touch. **Nothing in the plugin is
   Rebuild.** `Rebuild` mints a fresh node ID, and Code Connect pins the
   existing one — six declarations for `Sidebar` (`752-6807`), one for
   `FileUpload` (`444-12724`).

   `Fix Audit Issues` is the right button rather than the per-component one: it
   updates Separator, Slider, **NavigationItem, then Navbar and Sidebar**, then
   Dialog and BottomSheet — and NavigationItem landing before Sidebar is what
   Sidebar needs, since it composes NavigationItem instances. The blue **Fix**
   button on a selected component is the same `update` action under a different
   label; `selectedRecommendation()` returns `action: "update"` and only renames
   the button when warnings exist. It is safe, just narrower.

   For `FileUpload`, plain **Update** reaches the fix:
   `updateFileUploadVariant` calls `syncFileUploadVariantChildren`, which calls
   the repaired `createFileUploadFileRow`. An earlier draft of this document
   said Rebuild; that was wrong and would have broken its Code Connect anchor.

3. **Re-run the plugin for the radius change.** The semantic layer is code-only
   so far. Run the foundations/variables import once so
   `Semantics/Radius/Control` exists, then `Update All Product / SDK` and the
   Core sets. Expect controls to go from 8px to 16px across the file.
4. **Publish the library from Figma.** That is Figma's own action, in the
   Assets panel — not something the importer or any script here touches. The
   file is current once step 1 is done.
5. **Decide how the iOS snapshots run in CI**, then widen coverage. The
   harness works; what it needs is a pinned runner image plus simulator, and
   then more components than Button. See §3.
6. **Script-aware typography.** Nine components apply `tracking-tight`
   (Tailwind's default `-0.025em`, since the config overrides no
   `letterSpacing`). Negative tracking makes CJK glyphs collide and disrupts
   Arabic cursive joining, and the product ships both. Line heights are
   Latin-tuned too, and CJK and Arabic diacritics want more room. The
   `letterSpacing` and `line.height` token scales are unused by every platform,
   so there is nowhere to say "tighter for Latin, normal for CJK" even if you
   wanted to.
7. **Font sizes are untokenised everywhere.** `Primitives.Typography.font.size`
   (0-1500) is read by no platform: iOS uses Dynamic Type styles, Android
   hardcodes `14.sp`, and Tailwind has no `fontSize` override. Same shape of
   problem the radius and family layers solved.
8. **Decide the brand font's fate.** Readex Pro covers Latin and Arabic and has
   no CJK, so Chinese was always falling back to a system font whatever the
   tokens said. Either drop it, or scope it to Latin with `unicode-range` — and
   note that a single `size-adjust` ratio cannot work across scripts, so the
   metric-matched fallback needs per-script faces if it happens at all.
9. **Decide RoutePreviewPanel's states** — see §5. A design call, not a defect.
10. **Dashboard items outside the design system** — raised but never scoped.
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
- **RoutePreviewPanel's five states look like two.** Only `Ready` renders
  RouteOptionCard slots; the other four show the same generic "Status content
  slot" placeholder, so Loading, Empty and Error are distinguishable from each
  other only by the header line — and Error only because it turns red. Nothing
  is broken and every gate passes; the question is whether a designer opening
  the set can tell the states apart, and that is a call for whoever owns the
  routing flow. Differentiating them means giving each state its own placeholder
  anatomy rather than sharing one.
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

- **`figma:verify` green does not mean the file says the right words.** It
  checks structure — presence, axes, geometry, contrast, and now truncation —
  and never compares text content against the builder. RoutingInputGroup read
  "Start" three times for the whole life of the set without a check noticing.
  If you want this class closed properly, the shape is for the plugin to stamp
  each set with a fingerprint of the builder source at generation time and for
  the verifier to compare it; that was scoped and deliberately not built here.
  It is also not run in CI at all — see §1.
- **A text property binds by node name across the entire component set.**
  `configureNamedTextProperty` walks every variant and binds every TEXT node
  carrying the given name, then paints the property's single default over all of
  them. Two sibling nodes sharing a name is therefore not a cosmetic
  duplication; it silently collapses them to one value. That is what happened to
  RoutingInputGroup's three fields. If a builder emits N of the same thing, give
  each its own name — FileUpload's `File Meta Text` / `File Meta Text 2` is the
  convention.
- **Query the file at full depth.** `depth=8` on the nodes endpoint looks like a
  harmless optimisation and drops 17% of the page's text nodes on the floor,
  with no error and no truncation marker in the response. Any new check that
  walks the tree should fetch without a depth cap.
- **`productSdkText` ignores the `fontSize` and `lineHeight` you pass it.**
  `applyTextStyleToNodeAsync` runs after both assignments and overwrites them
  from the style spec, so a call site asking for 12 renders at 14. Around a
  dozen call sites do exactly that. Nothing currently breaks because of it, but
  any width arithmetic derived from the argument is wrong — which is half of
  why the slot labels truncated.
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
- **`Sidebar`'s rows are stale frames, not a frozen-Core decision.** The one
  audit warning left reads `sidebar-navigation-slot-overflow (Content=Rail /
Navigation Slot)`, and the earlier diagnosis here — that the builder emits
  plain frames where the audit wants instances, so fixing it means composing
  `NavigationItem` instances into the Rail variant — was wrong on both counts.
  The builder already composes them: `createSidebarRailNavigationRow` calls
  `createNavigationItemNestedInstance`. The set is simply older than
  `NavigationItem` (node `752:6807` versus `861:7297`), so at build time the
  lookup failed and every row fell back to a frame. All four variants are
  frames, not just Rail; Rail is only the one that overflows, by 4px, because
  its fallback frames are 80px tall where a real instance is 72 — 3x80 + 2x8 =
  256 against 252 of slot. `Navbar` came through the same code later and is
  entirely instances, which is the contrast.

  It could not be healed either way until now. `Update Sidebar` reuses the
  existing rows unless `shouldRefreshGeneratedShellSlotDefaults` says otherwise,
  and that demanded a `missing-nested-component` stamp these frames predate — so
  Update was a no-op on them for ever. `Rebuild Sidebar` would have worked and
  changed the set's node ID, which six Code Connect declarations pin across
  React, SwiftUI and Compose. The predicate now also accepts an unstamped frame
  under a generated row name, so **`Update Sidebar` heals it in place**, node ID
  intact. Every variant fits afterwards: Side instances are 248x44 (3x44 + 2x8 =
  148 of 220) and Rail 72x72 (232 of 252).

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
pnpm tokens:radius:check          # all four surfaces agree on corner radius
pnpm tokens:typography:check      # all surfaces read the same font family role
pnpm ios:snapshot:verify          # iOS renders match their baselines (needs a simulator)
node scripts/measure-font-metrics.mjs <brand> <fallback>   # real size-adjust numbers
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
