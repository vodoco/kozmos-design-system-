# Product UI coverage, 2026-09-14

What the running product actually draws, and how much of it the Kozmos design system covers.
Priority two of the five (`ds-handoff.md` §4.2).

Every number here was read from the Figma REST API on 2026-09-14, from **13 surfaces across three
files, 763,776 nodes**. Nothing is quoted from an earlier audit; where an earlier audit disagrees,
this file says so and gives the measurement. The prior scans were inputs, not answers, and three of
their claims did not survive (§5).

## 0 · How to reproduce this

The scan reads each surface over `/v1/files/{key}/nodes`, walks every node, and counts component
instances, text styles, fills, strokes and corner radii. Two pages exceed what one response can
carry, so they are fetched child by child; `2.5 - Map Content` alone is 498,644 nodes.

```bash
curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/b8dqhE3CPxitYfqlXuQJTC/nodes?ids=19452%3A258615" | head -c 400
```

The token in `.env` carries `file_content:read`, which is enough for all three product files. It
expires 2026-11-24.

**Counting rule.** A "control" is a component instance that is not an icon and not mock-up chrome.
An icon is a name from an icon-library namespace (`PointrMaps Symbols`, `facility/`, `social/`), a
lucide-style slug with a numeric suffix (`edit-05`, `loading-01`), or one of a written-out list of
glyph nouns. Chrome is the iPhone keyboard, status bars and App Clip frames the mock-ups sit inside.

The rule is spelled out because it is a judgement, and because a first pass of this scan got it
wrong: it filed every lowercase single word as an icon, which hid `counter` (8,962 instances) and
`button` (5,442) among the glyphs. The split is now **147 icon names / 130,114 instances**, 20
chrome names / 5,965 instances, and **516 controls / 126,222 instances**, of which **131 appear on
four or more surfaces**.

## 1 · What was scanned

| Surface                              | Node           | Nodes read | Distinct instances |
| ------------------------------------ | -------------- | ---------- | ------------------ |
| Dashboard · 0 - Common UI Components | `7760:322712`  | 23,363     | 429                |
| Dashboard · PreferencesOverlay       | `19452:258615` | 81         | 6                  |
| Dashboard · error overlay            | `7581:268934`  | 176        | 14                 |
| Dashboard · 2.4 - Levels             | `12929:235428` | 37,889     | 305                |
| Dashboard · 2.5 - Map Content        | `9434:54197`   | 498,644    | 561                |
| Dashboard · taxonomy workflow        | `15703:113650` | 25,882     | 274                |
| Express · Branded Pointr Express     | `18518:29917`  | 25,025     | 224                |
| Express · Theme Support              | `16415:43319`  | 33,929     | 343                |
| Express · Rate your experience       | `19922:8556`   | 100,600    | 242                |
| Express · Logo and whitelabeling     | `11673:277621` | 13,942     | 207                |
| POI Revamp · POI detail              | `241:4772`     | 886        | 52                 |
| POI Revamp · Web SDK screen          | `537:35728`    | 1,405      | 92                 |
| POI Revamp · wayfinding              | `862:131794`   | 1,954      | 73                 |

Files: dashboard `b8dqhE3CPxitYfqlXuQJTC`, Express `BwtG2COVRqUWGPrIvP4jxr`, POI revamp
`HbFSXhCPxKUy2fWa5x9TKO`.

One limit, stated plainly: `0 - Common UI Components` nests deeply enough that some children were
read at depth 6, so its counts are a floor. Every other surface was read whole.

## 2 · The tokens, measured

This is what settled the token questions the handoff had been holding, and it is friendlier than
that handoff assumed. Every one of them was ruled on 2026-09-14; they now sit in `ds-handoff.md` §5.

### 2.1 · Colour: the neutral ramps are already the same

**79.1% of the product's opaque fills are already a Kozmos token value**, byte for byte. The
product's most-used neutrals are Kozmos's `Primitives.Colors.background` ramp:

| Product fill | Share of fills | Kozmos token                        |
| ------------ | -------------- | ----------------------------------- |
| `#464A53`    | 13.7%          | `background.700` / `foreground.300` |
| `#FFFFFF`    | 13.1%          | `background.0` / `foreground.1000`  |
| `#5D626F`    | 12.5%          | `background.600` / `foreground.400` |
| `#9095A2`    | 8.0%           | `background.400` / `foreground.600` |
| `#000000`    | 5.1%           | `background.1000` / `foreground.0`  |
| `#2E3138`    | 4.1%           | `background.800` / `foreground.200` |
| `#747B8B`    | 3.9%           | `background.500` / `foreground.500` |
| `#E3E4E8`    | 3.3%           | `background.100` / `foreground.900` |

So "the palette numbering runs opposite ways" is not two palettes. It is **one ramp with two names**,
and Kozmos already defines both: `background` ascending light to dark, `foreground` descending. The
product's `foreground/900` ink is Kozmos's `background.900`, `#17191C`.

What genuinely differs is the brand blue, and it is the largest single gap:

| Value     | Share | Status                                                                                       |
| --------- | ----- | -------------------------------------------------------------------------------------------- |
| `#346DF1` | 3.7%  | **no Kozmos token.** Kozmos straddles it: `theme.500` is `#135BEC`, `theme.600` is `#1051E8` |
| `#1051E8` | 3.5%  | `theme.600` — the product uses this one too                                                  |
| `#DADADA` | 3.1%  | no Kozmos token; a grey off the ramp                                                         |
| `#011E41` | 1.4%  | no Kozmos token                                                                              |

`#346DF1` is 4.56:1 on white and `#1051E8` is 6.24:1, so both pass AA for text. This is a brand
decision, not an accessibility one.

### 2.2 · Type: the scale mostly agrees, and the handoff had the wrong number

**Readex Pro is 93.8% of all product text.** That settled the question of the `Brand` role, which the
handoff had proposed dropping because "no surface uses it": no _Kozmos_ surface uses it, but the
entire product is set in it. Ruled 2026-09-14 — the role stays, scoped with `unicode-range`.

| Size | Share of product text | On the Kozmos scale?          |
| ---- | --------------------- | ----------------------------- |
| 11px | 45.3%                 | yes, `font.size.100` = 11.008 |
| 13px | 15.3%                 | yes, `font.size.200` = 13.008 |
| 12px | 14.4%                 | **no**                        |
| 10px | 7.5%                  | yes, `font.size.50`           |
| 15px | 6.2%                  | **no**                        |
| 16px | 3.6%                  | yes, `font.size.300`          |
| 25px | 2.4%                  | **no**                        |

**The handoff says "the product runs at 12". It does not.** 11px is 45.3% of the product's text and
12px is 14.4%. Kozmos's 11 and 13 are the product's two dominant sizes, so the scale is closer to
right than anyone thought. What is wrong is the floating-point noise on exactly those two steps, and
two absent sizes.

Measured against the whole scale, **72.9% of product text already sits on a Kozmos size** (within
0.5px of a step). Adding 12 and 15 takes it to **93.4%**; adding 25 as well, 95.8%.

Weights: 400 at 90.0%, 600 at 6.5%, 700 at 2.3%, 500 at 1.2%.

### 2.3 · Border: the product's container edge is lighter than Kozmos's

The most-used opaque stroke is `#E3E4E8` at 1px, 8.1% of all strokes. That is `background.100`, and
it is **1.27:1 on white**. Kozmos's `Border/Subtle` is `#C7CAD1` at **1.64:1** and `Border/Input` is
`#747B8B` at **4.24:1**. The product uses `#C7CAD1` as well, also at 1px.

So the disagreement is narrow: one step on a ramp both sides already share. Neither of the product's
border values reaches 3:1, the WCAG minimum for a control boundary that carries meaning.

### 2.4 · Radius: the product's commonest corner has no Kozmos role

| Radius | Share of rounded nodes | Kozmos role                                                                       |
| ------ | ---------------------- | --------------------------------------------------------------------------------- |
| 8px    | **52.5%**              | none. `Primitives.Layout.radius.100` exists; no `Semantics.Radius.*` points at it |
| 16px   | 20.1%                  | `Radius.Control`                                                                  |
| 4px    | small                  | `Radius.Marker`                                                                   |

More than half of every rounded corner in the product is 8px, and the roles skip it: `Marker` is 4,
`Control` is 16. The tail (4.6px, 0.65px, 4.37px) is scaled mock-up artefacts, not decisions.

## 3 · Component coverage

**covered** means a Kozmos component expresses it today; **partial** means the component exists but
cannot express an axis the product uses; **missing** means there is nothing.

| Product control                                                                         | Surfaces | Instances | Kozmos                                 | Verdict     | Lane                        |
| --------------------------------------------------------------------------------------- | -------- | --------- | -------------------------------------- | ----------- | --------------------------- |
| `Tags`, `tag/small/master`, `filterTag`                                                 | 10       | 33,988    | `Tag`, `Chip`                          | **partial** | Core                        |
| `Buttons`, `.Buttons Master`, `button`                                                  | 12       | 25,712    | `Button`                               | **partial** | Core                        |
| `counter`, `itemCounter`                                                                | 11       | 9,427     | `Counter`                              | **partial** | Core                        |
| `Text-Inputs`, `.text-input-master`                                                     | 9        | 4,269     | `Input`, `FieldWrapper`                | **partial** | Core                        |
| `dropdown-item`, `dropdownItem`, `menu-item`, `dropdown-item/idle`                      | 7        | 3,917     | `Menu`, `Listbox`, `Select`            | covered     | Core                        |
| `listItem`                                                                              | 4        | 3,865     | `List`                                 | covered     | Core                        |
| `showHideButton`, `show/hideButton`                                                     | 7        | 3,081     | `ToggleButton`, `IconButton`           | covered     | Core                        |
| `levelItem`, `.master-level-button`, `level change`, `Building-Level Selector`, `floor` | 10       | 2,926     | `FloorSelector`                        | **partial** | Product / SDK               |
| `QuickAccessItem`                                                                       | 5        | 1,345     | `CategoryTile`                         | **partial** | Product / SDK               |
| `sideMenu`, `sideMenu-item`, `side-drawer-Buttons`                                      | 5        | 1,186     | `Sidebar`, `NavigationItem`            | covered     | Core                        |
| `Place card`, `Cards`                                                                   | 4        | 1,081     | `POICard`, `POIResultCard`             | covered     | Product / SDK               |
| `drawingToolItem`, `.edit-tools/master`, `Toolbar - URL Controls`, `Tools`              | 10       | 1,013     | none                                   | **missing** | Core (Toolbar + ToolButton) |
| `WayfindingButton`, `accessibilityButton`                                               | 5        | 807       | `MapControlButton`, `MapControlsGroup` | **partial** | Product / SDK               |
| `Tabs`                                                                                  | 4        | 675       | `Tabs`                                 | covered     | Core                        |
| `Toggle`, `Text-Inputs/text-area-master/toggle-base-master`                             | 7        | 660       | `Switch`                               | covered     | Core                        |
| `Search Box`, `searchBox`                                                               | 9        | 619       | `SearchBar`, `Search`                  | covered     | Core                        |
| `dragHandle`                                                                            | 5        | 532       | none                                   | **missing** | Core                        |
| `Footer`, `Top bar - Light`, `Chrome`                                                   | 4        | 429       | `Navbar`                               | **partial** | Core                        |
| `Bluedot`                                                                               | 7        | 424       | `UserLocationMarker`                   | covered     | Product / SDK               |
| `openingHours`, `dayItem`                                                               | 5        | 410       | none                                   | **missing** | Product / SDK               |
| `buildingWizard-SegmentAccordionItem`                                                   | 4        | 396       | `Accordion`                            | covered     | Core                        |
| `drawer/bottom/info`                                                                    | 7        | 358       | `BottomSheet`, `Drawer`                | covered     | Core                        |
| `map-module/content`, `*map-viewer/ltr`                                                 | 8        | 334       | `MapView`, `MapOverlay`                | covered     | Product / SDK               |
| `language selector`, `Scope Selector`                                                   | 4        | 321       | `Select`                               | covered     | Core                        |
| `Circular-preloader`, `preloader/circular-item-0`                                       | 4        | 234       | `Spinner`, `Progress`                  | covered     | Core                        |
| `notifierBox`, `notifierBox/Side-Drawer-Footer`                                         | 4        | 213       | `Alert`, `Toast`                       | covered     | Core                        |
| `User Menu`                                                                             | 4        | 158       | `Avatar` + `Menu`                      | covered     | Core                        |
| `filterButton`, `filterSection`                                                         | 3        | 139       | none                                   | **missing** | Core (Filter)               |
| `carouselHeader`                                                                        | 3        | 69        | none                                   | **missing** | Core (Carousel)             |
| `Countdown Timer`                                                                       | 5        | 9         | none                                   | **missing** | Product / SDK               |

Across the 30 mapped groups, 98,597 control instances: **80.0% partial, 17.8% covered, 2.2%
missing.** That ratio is the finding. The design system is not short of components; three of them
cannot express one axis, and those three are the product's most-used controls.

`frameType`, `foldersIcons`, `buttonContainer` and `cardNumber` are dashboard layout scaffolding
rather than reusable controls, and are deliberately left without a verdict.

### 3.1 · Why the three biggest are only "partial"

**Button.** The product drives an `Emotion` axis and uses all six values: Themed 656, Neutral 444,
Success 185, Danger 105, Informative 37, Alert 3. Kozmos's React `Button` has
`variant: default | secondary | destructive | outline | ghost | link | glass`, which expresses
`danger` as `destructive` and nothing else.

**The Kozmos token layer already models it exactly.** `Components.{Primary,Secondary,Tertiary}
Buttons` each carry `themed, success, alert, danger, informative, neutral`, with `background` and
`foreground` for `idle, hover, pressed, focus`. The tokens are the product's model; the component
API is not. The gap is at the component layer only, which makes it far cheaper to close than a
retheme.

**Tag and Counter** carry the same `Emotion` shape in the product and the same absence in the
component API.

**Input.** The product's border is `#E3E4E8` at 1.27:1 and Kozmos's `Border/Input` is 4.24:1. The
component exists; the token it reads is not what the product draws.

## 4 · What is missing, by lane

**Core:** Toolbar and ToolButton (10 surfaces, 1,013 instances, the largest missing pattern),
DragHandle (5 surfaces, 532), Filter, Carousel. The first two are already named in
`ds-scope-2026-09-12.md` §4; this scan gives them their usage counts.

**Product / SDK:** opening hours with a per-day row (410), a countdown timer, quick-access items
beyond what `CategoryTile` expresses (1,345), and a building-plus-level scope selector, which is
what the dashboard means by "level selector" and is wider than `FloorSelector`.

**Neither, and blocking 80% of the mapped instances:** the `Emotion` axis. Not a new component; an
axis missing from `Button`, `Tag` and `Counter`, already present in the tokens.

## 5 · Where the earlier audits were wrong

Kept so the next reader does not re-inherit them:

1. **"The product runs at 12"** (`ds-handoff.md` §4.2, and the decision then numbered §6.3). 11px is 45.3% of product text;
   12px is 14.4%. Kozmos's two dominant steps are the product's two dominant steps.
2. **"The palette numbering runs opposite ways"**, implying two palettes. It is one ramp with two
   names and Kozmos defines both. 79.1% of product fills are already Kozmos token values.
3. **`Brand` (Readex Pro) is "an opt-in role no surface uses"** (the decision then numbered §6.8). The product is 93.8% Readex
   Pro. Dropping the role moves the design system away from the product, not towards it.

## 6 · What this decided

Each of these was put to Olcay on 2026-09-14 with the measurement beside it, and ruled the same
evening. They are recorded in `ds-handoff.md` §5; the numbers behind them are above.

| Question                                                                   | Ruling                                                                                                                                                                        |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The brand blue: `#346DF1` in the product, `theme.500` `#135BEC` in Kozmos  | **Adopt `#346DF1`** as `theme.500`. Use `theme.600` where a border must carry meaning, since `#346DF1` is 4.56:1 and does not reach 3:1 as a non-text boundary at small sizes |
| Whether `background.N` or the product's `foreground.N` naming is canonical | **Keep both**, as Kozmos ships them. The product maps at its own boundary; nothing is renamed                                                                                 |
| The type scale                                                             | **Add 12 and 15, round `11.008…` to 11 and `13.008…` to 13.** Coverage of product text goes 72.9% to 93.4%                                                                    |
| The `Brand` role, given Readex Pro has no CJK                              | **Keep it, scoped with `unicode-range`**, with a declared system stack for CJK                                                                                                |
| A radius role for 8px                                                      | **Add one between `Marker` and `Control`.** Nothing already bound to another step moves                                                                                       |
| The `Emotion` axis on `Button`, `Tag` and `Counter`                        | **Add an `emotion` prop** reading the tokens that already exist. `variant` keeps its meaning for shape and weight                                                             |
| A glass surface role                                                       | **Add it**, composed from the `Semantics.Effect.glass` values already in the tokens                                                                                           |

The `emotion` ruling is the one that matters most: it is a component API change, not a retheme, and
it is what stands between the design system and 80% of the product's control instances.
