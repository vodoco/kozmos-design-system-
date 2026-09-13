# Kozmos design system — handoff for the next session

Written 2026-09-13 and refreshed that evening, after the day's five merges (§10). It replaces the
2026-09-12 version of this file (PR #19) and carries its
verified facts forward; every number here was read from the repo, GitHub, npm or the Figma REST API
on 2026-09-13 by the command shown beside it, unless marked "last measured".

## 0 · Start here

Paste this as the first message of the new chat:

> Continue the Kozmos design system work. Read `docs/ds-handoff.md` first — it holds the scope, the
> priorities in order and the measured state. Then `docs/ds-scope-2026-09-12.md` (what is missing)
> and `docs/style-playbook.md` (how to change how it looks). The subject is the design system only:
> the packages under `packages/`, the Figma Core Library and its plugin, the checks, the docs.
> MAP-595 and `apps/mapscale-review` are parked — do not work on them unless asked in so many words.
> Start with §4.1, Tidy up.

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

## 3 · The system today — measured 2026-09-13

| Thing            | State                                                                                                                                                                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `origin/main`    | `8f81912` — every PR through #23 merged, except #17, which was closed (`git log -1 origin/main`). The local `main` in the shared checkout was 19 commits behind this morning and is level tonight; fetch before measuring anything "against main"                                                                      |
| Open PRs         | **none.** Merged on 2026-09-13, in order: #19 (the scope answer and the overlay-animation fix), #20 (this handoff), #21 (the indeterminate Checkbox), #22 (the iOS map-panel sheet, its Playground, and the test fix), #23 (MAP-595's documentation as one snapshot). #17 closed with its branch kept (§4.1)           |
| Packages         | `@kozmos/react` `tokens` `icons` `vue` `product-contracts`, all `0.0.1`, `publishConfig.access: public`, never published — `npm view @kozmos/react` is a 404 and `git tag` lists nothing                                                                                                                               |
| React components | 97 directories in `packages/react/src/components` (`STATUS.md`: Core 68 · Code-only 5 · Product/SDK 22 · Platform 2; GlassSettingsPanel excluded). iOS and Android carry the same 97 names; Vue wraps them all                                                                                                         |
| Figma            | `Kozmos DS - Core Library` `Yj4O8p6Y9h2Sa9zJVoAiVY`, Components page `4:4`, Product / SDK section `1340:6764`; **94 of 94 sets** on one plugin build (last measured 2026-09-12, `pnpm figma:verify`); the stamp reads behind the plugin by one resumability change that touched no painter — do not re-run to chase it |
| Tokens           | 601 light + 601 dark (`docs/figma-library-manifest.json`); 1,412 variables in the file (last measured 2026-09-03); font sizes carry floating-point noise (`11.008000373840332`, `13.008000373840332`)                                                                                                                  |
| Gates            | last measured green 2026-09-12 (§7 has the one-liner). `tokens:raw:check` is a ratchet: 35 raw colours across 7 components, 7 raw radii across 6                                                                                                                                                                       |
| Chromatic        | **snapshot limit** since early September — nothing has been visually compared since, including a shadow change across 27 components and #19's animation fix; `UI Tests` shows PENDING on every PR for that reason                                                                                                      |
| CI on `main`     | green on 2026-09-10; the runs for the 2026-09-13 merges were still in progress at the time of writing — Bundle Size and Visual Regression green on `8f81912`; read the rest with `gh run list --branch main`                                                                                                           |
| Release path     | `.changeset/` holds only `config.json`; `release.yml` runs on CI success on `main`, skips publish when `NPM_TOKEN` is missing or invalid — inferred **not configured** (the registry has nothing and the run was "success")                                                                                            |
| Working tree     | `/Volumes/4TB Depo/development/K/kozmos-design-system-dev`, shared with parallel sessions that switch branches and leave work uncommitted — stage by path, never `-A`; build branches in a `git worktree` under the scratchpad                                                                                         |

## 4 · The five priorities, as a plan

### 4.1 · Tidy up

**Branches and PRs.**

- **Merge #19** if its scope answer is agreed (it also carries the animation fix, which is a defect
  in `main` today).
- **#17 was split on 2026-09-13, as recommended.** Against `origin/main` it held 74 commits: 38
  MAP-595 documentation, 24 the prototype app, 8 the iOS sheet and its Playground, one merge, and two
  pre-split copies of #18's already-merged work whose only surviving file was `Checkbox.tsx`. Now:
  All three merged the same day. (a) **#22** — the eight iOS and Playground commits cherry-picked in order onto `main`, plus one
  commit that makes the package's tests pass (the width class is an argument of
  `resolvedCollisionInsets`; `swift test`: 53 tests, 0 failures, was 52 with 7). (b) **#21** — the
  Checkbox change from the rescued branch `codex/checkbox-indeterminate`, byte-identical to #17's.
  (c) The MAP-595 documentation as one snapshot of the branch at `0b3acfd` — #23. (d) The
  prototype app stays on `codex/wayfinding-map-panel`, unmerged; #17 is closed with a comment
  naming each part, and the branch is kept.
- Delete the merged-and-kept branches `codex/wave-2-figma-components` and `codex/elevation-audit`
  (still on origin tonight); `codex/checkbox-indeterminate` went with #21's merge.
- ~~Fast-forward the stale local `main`~~ — done 2026-09-13.

**The repo root** (`git ls-files` / `git check-ignore`): `scratch.js` is tracked; `test-results/`
is tracked (Playwright output — untrack and ignore); `playwright-report/` is ignored; `STATUS.md`
is generated (`pnpm exec tsx scripts/skills/check-completion.ts --check`) and should stay so;
`FIGMA_CODE_CONNECT_RESEARCH.md` and `antigravity.config.yaml` are tracked at the root and belong in
`docs/archive/` or out.

**The docs.** 22 Markdown files in `docs/` on `main`, plus `docs/agent-tracking/` (four analysis
passes from May) and `docs/archive/`. Current and load-bearing: `style-playbook.md`,
`nested-radius.md`, `generated-color-scales.md`, `sdk-module-primitives.md`,
`gap-audit-2026-09-05.md`, `ds-scope-2026-09-12.md`, `figma-change-workflow.md`,
`product-sdk-react-handoff.md`, the generated `component-variant-gap-analysis.md`, and the record
`session-handoff.md`. Historical (May–August; superseded by `STATUS.md` and the two audits above):
`figma-core-gap-audit.md`, `core-component-candidate-research.md`, `figma-rebuild-plan.md`,
`figma-upcoming-components.md`, `figma-icon-strategy.md`, `figma-icon-library-report.md`,
`figma-legacy-source-review.md`, `figma-component-build-report.md`, `platform-form-factor-roadmap.md`,
`web-sdk-revamp-audit.md`. Move the historical set to `docs/archive/` with a one-line index, so a
reader finds the current ten.

**Code and token hygiene, each measured by its own check:**

- `tokens:raw:check` — 35 raw colours (29 of them the same `bg-white/70` on three map cards: name
  a **glass** surface role and they clear) and 7 raw radii.
- Two font-size tokens with floating-point noise; `Primitives.Typography.font.size` read by no
  platform; `letterSpacing` and `line.height` scales unused.
- Screen breakpoints emitted 16× inflated on Android (`primitivesScreenTablet = 12288.dp`, wants 768) — a rem-conversion bug in `packages/tokens/build.mjs`; nothing consumes them yet.
- `*.figma.tsx` excluded from typecheck — 21 files never type-checked (gap audit §9).
- Native enum names inconsistently prefixed (`AlertStatus`, `BadgeVariant`, `ChipSize`,
  `CounterTone`, `SegmentedControlSize`, `StackDirection`); `AlertStatus.Error` maps to React's
  `destructive`. Cosmetic but breaking — do it once, with deprecated aliases, before a publish.
- The tracked `KozmosColors.swift` and `.kt` are a May baseline that drifted from the generator's
  output; 13 iOS and 16 Android border references still hard-code the old grey.

**Figma file hygiene** (each is one plugin run once its painter is right): Text, Heading and Label
have never been built in Figma — `Update All Core` skips them silently, which is why they alone have
no Code Connect on any platform; 19 sets cast no shadow where an implementation does; 15 nesting
findings sit behind a popover-padding variable that now derives and has not been re-run; 11 pill
radii are applied by bound variables and store 9999; `productSdkSlot()` returns a frame, so no
Product / SDK set has a real Figma slot.

### 4.2 · Scan the current product UI

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
answers: `figma-core-gap-audit.md` (2026-05-21, dashboard taxonomy and Express),
`gap-audit-2026-09-05.md` (the revamp designs and the monorepo — about twenty missing patterns),
`web-sdk-revamp-audit.md` (2026-08-05), `ds-scope-2026-09-12.md` (the 24 SDK sets and eight missing
parts), `sdk-module-primitives.md` (eleven ranked primitives, 1 done).

**Token-level disagreements already known**, which the scan will turn into a decision (§6, 2):
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

| Gap                                                                                            | Check                                                                                                 |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| No `LICENSE` at the root or in any package; no `license` field in any `package.json`           | `ls LICENSE*`; `node -e 'console.log(require("./packages/react/package.json").license)'`              |
| No `README.md` in any package (npm shows the package README)                                   | `ls packages/*/README.md`                                                                             |
| No `repository`, `homepage`, `bugs`, `keywords`; `description` only on contracts               | the same one-liner per field                                                                          |
| No changesets, so `changeset version` has nothing to bump; `0.0.1` everywhere                  | `ls .changeset`                                                                                       |
| `NPM_TOKEN` not configured; the `@kozmos` scope not claimed on npm                             | the Release run says "success" while the registry has nothing; `npm org ls kozmos` once logged in     |
| `@kozmos/tokens` has no `exports`: consumers deep-import `dist/css/…` by path                  | decide subpaths: `./css`, `./scss`, `./js`, `./ios`, `./android`                                      |
| `@kozmos/vue` depends on `@kozmos/react` and ships a React root per instance                   | the §6 decision: shipped package or internal convenience                                              |
| `@kozmos/icons` peer-depends on `lucide-react` and renders artwork that differs from Figma     | `docs/gap-audit-2026-09-05.md` §4                                                                     |
| No `npm pack` smoke test: install each tarball in a fresh project and import it                | `pnpm -r exec npm pack --dry-run`, then a scratch project                                             |
| The CSS entry is `@kozmos/react/dist/style.css` — document it, or expose `./style.css`         | `packages/react/package.json` `exports`                                                               |
| No CHANGELOG (changesets writes them on the first version PR)                                  | —                                                                                                     |
| Chromatic on its limit: a publish would ship visuals nobody has compared since early September | §3                                                                                                    |
| Provenance and the Node engine                                                                 | `--provenance` needs `id-token: write` in `release.yml`; `engines.node >= 20` is set at the root only |

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
2. **Which tokens the design system is canonical for.** The product implements its own four-mode
   Primitive Tokens with the opposite numbering and a different brand blue; the shipped Web SDK uses
   `--pointr-*`. Either the design system adopts the product's palette and numbering (the smaller
   change for adoption) or the product retokens. This decides what "satisfies all" means and should
   be taken before the scan's gap list is built into anything.
3. **The type scale** — 14 and 12 join it, or the library moves to 13 and 11; 95% of the file's text
   sits off it today, and the product runs at 12.
4. **Chromatic** — raise the plan, wait for the period, or enable TurboSnap; a publish without a
   visual gate is a publish nobody compared.
5. **A glass surface role** — clears 29 of the 35 raw colours.
6. **`@kozmos/vue`** — a shipped package or an internal convenience (it cannot SSR and makes every
   consumer ship React).
7. **Naming normalisation of native enums** — once, with deprecated aliases, before the first
   publish.
8. **The brand font** — Figma renders Inter; `Brand` (Readex Pro) is an opt-in role no surface uses
   and has no CJK; drop it or scope it with `unicode-range`.
9. **iOS snapshots in CI** — the harness works; it needs a pinned runner image and a simulator.
10. **RoutePreviewPanel's five states look like two; MapOverlay's `position` is not a Figma axis;
    LocationPin's `variant` and `labelPlacement` stay renderer concerns** — recorded, revisit if a
    designer asks.

## 7 · Where everything is, and how to check it

| Thing                         | Path or command                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
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
  && pnpm docs:snippets:check
pnpm native:check                 # Swift + Kotlin compile, ~6s (Android needs packages/android/local.properties)
pnpm figma:verify                 # the live file against the plugin; needs FIGMA_ACCESS_TOKEN in .env (expires 2026-11-24)
pnpm tokens:radius:nesting        # concentric radii; --strict is what CI runs
pnpm figma:publish:linked:dry && pnpm figma:publish:native:linked:dry
git worktree add --detach /tmp/verify HEAD && cd /tmp/verify   # measure a clean checkout, not the tree
```

A fresh worktree has no built workspace packages: run `pnpm --filter "@kozmos/react..." build`
before `pnpm --filter @kozmos/react test`, or the failure is the worktree, not the code.

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

## 10 · The day's log, 2026-09-13

In order, so a reader knows what tonight's `main` contains and why:

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
5. **Where that leaves the tidy list (§4.1):** two merged branches still to delete on origin, the
   root strays (`scratch.js`, `test-results/`, two root documents), the docs to sort into current
   and historical (the MAP-595 files now on `main` belong with the historical index as a parked
   workstream), and the measured ratchets. Start there.

Everything verified by running it; nothing here is recalled.
