# Nested Corner Radius

How a rounded shape should hug the rounded shape inside it.

Written 2026-08-31. Every number here was measured from the published Figma file
by `pnpm tokens:radius:nesting`, not estimated.

## The rule

```
R_outer = min(R_inner + padding, min(width, height) / 2)
```

Two independent parts, and both matter.

**Concentricity.** `R_outer = R_inner + padding` is not a heuristic or a taste
call. It is the only value that holds the gap between the two curves constant
all the way around the corner. At any other value the gap pinches or flares,
and it does so exactly at the corner, where the eye is most sensitive to it.
People read the result as "uneven roundness" long before they can name the
cause — which is how this document came to be written.

**The cap.** A radius above `min(width, height) / 2` cannot render: opposite
corners would overlap. Figma and CSS both clamp silently, so a value above the
cap is a number that lies about what it draws. Note `min(w, h)`, not `h`:
height alone is right for a wide control and wrong for a tall narrow one, where
it would permit a radius the width cannot carry.

The `pill: 9999` role is this clamp used deliberately — a sentinel meaning "as
round as this box allows" rather than a literal 9999px.

## Where it applies, and where it does not

The rule governs **a rounded panel nested inside a rounded panel**. Four
exclusions keep it from producing noise, and each one is a real distinction
rather than a convenience.

**Only corner-adjacent children.** A chip in the middle of a row is nowhere near
the parent's curve; concentricity with it is meaningless. The checker uses a
32px reach from the corner.

**Only shapes that are actually drawn.** Auto-layout frames with no fill and no
stroke carry a `cornerRadius` that renders nothing. Judging structural
scaffolding would bury the real findings.

**Not pills or circles.** A child at its own cap is a distinct shape sitting
inside the parent, not a panel nested in one. Applying the rule to it drags
every card holding a round icon badge out to a full stadium, which is not what
anyone means by hugging. This exclusion removed 46 of the first 65 findings, and
they were all icon badges.

**Non-uniform padding has no exact answer.** When padding-x differs from
padding-y, no single radius keeps the gap constant on both axes. The convention
here is to take the **tighter** axis: that is where the two curves come closest
and where a mismatch shows first. Only uniform padding is truly concentric; with
uneven padding the rule is an approximation, applied where it matters most.

## Where the rule should live

Not in the token layer. `Semantics.Radius.control = 16` is a fixed value, and a
concentric radius is a _relationship between two elements_ — it depends on the
padding between them, which is a property of the composition, not of either
shape. Encoding it as tokens would mean a new token per nesting, and the one
lever the semantic layer bought ("repoint `Control` and the product changes
roundness") would be diluted across dozens of derived values.

The division that keeps the lever:

- **Role tokens set the innermost and standalone radius** — a chip, a swatch, a
  button on its own.
- **Containers derive**: `R_outer = min(R_inner + padding, min(w, h) / 2)`.

One alias still drives everything. Change `Control` and every nested container
recomputes, instead of 162 hand-set numbers each needing to be found.

## What the file looks like today

`pnpm tokens:radius:nesting`, measured 2026-08-31 against 94 component sets:

|                                         |         |
| --------------------------------------- | ------- |
| corner-adjacent pairs judged            | **296** |
| off the concentric ideal                | **50**  |
| sets affected                           | **16**  |
| pills inside a rounded box (not judged) | 23      |

| Set                   | Pairs |
| --------------------- | ----- |
| Listbox               | 9     |
| NavigationItem        | 8     |
| MapOverlay            | 5     |
| POIResultCard         | 4     |
| AdaptiveMapShell      | 3     |
| POIMediaGallery       | 3     |
| POIResultList         | 3     |
| FeedbackCard          | 2     |
| RouteSummary          | 2     |
| RoutingInputGroup     | 2     |
| ColorPicker           | 2     |
| MultiSelect           | 2     |
| FloorSelector         | 2     |
| BrowseCategoriesPanel | 1     |
| Combobox              | 1     |
| TimePicker            | 1     |

**50 of 296 is a cleanup, not a redesign.** Five sixths of the file already
satisfies the rule without anyone having stated it, which is worth knowing
before anyone proposes a sweep.

Two shapes account for nearly all of it:

- **A child as round as, or rounder than, its parent.** Product / SDK cards sat
  at 12 and now sit at `container` 16, while the slots inside them use `control`
  at 16, with 13-17px of padding. Either way the child is at least as round as
  the box around it, and geometrically a 16-radius card with 13px of inset can
  only hold a child of about 3. The correction is the slot, not the card.
- **A parent much rounder than a small child needs.** Listbox and MultiSelect
  put 4-radius options inside a 16-radius popover with 4-5px of padding. The
  concentric answer is a popover at 8-9, or options at 11-12.

## The rule predicts a number the design already chose

The pair from the report that started this:

```
ColorPicker / ColorPicker Field > Selected Color Swatch
    parent 320x44 r=16 · child r=4 · padding 10  (off by +2)
    either parent -> 14, or child -> 6
```

The swatch renders at 4, and the rule says it should be **6**. The token already
says 6: `ColorPicker/swatch/radius` has `value: 6`.

So the relationship was designed in from the start — 6 + 10 = 16, exactly the
field's radius — and something broke it. That token aliases `Radius/sm`, and
`Radius/sm` is **4**. A bound variable beats the literal, so the swatch renders
4 and the concentricity collapses. `tokens:radius:check` reports the literal 6,
a number that never reaches the screen.

This is the strongest evidence the rule is right: derived independently from
geometry, it lands on the value a designer had already chosen by eye.

## Two decisions the rule does not make

**Should a pill sit inside a merely rounded box?** 23 pairs do — MultiSelect's
chips in their field, ScrollArea's thumbs in their track. Concentricity would
force each parent to a full stadium, so the checker declines to judge them. The
real question is upstream and is a role decision: if MultiSelect's chips were
`marker` (4) rather than `pill`, the field's 16 would already be almost exactly
right, since 4 + 12 = 16.

**Should Product / SDK cards stay at 12?** They were moved to `container` (16)
on 2026-08-31, and it is worth recording that this **did not resolve a single
nesting finding** — 50 before, 50 after, simulated against the file before the
change was made. An earlier draft of this section claimed it would fix most of
them, which was wrong and arithmetically obvious in hindsight: a 16 card holding
a 16 slot across 13px of padding wants 29, so raising the card from 12 to 16
narrows the gap and never closes it.

The move was still right, for a different reason: it put 15 sets on the semantic
scale instead of an off-scale literal, so `Control` and `Container` now reach
them. But the nesting fix is the **child**, in every one of these pairs. With
the card at 16 and 13px of inset, the slot wants roughly 3 — which is to say
square, or `marker` at 4 if a hint of rounding is wanted.

Both are design calls. The checker reports; it does not decide.

## Running it

```bash
pnpm tokens:radius:nesting          # summary plus the 25 worst pairs
pnpm tokens:radius:nesting --all    # every pair
```

It reads the **published Figma file** over REST rather than the plugin source,
because the relationship is geometric: it needs the rendered box of both shapes
and the space between them, and none of that exists in the builder's arguments.
So it reports what is drawn, which is also its limit — it cannot see a fix that
has been committed but not yet run through the plugin.

It exits 0 while the backlog is open. `--strict` makes it fail, and it should be
wired into CI on the day the 50 reach zero — not before, or it is a gate
somebody switches off.

Related: `pnpm tokens:radius:check` covers the other half of the question —
whether the plugin, Tailwind and the native sources all agree with
`Semantics.Radius` in the first place.
