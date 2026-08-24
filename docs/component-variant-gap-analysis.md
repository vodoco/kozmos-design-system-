# Component And Variant Gap Analysis

Generated from `pnpm components:variant:check`
(`scripts/skills/check-variant-parity.mjs`). Regenerate it rather than editing
the counts by hand.

## Why This Exists

`STATUS.md` reports 97/97 on Web, iOS, and Android, but it only proves that a
file exists. It says so itself: it does not grade API parity, behavioural
completeness, or variant coverage. This document is the missing half — it looks
_inside_ the files and compares the variant surface each platform can express.

React is the reference because it is the only platform with 97/97 components,
stories, and tests. A gap means "React can express this and the other platform
cannot".

## Headline Numbers

| Measure                                    | Result |
| ------------------------------------------ | ------ |
| Components scanned                         | 97     |
| Declaring at least one React variant axis  | 25     |
| Variations that are compositional only     | 72     |
| Components with variant gaps — iOS         | 0/25   |
| Components with variant gaps — Android     | 0/25   |
| Components with variant gaps — Figma       | 6/25   |
| Components with variant gaps — Vue         | 0/25   |
| Components absent entirely — iOS / Android | 0/97   |
| Components absent entirely — Figma         | 22/97  |
| Components absent entirely — Vue           | 0/97   |

The important correction to the previous mental model: **only 25 of 97
components carry variant axes in code**. The other 72 vary compositionally, and
those variations exist _only_ as Figma axes (`Dialog Content`, `Drawer Side`,
`Tabs Count/Active/State`). Code has no name for them, so no amount of native
work will "complete" them — they are a Code Connect mapping question, not a
missing-variant question.

## 1. Real Variant Gaps

**iOS and Android are at zero.** Everything remaining is Figma.

```
AdaptiveMapShell
  - figma: component/set absent
Icon
  - figma: component/set absent
MapControlButton
  - figma: component/set absent
MapControlsGroup
  - figma: component/set absent
MapOverlay
  - figma: component/set absent
POIDetailPanel
  - figma: component/set absent
```

Six of the eight are Product / SDK sets that simply do not exist in the plugin
yet; they fold into the "remaining 18 Product / SDK Figma builders" item below
rather than being separate work.

All six are "the set does not exist in the plugin yet". There are no remaining
axis or value mismatches on any platform.

### Corrections made while validating

Three parser defects produced phantom gaps in the first pass. All are fixed; the
findings they generated were **not real**:

| Defect                                       | Phantom result                                                               |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| Key matching at every character offset       | `default` yielded `efault, fault, ault, …`                                   |
| Kotlin enum regex required a `Kozmos` prefix | Alert, Badge, Chip, Counter, SegmentedControl reported as missing whole axes |
| Kotlin/Swift case regex was line-anchored    | `Default, Info, Success` on one line yielded only `Default`                  |

The headline correction: **the recommended "Android variant catch-up" was a
phantom.** `BadgeVariant`, `BadgeSize`, `ChipVariant`, `ChipSize`, `CounterTone`,
`CounterSize`, `SegmentedControlSize`, and `AlertStatus` all already exist and
are complete. Android needed no enum work at all.

The naming inconsistency behind it is real but cosmetic: those enums are not
`Kozmos`-prefixed, and `AlertStatus` uses `Error` where React says
`destructive`.

## 2. Intentional, Not Backlog

Recorded in the analyzer's `INTENTIONAL` registry so they stop appearing as
gaps.

### Stack and Grid on native — decided

Native does **not** mirror the CSS axes (`align`, `justify`, `wrap`, `flow`,
`cols`, `rows`, `gap`, `xGap`, `yGap`, and the reverse `direction` values).
Product code uses `VStack`/`HStack`, `Row`/`Column`, and `LazyVerticalGrid`
directly, with spacing from `KozmosDimensions`.

Rationale:

- `wrap` needs Compose's experimental `FlowRow`; `baseline` is an
  `alignByBaseline()` child modifier, not a container parameter; `row-reverse`
  is content ordering. A faithful mirror is not possible, and a partial one
  means enum cases that silently no-op.
- `gap: 0,1,2,3,4,6,8` is Tailwind's numeric scale. Porting it would put
  Tailwind numbering into Swift and Kotlin instead of Kozmos spacing tokens.
- `cols: 1–6, 12` is a web 12-column grid concept; mobile uses adaptive sizing.
- It matches the call already made for Figma, and matches how SwiftUI and
  Compose model layout.

The design-system contract here is the **spacing token**, not the container.

### Also intentional

- `Stack.align/justify/wrap`, `Grid.align/justify/flow` on **Figma** — variant
  explosion (plugin README).
- `Text.size/weight/align/color` on **Figma** — Text is a typography
  token/style, not a component set. _Native Text is still open — see §4._
- Boolean props (`error`, `truncate`, `fullWidth`, `asChild`) are not variant
  axes.

## 3. Components Absent Entirely

### Figma — 22 of 97

Product / SDK and Platform lanes, minus the six now covered by the plugin's
Product / SDK builders (DirectionStep, FloorSelector, LocationPin, MapView,
POICard, WayfindingCard):

AdaptiveMapShell, BrowseCategoriesPanel, CategoryTile, DynamicIsland,
FeedbackCard, MapControlButton, MapControlsGroup, MapOverlay, POIDetailPanel,
POIMediaGallery, POIResultCard, POIResultList, RouteOptionCard,
RoutePreviewPanel, RouteSummary, RoutingInputGroup, SaveLocationCard,
UserLocationMarker.

Plus four that are correctly absent: FieldWrapper, Icon, NavigationAnnouncer,
ThemeProvider — code-only or icon-registry primitives.

### Vue — 0 of 97 (closed)

**Twice-corrected.** An earlier pass reported Vue at 3/97 by counting
directories in `packages/vue/src/components`. Vue has no per-component
directories: everything is re-exported from `packages/vue/src/index.ts` through
`createVueWrapper(ReactComponent)`, which mounts the React component inside a
Vue node. Real coverage was 82 of 98.

The 18 genuinely missing wrappers have now been added, taking Vue to full
parity. (`Radio` was a false positive: that directory exports `RadioGroup` and
`RadioGroupItem`, both already wrapped. The analyzer now carries a
directory→export alias for it.)

Eight of the additions bridge `update:modelValue`: ColorPicker, Combobox,
DateRangePicker, Listbox, MultiSelect, NumberInput, PasswordInput.

**Adapter constraints worth knowing before treating Vue as a shipped SDK
surface:** a React root is created per component instance; `watch(…, { deep:
true })` re-renders the whole root on any prop change; slots are DOM-transplanted
via `appendChild`; `createRoot` is client-only so Nuxt SSR will not work; and
every Vue consumer ships react + react-dom (~130KB). Fine for an internal
dashboard, not for a public SDK where bundle size and SSR matter.

### iOS and Android — 0 of 97

Both platforms now have every component directory.

## 4. Recommended Build Order

Closed:

- **Vue** — 18 wrappers added; full parity.
- **Stack, Grid, Text on native** — recorded as intentional. Layout and
  typography stay platform primitives with Kozmos tokens.
- **Heading** — `level` added on iOS and Android. Both previously had _no_
  heading semantics at all; iOS now sets `accessibilityHeading`, Compose sets
  `heading()`.
- **LocationPin** — `variant`, `size`, `labelPlacement` implemented on both
  natives, alongside the existing selected/featured/offFloor/disabled flags.
- **FloorSelector** — `variant` (vertical-list, horizontal-list,
  compact-stepper) implemented on both natives.
- **MapControlsGroup** — `locationPresentation` added on both natives, now
  composing the shared MapControlButton so the labelled presentation and its
  accessible name stay consistent.
- **FloatingActionButton, SearchBar, MapOverlay, ScrollArea** — recorded as
  intentional; see §2.
- **Android variant catch-up** — never needed; it was a parser defect.

Remaining:

1. **Product / SDK Figma sets** — the remaining 18, using the plugin lane
   already built. This subsumes the six "set absent" rows above.
2. ~~LocationPin `size` in Figma~~ — done. The set now uses the two-axis matrix
   builder: State x Size, 15 variants.
3. **Naming normalisation** — `Kozmos`-prefix the unprefixed native enums
   (`AlertStatus`, `BadgeVariant`, `ChipSize`, `CounterTone`,
   `SegmentedControlSize`, `StackDirection`) and reconcile `AlertStatus.Error`
   with React's `destructive`. Cosmetic, breaking, so do it with deprecated
   aliases.

## 5. Known Limits Of This Analysis

- It compares _declared_ variant surfaces, not rendered output. Two platforms
  can agree on axis and values and still look different.
- It does not check that a variant is _correct_, only that it can be expressed.
- Compositional variations (the 72) are out of scope by construction.
- Figma axes are read from the importer plugin's registry, which is the intended
  design, not from the live Figma file. A designer who adds a variant by hand
  will not appear here until the plugin registry is updated.
