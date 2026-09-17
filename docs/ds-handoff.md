# Kozmos design system — handoff for the next session

Written 2026-09-13, refreshed 2026-09-17 after #45 to #47 merged and #48 and #49 opened (§10). It
carries the verified facts of the 2026-09-12 to 2026-09-15 versions forward; every number here was
read from the repo, GitHub, npm, the Figma REST API or a rendered build on 2026-09-17 by the command
shown beside it, unless marked "last measured".

## 0 · Start here

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

## 3 · The system today — measured 2026-09-17

| Thing            | State                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `origin/main`    | `e9f5069` — every PR through #49 merged (`git log -1 origin/main`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Open PRs         | **one — this one.** #50, the handoff. Merged 2026-09-17, in order: #47 the map mode toggle, #48 `components:classes:check`, #49 npm publish readiness and `packages:install:check` — #49 after its textual conflict with #48 was resolved by keeping both lines, and both checks were verified together locally and in CI                                                                                                                                                                                                                                                                                                                                    |
| Branches         | `origin` carries `main`, `codex/handoff-2026-09-17` (#50) and `codex/wayfinding-map-panel` — the last is MAP-595's prototype, parked (§9). Everything merged has been deleted                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Packages         | `@kozmos/react` `tokens` `icons` `vue` `product-contracts`, all `0.0.1`, never published — `npm view @kozmos/react` is a 404 and `git tag` lists nothing. Since #49, `vue` is private, all five carry `license: MIT`, and the four public ones a LICENSE file and README (§4.5)                                                                                                                                                                                                                                                                                                                                                                              |
| React components | 99 directories in `packages/react/src/components` (`STATUS.md`: **Core 69** · Code-only 5 · Product/SDK 22 · Platform 2). **353 React tests**; iOS **57** (`swift test`); Android **25** unit tests plus `verifyPaparazziDebug`                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Figma            | `Kozmos DS - Core Library` `Yj4O8p6Y9h2Sa9zJVoAiVY`, Components page `4:4`, MetaStrip `1890:8911`. `pnpm figma:verify` on 2026-09-17: **95 of 95 sets**, presence and variant drift clean. **Build coverage 71 of 95** on `dd9f78a05cc0`; the 24 on `3e597100b157` are the Product / SDK lane. Two standing findings: **5 children overflow their box** and **29 icons are typed as characters**. **`MapControlButton`'s `State=Pressed` still paints filled** while code renders tinted — `figma:verify` compares structure, not paint (§6)                                                                                                                 |
| Tokens           | **641 light + 641 dark** (`docs/figma-library-manifest.json`), up 18 for `Semantics.Emotion` (#40). 1,412 variables in the file (last measured 2026-09-03). **18** values carry floating-point noise — four font sizes, five letter-spacings, one line height, one paragraph spacing, and seven unitless numbers                                                                                                                                                                                                                                                                                                                                             |
| Typecheck        | `pnpm --filter @kozmos/react typecheck`: **0 errors**, and since #27 it sees all 92 `*.figma.tsx` files. The package's `build` runs the same `tsc`, so CI catches a regression                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Gates            | the eleven in §7 green on 2026-09-17, plus `pnpm native:check` and the STATUS check. Since #48 and #49, CI also runs `components:classes:check` — a ratchet at **62/40/27** — and `packages:install:check`. `tokens:raw:check` is a ratchet: 35 raw colours across 7 components, 7 raw radii across 6 — unchanged                                                                                                                                                                                                                                                                                                                                            |
| Chromatic        | **snapshot limit** since early September — nothing has been visually compared since, including a shadow change across 27 components and #19's animation fix; `UI Tests` shows PENDING on every PR for that reason                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| CI on `main`     | green on `e9f5069` — CI (web, iOS and Android), Visual Regression, Bundle Size, Lighthouse and Release all succeeded, and the release job ran `packages:install:check` before skipping publish. `Release Kozmos System` runs after CI and skips publish while `NPM_TOKEN` is absent. **GitHub Actions refused every job on 2026-09-16 and 2026-09-17** — "recent account payments have failed or your spending limit needs to be increased", no steps run — until Olcay unblocked it on 2026-09-17. Runs now warn that `actions/checkout@v4`, `actions/setup-node@v4` and `pnpm/action-setup@v3` target Node 20, which is deprecated and forced onto Node 24 |
| Release path     | `.changeset/` holds only `config.json`; `release.yml` runs on CI success on `main`, skips publish when `NPM_TOKEN` is missing or invalid — inferred **not configured** (the registry has nothing and the run was "success")                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Working tree     | `/Volumes/4TB Depo/development/K/kozmos-design-system-dev`, shared with parallel sessions that switch branches and leave work uncommitted — stage by path, never `-A`; build branches in a `git worktree` under the scratchpad                                                                                                                                                                                                                                                                                                                                                                                                                               |

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
| Changesets, `NPM_TOKEN`, the `@kozmos` scope | not done — the first release is an account action plus a changeset                                                                                                                                                                                                                             |
| Chromatic                                    | still on its limit: a publish would ship visuals nobody has compared since early September                                                                                                                                                                                                     |

The mechanics, now that #49 has merged: a changeset per package (`pnpm changeset`, "minor" for a first
`0.1.0`), merge → CI green → `release.yml` runs the install check, then opens the version PR → merge
it → the same workflow publishes with `NPM_TOKEN` (an automation token for the `kozmos` org). Semver
from `0.1.0`: breaking changes are minors until `1.0`. `emphasis` defaulting to tinted is one.

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

## 6 · Open — waiting on Olcay

Eleven of the twelve that stood here were ruled on 2026-09-14 and moved to §5. What is left needs an
action rather than an answer, needs a designer, or is work with nobody blocked on it (§6.3).

1. **Chromatic — raise the plan.** Ruled: raise it. This is an account action only Olcay can take.
   Until it happens nothing has been visually compared since early September, including a shadow
   change across 27 components and #19's animation fix, and `UI Tests` shows PENDING on every PR. It
   should land before the first npm publish, or that publish ships visuals nobody compared.
2. **The other 38 icons.** The set names **51**: 13 carry Pointr's own outlines (§11.1) and 38 are
   still lucide look-alikes. Migrating them changes the artwork of icons used across the library, which wants a
   visual gate — so it waits on Chromatic. Beyond them, **70 of 99** React components import
   `lucide-react` directly and bypass the registry entirely (measured 2026-09-15).
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

Memory files: `kozmos-session-handoff-pointer` · `kozmos-verify-before-asserting` ·
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

## 10 · The log, 2026-09-13 to 2026-09-17

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
