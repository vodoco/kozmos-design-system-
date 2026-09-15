# The map mode toggle — what the SDK draws, and what Kozmos could not express

Written 2026-09-15. The second component of §11's loop
(`docs/ds-handoff.md`). Olcay shared the tracking (`Focus`) and step-free
controls from the SDK prototype at `https://agentic-search-zeta.vercel.app/`
and asked whether they wanted a new component or a change to an existing one.

Every number below was read out of the running prototype over the Browser
pane's `javascript_tool` — computed styles, bounding boxes and timed samples —
not from the screenshots.

## 1 · What the prototype draws

Both controls are `div role="button"`. **Neither is keyboard-focusable**: no
`tabindex`, so `el.tabIndex` is `-1`. The page contains **no live region at
all** (`[aria-live], [role=status], [role=alert]` matches nothing).

|                      | **Focus** (tracking)         | **Step-free**                    |
| -------------------- | ---------------------------- | -------------------------------- |
| Collapsed → expanded | 48×46 → 86×46                | 48×46 → 108×46                   |
| Radius               | 16px                         | 16px                             |
| Surface              | solid `#FFFFFF`              | white at **0.88** alpha          |
| Border, off → on     | `#DEE2E6` → **`#135BEC`**    | `#DEE2E6` → **`#DEE2E6`**        |
| Icon, off → on       | `#17191C` → `#135BEC`, 16×16 | `#5D626F` → `#135BEC`, **20×20** |
| `aria-pressed`       | **absent**                   | `"true"` / `"false"`             |
| `aria-label`         | `"Tracking mode"`, static    | `"Step-free route on/off"`       |

The label is stacked in both: **11px/400 `#5D626F`** over **13px/600
`#17191C`**. `--primitives-colors-theme-500` resolves to `#135BEC`, so the
on-colour is a token rather than a literal and would follow §5.10's move to
`#346DF1` on its own.

### The choreography

- **Focus** — expands in ~300ms, holds **~2.5s**, collapses in ~300ms. The
  on-state persists after the label is gone.
- **Step-free** — press, and the status pill appears immediately while the
  control stays icon-only for **~1.4s**; the pill then expands at ~1.5s, holds
  ~3s, and collapses at **~4.5s**. The route stats update behind it
  (12 min / 210 m → 17 min / 241 m).

The transition is `max-width`, `padding` and `gap` over 300ms
(`cubic-bezier(.42, 0, .58, 1)`).

### The "Calculating…" pill

160×54, radius **18px**, white at 0.92, `0 10px 15px -3px rgba(23,25,28,.1)`,
padding `8px 14px`, gap 8px, alive for ~1.4s. Its text swaps between
"Calculating step-free route" and "Calculating quickest route". It carries
**no `role` and no `aria-live`**, so nothing announces that the route is being
recalculated or that it changed.

### One pattern, implemented twice

The two controls disagree on six things: whether "on" colours the border,
icon size, surface opacity, dwell time, whether the state reaches assistive
technology at all, and whether the accessible name says the state. That
disagreement is the argument for one owner rather than a second component.

## 2 · The ruling

Asked as a decision with the measurements beside it, and answered 2026-09-15:

1. **Modify `MapControlButton`, plus a hook** — not a new component. It already
   exists on React, SwiftUI and Compose with Code Connect on all three, and the
   scan counts the family at **807 instances across 5 surfaces**
   (`WayfindingButton`, `accessibilityButton` —
   `docs/product-ui-coverage-2026-09-14.md`, verdict _partial_). §5.5 would
   also make a new Product / SDK component an example rather than a set, which
   is wrong for something drawn 807 times.
   `docs/sdk-module-primitives.md` §1 had already ruled this way: "this one is
   an axis on an existing one, and it unblocks four controls at once."
2. **The SDK's tinted treatment becomes the default.** The design system
   adopts what the product ships, as §5.10 did for the brand blue.

## 3 · What was built

- **`emphasis`: `tinted` (default) | `filled`.** Tinted keeps the surface and
  colours the icon and the ring; filled is the pre-2026-09-15 inverted
  treatment, kept for callers wanting the heavier emphasis. React, SwiftUI and
  Compose.
- **`labelPlacement`: `inline` (default) | `stacked`.** Stacked sets the state
  under the label, as the map pill does.
- **`useRevealOnChange(value, { duration, delay, enabled })`** — a headless
  hook returning whether the label should be showing. The first render never
  reveals; a change restarts the window rather than stacking timers; `delay`
  covers the case where the change takes time to settle, which is exactly the
  step-free control's 1.4s recalculation.
- **The radius role corrected**, and it was wrong three different ways: React
  reached for `rounded-container` (20), iOS and Android for
  `semanticsRadiusPanel` (24), and the product draws **16** — which is the
  `control` role the vocabulary already had. All three now read
  `control`. `MapControlsGroup`'s `rounded-container` caller override went with
  it; that override only started winning at all after #45 taught `cn` to
  resolve the design system's own radius names.
- **iOS text styles moved onto `KozmosTypography`**, which
  `tokens:typography:check` demanded for the new `.font(.caption)` and caught
  nothing for the two pre-existing `.font(.subheadline.weight(.medium))` lines
  beside it — the check's pattern only matches the bare form. Both were moved
  anyway.

## 4 · The defect this found: a whole class of Tailwind opacity modifiers paints nothing

`MapControlButton` carried `bg-background/90`. **That class is not in the built
stylesheet.** `background` is defined in `packages/react/tailwind.config.js` as
a plain `var(--primitives-colors-background-0)`; Tailwind can only compute an
alpha modifier when the colour is a literal or carries `<alpha-value>`, so it
drops the class silently. A `ghost` Button sets no surface of its own, so **the
control was fully transparent over the map**.

It survives review because `MapControlButton.stories.tsx` is `layout:
"centered"` on a white canvas, where a transparent control and a white one are
the same picture.

The mechanism is confirmed both ways in `packages/react/dist/style.css`:
literal colours do compile their alpha variants (`bg-black/5`, `bg-black/50`,
`bg-green-900/30` are all present), while every token role compiles **zero**
(`bg-background`, `bg-foreground`, `bg-primary`, `bg-secondary`, `bg-muted`,
`bg-accent`, `bg-card`, `bg-popover` — none has an alpha rule).

The library authors **31 distinct such classes, ~70 occurrences**, all inert.
The heaviest:

| Class               | Uses | Where it matters                                                                        |
| ------------------- | ---- | --------------------------------------------------------------------------------------- |
| `bg-muted/50`       | 6    | muted surfaces                                                                          |
| `bg-muted/40`       | 6    | muted surfaces                                                                          |
| `bg-background/90`  | 6    | map chrome — `MapControlsGroup` ×2, `FloorSelector`, `RouteSummary`, `MapControlButton` |
| `bg-secondary/80`   | 4    | secondary hovers                                                                        |
| `ring-primary/20`   | 3    | focus rings                                                                             |
| `bg-primary/5`      | 3    | tinted rows                                                                             |
| `bg-primary/90`     | 2    | the primary Button's hover                                                              |
| `bg-destructive/90` | 2    | the destructive Button's hover                                                          |

**Only `MapControlButton` was fixed here** — it is the component this work
changes, and the opaque role is what the SDK draws for Focus anyway. The rest
is a token-layer decision (redefine the roles so an alpha modifier can be
computed, which means channel triples rather than whole colours) and it is
reported rather than swept in.

## 5 · What could not be expressed, and stops here

**Figma cannot draw the tinted state.** The `MapControlButton` set composes a
Button instance, and `BUTTON_VARIANTS` is
`Default · Destructive · Outline · Secondary · Ghost · Link · Glass` — there is
no themed-outline among them, and the Figma Button set has **no `Emotion` axis
at all** (#32 and #42 added `emotion` to React, SwiftUI and Compose only). The
painter also keeps paint off the MapControlButton root on purpose: its comment
says the root carries "only what is specific to being over a map — the shadow
that lifts it off the tiles", because a root that redraws the Button is what
lets the two drift.

So `State=Pressed` still paints filled in Figma while code now renders tinted.
`pnpm figma:verify` stays clean because it compares structure and variant
names, not paint. The regenerated
`docs/component-variant-gap-analysis.md` records it by itself:

> MapControlButton — figma missing axes -> emphasis (tinted, filled);
> labelPlacement (inline, stacked)

**The decision needed:** either the painter overrides the nested Button
instance's stroke and icon colour at build time, or the Figma Button set gains
a tone axis. The second is the larger, more correct change and would also close
#42's code-only `emotion`. Neither is done here.

**`mapControlButtonStateConfig` in the plugin is dead code.** It returns the
fill, stroke and foreground for each state and **nothing calls it** — the
nested Button decides the look through `mapControlButtonNestedVariant`. A
reader changing the pressed colours would edit it and see nothing happen.

**The in-surface status message is still missing.** The "Calculating…" pill has
no home: `Toast` needs a document-level viewport and is 420×92, `Alert` is a
block in the flow. `docs/sdk-module-primitives.md` §3 already asked for "an
in-surface status message, sized for chrome rather than for a page", and it is
one of the eight parts in `docs/ds-scope-2026-09-12.md` §4. Its 18px radius is
not a role either — the roles are 0 · 4 · 8 · 16 · 20 · 24 · pill.

**The stacked label sizes are approximated.** The SDK sets 11px over 13px/600.
The type scale has no role at either size, so the component reaches for the
nearest (`text-xs` 12 and `text-sm` 14; `caption` and `footnote` on iOS;
`labelSmall` and `bodySmall` on Compose). §5.11 rounds 11.008 and 13.008 and
adds 12 and 15 in one pass — this closes then.

**The on-colour is a role, not the product's step.** The prototype draws
`theme.500` (`#135BEC`); the component reads the `primary` role, which is
`theme.600`. Reaching past the role to a primitive would break §5.1, so the
role stands and the difference is recorded here.

## 6 · Reported back to the SDK, not reproduced

1. Both controls are `div role="button"` with no `tabindex` — **not reachable
   by keyboard**, and the accessible name is the only thing a screen reader
   gets.
2. **Focus has no `aria-pressed`** while step-free does, and Focus's
   `aria-label` never names the state, so its on/off is conveyed by colour
   alone.
3. **The recalculation is silent** — no `aria-live`, so a screen reader user is
   never told the route is being recalculated or that the ETA changed.
