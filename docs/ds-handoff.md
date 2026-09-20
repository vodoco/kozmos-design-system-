# Kozmos design system — handoff for the next session

Written 2026-09-13, refreshed 2026-09-17 after #45 to #51 merged, and re-measured the same day for
the switch to ChatGPT Astra (§10). It carries the verified facts of the 2026-09-12 to 2026-09-15
versions forward; every number here was read from the repo, GitHub, npm, the Figma REST API or a
rendered build on 2026-09-17 by the command shown beside it, unless marked "last measured".

## 0 · Start here

**Taxonomy integration, 2026-09-18:** read `poi-taxonomy-display-2026-09-18.md`
for the pinned 10.12.0 property/value icon adapter, ordering, null/false/zero rules,
dark-mode asset handling, and upstream schema/color conflicts. The adapter is an
example, not a validated live SDK parser. Rating and opening-hours object schemas
remain undefined by that taxonomy. No push/merge/npm.

**POI follow-up review, 2026-09-18:** read
`poi-reference-review-2026-09-18.md` for fixes, verification and self-service
editing instructions. Eleven examples now include retail, fitness, parking and
the full-field catalogue. Gallery state/geometry, failed logos and selection
scroll have dedicated regression coverage. Use the current report's evidence,
not historical counts below. Real assets, SDK adapter and device acceptance
remain separate requirements. No push/merge/npm.

**SDK screenshot examples, 2026-09-18:** read
poi-reference-examples-2026-09-18.md. Restaurant/entrance references now use
one richer POIDetailPanel, additive detail contracts and explicit optional
book/call capabilities. The initial seven stories cover normal, sparse, map-shell and failure
states. The screenshots do not provide real media or gesture specifications;
no real map, routing or external actions are claimed. Remaining venue fixtures
were completed in the follow-up above; real SDK integration is still next. No push/merge/npm.

**Installed-product continuation, 2026-09-18:** read
`installed-product-pilot-2026-09-18.md`. The existing MapScale Review app is now
checked from isolated installed tarballs, with strict library checks, its 680
geometry checks and offline signed-out browser coverage. This found an obsolete
`Button asChild` use, incompatible Lucide/React types, and typography being
overridden by scoped CSS. Links use `buttonVariants`, the product's Lucide pin
matches Kozmos, preflight has zero specificity and Text/Heading use owned CSS.
No product-specific CSS patch. This is **not authenticated product acceptance**;
the end-user search-to-routing module is not in this checkout and still needs an
identified repository/adapter and controlled test environment. No push/merge/npm.

**Executable React recipes, 2026-09-18:** read
`snippet-validation-2026-09-18.md` for the next release-gate slice. All 82 displayed
React recipes now compile unchanged against installed tarballs on React 18 and 19,
with strict NodeNext and library checking enabled. The gate is part of
`packages:install:check` in CI; `docs:snippets:compile` runs the same gate locally.
Negative controls verify missing exports, invalid props and undeclared state fail.
This supersedes earlier claims that no Docs snippets compile, **only for React**.
The 80 Vue and 162 native snippets remain uncompiled references; 17 component Docs
pages have no PlatformSnippets recipe. Neither compilation nor this inventory
establishes platform parity, runtime correctness or production readiness. No push,
merge or npm publish.

**Responsive/Docs recheck, 2026-09-18:** read
`production-readiness-recheck-2026-09-18.md` first, then
`public-catalogue-guide-2026-09-18.md`. This supersedes older preview/test counts
below. The public catalogue no longer depends on the private Vue harness; code
tabs are styled and support limitations explicit. The recheck repairs narrow
Navbar action loss, the blank MapSearch example, POI overlap, Docs overflow/live
preview gaps, marker IDs/reduced motion, and the audit gate's async coverage gap.
Navbar now grows beyond its 64px minimum instead of hiding essential actions.
React has 436 passing tests; all 99 Docs pages fit 320/1280px and all 164 snippet
section/viewport checks are required. Publishing remains blocked on the explicit
manual, product, platform and release gates in the new report. Shared main stays
untouched; no push/merge/npm publication is part of this work.

**npm foundations continuation, 2026-09-18:** read `npm-foundations-2026-09-18.md`
first. The three package declaration-format problems are resolved (`44712b0`); the tarball
gate now enforces zero and checks strict ESM/CJS Node consumers on React 18/19.
Token opacity now compiles (zero inert slash-class uses), and DatePicker,
DateRangePicker and TimePicker are complete owned-CSS compositions. React has
430 passing tests across 111 files; the 944-case story scan and 336 cross-engine
interaction audits pass. The unchanged 48-case manual-review queue is not a pass.
The CSS batches are `3d577e5` and `767b3be`; the latter fixes a legacy initializer
overwriting owned transforms, caught by final visual inspection. The independent
6006 preview runs `767b3be`. The current guide includes restart/build precautions.
This supersedes older statements that those three problems remain. CSS migration
and manual/product acceptance are still release work; nothing published or pushed.

**Overnight quality pass, 2026-09-18:** read
`overnight-quality-pass-2026-09-18.md` first. Olcay asked for another extensive pass
and local commits while away. Select's previously exposed modal accessibility
blocker is fixed with explicit inert-state ownership (`598b0b8`); emotional button
contrast is repaired in canonical tokens and native copies (`10cbfb8`). The wider
continuation covers accessibility, keyboard scrolling, responsive layouts and
all 236 React stories. Storybook's source/built-provider context split is corrected
(`a2cefbe`); manual-review findings led to range-label, warning-contrast and POI
description fixes (`bbeddcf`). React now has 425 passing tests. The guide records the final verification state and exact
maintenance commands. Older continuation notes below are historical, not the
current release verdict. Shared main is untouched; no overnight push/merge/npm.

**Screenshot audit continuation, 2026-09-17:** read
`storybook-screenshot-audit-2026-09-17.md` first for the newest local batch on
`astra/browser-compatibility`. Fixes cover active option contrast, selection ARIA
and read-only/focus behavior, empty-result semantics, Listbox scrolling, native
upload activation/long filenames, truthful Label examples and responsive/themed
Storybook. React: 409 tests/108 files; screenshot matrix: 108 cases across three
engines. The hardened accessibility smoke now FAILS for Select's
`aria-hidden-focus` condition, previously suppressed. **Not release-ready; do not
waive this gate.** The guide records source paths, exact commands, migration notes,
unfixed debt and the next implementation order. No push, merge or npm publication.

**Component-owned CSS continuation, 2026-09-17:** Olcay approved the recommendation
to replace mandatory native scope (ruling 26). The first slice migrates Input,
Textarea, Button, Popover, FieldWrapper, Label, PasswordInput and NumberInput;
token definitions/keyframes are
outside scope. Read `component-owned-css-2026-09-17.md` for the source map, migration,
verification and outstanding work. The original form gate is retained, not waived.
Only these slices are migrated; the whole library is not ready for npm. Button's
non-functional `asChild` declaration is now removed: use native buttons for actions
and links for navigation. Input/Textarea/PasswordInput/NumberInput accessibility
descriptions and invalid-state merging are fixed. React Storybook is served from
the separate verification worktree on port 6006; the guide explains safe rebuilds.

**Earlier browser compatibility investigation, 2026-09-17:** release safeguards were pushed
in PR #54 (not merged). The separate local `astra/browser-compatibility` branch is
based on merged foundations `040f53d`, worktree `/private/tmp/kozmos-browser-compat.uqPMBD`.
Read `browser-compatibility-2026-09-17.md`: actual packaged Input/Textarea controls
fail scoped styling on the installed WebKit 26.0. Earlier geometry/theme tests did
not cover them. At investigation commit `f8eb957` the added gate deliberately failed;
the implementation continuation above addresses that failure.
Chromium 145 and Firefox 146 pass the form fixture; the launcher now really selects
Firefox and rejects unknown names. Minimum-engine certification remains release
work; ruling 26 supersedes the earlier pending architecture choice. The baseline
investigation itself changed no production styles.

**Agent switch, 2026-09-17.** Development moved from Claude Code to ChatGPT Astra at `a02a008`.
Whoever picks the work up next reads `docs/agent-switch-2026-09-17.md` first: its §1 to §5 hand the
work to Astra, §6 is the handback Astra leaves before switching back, and §7 is what Claude checks on
return.

**Astra continuation, 2026-09-17:** Olcay approved the pre-publication architecture recommendations
(ruling 24). Local branch `astra/prepublish-foundations`, based on the switch handoff at `c274b06`,
contains the first React adaptive-layout batch. Read `docs/adaptive-map-layout.md` and the new
§10 entry before continuing. This is not on shared `main`; nothing has been pushed or published.
The follow-up audit fixed four adaptive defect classes and added explicit `portalContainer`
support to the overlay primitives; see `foundation-audit-2026-09-17.md`. The next batch implements
module-owned ThemeProvider state, automatic overlay ownership and scoped CSS with an opt-in
global reset; see `embedding-isolation.md`. Its native CSS `@scope` browser/WebView support floor
is **not yet approved**. KozmosTheme/DesignConfigProvider now share the scoped provider machinery;
see the runtime-configuration continuation in `embedding-isolation.md`, including migration and
deprecated experimental controls. Next are native adaptive parity and real map-adapter proof.
The SDK composition loop remains part of
validation, not replaced by counts. Nothing in this local work authorizes an npm release.

Paste this as the first message of the new chat:

> Continue the Kozmos design system work. Read `docs/ds-handoff.md` first — it holds the scope, the
> priorities in order and the measured state. Then `docs/ds-scope-2026-09-12.md` (what is missing)
> and `docs/style-playbook.md` (how to change how it looks). The subject is the design system only:
> the packages under `packages/`, the Figma Core Library and its plugin, the checks, the docs.
> MAP-595 and `apps/mapscale-review` are parked — do not work on them unless asked in so many words.
> The work now is §11: Olcay shares the SDK's current components, and each one is rebuilt as an
> example using Kozmos components only. Where that cannot be done, it is reported and asked about,
> never worked around. Two components are done: the POI card (§11.1) and the map mode toggle
> (§11.3). #47, #48 and #49 have all merged. The next piece of work
> is the next SDK component, which needs Olcay to name one, or the queue in §6.3. §4.1 and §4.2 are
> done; read §11 first, then §4.3.

Read order: this file → `docs/ds-scope-2026-09-12.md` → `docs/style-playbook.md` →
`docs/gap-audit-2026-09-05.md` → the memory files named in §8, which are Claude's and live outside
the repository (`docs/agent-switch-2026-09-17.md` §4). `docs/session-handoff.md` is the long
record (1,640 lines, to 2026-09-10); read its §3 only for the reasoning behind a specific decision.

## 1 · The scope, in Olcay's words

> "This is all about kozmos design system. I don't want to drift other than the design system. Our
> priority should be tidying up, scanning current product UI, make sure design system satisfies
> all, completing missing parts, getting ready for npm publish."

So, in order: **tidy up → scan the current product UI → make the system satisfy all of it →
complete the missing parts → get ready for npm publish.** §4 turns each into a plan with a measured
starting point.

**In scope:** `packages/react`, `packages/tokens`, `packages/icons`, `packages/vue`,
`packages/product-contracts`, `packages/ios`, `packages/android`; `figma/foundations-importer` (the
plugin that paints the Figma library); the Figma file `Kozmos DS - Core Library`
(`Yj4O8p6Y9h2Sa9zJVoAiVY`); `scripts/check-*.mjs` and the other gates; `apps/docs` (Storybook); the
playgrounds only as consumers that prove the packages install.

**Out of scope until asked in so many words:** MAP-595 (the Map Content editing stories and their
Figma file `nm6qdzaC9B1lknllbwaMTh` — parked, §9), `apps/mapscale-review` (the MAP-595 prototype),
PR #17's iOS map-panel sheet and `apps/Playground.swiftpm`, and any product screen work that is not
"does the design system cover this".

## 2 · How Olcay works

- The standing instruction, repeated most turns:
  > "Once more, please analyse extensively to see if anything is overlooked, missed, mis-implemented
  > or could have done better. No hacks - no cheats - do it propertly and perfectly. Otherwise
  > please proceed with your recommendation. Provide me everything I'd need if I need to make
  > changes myself. But remember you have CLI access. I don't want to miss anything"
- **Verify by measuring, never assert from memory** — the command beside every number.
- An adversarial self-audit before "done". Mistakes stated plainly, including your own.
- Decisions as short multiple-choice questions, the recommended option first. "Proceed with your
  recommendation" applies every recommended option, including a PR edit the recommendation named.
- Pushes, PR edits and merges only on a go-ahead ("push the branch"). Commits when asked ("commit
  the docs") or as the natural end of a "proceed".
- When a look cannot be explained by anything the API can read, **ask before changing it** — a
  section Olcay had dimmed on purpose was nearly "fixed" on 2026-09-13 (§8).
- A handoff a new chat can start from, whenever the session ends.

## 3 · The system today — measured 2026-09-17

The table below is the **Claude handover baseline**, not the state of Astra's local feature branch.
For the latter, React now has 360 passing tests in 104 files, and fourteen adaptive checks pass
in each of Chromium and WebKit (`pnpm --filter @kozmos/react test`, `pnpm test:adaptive`,
`ADAPTIVE_BROWSER=webkit pnpm test:adaptive`). Fourteen overlay checks (seven components, default
and explicit containers) also pass per engine (`pnpm test:overlays`, with the same browser selector).
Native/Figma numbers below were not re-measured in
this implementation batch. The worktree is `/private/tmp/kozmos-astra-review.hwXbrb`; shared
`main` at `/Volumes/4TB Depo/development/K/kozmos-design-system-dev` remains clean at `a02a008`.

| Thing            | State                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `origin/main`    | `a02a008`, followed only by the switch handoff's merge — every PR through #51 merged (`git log --oneline a02a008..origin/main`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Open PRs         | **none** besides the switch handoff's own, until it merges (`gh pr list --state open`). Merged 2026-09-17, in order: #47 the map mode toggle, #48 `components:classes:check`, #49 npm publish readiness and `packages:install:check` — #49 after its textual conflict with #48 was resolved by keeping both lines, and both checks were verified together locally and in CI — then #50 and #51, this handoff                                                                                                                                                                                                                                                                                                                                                        |
| Branches         | `origin` carries `main` and `codex/wayfinding-map-panel` — MAP-595's prototype, parked (§9). Everything merged has been deleted. The local `codex/wayfinding-map-panel` holds one commit `origin` does not, `0b3acfd`, from 2026-09-13 (`git branch -vv`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Packages         | `@kozmos/react` `tokens` `icons` `vue` `product-contracts`, all `0.0.1`, never published — `npm view @kozmos/react` is a 404 and `git tag` lists nothing. Since #49, `vue` is private, all five carry `license: MIT`, and the four public ones a LICENSE file and README (§4.5)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| React components | 98 directories in `packages/react/src/components`, beside one file, `PlatformSnippets.tsx` (`STATUS.md`: **Core 69** · Code-only 5 · Product/SDK 22 · Platform 2). **353 React tests**; iOS **57** (`swift test`); Android **25** unit tests plus `verifyPaparazziDebug`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Figma            | `Kozmos DS - Core Library` `Yj4O8p6Y9h2Sa9zJVoAiVY`, Components page `4:4`, MetaStrip `1890:8911`. `pnpm figma:verify` on 2026-09-17: **95 of 95 sets**, presence and variant drift clean. **Build coverage 71 of 95** on `dd9f78a05cc0`; the 24 on `3e597100b157` are the Product / SDK lane. Two standing findings: **5 children overflow their box** and **29 icons are typed as characters**. **`MapControlButton`'s `State=Pressed` still paints filled** while code renders tinted — `figma:verify` compares structure, not paint (§6)                                                                                                                                                                                                                        |
| Tokens           | **641 light + 641 dark** (`docs/figma-library-manifest.json`), up 18 for `Semantics.Emotion` (#40). 1,412 variables in the file (last measured 2026-09-03). **18** values carry floating-point noise — four font sizes, five letter-spacings, one line height, one paragraph spacing, and seven unitless numbers                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Typecheck        | `pnpm --filter @kozmos/react typecheck`: **0 errors**, and since #27 it sees all 92 `*.figma.tsx` files. The package's `build` runs the same `tsc`, so CI catches a regression                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Gates            | the eleven in §7 green on 2026-09-17, plus `pnpm native:check` and the STATUS check. Since #48 and #49, CI also runs `components:classes:check` — a ratchet at **62/40/27** — and `packages:install:check`. `tokens:raw:check` is a ratchet: 35 raw colours across 7 components, 7 raw radii across 6 — unchanged                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Chromatic        | **snapshot limit** since early September — nothing has been visually compared since, including a shadow change across 27 components and #19's animation fix; `UI Tests` shows PENDING on every PR for that reason                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| CI on `main`     | green. CI and Release last ran on `e9f5069`, because #50 and #51 are documentation, which CI skips on a push; on `e9f5069`, CI (web, iOS and Android), Visual Regression, Bundle Size, Lighthouse and Release all succeeded, and the release job ran `packages:install:check` before skipping publish. `Release Kozmos System` runs after CI and skips publish while `NPM_TOKEN` is absent. **GitHub Actions refused every job on 2026-09-16 and 2026-09-17** — "recent account payments have failed or your spending limit needs to be increased", no steps run — until Olcay unblocked it on 2026-09-17. Runs now warn that `actions/checkout@v4`, `actions/setup-node@v4` and `pnpm/action-setup@v3` target Node 20, which is deprecated and forced onto Node 24 |
| Release path     | `.changeset/` holds only `config.json`; `release.yml` runs on CI success on `main`, skips publish when `NPM_TOKEN` is missing or invalid — inferred **not configured** (the registry has nothing and the run was "success"). With a valid token and no changeset pending, it publishes every unpublished package at once (§4.5)                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Working tree     | `/Volumes/4TB Depo/development/K/kozmos-design-system-dev`, shared with parallel sessions that switch branches and leave work uncommitted — stage by path, never `-A`; build branches in a `git worktree` under the scratchpad                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

## 4 · The five priorities, as a plan

### 4.1 · Tidy up

Most of this is done. Three items remain in the hygiene list below, each gated on a §6 decision
rather than on work, and the Figma file hygiene paragraph is untouched — every item there is one
plugin run once its painter is right.

**Branches and PRs — done 2026-09-14.** #24 to #28 merged in order (§10), their branches deleted,
and the two merged-and-kept ones from before (`codex/wave-2-figma-components`, `codex/elevation-audit`)
deleted with them. `origin` now carries `main` and `codex/wayfinding-map-panel` only. #17 stays
closed with its branch kept, because the MAP-595 prototype lives there and nowhere else.

**The repo root — done (#25).** `scratch.js` deleted; `test-results/` untracked, 334 files that
`.gitignore` already listed; `FIGMA_CODE_CONNECT_RESEARCH.md` and `antigravity.config.yaml` moved
to `docs/archive/`, and `scripts/verify-setup.sh` no longer demands the config at the root.
`STATUS.md` stays generated (`pnpm exec tsx scripts/skills/check-completion.ts --check`).
**Not yet judged, and not on anyone's list:** `PROJECT_SCOPE.md` (134 KB, February), `.ai-skills/`
(30 guides from February), `.agents/` (3 workflow files). They are stale rather than wrong; decide
whether they are reference or archive before the next reader trusts them.

**The docs — done (#25).** `docs/` holds 17 Markdown files now: the current ten, the five MAP-595
records (parked, left at their paths because the record links them by path), this handoff and
`docs/README.md`, which maps what is current, generated, parked and archived. The ten historical
documents and the eight May agent-tracking documents moved to `docs/archive/`, whose own README says
what each was and what replaced it. Two comments inside the plugin's `code.js` still name the old
path of `figma-core-gap-audit.md`; they were left alone because editing `code.js` changes the plugin
build id, and a comment is not worth a re-stamp.

**Code and token hygiene — three of the six done, and the stale manifest with them:**

- ~~Screen breakpoints emitted 16× inflated on Android~~ — fixed in #26, and it was seven tokens,
  not four: the icon stroke widths were inflated too (1.5px read as 24dp). The dp transforms read
  the unit now.
- ~~The tracked `KozmosColors.swift` and `.kt` drifted from the generator~~ — resynced in #26, along
  with the two XML resource files that nothing had ever copied. The claim that **13 iOS and 16
  Android border references hard-code the old grey did not reproduce at all** on 2026-09-14. The two
  old greys that remain are two entries in `ColorPicker`'s swatch palette on each platform, which is
  content a user picks from, not a border reading a role. The only border and stroke literals left
  are a white ring on `UserLocationMarker` and `Tag`'s outline at 30% of its own variant colour,
  and neither wants a role. Treat the old number as retired, not pending.
- ~~`*.figma.tsx` excluded from typecheck~~ — lifted in #27; the 55 errors it surfaced are closed and
  all 92 files type-check.
- ~~`docs/figma-library-manifest.json` four weeks stale~~ — regenerated in #28, which also made the
  manifest and payload generators write Prettier-formatted output, so a regeneration is a
  content-only diff instead of 3,331 reflowed lines.
- **Ruled, not yet built:** `tokens:raw:check` at 35 raw colours and 7 raw radii. Twenty-nine of the
  colours are the same `bg-white/70` on three map cards and clear the moment the **glass** surface
  role lands (§5.13).
- **Ruled, not yet built:** the 18 floating-point values. Noise from a Figma export, not decisions.
  The type-scale ruling (§5.11) rounds `11.008…` and `13.008…` and adds 12 and 15 in the same pass. `Primitives.Typography.font.size` is read by no platform, and the
  `letterSpacing` and `line.height` scales are unused.
- **Ruled, not yet built:** native enum names inconsistently prefixed (`AlertStatus`, `BadgeVariant`,
  `ChipSize`, `CounterTone`, `SegmentedControlSize`, `StackDirection`); `AlertStatus.Error` maps to
  React's `destructive`. Cosmetic but breaking — do it once, with deprecated aliases, before a
  publish (§5.16).

**Figma file hygiene** (each is one plugin run once its painter is right): Text, Heading and Label
have never been built in Figma — `Update All Core` skips them silently, which is why they alone have
no Code Connect on any platform; 19 sets cast no shadow where an implementation does; 11 pill
radii are applied by bound variables and store 9999; `productSdkSlot()` returns a frame, so no
Product / SDK set has a real Figma slot.

Measured 2026-09-14, each correcting or adding to what this file said before:

- ~~15 nesting findings behind a popover-padding variable~~ — **gone.** `pnpm tokens:radius:nesting`
  reports 290 corner-adjacent pairs and no finding, `--strict` included. The variable that derives
  closed them; nobody had re-run it to notice.
- **5 children overflow the box holding them**, new to this file: `DynamicIsland`'s Compact Leading,
  Compact Trailing and Minimal Content slots are each 26 tall in a 24 box, and `Dialog` and `Drawer`
  Primary Action labels are each 94 wide in a 90 box.
- **29 icons are typed as characters**, new to this file — `↑ ← → ◉` on `DirectionStep`, the
  `FloorSelector` stepper glyphs, `POIDetailPanel`'s four action glyphs, `POIMediaGallery`'s pager
  arrows, and seventeen more. A character is not an icon: it cannot take the icon stroke, it will
  not swap with the set, and it renders in whatever font its text node carries. This is the Figma
  half of the `packages/icons` question in §4.4.

### 4.2 · Scan the current product UI — done 2026-09-14

**The answer is `docs/product-ui-coverage-2026-09-14.md`**: 13 surfaces across the three product
files, 763,776 nodes, read over the REST API. The headline is that the design system is not short of
components. Of 98,597 mapped control instances, **80.0% are "partial"** — the component exists but
cannot express an axis the product uses — against 17.8% covered and 2.2% missing. Almost all of that
80% is three components (`Button`, `Tag`, `Counter`) missing one `Emotion` axis that the token layer
already defines in full.

It also corrected three things this file used to assert: the product runs at **11px** (45.3%), not
12; the palettes are **one ramp with two names**, with 79.1% of product fills already Kozmos token
values; and Readex Pro is **93.8%** of product text, so the `Brand` role should not be dropped.

The original plan, kept for the record:

**What to scan, with keys** (all readable over REST or `use_figma`; the dashboard and Express files
are read-only for us, and the dashboard publishes only `listItem`):

| Surface                                               | Where                                                                                                                                                                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pointr Cloud Dashboard v9 — the web product           | `b8dqhE3CPxitYfqlXuQJTC`: `0 - Common UI Components` (PreferencesOverlay `19452:258615`, error overlay `7581:268934`), `2.4 - Levels`, `2.5 - Map Content`, the taxonomy workflow `15703:113650`      |
| Pointr Maps Express — the branded web experience      | `BwtG2COVRqUWGPrIvP4jxr`: onboarding `18518:29917`, theme `16415:43319`, rate your experience `19922:8556`, logo and whitelabel `11673:277621`                                                        |
| POI Details Card Revamp — the mobile SDK direction    | `HbFSXhCPxKUy2fWa5x9TKO`: POI detail `241:4772`, Web SDK screen `537:35728`, wayfinding `862:131794` (audited 2026-09-05)                                                                             |
| The shipped Web SDK v10.7.1                           | its public CDN stylesheet (979,502 bytes) implements `--pointr-*` tokens and contains zero occurrences of "kozmos" (reported by #19's audit)                                                          |
| The MAP-595 file's measurements of the dashboard (§9) | the product's four-mode Primitive Tokens; input border `foreground/100` at 2px (1.27:1); tool tiles icon-only 40×46; list rows 35px; Readex Pro 10·11·12·13·16; a Delete red `#b42318` no token names |

**Method.** One document, `docs/product-ui-coverage-<date>.md`, built surface by surface: every
control and pattern on the screen with its node id → the Kozmos component that covers it (Core,
Product / SDK, or none) → the token match (colour, type, radius, border, elevation) → a verdict:
covered · partial · missing → the lane a missing one belongs to. The prior scans are inputs, not
answers: `docs/archive/figma-core-gap-audit.md` (2026-05-21, dashboard taxonomy and Express),
`gap-audit-2026-09-05.md` (the revamp designs and the monorepo — about twenty missing patterns),
`docs/archive/web-sdk-revamp-audit.md` (2026-08-05), `ds-scope-2026-09-12.md` (the 24 SDK sets and eight missing
parts), `sdk-module-primitives.md` (eleven ranked primitives, 1 done).

**Token-level disagreements as the scan measured them** (the paragraph below is the pre-scan
guess, kept so the correction is visible; `product-ui-coverage-2026-09-14.md` §2 has the numbers):
the brand blue (`#346df1` in the product and PDS Core, `#0d44c2` for Kozmos Core's primary button);
the palette numbering runs opposite ways (the product's `foreground/900` is the ink, Kozmos Core's
`foreground/100` is); the type scale (the product runs 12 where Kozmos has 11.008 and 13.008); input
borders (the product's at 1.27:1, Kozmos `Border/Input` at 4.2:1); there are three Kozmos-named
Figma libraries that disagree.

### 4.3 · Make the system satisfy all of it

The scan's "missing" and "partial" rows each need a lane before code: **Core** (domain-neutral),
**Product / SDK** (map, POI, routing, dashboard compositions — by policy examples, not sets, and any
existing set is deprecated in place, never deleted, because 72 Code Connect mappings pin its node
ids), or **an example** in `apps/docs/stories/examples/` and the Figma `Examples` page (`286:1601`).
~~The token disagreements need one ruling~~ — **taken 2026-09-14** (§5.10 to §5.14). The brand blue
is the product's `#346DF1`, both ramp namings stay, the type scale gains 12 and 15, `Brand` stays
scoped, and a glass role is added. What is left in this section is assigning a lane to each row of
the scan's coverage table, and §11 is now the way that happens: an example is built, and whatever it
cannot express becomes the gap list.

### 4.4 · Complete the missing parts

The consolidated list, with where each is argued. Build order is the scan's to set; the cheap and
unblocking ones first.

- **In Figma only:** Text, Heading, Label (builders exist; nine Code Connect files follow); the 19
  shadowless sets; real slots for Product / SDK sets.
- **The eight parts** (`ds-scope-2026-09-12.md` §4): in-surface status message · Toolbar and
  ToolButton · DragHandle (lift out of BottomSheet) · ControlCluster (generalise
  MapControlsGroup) · AttributeSection · MetaStrip / DescriptionList · the glass surface role ·
  Tooltip on a disabled trigger.
- **From the revamp designs** (`gap-audit-2026-09-05.md` §3): POI attribute section, meta strip,
  opening hours, bookmark/favourite pair, quick-button clusters, Filter, Carousel, quick-access
  grid, a horizontal paged level selector, ~~map tracking mode~~ (#47, §11.3), a no-results card, error and
  notification overlay placement, a directions card composing DirectionStep, journey progress and
  checkpoints, the lift/escalator/stairs icons (33 uses, absent from the set).
- **From the dashboard's Map Content editor** (§9): six field controls the taxonomy needs and the
  MAP-595 file drew as proposals — Textarea with a character counter, Opening Hours, Logo, Images,
  Price band, Rating — check each against what `packages/react` already has (Textarea and Rating
  exist there; the Figma library's coverage is the question) before building; a neutral outline
  button; a destructive button shade; colour scopes for coloured text, strokes and icons.
- **Depth, not presence:** six native components are thin wrappers around an OS control (Slider
  first); Link and Spinner each miss a variant axis on iOS and Android; `packages/icons` renders
  different artwork from Figma and is too small for the revamp — resolve before extending.
- **A11y and tests:** the a11y spec is thin and coverage has no threshold (gap audit §8).
- **Classes that compile to nothing: 62 uses of 40 classes across 27 files on `main`.** Every colour
  role in `packages/react/tailwind.config.js` is a plain `var(...)`, so an opacity modifier on one —
  `bg-muted/40`, `ring-primary/20`, `hover:bg-accent/10` — is dropped from the stylesheet without a
  word, and `toHaveClass` still passes. It removed `MapControlButton`'s whole surface and ghost
  Button's background hover. The fix is in how the roles are declared, it switches on styles nobody
  has seen, so it wants Chromatic; `components:classes:check` (#48) counts them and proves the fix
  when it lands. `docs/map-mode-toggle-gaps-2026-09-15.md` §4 has the table.
- **An in-surface status message** — the map toggle's "Calculating…" pill has nowhere to live:
  `Toast` needs a document-level viewport at 420×92 and `Alert` is block-level. It is the first of
  the eight parts above, now with a second consumer waiting.
- ~~Three defects that only building an example found~~ (2026-09-14, §11.1) — **fixed in #45.**
  `ScrollArea` set `h-full` on both of its wrappers, so a horizontal strip inside an auto-height
  column resolved to height 0 and vanished; a component's radius role could not be overridden from
  outside, because `cn`'s tailwind-merge did not know the design system's custom radius names, so
  `rounded-pill` and `rounded-control` both survived and CSS order decided; and `BottomSheetContent`
  left the sheet unlabelled unless the caller reached for `BottomSheetTitle`, which a `Heading`
  type-checks beside and does not satisfy.

### 4.5 · Get ready for npm publish

**#49 closed most of this list.** What it did, and what stays open, measured on 2026-09-17:

| Item                                         | State                                                                                                                                                                                                                                                                                          |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LICENSE` and `license` fields               | #49: MIT, copyright **Vodoco** (§5.22). A LICENSE file at the root and in each of the four public packages — npm copies one only from a package's own directory, never the monorepo root — and a `license` field in all five                                                                   |
| `@kozmos/vue` not published                  | #49 marks it `private` (§5.15) — before it, the first publish would have shipped it                                                                                                                                                                                                            |
| README per package                           | #49: all four public packages, every claim checked against the built package, every code sample type-checked by the install check                                                                                                                                                              |
| `repository`, `homepage`, `bugs`             | **ruled out** while the repository is private (§5.21) — they would 404. `description` and `keywords` added                                                                                                                                                                                     |
| `@kozmos/tokens` exports                     | #49: `.` with separate ESM and CommonJS declarations (`tokens.d.mts` / `tokens.d.ts`), `./css/light.css`, `./css/dark.css`, `./dist/*` so every old deep import still resolves                                                                                                                 |
| CSS entry                                    | #49: `@kozmos/react/style.css`, beside `./dist/style.css`                                                                                                                                                                                                                                      |
| A pack-and-install smoke test                | #49: `pnpm packages:install:check` — §7                                                                                                                                                                                                                                                        |
| Type declarations                            | `@arethetypeswrong/cli`: tokens clean after #49; **FalseCJS on react and icons** (declarations use extensionless relative imports an ES-module declaration cannot resolve) and **CJSResolvesToESM on the types-only product-contracts** — pre-existing, held as a ratchet by the install check |
| Provenance                                   | **not possible** while the repository is private: npm requires "a public `repository` that matches … where you are publishing with provenance from"                                                                                                                                            |
| The stylesheet's global reset                | `@kozmos/react/style.css` includes Tailwind's preflight — body margin, heading sizes, block images and SVGs. The README says so; scoping or splitting it is open (§6)                                                                                                                          |
| `ThemeProvider`'s storage key                | `vite-ui-theme`, a scaffold default that would land in every consumer's localStorage — cheap to rename before a publish (§6)                                                                                                                                                                   |
| Declaration maps                             | `icons` and `product-contracts` ship `.d.ts.map` files pointing at a `src/` the tarball does not include                                                                                                                                                                                       |
| Changesets, `NPM_TOKEN`, the `@kozmos` scope | not done. **The token alone publishes:** with no changeset pending, `changesets/action` publishes every unpublished package, so the first CI run to pass on `main` after a valid `NPM_TOKEN` exists ships all four at `0.0.1`. Add it last                                                     |
| Chromatic                                    | still on its limit: a publish would ship visuals nobody has compared since early September                                                                                                                                                                                                     |

The mechanics, now that #49 has merged, **in this order**: claim the `@kozmos` scope; settle §6's
pre-publish items (1, 3, 9, 10); merge a changeset per package (`pnpm changeset`, "minor" for a first
`0.1.0`); only then add `NPM_TOKEN` (an automation token for the `kozmos` org). The next CI run to
pass on `main` runs `release.yml`: the install check, then the version PR → merge it → the same
workflow publishes. The order is the safeguard. Without a token, `release.yml` never reaches
changesets at all; with one and no changeset pending, `changesets/action` logs "No changesets found.
Attempting to publish any unpublished packages to npm" and publishes `0.0.1` of all four (measured
2026-09-17 from `release.yml` and the action's source). Semver from `0.1.0`: breaking changes are
minors until `1.0`. `emphasis` defaulting to tinted is one.

## 5 · Decided — do not reopen

1. **A value that depends on another value is derived, not written** (radius, border, elevation
   roles; `docs/style-playbook.md`).
2. **The roles:** radius `none · marker 4 · small 8 · control 16 · container 20 · panel 24 · pill`
   — `small` added 2026-09-14 because 52.5% of the product's rounded corners are 8px and nothing
   named it; nothing already bound to another step moved. Border `Subtle` (`#C7CAD1`, 1.6:1,
   container edges and dividers) and `Input` (`#747B8B`, 4.2:1, things you interact with);
   elevation `raised · floating · overlay`, native following dark mode.
3. **Only a `SLOT` node carries a slot binding**, and a component's own property never drives a node
   inside its slot or a nested instance — bound defaults sit beside the slot.
4. **Update, never Rebuild**, in the plugin: Rebuild mints new node ids and Code Connect pins the old.
5. **Lanes:** Core is domain-neutral; Product / SDK compositions are examples by policy — existing
   sets are deprecated in place, never deleted; Platform / Form-Factor is its own lane.
6. **Checks scan everything and name only the exceptions** — a check that lists its consumers only
   confirms what someone already looked at.
7. **Verify against a clean checkout, not the working tree**; measure, then report.
8. **The Figma file is painted by the plugin**, not drawn by hand and not written by MCP.

**Ruled 2026-09-14**, after the product UI scan put numbers on each. These close what §6 had been
holding; the work each unblocks is in §4.3 and §4.5.

9. **Button, Tag and Counter take an `emotion` prop** — `neutral · themed · success · danger ·
informative · alert`, reading `Components.{Primary,Secondary,Tertiary} Buttons`, which already
   carry all six with `idle/hover/pressed/focus`. `variant` keeps its current meaning for shape and
   weight. This is the single largest gap: it gates 80% of the product's mapped control instances.
10. **The brand blue is `#346DF1`** — the design system adopts what the product ships, as
    `theme.500`. Kozmos's current `#135BEC` and `#1051E8` shift with it. 4.56:1 on white, so it
    passes AA for text but not 3:1 as a non-text boundary; use `theme.600` where a border must
    carry meaning.
11. **The type scale gains 12 and 15, and the noise is rounded off** — `11.008…` becomes 11 and
    `13.008…` becomes 13. Coverage of product text goes from 72.9% to 93.4%. One plugin run
    restyles every text style in Figma, so do it in a single pass.
12. **The neutral ramp keeps both names** — `background.N` ascending for surfaces, `foreground.N`
    descending for ink, as today. The product maps to these at its own boundary; nothing is renamed.
13. **A glass surface role is added** — composed from the `Semantics.Effect.glass` values that
    already exist. It clears 29 of the 35 raw colours the ratchet counts.
14. **`Brand` (Readex Pro) stays, scoped with `unicode-range`** — the product is 93.8% Readex Pro,
    so the role matches what it sets. A declared system stack takes CJK, which the face does not
    cover, instead of whatever each browser picks.
15. **`@kozmos/vue` is internal and is not published** — it mounts a React root per instance, so it
    cannot SSR and would make every consumer ship React. It stays as proof the React components
    mount.
16. **Native enum names are normalised once, with deprecated aliases** — before the first publish,
    while nothing outside the repo depends on them.
17. **The packages are MIT** — a `LICENSE` at the root and a `license` field in all five
    `package.json` files.
18. **iOS snapshots run in CI**, on a pinned runner image with a fixed simulator, so an OS update
    cannot invalidate every snapshot at once.

**Ruled 2026-09-15 to 2026-09-17**, while rebuilding the map mode toggle and readying the packages:

19. **A map mode toggle is `MapControlButton`, not a new component** — `emphasis`, `labelPlacement`
    and `revealOnChange` on the existing component, which already carried icon, label, state and
    pressed on three platforms with Code Connect pinned to it. **Tinted is the default**: the SDK is
    right that a control over a map keeps its surface and colours only its glyph and edge.
20. **`revealOnChange` is a boolean prop, not a third `presentation` value** — `presentation` is an
    axis iOS, Android and Figma share, and a React-only value would open a cross-platform gap. The
    timing is also exported as `useRevealOnChange`. It is React-only today.
21. **The packages publish publicly on npm while the repository stays private** — so no
    `repository`, `homepage` or `bugs` links, the READMEs carry the documentation, and provenance is
    not possible.
22. **The MIT copyright holder is Vodoco.**
23. **A PR whose CI could not run waits for CI before merging**, however complete the local
    verification (#47, 2026-09-17).

**Ruled 2026-09-17, during the Astra continuation:**

24. **Proceed with the pre-publication architecture pass**, before treating npm or module rebuilds
    as ready. The approved direction is local available-space and region/occlusion contracts,
    state-preserving adaptive layout, scoped theme/portal/CSS ownership, a deliberate public API,
    and representative POI/routing flows before beta. See `prepublish-architecture-review-2026-09-17.md`.
    This authorizes implementation, not publication, credentials, pushes or merges. The numerical
    React thresholds are implementation choices for validation, not a universal native policy.

25. **Proceed with release safeguards first**, then browser/WebView compatibility,
    native adaptive parity and a real Pointr consumer proof before a prerelease
    (2026-09-17). This authorizes local implementation, not credentials, account-plan
    changes, repository visibility changes or publication. The browser minimums have
    not been chosen by this ruling; Olcay has been asked for the Pointr support range.

26. **Proceed with the component-owned CSS recommendation**, after another extensive
    audit: precompiled namespaced recipes, provider-owned tokens and local resets,
    without mandatory native scope. Prove a representative slice before migrating
    the remaining components. Preserve customer compatibility rather than silently
    raising browser minimums; exact minimums and device certification remain open.
    Leave source/migration/verification instructions for independent maintenance.
    This authorizes implementation, not a new push, merge or npm publication.

## 6 · Open — waiting on Olcay

Eleven of the twelve that stood here were ruled on 2026-09-14 and moved to §5. What is left needs an
action rather than an answer, needs a designer, or is work with nobody blocked on it (§6.3).

1. **Chromatic — raise the plan.** Ruled: raise it. This is an account action only Olcay can take.
   Until it happens nothing has been visually compared since early September, including a shadow
   change across 27 components and #19's animation fix, and `UI Tests` shows PENDING on every PR. It
   should land before the first npm publish, or that publish ships visuals nobody compared.
2. **The other 38 icons.** The set names **51**: 13 carry Pointr's own outlines (§11.1) and 38 are
   still lucide look-alikes. Migrating them changes the artwork of icons used across the library, which wants a
   visual gate — so it waits on Chromatic. Beyond them, **50 of 98** React components import
   `lucide-react` directly in the source they ship, bypassing the registry entirely — 60 counting
   their stories and tests (`git grep -l lucide-react -- packages/react/src/components`, 2026-09-17).
   This line said 70 of 99 until then, which no count reproduces, on 2026-09-15's `1dd30f0` or since.
3. **`@kozmos/icons` no longer re-exports lucide wholesale** (§11.1). It had to stop, because owning
   one outline while re-exporting its look-alike put two different Hearts under one name. It narrows
   the package's public surface on a package that has never been published, and nothing in the repo
   used it — but it is a public-API decision, and one line to reverse.
4. **The payment brand marks** — Apple Pay, Google Pay and Samsung Pay are drawn as tags in the POI
   card. A brand mark is neither a `Tag` nor an icon from the set: it is someone else's artwork at a
   fixed lockup, and the design system has nowhere to put one.
5. **The accessibility facility glyph.** The most-drawn icon the scan found — 1,213 uses across 7
   surfaces — and still missing, because it lives in a different Figma library from the Pointr Icon
   Library the generator reads. It needs that file's key from Olcay; everything else is one line in
   `scripts/build-pointr-icons.mjs` and a re-run.
6. **The Product / SDK sets are still on the older plugin build** (§3). `Update All Product SDK` in
   the plugin moves the remaining 24. Nothing is wrong with them — the drift checks pass — so this
   only decides which build painted them.
7. **RoutePreviewPanel's five states look like two; MapOverlay's `position` is not a Figma axis;
   LocationPin's `variant` and `labelPlacement` stay renderer concerns** — recorded, revisit if a
   designer asks.
8. **How Figma draws `MapControlButton`'s tinted state.** Its set composes a Button instance, and
   the Figma Button set has no themed outline and **no `Emotion` axis at all** (#32 and #42 added
   `emotion` to code only), while the painter keeps paint off the root on purpose. Either the painter
   overrides the nested Button's stroke and icon at build time, or the Figma Button set gains a tone
   axis — larger, and it would carry #42's `emotion` too. Until then `State=Pressed` paints filled
   and no check can see it. The regenerated variant analysis lists `emphasis` and `labelPlacement`
   as Figma's missing axes.
9. **The React stylesheet ships Tailwind's global reset** (§4.5) — keep and document it, scope it
   under a Kozmos root, or ship it as a separate file.
10. **`ThemeProvider` stores the theme under `vite-ui-theme`** — rename before a first publish.
11. **React's ink is `#000000`, native's `#17191C`.** The Tailwind config maps `foreground` to
    `foreground/0`; the native controls read `foreground/100`, which is the ink the SDK draws. It is
    a library-wide role mapping, so it was recorded rather than changed inside #47.

### 6.3 · The queue, when there is no SDK component waiting

Work, not questions. In the order it is worth doing:

- **Approved pre-publication foundations (ruling 24).** The first React layout batch is on
  `astra/prepublish-foundations`. Next: theme/portal/CSS isolation; native local-space/region
  parity while retaining iOS detents; an actual Pointr map adapter and POI/routing consumer proof;
  public export/type/token cleanup and release safeguards. Do not mistake the existing variant
  scanner's green result for native adaptive parity: it does not track these new geometry inputs.

- **`Link` and `Spinner` cannot express an axis React has**, on both iOS and Android — `Link.variant`
  (`default`, `subtle`) and `Spinner.size` (`sm`, `md`, `lg`, `xl`). These are the only two real
  variant gaps in the system, and they only became visible when the variant analysis started being
  regenerated (#38).
- **The 18 floating-point token values** (§4.1), which belong with the type-scale work.
- **The native enum naming normalisation** (§5.16), which wants doing before the first publish.
- **GitHub Actions on Node 24** — `actions/checkout@v4`, `actions/setup-node@v4` and
  `pnpm/action-setup@v3` target the deprecated Node 20 runtime; every run warns.
- **ES-module declarations for react and icons**, which would clear the two FalseCJS problems the
  install check keeps as a ratchet — it fails until their lines are deleted, so the fix locks in.
- **`components:classes:check` does not read `apps/docs`**, where the examples live and where there
  is no Tailwind build at all: any class `packages/react` does not already emit is inert there.
- **Native tests.** `MapControlButton` has them on both platforms now (§11.3); most native
  components have none, and `native:check` only compiles.
- **The `Examples` page in Figma** (`286:1601`) has no painter, so the POI card example and the
  opening-hours example exist in Storybook and nowhere in the file.

## 7 · Where everything is, and how to check it

| Thing                         | Path or command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What every document is        | `docs/README.md` (current · generated · parked · archived); `docs/archive/README.md` for the superseded                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| The scope answer and gap list | `docs/ds-scope-2026-09-12.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| How to change how it looks    | `docs/style-playbook.md` (roles, cookbook, traps, checks)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| The long record               | `docs/session-handoff.md` (§3 reasoning; §6 risks; §7 every check)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| The overnight gap audit       | `docs/gap-audit-2026-09-05.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| SDK primitives, ranked        | `docs/sdk-module-primitives.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| The Figma plugin              | `figma/foundations-importer/code.js` (+ `ui.html`, `manifest.json`); ⌘Q Figma after every change                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Component number table        | the same file, search `name: "<Component>/`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Figma                         | `Kozmos DS - Core Library` `Yj4O8p6Y9h2Sa9zJVoAiVY`, Components page `4:4`, MetaStrip `1890:8911`. `pnpm figma:verify` on 2026-09-15: **95 of 95 sets**, presence and variant drift clean, and the file matches what the importer would generate. **Build coverage 71 of 95** on the current build (`dd9f78a05cc0`) after Olcay ran Update All Core; the 24 still on `3e597100b157` are exactly the Product / SDK lane, and `Update All Product SDK` is what moves them. Two standing findings: **5 children overflow their box** and **29 icons are typed as characters** |
| Code Connect                  | `figma.config.json`, `figma.linked.config.json`, `packages/{ios,android}/figma.linked.config.json`                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Tokens                        | **641 light + 641 dark** (`docs/figma-library-manifest.json`), up 18 for `Semantics.Emotion` (#40). 1,412 variables in the file (last measured 2026-09-03). **18** values carry floating-point noise — four font sizes, five letter-spacings, one line height, one paragraph spacing, and seven unitless numbers                                                                                                                                                                                                                                                           |
| Generated status              | `STATUS.md` (`pnpm exec tsx scripts/skills/check-completion.ts --check`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Storybook                     | `apps/docs` (React on 6006, Vue on 6007)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

```bash
pnpm tokens:elevation:check && pnpm tokens:border:check && pnpm tokens:radius:check \
  && pnpm tokens:typography:check && pnpm tokens:contrast:check && pnpm tokens:raw:check \
  && pnpm figma:plugin:check && pnpm components:contract:check && pnpm figma:stamp:check \
  && pnpm docs:snippets:check && pnpm components:variant:check
pnpm --filter "@kozmos/react..." build && pnpm components:classes:check   # reads dist/style.css, so build first
pnpm packages:install:check      # packs, installs against React 18 and 19, type-checks READMEs; needs a build and the network
pnpm native:check                 # Swift + Kotlin compile, ~6s (Android needs packages/android/local.properties)
pnpm figma:verify                 # the live file against the plugin; needs FIGMA_ACCESS_TOKEN in .env (expires 2026-11-24)
pnpm figma:icons                  # refused by the current token: wants library_content:read, which it does not carry
pnpm tokens:radius:nesting        # concentric radii; --strict is what CI runs
pnpm figma:publish:linked:dry && pnpm figma:publish:native:linked:dry
git worktree add --detach /tmp/verify HEAD && cd /tmp/verify   # measure a clean checkout, not the tree
```

Two more, from #48 and #49, both read a build, so build first:
`pnpm components:classes:check` (#48) — every slash-modified Tailwind class in `packages/react/src`
must exist in `dist/style.css`, a ratchet at 62/40/27 — and `pnpm packages:install:check` (#49) —
packs every non-private package, installs the tarballs into empty projects against React 18 and 19,
resolves every export and README import, renders a component, type-checks every README sample, and
holds `@arethetypeswrong/cli`'s findings as a ratchet. It needs the network and takes about fourteen
seconds with a warm npm cache.

A fresh worktree has no built workspace packages: run `pnpm --filter "@kozmos/react..." build`
before `pnpm --filter @kozmos/react test`, or the failure is the worktree, not the code. If a
typecheck then reports errors in files nobody touched, suspect the install before the code (§8).

## 8 · Traps that have cost real time

- **The checkout is shared.** Sessions switch branches under you and leave uncommitted work. Stage
  explicit paths; never `git add -A` or a directory; build branches in a `git worktree` under the
  scratchpad; never reset or rewrite a branch another session is on.
- **The shell is zsh.** A command in a variable does not word-split; `PIPESTATUS` is empty (it is
  `$pipestatus`); an unquoted glob in a flag aborts. `set -e` does not gate in the Bash tool and
  `cmd | tail || exit 1` tests `tail` — gate before any pipe and read outward changes back.
- **`lint-staged` prettiers whatever you stage**, and reflows Markdown tables — match text by line
  content, never by padded table rows, when editing a committed doc by script.
- **Figma runs stale plugin code** until it is relaunched (⌘Q). **Never Rebuild.** **A bound
  property ignores the painter** — fix the token table. **A quiet file is not a stalled run.**
- **A hidden instance reads layerless** to the plugin API, and a page reads empty until
  `setCurrentPageAsync`. **Section opacity is not exposed** by this build — a dimmed section is a
  choice someone made (Olcay dimmed ⑤'s layer-sections section in the MAP-595 file on purpose);
  ask before touching what you cannot read.
- **A half-made `node_modules` lies.** On 2026-09-14 a worktree installed while sibling worktrees
  were being removed produced 111 `TS2786` errors — every `lucide-react` icon "cannot be used as a
  JSX component" — in files nobody had touched, because two copies of `@types/react` (18 and 19)
  were linked into one program. The same commit built cleanly in another worktree, and a clean
  `rm -rf node_modules && pnpm install` cleared it. Before believing a broad, uniform type error,
  build the same commit somewhere else.
- **A tsconfig `exclude` is also a publish list.** `vite-plugin-dts` follows tsconfig, so lifting
  the Code Connect exclusion to gain a typecheck (#27) silently added 92 `*.figma.d.ts` files to
  `dist`, which `files: ["dist"]` publishes. Nothing failed; `dist` went from 204 files to 296. After
  changing what a package compiles, count what it builds (#30).
- **`pnpm install` rewrites the lockfile in pnpm's quote style**, which diffs at ~14,000 lines
  against the Prettier-formatted `pnpm-lock.yaml` in the repo. Run Prettier over it and the diff
  comes back to the lines that actually changed — three, for one added dependency.
- **`apps/docs` has no Tailwind build.** It ships the packages' prebuilt CSS, so a class a story
  uses that `packages/react` does not already emit simply does not exist: `max-w-[375px]` was on the
  element and computed to `none`. It enforces "no one-off class" by construction, and it means a
  story cannot be styled its own way.
- **`gh pr checks` exits 8 when a check is merely pending**, not failing. On this repo `UI Tests` is
  always pending (Chromatic's limit), so that exit code is the normal state of a green PR.
- **A render harness can carry two Reacts.** A worktree install put React 18 and 19 in one program
  and every `renderToStaticMarkup` failed with "Objects are not valid as a React child" — including
  for components that had not been touched. Render one known-good component through the same harness
  before believing it broke yours.
- **A green that proves nothing is worse than a failure.** Three arrived in one day. Both Code
  Connect dry-runs said "All Code Connect files are valid" without ever parsing MetaStrip, because
  the three `figma.linked.config.json` files are explicit file lists, not globs, and a validator
  passes trivially when it validates nothing. The plugin's dropdown and its action registry are two
  separate structures in `ui.html`, so a painter can be fully wired and unselectable. And
  `components:variant:check` had never written the document it told readers to regenerate. Check
  that a pass _mentions the thing you added_.
- **A gate that cannot fail is not a gate.** Run a new test against the unfixed code before
  believing it: four of the seven `cn` radius assertions fail against the old `cn`, which is the
  only reason they are worth having.
- **`pnpm --filter @kozmos/react build` starts with `rm -rf dist`, and Storybook serves from that
  `dist`.** Rebuilding the package while Storybook is running breaks every story with "Failed to
  fetch dynamically imported module", naming whichever story you happen to click. Restart Storybook
  after a package rebuild; the error is not about that component.
- **Merging two green PRs can leave `main` red.** #37 taught the plugin about MetaStrip and #38
  generated the variant analysis before it; each was correct alone and the merge was stale. The
  merged `main` is a commit no branch ever built — check it, do not infer it.
- **A class on an element is not a style.** `toHaveClass` passes for a class that compiled to
  nothing (`bg-background/90` left `MapControlButton` transparent over the map for three weeks) and for a
  class tailwind-merge let a caller override (`emphasis="filled"` rendered white with black text,
  under a test that asserted a tint was absent). Render the built component and read computed
  colours: Playwright's `chromium.launch({ channel: "chrome" })` drives the Chrome already installed,
  with no browser download.
- **Since #45, a caller's `className` always beats a component's default.** A composition that
  restates its child's classes can undo the child: `MapControlsGroup` kept the compass see-through,
  the zoom hover dark and the location control unlifted.
- **`preview_start` always serves the original checkout**, never a worktree, even after the session
  moves — `preview_list` shows the real `cwd`. Olcay reviewed `main`'s component believing it was the
  PR's. Render the built package, or publish a bundle as an Artifact.
- **`gh pr edit --body-file` silently changes nothing on this repository** (a Projects-classic
  GraphQL error that reads like a warning). PATCH through `gh api` and read the body back.
- **A tool's output read through a pipe can stop at 65,536 bytes** when the tool exits before the
  pipe drains — `@arethetypeswrong/cli`'s report for react did. It was first misread as Node's 1 MB
  buffer; write the report to a file.
- **An effect that lists its timing as dependencies can orphan its own timers.** `useRevealOnChange`
  stuck open for ever when a caller changed the delay mid-reveal; timing belongs in a ref.
- **Stacked PRs:** GitHub does not retarget them; merging blind lands in the base branch.
- **Agent fan-out:** cap the candidate list before multiplying it — a scope audit once burned 5.16M
  tokens on ~330 candidates × 3.

Memory files — Claude's, kept outside the repository (`docs/agent-switch-2026-09-17.md` §4):
`kozmos-session-handoff-pointer` · `kozmos-verify-before-asserting` ·
`kozmos-audit-then-proceed` · `kozmos-shared-checkout-stage-by-file` · `shell-is-zsh-three-traps` ·
`bash-tool-set-e-does-not-gate` · `kozmos-never-rebuild-in-plugin` · `kozmos-plugin-may-run-stale-code`
· `kozmos-bound-property-beats-painter` · `kozmos-frame-is-not-a-slot` ·
`figma-pages-read-empty-until-loaded` · `figma-hidden-instances-read-layerless` ·
`figma-ask-before-replacing-a-node` · `kozmos-stacked-pr-runs-only-ci` · `kozmos-token-roles` ·
`preview-start-pins-project-root` · `kozmos-tailwind-alpha-on-token-roles-is-inert` ·
`gh-pr-edit-fails-silently-here`.

## 9 · MAP-595 — parked

MAP-595 (Easier Content Editing — Part 2) produced a Figma file `nm6qdzaC9B1lknllbwaMTh` that is
the team's QA and implementation reference for eight user stories, a prototype app
(`apps/mapscale-review`), and 199 record sections. It is complete and nothing in it waits on
anyone. Its handoff is `docs/map-595-handoff.md`, on `main` with the rest of its record since the
2026-09-13 snapshot; the prototype app stays on `codex/wayfinding-map-panel` (PR #17, closed). It
is not the design system's work and is not to be picked up without an explicit ask.

What it leaves the design system, as inputs to §4.2 and §4.4: the dashboard's real tokens and
sizes (the four-mode Primitive Tokens, opposite numbering, `#346df1`, 12px list text, a 1.27:1
input border, icon-only 40×46 tool tiles, 35px rows), the six field controls above, a neutral
outline button, a destructive shade, colour scopes for text, strokes and icons, the fact that the
dashboard's v9 library publishes only `listItem`, and ~228 PDS / Pointr bindings still pointing at
the unpublished "Primitive Tokens" collection.

## 10 · The log, 2026-09-13 to 2026-09-20

### 2026-09-13

1. **Morning, still MAP-595.** The tile change of the evening before was audited (all 279 tool
   instances, the hidden ones unhidden and re-hidden), the file walked as a reviewer would (three
   small fixes, the Contents titles linked), and one lesson kept: a section Olcay had dimmed on
   purpose was nearly "fixed" because this plugin build cannot read a section's opacity — ask before
   changing what the API cannot explain (`memory/figma-ask-before-replacing-a-node.md`).
2. **The scope ruling** (§1): the design system is the work; MAP-595 and the prototype app are
   parked.
3. **#19 merged** (`9332439`): the scope answer, the 2026-09-12 handoff, the overlay-animation fix.
   **#20 merged** (`de016b9`): this handoff.
4. **#17 split** as §4.1 recommended. **#21** the Checkbox (`2e51aaa`). **#22** the iOS sheet and
   Playground (`66aaa99`) — measured first: seven assertions in four `KozmosAdaptiveMapShellTests`
   failed under `swift test` because the shell read its width class from an environment that
   reports none on macOS; the width class is an argument of `resolvedCollisionInsets` now, the body
   passes the environment's value at both call sites, the four tests pin compact, a fifth covers
   the wide case; 53 tests, 0 failures, green in CI before the merge. **#23** MAP-595's record and
   this handoff's split patch (`8f81912`). #17 closed with a comment mapping each part; its branch
   kept for the prototype app and the commit-by-commit history.

### 2026-09-14

The tidy list of §4.1 turned into four PRs, each built in its own worktree off `8f81912` so none
stacked on another, then all five merged in order.

1. **#25, the tidy-up** (`196ae85`): the root strays and the docs sort, with an index at each level.
2. **#26, the tokens** (`682bed3`): Style Dictionary's `remToDp` transforms multiply every
   dimension-typed value by 16 without reading its unit, so seven px-valued tokens were inflated on
   Android alone. Two unit-aware transforms replace them. The native shadow files are generated
   whole now — doc comments, `none`, the `kozmosElevation` modifier — because the packages held a
   richer copy than the generator produced and the token-sync workflow's `cp` would have flattened
   it. The native files were then resynced, and the workflow now copies the two XML resource files
   as well.
3. **#27, the Code Connect typecheck** (`cb97967`): the exclusion lifted, 55 errors in 19 SDK files
   closed. Every placeholder an example used for caller-supplied data is a `declare const` typed
   from the component's own props now, so an example breaks when its props change. Read the parser's
   output back to confirm the rendered snippets are unchanged apart from two nested components that
   gained a typed spread.
4. **#28, the manifest** (`da0a312`): regenerated after four weeks — 601 → 623 tokens per mode,
   87 → 97 components, 66 → 90 Core React mappings. Two prop lists shrink, and both are the builder
   rather than the code: Accordion's props are a Radix union and DynamicIsland's extend a
   framer-motion type, neither of which the builder resolves. The manifest and payload generators
   write Prettier-formatted output now, so a regeneration shows only what changed.
5. **Verified on the merged `main`**, which no branch had ever built: the React build, the eleven
   gates, `pnpm native:check`, and both generators idempotent. CI green on `da0a312`.

6. **The audit that followed**, asked for after the merges rather than before, and the reason #29
   and #30 exist. Four things had been missed. **#27 had put 92 `*.figma.d.ts` files into `dist`**,
   which `files: ["dist"]` would publish — found by counting `dist` against a pre-#27 build, fixed
   in #30 along with the two generators #28 left alone. **`pnpm figma:verify` had not been run**
   this session: the file is whole, but it reports 5 overflowing children and 29 icons typed as
   characters, neither of which this handoff had ever recorded. **The 15 nesting findings are
   gone** — the check is green, `--strict` included, and nobody had re-run it. **`pnpm figma:icons`
   cannot run at all** with the current token, which lacks `library_content:read`. The Code Connect
   publish dry-runs, which CI skips without a token, are valid on all three platforms.

7. **§4.2, the product UI scan** — done the same day, and the largest single piece of measurement
   this work has had: 13 surfaces across the dashboard, Express and the POI revamp, 763,776 nodes
   over the REST API, written up as `docs/product-ui-coverage-2026-09-14.md`. The headline is that
   the design system is not short of components. Of 98,597 mapped control instances, **80% are
   "partial"**: the component exists but cannot express the product's `Emotion` axis, which the
   token layer already defines in full for Primary, Secondary and Tertiary buttons. It corrected
   three things this handoff asserted (§4.2) and added two decisions to §6.

8. **The twelve open decisions were ruled the same evening**, each as a short question with the
   measurement beside it. Eleven moved to §5; only Chromatic's plan upgrade is still waiting, and
   that is an account action rather than an answer.

9. **The `emotion` axis built**, the first of the twelve rulings and the one gating most of the
   product: #32 adds it to `Button` on React, SwiftUI and Compose. Compose needed
   `KozmosThemeTokens` widened first — the generated light and dark files have carried all 48
   tier-emotion-state colours from the start, but only three emotions were ever wrapped for the
   theme. Nothing changes when the prop is unset, which the tokens prove rather than the commit
   claiming it.
10. **The subject changed** (§11): from here the work is the SDK's components, rebuilt as examples
    from Kozmos components only, with every gap reported rather than worked around.

**What that leaves.** §4.1 and §4.2 are done and §6 is all but empty. What is open now is _work_,
not questions: the `emotion` axis on three components, the type scale, the glass role, the 8px
radius role, the enum normalisation, the MIT licence, and iOS snapshots in CI. §4.3 assigns each a
lane; §4.5 carries the publish list. The one thing still
waiting on Olcay is Chromatic's plan, which is an account action and which has compared nothing
since early September.

### 2026-09-14, evening

11. **#31 and #32 merged** (`15cdc3c`, `84ed387`), their branches deleted; CI green on the merged
    `main`, which no branch had built, and the eleven gates green beside it. One thing that cost
    time: the gates reported a failure that was `tokens:contrast:check` unable to resolve
    `tailwindcss-animate` — declared and in the lockfile, simply not installed in the shared
    checkout. `pnpm install --frozen-lockfile` added one package and everything passed. §8's
    half-made `node_modules` again.
12. **§11's loop ran for the first time** (§11.1): the POI detail card measured, rebuilt and
    reported as **#33**, and the icon set extended as **#34**. Both green but for `UI Tests`, which
    Chromatic's limit pins pending on every PR.
13. **An audit after the fact caught three things**, which is why #33 and #34 each carry a second
    commit: the example had rendered ten sections with invented values against the file's 22 real
    ones; `@kozmos/icons` had put two different Hearts under one name; and `docs/README.md` did not
    index the new report. All three are fixed and pushed. A fourth suspicion did not survive
    checking — the `emotion` custom properties #32 writes do resolve, in
    `variables-light.css`/`-dark.css`; the legacy combined `variables.css` is simply a different,
    older naming and was the wrong file to grep.

### 2026-09-15

Eight merges. The through-line is that the POI card of §11.1 kept paying out: everything merged
today was something that rebuild had found.

1. **#37, the MetaStrip painter** (`96b386d`). Registered in all ten places a Core component needs.
   Three bugs were caught by reading rather than running, because plugin code cannot run outside
   Figma: `layoutSizingVertical = "FILL"` set before the node was appended (the plugin's own helper
   says FILL throws outside an auto-layout parent), `minWidth` bound as a variable where nothing in
   the file binds it, and a padding token aliased to `Spacing/200`, which does not exist —
   `Layout/spacing/200` does.
2. **#38, the variant analysis made generated** (`18f422b`), and **#39** regenerating it. The
   document had told readers to regenerate it since 2026-08-24 and nothing ever could: the script
   printed to stdout and had no write path. Adding MetaStrip is what exposed it. Its data blocks
   now sit between markers written by `pnpm components:variant:write`, formatted with the
   repository's Prettier config so the generator and the pre-commit hook cannot disagree for ever.
   What three weeks of staleness had hidden: 98 components not 97, 29 with variant axes not 25,
   Figma absences down from 22 to 5, and **iOS and Android no longer at zero** — `Link` and
   `Spinner` each miss an axis.
3. **#40, `Semantics.Emotion`** (`aeefa3c`): `surface`, `onSurface` and `text` for six emotions, in
   both modes, every step chosen by contrast measurement. `surface`/`onSurface` is the ramp's
   100/900 — which is exactly what the product draws — and `text` is the first step reaching 4.5:1,
   which differs per emotion. **The product's own green fails**: its "Open" text is success/600 at
   2.74:1, so Kozmos's status green is deliberately darker.
4. **#41, an icons build break** (`e08ef3e`), found by #40's CI, which had no business touching
   icons. `createPointrIcon` rendered `children` from `LucideProps`, dragging React's `ReactNode`
   into a file where `lucide-react`'s types can resolve to a different `@types/react`. `main` had
   passed the same job: the lockfile carries both 18 and 19 across 334 references, so it was
   fragile rather than broken, and latent since #34.
5. **#42, the emotion axis on `Tag` and `Counter`** (`833d013`), across all three platforms. With
   `Button` (#32) the axis behind **80% of the product's mapped control instances** is closed. A
   `success` tag computes `#CBF5E0` on `#14653D` in a browser — the POI card's OPEN pill, reached by
   the role rather than copied.
6. **#43, the plugin dropdown** (`548a559`). Olcay opened the plugin to run the painter and
   MetaStrip was not there. `ui.html` says everything twice — a `<select>` and an action registry —
   and #37 had added it to one. A check now asserts the two agree; it was proven to fire.
7. **#44, MetaStrip's Code Connect** (`dcda8fb`), after Olcay ran the painter. The set is
   `1890:8911`, four variants, verified against what the painter intended before anything was
   pinned to it. **Core reached 69/69 in every column.** The first attempt's dry-runs passed without
   parsing MetaStrip at all.
8. **#45, the three defects** (`f08455f`). `cn` could not resolve the design system's own radius
   or elevation roles, so a caller's `rounded-control` was silently ignored; `ScrollArea` collapsed
   to zero height when it scrolled sideways; `BottomSheetContent` shipped an unnamed dialog.

Olcay also ran **Update All Core** in the plugin, taking build coverage from 0 of 94 to 71 of 95 —
the first time painter changes have reached the file since early September.

### 2026-09-15, evening, to 2026-09-17

1. **#45 and #46 merged** (`f08455f`, `1dd30f0`), the handoff corrected before it landed. CI green on
   the merged `main`, which no branch had built, and the eleven gates, `figma:verify` and the variant
   generator's idempotency checked beside it.
2. **§11's second component: the map mode toggle** (§11.3). Olcay shared the SDK prototype's
   tracking and step-free controls; they were measured out of the running page, ruled onto
   `MapControlButton` with tinted as the default, and built as **#47**. Looking at it running, Olcay
   caught a hover too dark and asked how a developer would know the reveal existed — which became
   `revealOnChange`.
3. **The inert-class family.** `MapControlButton`'s `bg-background/90` was not in the stylesheet at
   all. **#48** adds a check for every such class: 41 on `main` then, 40 now. A first count of 31
   came from a grep that missed `fill-`, `placeholder:` and `group-[…]:`; it was corrected wherever
   it had been written.
4. **npm readiness, #49.** Rulings 21 and 22; the install check; the stylesheet's global reset found
   and documented. The copyright holder was first written as "Vodo" and corrected to Vodoco before
   anything was committed.
5. **GitHub Actions refused every job** on 2026-09-16 and 2026-09-17 until Olcay unblocked the
   account. Per ruling 23, nothing merged on local verification alone.
6. **An audit on 2026-09-17**, asked for again, found more than any earlier pass. In #47: the reveal
   could stick open for ever; `filled` had never rendered a fill in React — which also made one of my
   earlier reports to Olcay wrong, since it described React's pressed state from the code without
   rendering it; a stacked caption at 1.9:1 on a fill on all three platforms; a spurious reveal on
   unset-to-false; iOS ignoring Reduce Motion; and no native tests. In #49: a types regression the PR
   itself had introduced in `@kozmos/tokens`, which none of its checks could see, so the install
   check gained a types ratchet, a file-type allowlist and React 18. In #48: an ordinary `"step/3"`
   string would have counted as a class. Every fix came with a test first run against the unfixed
   code, and the demo Artifact was republished with the fixes.
7. **#47 merged** (`f89b734`) once CI was green, and #48 took `main` and lowered its baseline to
   62/40/27.
8. **#48 merged** (`9bcb4cf`), then **#49** (`e9f5069`) after its textual conflict with #48 — both had
   added a script after `tokens:raw:check` and a CI step after _Verify No New Raw Values_ — was
   resolved by keeping both. The two checks were run together on a forced build of the merged tree
   first, then in CI, where the install check passed every stage; `main` was green after each merge.
9. **#50 and #51 merged** (`4ee7c95`, `a02a008`): this handoff, and then its first line, which still
   called #48 and #49 open.
10. **The switch to ChatGPT Astra** at `a02a008` — `docs/agent-switch-2026-09-17.md`. Re-measuring
    every claim it makes, with every check in §7 but the refused `figma:icons` run in a fresh worktree
    and all of them green, found four claims here wrong, now corrected: §3 still described `main`
    before #50 merged — its commit, an open PR and a deleted branch; 99 React components where there
    are 98, because a file had been counted; a lucide count in §6 that no method reproduces; and §4.5
    missing that a valid `NPM_TOKEN` publishes all four packages on its own.

### 2026-09-17 · Pre-publication foundations (Astra)

Olcay asked for the Claude work to be audited for deployment/npm readiness, landscape/foldables
and foundational changes before rebuilding Pointr modules. `prepublish-architecture-review-2026-09-17.md`
records the audit. A previous Astra statement that a missing changeset prevented first publication
was wrong and corrected: with a valid token, the current release path can publish all four
unpublished 0.0.1 packages without a version PR. No token or release setting was changed.

After “let's proceed with your recommendation”, the isolated review worktree was fast-forwarded
to the documentation-only `c274b06` handoff and renamed to `astra/prepublish-foundations`.
Shared `main`, Claude's worktrees, MAP-595 and Figma were not changed.

The first batch replaces React AdaptiveMapShell's viewport breakpoints and 448px minimum with
measured local geometry; adds typed usable-region, safe-area, panel-presentation and layout-output
contracts; measures top-bar/control coverage; resolves logical RTL; and preserves map/panel tree
positions across layout changes. It requires an explicitly bounded host height. No native shell,
gesture/detent implementation, automatic device detection or real map camera adapter is included.
See `adaptive-map-layout.md` for the API, coordinates, migration and next work.

Verification: the three initial browser regressions failed on the old build (360px host clipped a
416px side panel at x=-72; 390px landscape host grew to 448px; RTL end panel stayed right).
The expanded eight-scenario check was also run against the old shell and failed all eight, then
passed against the new build in Chromium and WebKit. It renders the shipped exports/CSS, including
POIDetailPanel and core controls, and checks geometry, padding, state/focus, mount count and live
direction changes. An additional empty-region accessibility assertion caught clipped-but-still-
exposed content; the slots now become hidden without unmounting. The CI web job runs both engines.

Local checks: package builds; React 359 tests/104 files; React lint; component contracts;
variant/completion/snippet checks; raw-value and compiled-class ratchets; packed-package install
checks for React 18 and 19 (three pre-existing declaration issues remain). Browser checks use
Playwright 1.58.2's Chromium/WebKit and installed Chrome. One intermediate class check raced a
concurrent build's dist cleanup and failed on missing CSS; rerunning after the build passed.
Native, live Figma, full Storybook/a11y and remote CI have not been run for this branch.

This is the first foundation only. Theme/portal/CSS isolation, native adaptive parity, real-device
and map-engine validation, API stability work and release controls remain before beta. The
existing full POI-detail-card Storybook example was not migrated; the browser regression fixture
uses the exported POIDetailPanel as a consumer, not a completed product flow.

### 2026-09-17 · Adversarial audit and overlay ownership (Astra)

Olcay asked again for an extensive audit and further recommended work. Auditing `b13f4d9` found
four adaptive defect classes: zero-width hosts left invisible controls exposed; a large requested
bottom panel could clip map controls to zero height; callback payload mutation leaked in both
directions; and a non-finite host inset could cancel a CSS safe area. Each was reproduced in the
built browser fixture before fixing it. The new minimum-chrome unit test failed first too.
`panelFraction` is now explicitly a request subject to measured content space, not unconditional.
See `foundation-audit-2026-09-17.md` for the evidence, API consequences and unfinished work.

Continued with a bounded prerequisite for scoped theming: the overlay content primitives accept
an explicit `portalContainer`. Dialog, Drawer, Popover, Menu and Select preserve their body default;
Tooltip preserves its inline default and portals when explicitly asked. BottomSheet inherits the
Drawer prop. Browser checks verify real containment, inherited tokens, Escape and focus restoration
for both defaults and explicit targets. The initial six primitive ownership tests failed before
implementation; the expanded matrix also covers BottomSheet and default-behavior preservation.

Checks: React 360 tests/104 files; 14 adaptive and 14 overlay checks in each of Chromium and WebKit;
React and new harness lint; component/snippet/variant/completion checks; unchanged raw-value and
compiled-class ratchets; tarball install/readme checks with React 18 and 19. The shared browser
fixture helper bundles built public exports, not source aliases; it is not itself an installed
React-peer browser matrix. Remote CI, full Storybook/a11y, native and live Figma checks were not run.
Shared main and Claude's worktrees remain untouched; no push/publication is authorized or performed.

Full provider/CSS isolation is **not done**: global theme mutation, storage/system-theme handling,
nested light/dark token/utility behavior, global reset/selectors and automatic portal propagation
through product compositions remain. Explicit container ownership also does not change Radix's
document-level modal semantics. Do not present this as scoped modal isolation or production readiness.

### 2026-09-17 · Module theme, portal and stylesheet foundation (Astra)

Olcay approved proceeding with the embedding-isolation foundation. ThemeProvider now owns a
layout-transparent DOM boundary rather than mutating `<html>`. It supports controlled state,
live system preferences, deterministic SSR/hydration and safe opt-in storage. A provider-owned
body-level portal root carries its resolved theme, explicit token overrides and direction;
all seven overlay types use it automatically unless an explicit destination overrides it.
Radix direction is provided through a direct `@radix-ui/react-direction` dependency, not merely
an inherited CSS attribute. Existing document-level modal semantics are retained.

The React stylesheet is bounded by native `@scope`, including nearest-root dark utilities.
Its preflight and generic utilities no longer style unrelated host content; `:scope` precedence
also prevents ordinary host reset/utility rules leaking inward. Keyframes are namespaced.
`@kozmos/react/reset.css` is a separate optional global reset. This is a breaking pre-publication
integration change: styled content needs a provider/scope. See `embedding-isolation.md` and the
React README for migration and the exact limits, including `rem` sizing and host `!important`.

**Decision pending, not a new ruling:** Olcay was asked whether the npm release may require
native CSS `@scope`. The implementation is local and provisional for that browser policy;
no minimum browser/WebView matrix has been approved or certified. Do not infer approval from
green current-engine checks. The older KozmosTheme/DesignConfigProvider surface still needs
consolidation/retirement: implicit persistence, duplicated effect IDs, global effects/fallbacks
and runtime variables outside automatic portal ownership remain. Neither provider consolidation
nor independently modal sibling widgets is claimed complete.

Evidence: five initial provider tests, seven automatic overlay ownership cases and the host
CSS probe failed before their fixes. A further host-border leak was reproduced and corrected.
The full React suite passes **368 tests in 105 files**. Chromium and WebKit each pass 14 adaptive,
21 overlay and 6 named theme/reset browser checks. React and harness lint, component contracts,
snippet/completion checks and unchanged raw-value/compiled-class ratchets pass. Regenerated
variant analysis honestly adds ThemeProvider's React `dir` axis as unmatched natively; the report
is current, not a claim that all platforms now have equivalent APIs. Tarball checks pass with
React 18/19, all 14 package exports and 10 README samples; the three known declaration issues
remain. React Storybook builds successfully; this is not a full visual/a11y audit.

No native/Figma source, shared main, parked product app, release workflow, credential, remote
branch or npm publication was changed. Next: resolve browser policy and legacy provider surface,
then native adaptive parity, real installed POI/routing consumer proof, remaining CSS/type debt
and release safeguards. Production readiness is still not established.

### 2026-09-17 · Scoped runtime configuration consolidation (Astra)

Olcay asked whether another pass was necessary and otherwise to proceed. Continued with
the next bounded foundation rather than another broad review. KozmosTheme is now a thin
compatibility name for DesignConfigProvider; that provider composes ThemeProvider and its
owned portals. It no longer injects into document fallbacks, paints page-wide noise, uses
fixed filter IDs or listens to global pointer movement. Initial/controlled configuration,
validated deep updates, safe explicit persistence, SSR hydration and declarative token
replacement are covered. An inherited theme observer must not suppress the parent's update;
that defect was reproduced while verifying the consolidation and corrected.

Breaking pre-publication migration: `KozmosTheme config` is now controlled; use `initialConfig`
for editable defaults. Configuration storage has no implicit key. Noise is limited to glass
backgrounds. The old dark glass selector now follows nearest scoped theme; depth and bevel
compose and disabled effects no longer leave visible bevel/spotlight styling. See
`embedding-isolation.md` and the React README for exact precedence and compatibility behavior.

Do not invent functionality for legacy fields: `preset` and `splay` never rendered an effect;
they are deprecated. `roundness`/`shadow` only drive legacy aliases, not semantic radius/elevation
roles, and are deprecated in favor of token customization. Experimental effects are not
cross-platform visual parity or a complete motion-accessibility policy. The existing 62 inert
class uses / 40 classes / 27 files and three declaration issues are unchanged.

Verification: six initial provider regression tests failed before fixes; the dark glass
browser assertion failed before its fix. React passes 379 tests / 106 files. Chromium and
WebKit each pass 14 adaptive + 21 overlay + 6 theme/reset + 5 runtime-configuration checks.
React and harness lint, contracts, snippet checks, radius/elevation checks, variant freshness,
raw/class ratchets, React 18/19 tarball installs with 11 README samples and React Storybook
build pass. Full visual/a11y, native/device, live Figma and remote CI were not run for this batch.

Next: native adaptive parity and real installed POI/routing consumer validation, while the
native CSS `@scope` browser/WebView policy remains an unresolved release gate. Publishing
safeguards, CSS/type debt and motion/a11y policy must still be closed before production.
No shared-main change, remote push, release change, credential use or publication occurred.

### 2026-09-17 · Component-owned CSS first slice (Astra)

Ruling 26 approved the recommended architecture after the `f8eb957` investigation.
`astra/browser-compatibility` now migrates Input, Textarea, Button, Popover,
FieldWrapper and Label to owned recipes and moves theme token definitions and
namespaced animations outside native scope. Remaining components are not migrated.
`component-owned-css-2026-09-17.md` is the maintenance/migration guide and evidence log.

The original ten WebKit failures now pass. The first slice is also tested after
removing all native scope rules. The audit reproduced and fixed description-ID/
invalid-state accessibility merging and empty-error/helper linkage. It recorded
Button's unsupported `asChild` API as a separate pre-release defect, not silently
implemented with an incomplete polymorphic contract. Raw-value checks now read CSS
recipes: moving styles must not hide debt. Inert references are 59/39/25; raw colours
remain 35/7 and raw radii 7/6. Three dead references were removed without claiming
their previously missing hover/placeholder visuals had been implemented.

Local verification: all package builds; 387 React tests/106 files; six build tests;
two browser-selection tests; 46 original + 13 form + two owned-CSS modes per engine
in Chromium, Firefox and WebKit; React 18/19 packed installs and README samples;
Storybook build and the contract/token/debt/snippet/variant checks. The guide states
limits and exact commands. PR #54's safeguards CI is green except the plan-blocked
Chromatic UI comparison; it is still open. This work is local, not pushed or published.

### 2026-09-17 · Composed fields and honest Button contract (Astra)

Olcay requested proceeding rather than another general pass, and a running Storybook.
Continued ruling 26 with PasswordInput/NumberInput's complete owned-CSS migration.
The RTL password-toggle defect and eight accessibility merge failures were reproduced
first, then fixed. A controlled NumberInput stepping test also failed (display changed
before parent acceptance); native stepping now proposes a value and restores the
controlled display before notifying the parent. Uncontrolled behavior is retained.

Implementation choice under the delegated recommendation: remove Button's unsupported
`asChild` declaration rather than promise a partly implemented polymorphic API. Native
Button props/ref/form semantics are unchanged; navigation uses Link or `buttonVariants`
on an anchor/router link. No repository consumer used the removed prop. Three negative
declaration assertions failed before removal and now pass against packed installs on
React 18 and 19. Radix trigger `asChild` is unchanged. See the React README for migration.

Verified: React build and lint; 400 tests / 107 files; six CSS-build tests; full and
scope-stripped owned styles, original form regression and all 46 prior browser checks
in Chromium/Firefox/WebKit; tarball install/type checks; Storybook production build;
contract, debt, snippet and variant checks. Existing declaration/variant/visual debts
are not waived. Native/device, live Figma and remote CI were not run for this batch.
Storybook's separate preview checkout is `/private/tmp/kozmos-owned-css-verify.dV1etM`
on port 6006; stop that server before rebuilding it. The guide contains exact commands,
source files and new RTL story IDs. No push, merge or publication, and no shared-main change.

Next: continue remaining field/overlay families, then remove legacy native scope entirely.
Real browser floors, physical adaptive devices, native parity, map-adapter consumer proof,
full accessibility/visual review and package/release gates still precede production.

### 2026-09-18 to 2026-09-19 · From the catalogue to a real Pointr host (Astra)

Astra's remaining batches never reached `main`. They sit on `astra/browser-compatibility`
in the worktree `/private/tmp/kozmos-browser-compat.uqPMBD`, 33 commits past `origin/main`,
unpushed: one public catalogue with platform reference tabs, the web POI reference examples
and their taxonomy-driven display, the native POI card brought up to them, and finally
`apps/PointrPlayground` — a real PointrKit 10.3.0 host on Design-QA with Kozmos-owned UI,
a browse-only milestone. Each batch has a dated report; `docs/README.md` lists them. The
handback to Claude Code is `claude-code-handoff-2026-09-19.md`, whose §8 names seven native
findings and whose §10 orders four passes. On `main`, Astra merged #53 and opened #54, which
is for review only. Nothing reached npm.

### 2026-09-19 · Pointr iOS Pass 1 (Claude Code)

Branch `claude/pointr-browse-repairs`, cut from Astra's at `663cde1` in the same worktree,
unpushed. Findings A–D measured and fixed; the measurements are in
`pointr-ios-pass1-2026-09-19.md`. Two of the fixes are the shared shell's, not the host's:
it now saturates opposing insets at the map's size as React's `resolveMapInsets` does, and
lays its top bar and controls out in the map beside a floating panel instead of under it.
The native gallery was rebuilt to React's contract. Two rules held: every new test was run
against the code it was written for and failed there first; every "fixed" was read from a
3× simulator screenshot, not from a passing test. E, F, G and Passes 2–4 are not started.
Five decisions wait on Olcay, listed in the report.

### 2026-09-19 · Pointr iOS Pass 2 (Claude Code)

Item E, `pointr-ios-pass2-2026-09-19.md`. Every one of Design-QA's 1,196 places was read
through the SDK before a line of mapping was written: no ratings, prices on a sentinel, seven
empty day schedules each, hours typed into two CMS keys, 269 places with Website and Call
buttons, six taxonomy properties among forty CMS keys. The web's taxonomy adapter now runs
natively over the same pinned 10.12.0 projection, generated for iOS by a script CI keeps
fresh; the SDK's buttons become contact actions the host opens, or a message when the device
cannot; hours are the venue's text and say so. Structured hours are not rendered: PointrKit
documents no day order. 31 tests in the app; Dunkin', Boston AMERICA! and a Terminal E lounge
checked live. Next: routing (Pass 3), and the six upstream findings for Pointr.

### 2026-09-19 · Pointr iOS Pass 3 (Claude Code)

Routing, `afa7bdf`, reported in `pointr-ios-pass3-2026-09-19.md`; the session handoff is
`claude-code-handoff-2026-09-19-pass3.md`. Go on the card opens a starting-point picker over the building's
places; the SDK calculates a normal and an accessible route, synchronously, in 15–77 ms; the
preview offers them as Quickest and Step-free with the routes' own time and distance; the
directions are stepped by hand, the map following each step's level and position. Measured
live: Dunkin' to Airport Shuttles, 200 m and 213 s in both modes, 4 steps against 10, the
elevator on both, the floor pill following the level change, Finish returning to the card.
Two findings: the directions arrived in Arabic until the SDK was asked for the app's language
(withdrawn 2026-09-20: the iPhone simulator's own first language, not a Cloud default); and the
four Kozmos direction arrows have no transition form, so an elevator
or a walkway keeps the SDK's words under a straight arrow — a design-system gap, not a host
patch. 41 tests in the app. Next: the pass's leftovers, then F, G and Pass 4.

### 2026-09-20 · Pointr iOS: Pass 3's leftovers closed (Claude Code)

`pointr-ios-pass3-closure-2026-09-20.md`, commits `65ddd1c`, `25629b3`, `cf75072`. The marker on the current
step is PointrKit's next-portal marker, read through MapLibre's public style API: one point
feature at the next transition's node, its icon named after the kind (`wf-custom-transition`,
`wf-lift-down`), no public API to it. No live no-route case: all 38 `Do Not Route` values on the
site are the string "false" and Silver Line routes. Readiness measured on eight launches, 240–330
ms after the building loads; the not-ready state now offers Try again and retries by itself when
readiness arrives, no route keeps "Choose another starting point". A new XCUITest drives the
routing flow on any simulator — the iPad included, which the desktop tool cannot — and attaches
each panel's screenshot and accessibility tree. VoiceOver got each step as three loose elements
with the arrow reading "Up" or "Remove Map Pin"; a step is now one element, the summary's icon
silent, the current step selected and announced. Withdrawn: Pass 3's "Design-QA answers in
Arabic" — the iPhone simulator's first language is Arabic, the iPad asked for nothing got English.
Also found: the building at launch varies (item G), two "Airport Shuttles" on one floor. Next: F,
G, Pass 4.

### 2026-09-20 · Design system pass (Claude Code)

Olcay redirected the work to the design system — "and if anything is missing, not to make the
app most functional" — with three examples. `design-system-pass-2026-09-20.md`, commits
`77b2ae7`, `04ca91a`, `400e097`, `bd4d3c8` and the docs commit. The card's name and its quick buttons now share one row on iOS, the web and
Android, the name wrapping to three lines at most: before, iOS and the web stacked the buttons
under a long name and Android cut it to one line. A long name is a shared fixture, in the
Storybook example and the native playground; the change is measured by a pixel-reading iOS
test, the browser suite's new header check (six failures on the old stylesheet, none on the new)
and an Android golden. The open level switcher names every level beside its short label, the
current one filled, trailing-aligned to the pill. Folded phones: Olcay chose the iPhone Fold
first; Xcode 26.6 has no device type, runtime or fold API for it, so the recommendation is to
bring the web shell's hinge-region model to the iOS and Compose shells ahead of the SDKs. F, G
and Pass 4 wait. Then Olcay named the reference for the screen states: the prototype at
`agentic-search-zeta.vercel.app`, over the older Figma boards. It was read through the DOM and
recorded in `pointr-prototype-screen-states-2026-09-20.md`: every state measured, mapped onto
Kozmos parts, five decisions (circular quick buttons, labels-only level list, Readex Pro, four
route modes on 132px cards, the step-free toggle's home) and the missing parts — a manoeuvre
card, a progress rail, an itinerary list, a gradient-ring AI search button, a pulsing location
marker. Olcay ruled the same afternoon: the 16px squares stay; system fonts per platform (already
the code's state — Readex Pro is only the unused brand token and the Figma text styles); no
wayfinding modes and no preview step, so the QA app's Go now opens the picker and the directions
follow at once (`6527d7a`, 40 app tests, the flow test green); the level list's form still his.
Audited the same evening at Olcay's request: the owned-CSS gate, skipped after the card's
stylesheet changed, run and green on three engines; the header test rewritten to tell one, two
and three lines apart (14.5, 39.5, 64.5 points at 320pt); the preview's unused estimate presenter
removed; the search bar's magnifier silenced and its clear button labelled on iOS, the Android
label aligned; the hidden pill taken out of VoiceOver's tree while the level list is open; the
operator's guide written (`kozmos-pointr-operators-guide-2026-09-20.md`).

### 2026-09-20 · The navigation parts (Claude Code)

On its own recommendation after the audit: the prototype's three navigation parts built on iOS,
React and Android — `navigation-parts-2026-09-20.md`, commits `3f360e2`, `e3353b7`, `e43941b`,
`bef76c9`, `536cdc1`, `f82f3fe`, `9783145` and the docs commit. A manoeuvre card over the map
that opens into the itinerary and is as tall as it up to a cap; an itinerary list with the
current step emphasised; a route progress rail whose disc travels by ground covered; and the
route summary's additive navigation layout — the destination with End, the stats on one row, the
rail. The QA app's directions and the fixture playground moved onto them; the Storybook has an
Examples/Navigation composition. Measured everywhere: the iOS render tests caught the rail's stack
centred a dot to the right and the open card taking its whole allowance (a `Layout` now proposes
the cap and takes the child's size); the new three-engine browser check caught the open card and
its itinerary sharing one landmark name, fixed on all three platforms. Gates: package 81/94/96,
CI step 52, app 39 and the flow test, react 507, `test:navigation` 20 × 3, Paparazzi verified.
Still open: the transition arrows, the rail's untokenised geometry, the card's translucency, the
QA sheet's detent while navigating, the level list's form. F, G and Pass 4 still wait.
Ruled the same evening: the rail's numbers stay; a glass surface role (§5.13) is built now on all
three platforms and the card and the summary take it; a compact detent in the shell; each
platform's own transition icons; the button-height finding withdrawn (44 everywhere by contract); the level list as built. The
branch was pushed to origin. Next: the glass role, the transition arrows, the search sheet.

## 11 · The work now: the SDK's components, rebuilt as examples

Olcay's instruction, 2026-09-14:

> "I now would like to focus purely on our design system project. I want to share with you the
> latest components that we have on the SDK and I want you to check components and build examples
> purely using design system components. If not possible report and ask."

So the loop is: **Olcay names an SDK component → it is checked against what Kozmos has → an example
is built from Kozmos components only → anything that cannot be built that way is reported, and the
work on it stops there until Olcay rules.**

Two things were settled on 2026-09-14 before the first component:

- **Olcay shares a Figma file and node ids.** So "check" means measuring, not guessing: read every
  node over the REST API, count what the file actually draws, and compare against the Kozmos library
  over the same API. `scan-all.mjs` in the coverage work is the shape — walk the node, count
  instances, text styles, fills, strokes and radii, and fetch child by child when a page is too
  large for one response.
- **A "partial" part is built, and the deviation recorded.** Use the Kozmos component, write down
  exactly which axis or value it could not express, and carry on. Stopping on every partial would
  stop on most components, since 80% of the product's control instances are partial; building
  silently would hide the gap. So the example ships and says where it differs.

### The rule that makes it useful

An example may use **only** what `@kozmos/react` exports, its tokens and its roles. No hand-rolled
markup standing in for a missing component, no raw hex, no one-off class that quietly reinvents a
part. The point of the exercise is to find out what the design system cannot do, and every
workaround destroys exactly the evidence being collected.

When something cannot be expressed, it goes on the gap list with four things:

1. the SDK component and the part of it that has no Kozmos equivalent,
2. what was tried,
3. the lane it belongs to — Core, Product / SDK, or an example (§5.5),
4. the evidence: how often the product draws it, from
   `docs/product-ui-coverage-2026-09-14.md` where the scan already counted it.

Then it is reported and asked about. It is not built, not approximated, and not deferred silently.

### Where an example lives

`apps/docs/stories/examples/` holds them as Storybook stories; `MapSearch.stories.tsx` is the one
that exists today and is the shape to follow. The Figma counterpart is the `Examples` page
(`286:1601`) in the Core Library, painted by the plugin, never drawn by hand (§5.8).

### What "checked" means before anything is built

The scan already did most of this once. For each SDK component, read
`docs/product-ui-coverage-2026-09-14.md` §3 first: it maps 30 control groups to their Kozmos
component with a verdict of covered, partial or missing, and it counted 763,776 nodes to get there.
An SDK component built from "partial" parts will come out close but not identical, and **that is a
finding, not a failure** — record which axis was missing.

The one axis known to be missing everywhere is `Emotion`, and #32 closes it for `Button`. `Tag` and
`Counter` still cannot express it, and they need semantic emotion roles in the tokens first, because
the existing six-emotion tokens are named for buttons and a Tag reaching into them would break the
roles discipline (§5.1).

### 11.1 · The first component, 2026-09-14: `fullPOIDetailCard`

Olcay shared the POI Details Card Revamp card (`HbFSXhCPxKUy2fWa5x9TKO`, node `241:4772`). It was
read over the REST API — 375×3183, **886 nodes**, 52 distinct instances, 126 visible text nodes,
**22 attribute sections** carrying 71 value tags and 3 payment brand marks — and rebuilt as
`apps/docs/stories/examples/POIDetailCard.stories.tsx` (**PR #33**), with
`docs/poi-detail-card-gaps-2026-09-14.md` recording every deviation.

**Two of its four top-level parts have no Kozmos equivalent** — the `poiMetaInformation` meta strip
and `openingHours` with its day rows — so the story names them in an `Alert` and renders nothing in
their place. Ruled the same day: build both, `MetaStrip` in Core and opening hours as a Product /
SDK example. **That is the next piece of work.**

**The largest blocker was not a component but the icon set.** `@kozmos/icons` held 38 glyphs; the
card draws 19 and 14 had no Kozmos name. **PR #34** adds 13 of them carrying the Pointr Icon
Library's own outlines, generated by `scripts/build-pointr-icons.mjs` (`pnpm icons:pointr:build`) —
each verified to be the component this card instantiates, matched **by component key, not by name**.
The 38 lucide mappings are untouched, so nothing already in the library moves while Chromatic cannot
compare. The fourteenth, the accessibility facility glyph, is in a different library and is still
missing; it is drawn 1,213 times across 7 surfaces, the most-used single glyph the scan found.

Two things the session got wrong and corrected, both worth the next reader's attention: the example
first rendered **ten** sections with invented values, which made it look like coverage rather than a
measurement — every label and value is read from the node now, with visibility resolved through
parents; and owning an outline while the package still re-exported lucide put **two different
Hearts** under one name, which is why §6.3 exists.

`figma:icons` fails for a narrower reason than this file used to say: it calls
`/files/{key}/components`, which needs `library_content:read`. `/v1/files/{key}/nodes` and
`/v1/images` both work on the token's `file_content:read`, which is how the outlines were exported.

**Everything it found is now built, 2026-09-15.** `MetaStrip` is a Core component on all three
platforms with a painted Figma set (`1890:8911`) and linked Code Connect — 69/69. Opening hours is a
Product / SDK example. The icon set carries the 13 glyphs it needed. `Tag` and `Counter` express the
`emotion` axis, reading `Semantics.Emotion`. The three defects it exposed are #45, merged.

**Still open from it:** the accessibility facility glyph (§6.5), the payment brand marks (§6.4), and
its Figma counterpart on the `Examples` page (`286:1601`), which §5.8 says the plugin paints and
which has no painter.

### 11.2 · What the loop has proved

The pattern is clear enough to rely on. Rebuilding one SDK component from Kozmos
parts finds more than a scan does, because a scan counts what exists and a rebuild exercises it:
the POI card produced a missing Core component, a missing example, fourteen missing icons, a missing
semantic token family, three component defects, a broken plugin menu, a documentation lie, and a
latent build break — none of which any gate had reported.

The second component, the map mode toggle (§11.3), confirmed it: a control that had been transparent
over the map for three weeks, a filled state that never rendered, a timer that could stick open, a
contrast failure on all three platforms, native code with no tests, and a class of Tailwind usage no
gate had ever read.

So the next SDK component is worth more than the next item on a list. It needs Olcay to name one.

### 11.3 · The second component, 2026-09-15: the map mode toggle

Olcay shared the tracking (`Focus`) and step-free controls from the SDK prototype at
`https://agentic-search-zeta.vercel.app/` and asked whether they wanted a new component or a change
to an existing one. They were measured out of the running page — computed styles, bounding boxes,
timed samples — and `docs/map-mode-toggle-gaps-2026-09-15.md` records all of it.

**The prototype draws one pattern twice, disagreeing with itself on six things**: whether "on"
colours the border, icon size (16 or 20), surface opacity, dwell time (2.5s, or 1.4s then 3s),
whether the state reaches assistive technology at all, and whether the accessible name says the
state. Both controls are `div role="button"` that cannot be reached by keyboard, and the
recalculation is silent — reported back to the SDK, not reproduced.

**Built in #47** (rulings 19 and 20): `emphasis` (tinted default, filled kept), `labelPlacement`,
`revealOnChange` with `revealDelay` and `revealDuration`, and `useRevealOnChange`; the radius
corrected from three different wrong roles to `control`; the surface that never compiled; the hover
lightened from the border grey to `muted`; `MapControlsGroup` stopped overriding its own child; and,
from the audit, the five fixes in §10 and a pure appearance type with tests on iOS and Android.
Rendered in Chrome and measured: tinted keeps white with a `#1051E8` glyph and edge; filled is
`#0D44C2` with white text and icon.

**Stops here:** Figma's tinted state (§6.8); the in-surface status message (§4.4); and
`revealOnChange` on native, which is React-only.

An interactive demo that bundles the real component is at
`https://claude.ai/artifact/AF8zyKTohcUrpcC2pnMb5Z`.

### What is already known to be missing

Straight from the scan, so an example that needs one of these will stop at the same place:

| Missing                              | Lane          | Product usage                                    |
| ------------------------------------ | ------------- | ------------------------------------------------ |
| Toolbar and ToolButton               | Core          | 10 surfaces, 1,013 instances                     |
| DragHandle                           | Core          | 5 surfaces, 532                                  |
| Filter                               | Core          | 3 surfaces, 139                                  |
| Carousel                             | Core          | 3 surfaces, 69                                   |
| Opening hours with a per-day row     | Product / SDK | 5 surfaces, 410                                  |
| Countdown timer                      | Product / SDK | 5 surfaces, 9                                    |
| A building-plus-level scope selector | Product / SDK | wider than `FloorSelector`                       |
| An in-surface status message         | Core          | the eight parts; the map toggle's "Calculating…" |

Everything verified by running it; nothing here is recalled.
