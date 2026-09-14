# Kozmos design system — handoff for the next session

Written 2026-09-13, refreshed 2026-09-14 after that day's five merges (§10). It carries the verified
facts of the 2026-09-12 and 2026-09-13 versions forward; every number here was read from the repo,
GitHub, npm or the Figma REST API on 2026-09-14 by the command shown beside it, unless marked "last
measured".

## 0 · Start here

Paste this as the first message of the new chat:

> Continue the Kozmos design system work. Read `docs/ds-handoff.md` first — it holds the scope, the
> priorities in order and the measured state. Then `docs/ds-scope-2026-09-12.md` (what is missing)
> and `docs/style-playbook.md` (how to change how it looks). The subject is the design system only:
> the packages under `packages/`, the Figma Core Library and its plugin, the checks, the docs.
> MAP-595 and `apps/mapscale-review` are parked — do not work on them unless asked in so many words.
> Start with §4.3. §4.1 and §4.2 are done: the product UI scan is
> `docs/product-ui-coverage-2026-09-14.md`, and what it found reshapes §6.

Read order: this file → `docs/ds-scope-2026-09-12.md` → `docs/style-playbook.md` →
`docs/gap-audit-2026-09-05.md` → the memory files in §8. `docs/session-handoff.md` is the long
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

## 3 · The system today — measured 2026-09-14

| Thing            | State                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `origin/main`    | `da0a312` — every PR through #28 merged, except #17, which was closed (`git log -1 origin/main`)                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Open PRs         | **none.** Merged 2026-09-14, in order: #24 the evening handoff (`c2c7510`), #25 the tidy-up (`196ae85`), #26 the Android dimension fix and the native token sync (`682bed3`), #27 the Code Connect typecheck (`cb97967`), #28 the regenerated manifest (`da0a312`)                                                                                                                                                                                                                                                                          |
| Branches         | `origin` carries **`main` and `codex/wayfinding-map-panel` only** — the latter is MAP-595's prototype, parked (§9). The five merged branches and the two older merged-and-kept ones were deleted on 2026-09-13 and 2026-09-14                                                                                                                                                                                                                                                                                                               |
| Packages         | `@kozmos/react` `tokens` `icons` `vue` `product-contracts`, all `0.0.1`, `publishConfig.access: public`, never published — `npm view @kozmos/react` is a 404 and `git tag` lists nothing                                                                                                                                                                                                                                                                                                                                                    |
| React components | 97 directories in `packages/react/src/components` (`STATUS.md`: Core 68 · Code-only 5 · Product/SDK 22 · Platform 2; GlassSettingsPanel excluded). iOS and Android carry the same 97 names; Vue wraps them all                                                                                                                                                                                                                                                                                                                              |
| Figma            | `Kozmos DS - Core Library` `Yj4O8p6Y9h2Sa9zJVoAiVY`, Components page `4:4`, Product / SDK section `1340:6764`. `pnpm figma:verify` on 2026-09-14: **94 of 94 sets present**, structure matching what the importer would generate, and all 94 on one earlier build (`3e597100b157`) while the plugin now hashes to `6cf5b38fff51` — the gap is the resumability change that touched no painter. Two reported-not-enforced findings, both new to this file: **5 children overflow their box** and **29 icons are typed as characters** (§4.1) |
| Tokens           | **623 light + 623 dark** (`docs/figma-library-manifest.json`, regenerated 2026-09-14; the 601 the last version reported was four weeks stale). 1,412 variables in the file (last measured 2026-09-03). **18** values carry floating-point noise, not the two named before — four font sizes, five letter-spacings, one line height, one paragraph spacing, and seven unitless numbers (the two motion durations and the five glass-effect values)                                                                                           |
| Typecheck        | `pnpm --filter @kozmos/react typecheck`: **0 errors**, and since #27 it sees all 92 `*.figma.tsx` files. The package's `build` runs the same `tsc`, so CI catches a regression                                                                                                                                                                                                                                                                                                                                                              |
| Gates            | the eleven in §7 green on 2026-09-14, plus `pnpm native:check`. `tokens:raw:check` is a ratchet: 35 raw colours across 7 components, 7 raw radii across 6 — unchanged                                                                                                                                                                                                                                                                                                                                                                       |
| Chromatic        | **snapshot limit** since early September — nothing has been visually compared since, including a shadow change across 27 components and #19's animation fix; `UI Tests` shows PENDING on every PR for that reason                                                                                                                                                                                                                                                                                                                           |
| CI on `main`     | **green on `da0a312`** — CI, Bundle Size, Visual Regression and Lighthouse all success, 2026-09-14. `Release Kozmos System` runs after CI and skips publish while `NPM_TOKEN` is absent                                                                                                                                                                                                                                                                                                                                                     |
| Release path     | `.changeset/` holds only `config.json`; `release.yml` runs on CI success on `main`, skips publish when `NPM_TOKEN` is missing or invalid — inferred **not configured** (the registry has nothing and the run was "success")                                                                                                                                                                                                                                                                                                                 |
| Working tree     | `/Volumes/4TB Depo/development/K/kozmos-design-system-dev`, shared with parallel sessions that switch branches and leave work uncommitted — stage by path, never `-A`; build branches in a `git worktree` under the scratchpad                                                                                                                                                                                                                                                                                                              |

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
- **Still open:** `tokens:raw:check` at 35 raw colours and 7 raw radii. Twenty-nine of the colours
  are the same `bg-white/70` on three map cards and clear the moment a **glass** surface role exists
  (§6.5).
- **Still open:** the 18 floating-point values. They are noise from a Figma export, not decisions,
  but rounding them is a visual change to every text style, so it belongs with the type-scale ruling
  (§6.3) rather than before it. `Primitives.Typography.font.size` is read by no platform, and the
  `letterSpacing` and `line.height` scales are unused.
- **Still open:** native enum names inconsistently prefixed (`AlertStatus`, `BadgeVariant`,
  `ChipSize`, `CounterTone`, `SegmentedControlSize`, `StackDirection`); `AlertStatus.Error` maps to
  React's `destructive`. Cosmetic but breaking — do it once, with deprecated aliases, before a
  publish (§6.7).

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
The token disagreements need one ruling: which palette, numbering and brand blue the design system
is canonical for — the product's tokens are what the running dashboard implements ("our current
implementation uses these exactly", 2026-09-11), and a design system the product cannot adopt
without a retheme satisfies nothing.

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
  grid, a horizontal paged level selector, map tracking mode, a no-results card, error and
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

### 4.5 · Get ready for npm publish

What exists: five public packages with `files: ["dist"]`, `main`/`module`/`types`, an `exports`
map on four of them (`@kozmos/tokens` has none), `sideEffects` on react, peer ranges for React 18/19,
a changesets config (`access: public`, `baseBranch: main`), `release.yml` (build → verify
`NPM_TOKEN` → `changesets/action`: a version PR, or publish), a Storybook publish workflow. The
names are free on npm today (`npm view @kozmos/react` → 404).

What is missing, measured on 2026-09-13:

| Gap                                                                                                                                                                                                                                                            | Check                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| No `LICENSE` at the root or in any package; no `license` field in any `package.json`                                                                                                                                                                           | `ls LICENSE*`; `node -e 'console.log(require("./packages/react/package.json").license)'`                      |
| No `README.md` in any package (npm shows the package README)                                                                                                                                                                                                   | `ls packages/*/README.md`                                                                                     |
| No `repository`, `homepage`, `bugs`, `keywords`; `description` only on contracts                                                                                                                                                                               | the same one-liner per field                                                                                  |
| No changesets, so `changeset version` has nothing to bump; `0.0.1` everywhere                                                                                                                                                                                  | `ls .changeset`                                                                                               |
| `NPM_TOKEN` not configured; the `@kozmos` scope not claimed on npm                                                                                                                                                                                             | the Release run says "success" while the registry has nothing; `npm org ls kozmos` once logged in             |
| `@kozmos/tokens` has no `exports`: consumers deep-import `dist/css/…` by path                                                                                                                                                                                  | decide subpaths: `./css`, `./scss`, `./js`, `./ios`, `./android`                                              |
| `@kozmos/vue` depends on `@kozmos/react` and ships a React root per instance                                                                                                                                                                                   | the §6 decision: shipped package or internal convenience                                                      |
| `@kozmos/icons` peer-depends on `lucide-react` and renders artwork that differs from Figma                                                                                                                                                                     | `docs/gap-audit-2026-09-05.md` §4                                                                             |
| No `npm pack` smoke test: install each tarball in a fresh project and import it. Not theoretical — #27 put 92 `*.figma.d.ts` files into `dist`, which `files: ["dist"]` would have published; found by counting `dist` against the pre-#27 build, fixed in #30 | `pnpm -r exec npm pack --dry-run`, then a scratch project; `find packages/react/dist -type f \| wc -l` is 204 |
| The CSS entry is `@kozmos/react/dist/style.css` — document it, or expose `./style.css`                                                                                                                                                                         | `packages/react/package.json` `exports`                                                                       |
| No CHANGELOG (changesets writes them on the first version PR)                                                                                                                                                                                                  | —                                                                                                             |
| Chromatic on its limit: a publish would ship visuals nobody has compared since early September                                                                                                                                                                 | §3                                                                                                            |
| Provenance and the Node engine                                                                                                                                                                                                                                 | `--provenance` needs `id-token: write` in `release.yml`; `engines.node >= 20` is set at the root only         |

The mechanics, once the gaps are closed: a changeset per package (`pnpm changeset`, "minor" for a
first `0.1.0`), merge → CI green → `release.yml` opens the version PR → merge it → the same workflow
publishes with `NPM_TOKEN` (an automation token for the `kozmos` org). Semver from `0.1.0`:
breaking changes are minors until `1.0`.

## 5 · Decided — do not reopen

1. **A value that depends on another value is derived, not written** (radius, border, elevation
   roles; `docs/style-playbook.md`).
2. **The roles:** radius `none · marker 4 · control 16 · container 20 · panel 24 · pill`; border
   `Subtle` (`#C7CAD1`, 1.6:1, container edges and dividers) and `Input` (`#747B8B`, 4.2:1, things
   you interact with); elevation `raised · floating · overlay`, native following dark mode.
3. **Only a `SLOT` node carries a slot binding**, and a component's own property never drives a node
   inside its slot or a nested instance — bound defaults sit beside the slot.
4. **Update, never Rebuild**, in the plugin: Rebuild mints new node ids and Code Connect pins the old.
5. **Lanes:** Core is domain-neutral; Product / SDK compositions are examples by policy — existing
   sets are deprecated in place, never deleted; Platform / Form-Factor is its own lane.
6. **Checks scan everything and name only the exceptions** — a check that lists its consumers only
   confirms what someone already looked at.
7. **Verify against a clean checkout, not the working tree**; measure, then report.
8. **The Figma file is painted by the plugin**, not drawn by hand and not written by MCP.

## 6 · Open — waiting on Olcay

1. ~~PR #17's split~~ — done 2026-09-13: #22, #21 and #23, all merged; #17 closed, its branch kept (§4.1).
2. **Which tokens the design system is canonical for.** Measured 2026-09-14 and much smaller than
   it looked: **79.1% of the product's opaque fills are already a Kozmos token value**, and the
   "opposite numbering" is one ramp with two names that Kozmos already defines — `background`
   ascending, `foreground` descending. What actually needs a ruling is (a) the **brand blue**,
   `#346DF1` in the product against `theme.500` `#135BEC` and `theme.600` `#1051E8` in Kozmos, and
   (b) which naming is canonical. The shipped Web SDK still uses `--pointr-*`. Take it before the
   scan's gap list is built into anything.
3. **The type scale** — measured 2026-09-14, and smaller than it looked. 72.9% of product text
   already sits on a Kozmos size; adding **12 and 15** takes it to 93.4%, and the floating-point
   noise sits on 11.008 and 13.008, which are the product's two dominant steps (45.3% and 15.3%).
   The claim that "the product runs at 12" was wrong: 12px is 14.4%.
4. **Chromatic** — raise the plan, wait for the period, or enable TurboSnap; a publish without a
   visual gate is a publish nobody compared.
5. **A glass surface role** — clears 29 of the 35 raw colours.
6. **`@kozmos/vue`** — a shipped package or an internal convenience (it cannot SSR and makes every
   consumer ship React).
7. **Naming normalisation of native enums** — once, with deprecated aliases, before the first
   publish.
8. **The brand font** — **do not drop `Brand`.** The product is 93.8% Readex Pro (measured
   2026-09-14 across 118,529 text nodes), so the role matches what the product actually sets. The
   real question is the CJK gap and whether to scope it with `unicode-range`. Figma still renders
   Inter.
9. **iOS snapshots in CI** — the harness works; it needs a pinned runner image and a simulator.
10. **An `Emotion` axis on `Button`, `Tag` and `Counter`** — new, from the 2026-09-14 scan and the
    largest single gap in the system. The product drives six emotions and uses all six (Themed,
    Neutral, Success, Danger, Informative, Alert); the components expose none of them, mapping only
    `danger` to `destructive`. `Components.{Primary,Secondary,Tertiary} Buttons` already carry all
    six with `idle/hover/pressed/focus`, so this is a component API change, not a retheme. It gates
    80% of the mapped control instances in the product.
11. **A radius role for 8px** — new, from the same scan. 52.5% of every rounded corner in the
    product is 8px and no `Semantics.Radius.*` names it: `Marker` is 4 and `Control` is 16. Either
    `Control` moves to 8 or a role is added between the two. Rule on it before anything is rebuilt
    against the roles (§5.2 is otherwise decided).
12. **RoutePreviewPanel's five states look like two; MapOverlay's `position` is not a Figma axis;
    LocationPin's `variant` and `labelPlacement` stay renderer concerns** — recorded, revisit if a
    designer asks.

## 7 · Where everything is, and how to check it

| Thing                         | Path or command                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| What every document is        | `docs/README.md` (current · generated · parked · archived); `docs/archive/README.md` for the superseded |
| The scope answer and gap list | `docs/ds-scope-2026-09-12.md`                                                                           |
| How to change how it looks    | `docs/style-playbook.md` (roles, cookbook, traps, checks)                                               |
| The long record               | `docs/session-handoff.md` (§3 reasoning; §6 risks; §7 every check)                                      |
| The overnight gap audit       | `docs/gap-audit-2026-09-05.md`                                                                          |
| SDK primitives, ranked        | `docs/sdk-module-primitives.md`                                                                         |
| The Figma plugin              | `figma/foundations-importer/code.js` (+ `ui.html`, `manifest.json`); ⌘Q Figma after every change        |
| Component number table        | the same file, search `name: "<Component>/`                                                             |
| Figma Core Library            | `Yj4O8p6Y9h2Sa9zJVoAiVY`, Components page `4:4`, Product / SDK section `1340:6764`, Examples `286:1601` |
| Code Connect                  | `figma.config.json`, `figma.linked.config.json`, `packages/{ios,android}/figma.linked.config.json`      |
| Tokens source                 | `packages/tokens/src/tokens-{light,dark}.json`, built by `packages/tokens/build.mjs`                    |
| Generated status              | `STATUS.md` (`pnpm exec tsx scripts/skills/check-completion.ts --check`)                                |
| Storybook                     | `apps/docs` (React on 6006, Vue on 6007)                                                                |

```bash
pnpm tokens:elevation:check && pnpm tokens:border:check && pnpm tokens:radius:check \
  && pnpm tokens:typography:check && pnpm tokens:contrast:check && pnpm tokens:raw:check \
  && pnpm figma:plugin:check && pnpm components:contract:check && pnpm figma:stamp:check \
  && pnpm docs:snippets:check && pnpm components:variant:check
pnpm native:check                 # Swift + Kotlin compile, ~6s (Android needs packages/android/local.properties)
pnpm figma:verify                 # the live file against the plugin; needs FIGMA_ACCESS_TOKEN in .env (expires 2026-11-24)
pnpm figma:icons                  # refused by the current token: wants library_content:read, which it does not carry
pnpm tokens:radius:nesting        # concentric radii; --strict is what CI runs
pnpm figma:publish:linked:dry && pnpm figma:publish:native:linked:dry
git worktree add --detach /tmp/verify HEAD && cd /tmp/verify   # measure a clean checkout, not the tree
```

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
- **Stacked PRs:** GitHub does not retarget them; merging blind lands in the base branch.
- **Agent fan-out:** cap the candidate list before multiplying it — a scope audit once burned 5.16M
  tokens on ~330 candidates × 3.

Memory files: `kozmos-session-handoff-pointer` · `kozmos-verify-before-asserting` ·
`kozmos-audit-then-proceed` · `kozmos-shared-checkout-stage-by-file` · `shell-is-zsh-three-traps` ·
`bash-tool-set-e-does-not-gate` · `kozmos-never-rebuild-in-plugin` · `kozmos-plugin-may-run-stale-code`
· `kozmos-bound-property-beats-painter` · `kozmos-frame-is-not-a-slot` ·
`figma-pages-read-empty-until-loaded` · `figma-hidden-instances-read-layerless` ·
`figma-ask-before-replacing-a-node` · `kozmos-stacked-pr-runs-only-ci` · `kozmos-token-roles`.

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

## 10 · The log, 2026-09-13 and 2026-09-14

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

**What that leaves.** §4.1 and §4.2 are done. §4.3 is next, and it now has measured input. The next piece of
work is §4.2, the product UI scan — the second of the five priorities and the largest remaining
one. Three decisions block what comes after it: which tokens the system is canonical for (§6.2),
the type scale (§6.3), and Chromatic (§6.4), which has compared nothing since early September.

Everything verified by running it; nothing here is recalled.
