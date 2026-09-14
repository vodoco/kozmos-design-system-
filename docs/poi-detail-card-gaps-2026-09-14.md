# `fullPOIDetailCard` rebuilt from Kozmos — what the design system could not express

The first component of the §11 loop (`ds-handoff.md`): Olcay shared
[POI Details Card Revamp](https://www.figma.com/design/HbFSXhCPxKUy2fWa5x9TKO/POI-Details-Card-Revamp?node-id=241-4772)
— file `HbFSXhCPxKUy2fWa5x9TKO`, node `241:4772` — and it was rebuilt as
`apps/docs/stories/examples/POIDetailCard.stories.tsx` using only what
`@kozmos/react` exports, its tokens and its roles.

Measured 2026-09-14 over the Figma REST API: the node is `fullPOIDetailCard`,
375×3183, **886 nodes**, 52 distinct component instances, **126 visible text
nodes** and **22 attribute sections** carrying 71 value tags and 3 payment brand
marks. Every label and value in the example is the file's own, read from the
node; visibility is resolved through parents, so nothing hidden is counted as
drawn. Usage counts below come
from the 13 surfaces captured for `product-ui-coverage-2026-09-14.md`, re-counted
for this report.

## 1 · The verdict

The card has four top-level parts: `cardHeader`, `poiMetaInformation`,
`cardDragHandle` and the body. **Two of the four are built, one is built with
deviations, and one has no Kozmos equivalent at all.** Nothing was approximated:
where the system cannot express a part the story renders an `Alert` naming it, so
the example cannot be mistaken for coverage.

| Part of the card                  | Kozmos                             | Verdict     | What differs                                                                                |
| --------------------------------- | ---------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| Sheet shell + drag handle         | `BottomSheet` `BottomSheetContent` | **partial** | Handle is 48×5 `muted-foreground/40`; source is 60×4 `#C7CAD1`. Decorative, not a component |
| Logo                              | `Avatar`                           | **partial** | Source is a 56 square at radius 8; `Avatar` is a pill and cannot be overridden (§3.2)       |
| POI name                          | `BottomSheetTitle`                 | **partial** | 18px semibold; source is 22px regular                                                       |
| Favourite / bookmark buttons      | `IconButton`                       | **blocked** | The control exists; neither glyph is in `@kozmos/icons` (§2)                                |
| Floor / building line             | `Text`                             | covered     | —                                                                                           |
| "Open" status                     | `Tag`                              | **partial** | No `emotion` axis — the source is `success` green. Ruled §5.9, built for `Button` only      |
| Description + Read More           | `Text` `Link`                      | covered     | —                                                                                           |
| "Go" CTA                          | `Button emotion="themed"`          | **partial** | No sub-label: the source stacks "Go" over "12min - 120m". Also 44 tall against 54           |
| Seven quick actions               | `Button variant="outline"`         | **partial** | Icons absent (§2); no counter slot, which the source carries on every one                   |
| `poiMetaInformation` — meta strip | none                               | **missing** | §4 below                                                                                    |
| Image gallery                     | `POIMediaGallery`                  | covered     | Pager, position label and horizontal scroll all match                                       |
| 22 attribute sections             | `Text` + `Tag`, composed           | **partial** | No `AttributeSection`; `Tag` is 12px semibold against the source's 13px regular             |
| Three payment brand marks         | none                               | **missing** | Apple Pay, Google Pay and Samsung Pay: artwork owned by someone else, at a fixed lockup     |
| `openingHours` + `dayItem` rows   | none                               | **missing** | §4 below                                                                                    |
| Description section               | `Text`                             | covered     | —                                                                                           |

## 2 · `@kozmos/icons` is the single largest blocker

The set holds **38 icons** (`kozmosIconNames`). This card draws **19 distinct
glyph components** — plus two PointrMaps symbol-set components, which are icon
fonts rather than single glyphs and are counted separately. Of the 19:
**14 have no Kozmos equivalent**, two exist only under a different name
(`close` → `x-close`, `caret-down-small` → `chevron-down`), and three are
present: `alert-circle`, `navigation-pointer-01`, `users-01`.

Every one of the 13 now owned was matched to the card **by component key, not by
name** — they are literally the components this card instantiates, not
look-alikes that happen to share a label.

Absent, all 14: `heart`, `bookmark`, `loading-01`, `eye`, `share-01`,
`calendar-check-01`, `shopping-bag-02`, `layout-alt-02`, `phone`, `globe-02`,
`mail-01`, `facility/accesibility-services`, `clock-plus`, `feather`. The
accessibility glyph alone is drawn 1,213 times across 7 surfaces.

This is not a styling gap. Seven of the card's eight quick actions and both top
quick buttons are icon-led, so the icon set decides whether the row can be built
at all. `ds-handoff.md` §4.4 already says `packages/icons` "is too small for the
revamp"; this is that claim with a number against one card. (`pnpm figma:icons`,
which would compare the set against Figma, cannot run — the current token lacks
`library_content:read`.)

## 3 · Three defects found in the design system while building

These were found by building, not by reading, and none is recorded anywhere else.

1. **`ScrollArea` collapses to nothing in an auto-height column.** Both its
   wrappers are `h-full`, so `orientation="horizontal"` inside a `Stack` resolves
   to height 0 and the content disappears. The source's action row is 819 wide in
   a 375 card and scrolls; the example wraps instead, because correcting it from
   outside takes an `h-auto` the component should not need.
2. **A component's radius role cannot be overridden from outside.**
   `<Avatar className="rounded-control">` renders with _both_ `rounded-pill` and
   `rounded-control` and computes to `9999px`: tailwind-merge does not know the
   DS's custom radius names, so it does not treat them as conflicting and CSS
   order decides. Any `rounded-*` role passed as a className is silently ignored.
3. **`BottomSheetContent` does not require its title.** Radix logs
   `DialogContent requires a DialogTitle` for a screen-reader label, and nothing
   in the Kozmos wrapper surfaces that — a `Heading` inside the sheet type-checks
   and renders, and the sheet stays unlabelled. The example uses
   `BottomSheetTitle`, but the trap is open to every caller.

Also worth recording, though not a defect: **a story can only use classes
`packages/react` already emits.** `apps/docs` has no Tailwind build of its own
and ships the packages' prebuilt CSS, so `max-w-[375px]` in a story is dead. It
enforces §11's "no one-off class" rule by construction.

## 4 · The two parts that need a ruling

Per §11 these are reported rather than approximated, and no work starts on them
until Olcay rules.

### `poiMetaInformation` — the meta strip

A row of seven bordered tiles, each 125×64 with a 1px `#E3E4E8` edge: travel
time, distance, rating, price band, wheelchair access, crowd level and access
restriction. Four are hidden in this state, which is how the SDK varies it by POI
type.

- **What was tried:** `Card` is the nearest shape, but a card is a container with
  its own padding and elevation, not a fixed-height tile in a divided strip;
  composing seven of them reproduces the look without the part.
- **Lane:** Core. `MetaStrip / DescriptionList` is already named in
  `ds-handoff.md` §4.4 as one of the eight missing parts.
- **Evidence:** 52 instances on 4 surfaces for the strip itself; the tiles it
  holds are drawn far more widely — the rating tile 63 on 4 surfaces, the
  accessibility glyph 1,213 on 7.
- **Note:** `Rating` exists and covers the star tile's contents; what is missing
  is the strip and the tile, not the rating.

### `openingHours` and its `dayItem` rows

A 343×40 bordered summary at radius 20 — a status tag, "Closes 12:30 pm", a
disclosure caret — over seven `dayItem` rows (day, opening time, dash, closing
time) that expand behind it.

- **What was tried:** `Accordion` gives the disclosure and `List` the rows, but
  the summary line is a status tag plus a label-and-time pair, and the row is a
  three-column time layout. Composing it means writing the part, not using it.
- **Lane:** Product / SDK, per §5.5 an example rather than a set.
- **Evidence:** 275 summaries on 5 surfaces, plus 135 `dayItem` rows on 4 — the
  410 that `product-ui-coverage-2026-09-14.md` counts as one row. It is
  also on the §4.4 list twice over: "opening hours" from the revamp designs and
  "Opening Hours" among the dashboard's six field controls.

## 5 · What this says about the loop

The card needed 14 icons, one axis (`emotion` on `Tag`), two missing components
and one radius role that has been ruled but not built. None of it is a missing
_component_ in the sense the earlier audits implied — the shapes are nearly all
there. What is missing is reach: the icon set, one axis on three components, and
two compositions the SDK repeats across five surfaces each.

That matches what the scan found at the population level (80% partial, 2.2%
missing) and is the first time a single component has been carried all the way
through to say so.
