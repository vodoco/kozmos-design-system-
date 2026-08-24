# Session Handoff

Written 2026-08-24. Everything below was verified by running it, not recalled.
Branch: `codex/wave-2-figma-components`.

## 1. Verified State

All gates pass as of this handoff:

| Gate                                                     | Result                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------- |
| `pnpm typecheck` / `lint` / `test` / `build`             | exit 0                                                              |
| `components:contract:check`                              | ok                                                                  |
| `components:variant:check`                               | ok                                                                  |
| `tokens:contrast:check`                                  | ok (50 pairs, light + dark)                                         |
| `figma:plugin:check`                                     | ok                                                                  |
| `check-completion --check`                               | STATUS.md up to date                                                |
| `figma:parse:linked` / `:ios:linked` / `:android:linked` | exit 0                                                              |
| iOS                                                      | `swift build` 0 warnings, 27 tests pass                             |
| Android                                                  | `assembleDebug` + `testDebugUnitTest` + `verifyPaparazziDebug` pass |
| Vue                                                      | `vite build` + `vue-tsc` clean                                      |

### Platform coverage

|                     | Web (React) | iOS      | Android  | Vue          | Figma |
| ------------------- | ----------- | -------- | -------- | ------------ | ----- |
| Components          | 97/97       | 97/97    | 97/97    | 100 wrappers | 75/97 |
| Stories             | 97/97       | —        | —        | 3            | —     |
| Tests               | 97/97       | 8 files  | 8 files  | 1 spec       | —     |
| Variant-axis gaps   | reference   | **0/25** | **0/25** | **0/25**     | 6/25  |
| Code Connect linked | 68/92       | 68/92    | 68/92    | —            | —     |

**Is it up to date?** Component presence and variant parity: yes, on all four
platforms. Code Connect: Core is complete, Product / SDK is at zero. Native
_test_ coverage is the weakest link — 8 test files each against 97 components.

## 2. What This Branch Changed

Nine commits, `0ac20a1`..`ab23fec`:

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

## 3. Immediate Next Actions, In Order

1. **Re-run `Update` (not Build) on all six Product / SDK sets in Figma.** Update
   preserves node IDs, which the Code Connect step depends on. This applies the
   fixes in `6803f20` and `ab23fec`. The first run produced broken output — see
   §5.
2. **Run `Audit Library`** and keep the JSON.
3. **Send the build logs.** Each prints the URL-safe node ID. With those, write
   the 18 Code Connect files (6 components x React/SwiftUI/Compose) and replace
   the six native `// Placeholder` stubs, then run `figma:publish:linked:dry` and
   `figma:publish:native:linked:dry`.
4. **Fix the Components page layout before adding more sets** — see §4.
5. **Write the remaining 18 Product / SDK Figma builders** using the lane in
   `figma/foundations-importer/code.js`. The scaffolding exists; each new one is
   a config plus variant functions following the DirectionStep pattern, or the
   two-axis matrix pattern LocationPin uses.
6. **Dashboard items outside the design system** — raised but never scoped.
   Likely adds genuinely new components rather than variants.

## 4. Open Decisions

These need a human call; none are blocked on code.

- **Vue: shipped SDK surface or internal convenience?** It is at full parity via
  `createVueWrapper`, but the adapter creates a React root per component
  instance, re-renders the whole root on any prop change (`watch(…, { deep: true
})`), DOM-transplants slots, cannot SSR (`createRoot` is client-only), and
  makes every consumer ship react + react-dom (~130KB). Fine internally; not
  fine for a public SDK.
- **Components page layout.** The page is **5,792 x 94,012px** — 14 sections in
  one column, `Inputs` alone 35,428px tall. Adding 18 more sets makes review
  impractical. Recommend fixing `reorganizeComponentsPage` to a multi-column
  grid first.
- **Naming normalisation.** Native enums are inconsistently prefixed
  (`AlertStatus`, `BadgeVariant`, `ChipSize`, `CounterTone`,
  `SegmentedControlSize`, `StackDirection` lack `Kozmos`), and
  `AlertStatus.Error` maps to React's `destructive`. Cosmetic but breaking — do
  it deliberately with deprecated aliases.
- **LocationPin `variant` and `labelPlacement` in Figma.** Recorded as
  intentional (colour is a token override, label placement is renderer layout).
  `Size` was added. Revisit only if designers ask.

## 5. Known Risks And Gotchas

Things that will bite whoever picks this up.

- **`setLayoutSizingHorizontal/Vertical` swallow errors silently.** Setting
  `FILL` on a node that is not yet in an auto-layout parent throws; the helper
  catches it and returns `false`, which callers ignore. This produced the
  first-run bug where text collapsed to one character per line. There are **180
  call sites plugin-wide**, so other builders may have latent failures that never
  appear in the log. Worth making the helper record a warning into `stats`.
- **Six dead Code Connect files.** `Heading`, `Text`, and `ThemeProvider` each
  have `.figma.swift` and `.figma.kt` placeholder stubs, but STATUS.md lists all
  three as "Code Connect not applicable" (typography lives in text styles;
  ThemeProvider is runtime). They are not counted in the 92 denominator, so they
  are simply dead files. Safe to delete; not done, to avoid a silent change.
- **`code.js` versus prettier.** The file had never been prettier-formatted.
  Running prettier over it wrapped a signature and broke a contract assertion
  (fixed in `a91cdce`). The pre-commit hook will prettier it on any commit that
  stages it, so re-run `components:contract:check` **after** formatting, not
  before.
- **Android needs an SDK path.** Without `ANDROID_HOME` or
  `packages/android/local.properties`, every Gradle task fails before
  compilation. Documented in `packages/android/README.md`.
- **Piping Gradle through `tail`/`grep` swallows its exit code.** Use
  `set -o pipefail` or check `${PIPESTATUS[0]}`. A "passing" baseline was
  reported this way once and was actually failing.
- **Some commits on this branch bundle pre-existing uncommitted work.** `code.js`,
  `ui.html`, `STATUS.md`, `package.json`, `Breadcrumb.kt`, `DirectionStep.kt` and
  others were already dirty when the session began. The messages describe only
  the new work. Review before pushing.
- **~588 files remain uncommitted** and are untouched pre-existing work.
- **Husky prints a deprecation warning** on every commit (v10 will fail). Two
  lines to remove from `.husky/pre-commit`.

## 6. The Variant Analyzer

`pnpm components:variant:check` — reads React cva blocks and union props,
SwiftUI/Compose enums (declared _and_ parameter-typed), and the Figma plugin's
axis registry, then diffs them.

**Treat its output as an upper bound.** It needed six parser fixes during this
session and every one _shrank_ the backlog — including a recommended "Android
variant catch-up" that turned out to be already complete. Eyeball a specific
finding before acting on it.

Decisions on record live in its `INTENTIONAL` registry with the reasoning inline,
so they stop reappearing as backlog. Full write-up:
`docs/component-variant-gap-analysis.md`.

## 7. Key Facts

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
