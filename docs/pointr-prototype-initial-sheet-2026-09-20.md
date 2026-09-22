# The prototype's initial bottom sheet, driven: detents, gestures, states — 20 September 2026

Olcay, the evening of the 20th, after the search sheet's parts were built: _"analyse the
prototype much better with interactions like expand collapse states of the initial bottom
sheet."_ This is that analysis, for the sheet a visitor meets first in the prototype at
`https://agentic-search-zeta.vercel.app` (the Mobile SDK tab), and for what the Kozmos shells
and the Pointr QA app do instead. Everything below was **driven, not eyeballed**: a Playwright
script (`scripts/measure-prototype-sheet.cjs`) drags, taps, focuses and types in the
prototype's 402 × 874 phone frame and after every step reads the sheet's box, its inner
scroller, its buttons and rows, and the prototype's own React state (`mDetent`,
`mSearchDetent`, `searchFocus`, `mSearchView`, `mCat`, `q`, `mPoi`); the rules came from the
prototype's bundle (`index-DNiyTJIJ.js`, its `detents()`, `onGrabDown/Move/Up` and every
`mDetent` assignment) and were then confirmed by the driven states. Numbers are CSS pixels in
the frame; `y+n` is measured from the sheet's top edge. The screenshots of the twelve states
that matter are in the contact sheet sent with this report.

## 1. The sheet and its three detents

| Detent   | Rule, from the bundle                                   | On the 874 frame                           | What is visible                                                                                                      |
| -------- | ------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **min**  | 20 % of the frame                                       | 175                                        | the grabber, the search row, and 90 px of the first tile row: the four 64 squares and the first line of their labels |
| **half** | 54 %                                                    | 472                                        | the search row and three tile rows, the fourth cut; the grid scrolls under the finger only at full (§2)              |
| **full** | 94 %                                                    | 822                                        | everything: 18 tiles in five rows (650 tall) fit in the 745 the scroller has                                         |
| POI min  | the Go row's bottom + 16, never under 24 % or over 72 % | 210 (Starbucks), 237 (the fish restaurant) | the card's header row, its location line, and the Go button — the actions strip is cut                               |

The sheet is absolute at the bottom of the frame, **animated by height** (`height .28s
cubic-bezier(.4,0,.2,1)`; no transition while a finger holds it; a 450 ms slide-in from the bottom
when it returns after navigation), top radius 24, white at 90 % over `blur(22px) saturate(180%)`,
a 1 px top border, the shadow `0 -8px 24px -8px rgba(23,25,28,.25)`, and a 24 px white-to-clear
fade over its top edge so scrolled content dissolves under the grabber. The grabber is 40 × 5 at
`y+5`, and takes no pointer: the whole sheet does (§2).

**Inside, two layers.** The search row is pinned at `y+23`, 44 tall, and never scrolls. Below it a
scroller starts at `y+77` and takes the rest of the sheet's height — 98 at min, 395 at half, 745
at full — holding the tile grid, the results or the recents. The grid: four columns of 86.5 × 114
at x 16 / 110.5 / 205 / 299.5 (8 between), rows 126 apart (12 between), the first at `y+85`;
each tile a centred 64 square (radius 18, border) holding a 24 icon in the theme blue, and an
11/14 label of up to two lines starting 8 under the square. That is why min shows exactly the
squares and one label line: 85 + 64 + 8 + 14 = 171 of 175.

## 2. The gestures

Read from `onGrabDown`, `onGrabMove`, `onGrabUp` and `onSheetClick`; each rule was then driven.

- **The whole sheet is the drag surface** — the grabber zone, the gaps, the tiles, the rows.
  Only the text field (any input, textarea or select) and the Go button are excluded.
- **Slop 6 px** before a drag begins. A move of more than 8 px that is more horizontal than
  vertical is not a drag: the pointer is left to the content (the action chips scroll sideways).
- **The content does not scroll under a finger at min or half** — an upward drag moves the sheet
  first. At full an upward drag scrolls the grid or the list; a downward drag scrolls it back to
  the top and only then moves the sheet (the scroller's `scrollTop` decides).
- **Rubber band:** the sheet follows the finger to 30 below min and 10 above full, no further.
- **Release snaps to the nearest detent by distance.** No velocity: a fast flick of 100 px lands
  where a slow one does. From min the sheet reaches half past +149; from half, full past +176;
  from full, half past −176; from half, min past −149. Driven: +100 stayed at min, +160 went to
  half, +160 more stayed at half, +200 reached full; −100 stayed, −250 fell to half, −300 to min.
- **A tap on the grabber does nothing.** A tap on the map does nothing, even while the field is
  focused. A tap that ends a drag is swallowed (`onSheetClick`), so a drag over a tile never opens it.
- Landing anywhere but full drops the field's focus; landing on full keeps it.
- Opening the level pill's list and then dragging the sheet closes the list.

## 3. The states and what moves them

| From                       | Action                   | To                                                                                                                                                  |
| -------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| any detent, browsing       | tap the field            | **full**, focused; with an empty query the scroller shows **Recently visited** (a 28-tall header with a count badge, then result rows)              |
| focused, empty             | type                     | results replace the recents as you type; a 24 **Clear** circle appears in the field; a 48 **Filters** button appears; the **Cancel** button goes    |
| with a query               | tap Clear                | query gone _and_ focus gone: the tiles are back; the sheet stays where it was (full)                                                                |
| focused                    | tap Cancel               | focus and query gone, the tiles back; the detent unchanged — driven at full, and `cancelSearch` sets only `searchFocus` and `q`                     |
| any detent, browsing       | tap a tile               | the category's results, **at the same detent** — at min the chip row and the first result show in 175; the field becomes the **category chip** (§4) |
| category results           | tap the chip's ×         | back to the tiles, detent unchanged                                                                                                                 |
| results or recents         | tap a row                | the **POI card at half**; the search sheet's detent is remembered (`mSearchDetent`) with its query, view and category                               |
| POI card                   | drag down                | the card's own min: the Go row's bottom + 16 (§1); its half and full are the sheet's                                                                |
| POI card                   | tap ×                    | the search sheet **returns at the remembered detent**, the query and the results as they were                                                       |
| POI card, Go pressed       | route → End navigation   | the sheet slides back in (450 ms) at the remembered detent                                                                                          |
| any                        | tap the AI search button | the Assistant overlay covers the frame; the sheet is untouched beneath it                                                                           |
| with a query or a category | tap Filters              | a full-frame Filters panel (Reset, Close; Accessibility: five toggles; Dietary options: sixteen); the sheet untouched beneath it                    |

## 4. The four forms of the search row (`y+23`, 44 tall, from x 16)

| Form              | Field                                                                                                                                 | Beside it                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| idle              | 312 wide, placeholder "Search", 18 icon                                                                                               | the AI search button, 48, at x 338 (`y+21`)                    |
| focused, empty    | 242.8 wide, theme-blue border                                                                                                         | **Cancel**, a 59.2 × 44 text button at x 268.8; the AI button  |
| with a query      | 254 wide, a 24 grey **Clear** circle at x 236                                                                                         | **Filters**, a 48 outlined icon button at x 280; the AI button |
| a category chosen | replaced by a **chip** 245 wide in the category's own colour: its icon, the name (28 tall at x 67), a 22 count badge, a 32 × at x 229 | Filters at x 280; the AI button                                |

Rows under any of these start at `y+97`: 370 × 80 cards, 104 with a 48 logo, 16 apart.

## 5. What Kozmos has, against this

**The iOS shell (`KozmosAdaptiveMapShell`)** has the machine's shape and different numbers:

| Prototype                                                                                         | Shell today                                                                                                | Gap                                                                                              |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| min 20 %, half 54 %, full 94 %                                                                    | collapsed 18 % (never under 112, never over 40 %), medium 48 %, large 88 %; `.fraction` allowed up to 0.94 | the named detents differ; the prototype's are reachable today only as `.fraction(0.2/0.54/0.94)` |
| the whole sheet drags, with the scroll handoff of §2                                              | only the 16 pt grabber row drags (`grabberRowHeight`); the content scrolls on its own at every detent      | **the drag surface**: a finger on the tiles or the rows moves nothing                            |
| a tap on the grabber does nothing                                                                 | a tap cycles the detents and wraps                                                                         | keep the shell's — it is the accessible affordance the prototype lacks                           |
| nearest by distance, no velocity                                                                  | nearest to the predicted end, so a flick counts                                                            | keep the shell's                                                                                 |
| rubber band 30 / 10                                                                               | clamped hard to the smallest and largest detent                                                            | cosmetic                                                                                         |
| 280 ms ease-out; a 450 ms slide-in on return                                                      | spring 0.34 / 0.88                                                                                         | cosmetic                                                                                         |
| the POI card's min is its Go row + 16                                                             | `.content` fits the **whole** content, between collapsed and large                                         | no way to peek at an anchor inside the content                                                   |
| the field's focus opens the sheet to full; the detent is remembered across the card and the route | the `panelDetent` binding lets a host do both                                                              | none in the shell; the QA app does neither                                                       |

**The web shell** sizes its bottom panel once (`panelFraction`, or `panelSizing="content"`): no
detents, no drag, no snap. **The Compose shell** caps its bottom panel at 64 % of the height:
no detents, no drag. On both, the whole machine of §1–§2 is missing.

**The parts** exist: `SearchBar` (44, `y+23` geometry), `AISearchButton`, `CategoryTile` and
`BrowseCategoriesPanel` (64 square, four columns, 8 between, rows 12 apart as the prototype's —
on every platform since 2026-09-22; web, Compose and Figma had 8 — and in its panel presentation
it pins its search slot over a rule the prototype's sheet does not draw, on an opaque
`Background0` that would show inside a glass sheet; SwiftUI's sheet presentation draws neither,
while React and Compose have no such presentation), `POIResultCard` / `POIResultList`
(80 / 104 rows), `Chip` with an icon and `onRemove` (the category chip; its count badge is a
`Badge`), `Button` for Cancel, `IconButton` outline for Filters, `POIDetailPanel` for the card.
Missing as parts: nothing the sheet itself needs. The Assistant overlay and the Filters panel are
compositions outside this scope.

## 6. The QA app today, against the prototype

The iOS QA app ([SDKMapScreen.swift](../apps/PointrPlayground/Sources/App/SDKMapScreen.swift))
does not match, as Olcay said, and now in detail:

1. The search row sits in the shell's **top slot over the map**; the prototype's is the sheet's
   first, pinned row. The sheet holds a title, three lines of status text and the result list.
2. **No quick-access tiles.** The prototype's grid is the sheet's body at rest; the app's rest
   state is a list of every place.
3. The sheet offers `[.collapsed, .content, .medium, .large]` and rests at **medium**; the
   prototype rests at **min** showing the search row and one tile row, and goes to full when the
   field is tapped. Tapping the app's field moves nothing.
4. A drag on the app's list moves nothing; only the 16 pt grabber row does.
5. Selecting a place swaps the sheet's content for the card at the same detent; the prototype
   opens the card at half, gives it a Go-fitted min, and **returns to where the search sheet was**.
6. No category chip, no Cancel, no Filters, no Recently visited; the AI button has no flow (as
   agreed for this milestone). Clear in the field exists.

Item 2 is also blocked by data: `PTRPoi` exposes no category — keywords only — so a tile can
only filter by what a category's matchers name, unless the SDK's own category list is used.

## 7. Decisions for Olcay

1. **The shell's named detents**: re-base collapsed / medium / large to the prototype's
   20 / 54 / 94 % on all three platforms, or keep the system's numbers and have the QA app pass
   fractions. Recommended: re-base — the prototype is the reference and the difference is only
   numbers.
2. **The drag surface** (§5, the real gap): make the whole sheet drag with the prototype's scroll
   handoff — the content scrolls only at the largest detent, a downward drag empties the scroll
   before the sheet moves — on iOS, the web and Compose. Recommended: yes, all three, iOS first.
3. **A peek at an anchor**: let the sheet's content mark the row its smallest detent ends at
   (the card's Go row), so `.collapsed` resolves to that row's bottom + 16 within 24–72 %, as
   the prototype's POI min does. Recommended: yes, as a preference the content sets, on all three.
4. **The QA app's tiles**: from the taxonomy's aviation quick-access bar, a tap searching the
   SDK's places by the category's keywords; or from the SDK's own category list if the SDK can
   list one for the site; or no tiles until the SDK exposes a place's type.

Chosen not to change, from §5: the grabber's tap cycling and the velocity-aware snap, both
better than the prototype's; the animation curves.

## 8. Change it yourself

| What                                               | Where                                                                                                                                          |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Re-drive the prototype and re-measure every state  | `node scripts/measure-prototype-sheet.cjs <out-dir>` from the repo root; states as JSON lines plus a PNG per step                              |
| The prototype's rules                              | its bundle, `detents()`, `onGrabDown/Move/Up`, `onSheetClick`, `openPoi`, `mCloseCard`, `onSearchFocus`, `cancelSearch`                        |
| The iOS shell's detents and gesture                | `packages/ios/Sources/Components/AdaptiveMapShell/AdaptiveMapShell.swift`: `KozmosMapPanelDetent.height(in:)`, `grabber(in:)`, `nearestDetent` |
| The web shell's single size                        | `packages/react/src/components/AdaptiveMapShell/AdaptiveMapShell.tsx`: `panelFraction`, `panelSizing`                                          |
| The Compose shell's cap                            | `packages/android/src/main/java/com/kozmos/components/AdaptiveMapShell/AdaptiveMapShell.kt`: `heightIn(max = 0.64)`                            |
| The QA app's browse sheet and top slot             | `apps/PointrPlayground/Sources/App/SDKMapScreen.swift`: `topBar`, `browsePanel`, `panelDetents`                                                |
| The earlier static measurement of the same screens | [pointr-prototype-screen-states-2026-09-20.md](pointr-prototype-screen-states-2026-09-20.md) §1                                                |
