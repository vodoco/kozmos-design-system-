---
"@kozmos-ds/react": minor
---

Six pieces of search polish, four of them defects a product would have had to
work around.

**A search row is the component's, not the caller's.** `CategoryField` gains a
`trailing` slot, the one `SearchBar` already has, because the field takes the
search bar's place when a category is chosen and the row around it does not
change. Without it the field shrinks to its content in a caller's flex row and
will not grow: Storybook's own example knew to pass `flex-1` through
`className`, and an integrator composing the same pair had no way to know. The
slot draws a gapped row, so the assistant button beside Filters keeps the row's
spacing rather than touching it — which is what both components did before.

**One separator for a place.** `poiLocationLabel` joins floor and building the
way Kotlin and Swift already join them on the model, with `·`. The web had no
shared derivation, so `POIResultCard` and `POIDetailPanel` each built it by
hand and the panel had drifted to `/`: the same place, described two ways, in
one product. It is exported, so a product composing its own row joins them
identically instead of inventing a third separator.

**The empty slot pads a string and never a component.** `POIResultList` added
`p-6` whatever it held. A string needs it. A component pads itself, and an
`EmptyState` adds `p-8` on top, which turned a one-line "no results" into a
222px box. The slot decides on what it is given rather than on a flag, because
nothing was passing a flag and nothing would have.

**`EmptyState` centres its own text.** `Text` aligns from the start now, so a
block that centres itself does not centre the text inside it; a description
that wrapped to two lines had its second line against the leading edge.

**`Container` takes an `inset`.** `lg:px-8` reads the window, so a 390px side
panel in a 1280px window took the widest step — the same content with 32px of
padding each side on a desktop and 16px on a phone. `inset="panel"` holds 16
whatever the window is doing. `window` stays the default.

**A side panel gets the space the sheet's grip makes.** A sheet's content
starts below its grip; a side panel has no grip and nothing stood in for one,
so the search field sat a pixel under the panel's top edge.
