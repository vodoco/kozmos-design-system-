# Session Handoff

Written 2026-08-24. Everything below was verified by running it, not recalled.
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
| `components:variant:check`                   | ok (97 scanned, 1 gap)                       |
| `tokens:contrast:check`                      | ok (50 pairs, light + dark)                  |
| `figma:plugin:check`                         | ok                                           |
| `check-completion --check`                   | STATUS.md up to date                         |
| iOS                                          | `swift build` exit 0                         |
| Android                                      | `assembleDebug` + `testDebugUnitTest` exit 0 |

### Platform coverage

|                     | Web (React) | iOS   | Android | Vue          | Figma     |
| ------------------- | ----------- | ----- | ------- | ------------ | --------- |
| Components          | 97/97       | 97/97 | 97/97   | 100 wrappers | **94/97** |
| Variant-axis gaps   | reference   | 0/26  | 0/26    | 0/26         | **1/26**  |
| Code Connect linked | 68/92       | 68/92 | 68/92   | —            | —         |

The three components with no Figma set are all intentional: `Icon` (source
components on the `Icons` page), `FieldWrapper` (covered by the `FormField` set
via a documented Code Connect override), and `GlassSettingsPanel`
(internal-only, excluded from STATUS.md). The one variant-axis gap is `Icon`,
for the same reason.

The weakest link is now **Code Connect**, not component presence: Core is
complete at 68/92, Product / SDK is at zero. Native test coverage is second — 8
test files each against 97 components.

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
Simulated against the plugin's own constants and footprint floors: **13,020 x
15,580px, 1.20:1, 5.9x shorter.** Reading order stays column-major, so each
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

1. **Build the 18 new sets in Figma.** Use **Build** for these (they do not exist
   yet), then **Update** from then on. Keep the logs — each prints the URL-safe
   node ID, which the Code Connect step needs.
2. **Re-run `Update` on the six existing Product / SDK sets** to apply `6803f20`
   and `ab23fec`. Update preserves node IDs; Build would not.
3. **Run `Reorganize`** and confirm the page really lands near the simulated
   13,020 x 15,580. The simulation used `COMPONENT_PAGE_LAYOUT_MIN_HEIGHTS` as a
   stand-in for measured footprints; it reproduced the old page height to within
   1.5%, but the real numbers come from Figma.
4. **Run `Audit Library`** and keep the JSON. Watch for the new layout-sizing
   warnings — they will now appear where they were previously silent.
5. **Write the Code Connect files** for all 24 Product / SDK sets (React,
   SwiftUI, Compose) from the node IDs, replace the six native `// Placeholder`
   stubs, then run `figma:publish:linked:dry` and
   `figma:publish:native:linked:dry`.
6. **Dashboard items outside the design system** — raised but never scoped.

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

- **Verify against a clean checkout, not the working tree.** This is how the
  branch ended up with 79 committed components while every report said 97. A
  `git worktree add --detach /tmp/verify HEAD` costs seconds and is the only
  thing that measures what CI will see.
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

## 7. The Variant Analyzer

`pnpm components:variant:check` — reads React cva blocks and union props,
SwiftUI/Compose enums (declared _and_ parameter-typed), and the Figma plugin's
axis registry, then diffs them.

**Treat its output as an upper bound.** It needed six parser fixes in the prior
session and one more here, and every one _shrank_ the backlog. Eyeball a
specific finding before acting on it.

Decisions on record live in its `INTENTIONAL` registry with the reasoning
inline. Full write-up: `docs/component-variant-gap-analysis.md`.

## 8. Key Facts

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
