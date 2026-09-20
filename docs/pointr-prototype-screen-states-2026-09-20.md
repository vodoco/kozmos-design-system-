# The Pointr prototype's screen states, measured, and what Kozmos has for each — 20 September 2026

Olcay's reference for how the screens should look is the prototype at
`https://agentic-search-zeta.vercel.app` ("POI details card — Pointr"), which supersedes the older
Figma boards (`Pointr Maps - Express`, `BwtG2COVRqUWGPrIvP4jxr`, node `5213-67470`). It was read in
the built-in browser through the DOM and computed styles, not from screenshots: every number below
is a CSS pixel in the prototype's 402 × 874 phone frame, and the WebSDK tab's are page pixels.
Its options are fixed in this build (`defaultProps`: `routeModeUI: "In-map toggle"`,
`routePreview: "On"`, `goInteraction: "Press and hold"`, `dataSource: "Mock"`, `showAssistant`,
`categoryIcons: "Outline"`); the four-mode preview was reached by switching the mounted
component's prop by inspection. The prototype can also point at a real site (`VITE_POINTR_SITE_PATTERN`,
default `^Harrods`); this build runs on mock data.

Shared surface: a bottom sheet with three detents — minimised (175 tall), resting (472) and
expanded (822) — top radius 24, background white at 90 % with `backdrop-filter: blur(22px)
saturate(1.8)`, shadow `0 -8px 24px -8px rgba(23,25,28,.25)`, a 40 × 5 grabber at 6.5 from the top
in `#C7CAD1`. Text colour `#17191C`, secondary `#5D626F`, borders `#DEE2E6`, theme blue `#135BEC`
(`#0D44C2` for the location dot), success `#23B26B`, danger `#E43458`. Body text is the system
font; controls, inputs and chips are **Readex Pro**.

## 1. Search — nothing selected

| Element                         | Measured                                                                                                                                                                                              | Kozmos                                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Venue info button               | 52 × 52 white, radius 16, shadow, top-right at 16; inner 44 hit area, 16 icon                                                                                                                         | `MapControlButton`                                                                                  |
| Tracking mode ("Focus" / "Off") | 48 × 46 white, radius 16, border, shadow, bottom-left; icon 16; label revealed on change                                                                                                              | `MapControlButton` with `stateLabel`, `revealOnChange` — exists                                     |
| Level pill                      | 69 × 48 white, radius 16, border, shadow, bottom-right; "1F" 15/600 with a 16 chevron in `#5D626F`                                                                                                    | `FloorSelector` collapsible (iOS only); the chevron is the hint recorded as a leftover this morning |
| Location                        | 18 dot `#0D44C2` with a 3 white border and shadow; a 48 pulsing ring; a 64 halo at 14 %                                                                                                               | `UserLocationMarker` has no halo or pulse — partial                                                 |
| Search field                    | 312 × 44, `#F8F9FA`, border, radius 16, Readex Pro 15, padding 0 34 0 38, 18 icon at 30; a 24 grey clear circle when filled                                                                           | `SearchBar` — geometry to compare                                                                   |
| AI search                       | 48 circle with a conic-gradient ring (66 outer), white 43 inner, 16 icon                                                                                                                              | **absent** — no gradient-ring icon button                                                           |
| Filters (with a query)          | 48 × 48 white, radius 16, border, sliders icon                                                                                                                                                        | `IconButton` outline                                                                                |
| Category tiles                  | 4 columns of 86.5 × 114, gap 8; a 64 × 64 white square, radius 18, border, 24 icon in the theme blue; label 11/400, line-height 14, two lines                                                         | `BrowseCategoriesPanel` + `CategoryTile` — geometry to compare                                      |
| Live results (typing "sta")     | 370 × 80 white cards, radius 16, border; name 18/400 Readex Pro; floor 14 grey with a 6 blue dot for the current floor; the estimate "2 min" 14 right; an optional 48 logo, radius 10 (card 104 tall) | `POIResultList` + `POIResultCard` — the result rows are `div`s in the prototype, not buttons        |

## 2. The place card — resting detent

| Element                  | Measured                                                                                                                                                                                                                                                                                                                                                                                       | Kozmos                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Name                     | 22/500, line-height 28, **226 wide beside the buttons, wrapping to two lines**                                                                                                                                                                                                                                                                                                                 | the rule built this morning, confirmed by the reference                                            |
| Favourite, Save, Close   | three **40 circles** (radius 999), white, border, gap 8, top-aligned 8 below the name's top; icons 16 (close 20)                                                                                                                                                                                                                                                                               | `POIDetailPanel` quick buttons are 16px rounded squares by the earlier decision — **conflict, §6** |
| Location · status        | "Current Floor / Building A" 14 grey; "Open" 12/600 in `#23B26B` at the right                                                                                                                                                                                                                                                                                                                  | `locationLabel`, `availabilityLabel`                                                               |
| Description              | 14/400, line-height 21, two lines, then Read More lower down                                                                                                                                                                                                                                                                                                                                   | `description`                                                                                      |
| Go                       | 144 × 56 pill, `#135BEC`, Readex Pro; icon 16, "Go" 15/600 over "12 min · 210 m" 11/400 at 85 %                                                                                                                                                                                                                                                                                                | the navigate action with `travelEstimate` — exists; the estimate as a second line                  |
| Share, Book, Order, Menu | 48 pills, white, border, Readex Pro 14, padding 0 18, icon 16, gap 8, **scrolling in one row**                                                                                                                                                                                                                                                                                                 | `supplementaryActions` in the scrollable strip — exists                                            |
| Rating, crowd, dietary   | three equal cells: star `#CD8905` + "4.7" 24/600 + "/5" 16 + "(32)" 11.5; clock + "Packed" 18/500 `#A06B04` + "25 min wait" 11.5; leaf `#197F4C` + "Dietary Options" 12                                                                                                                                                                                                                        | `MetaStrip` highlights — the three-cell rule                                                       |
| Gallery                  | 300 × 200 tiles, radius 14, gap 12                                                                                                                                                                                                                                                                                                                                                             | `POIMediaGallery` (85 % tiles, 4:3, radius 16 today) — geometry differs                            |
| Attribute sections       | heading 13/400 Readex Pro grey; chips 34 tall, radius 9999, border, 13 Readex Pro, padding 0 12 (0 12 0 10 with a 16 icon), gap 8; Cuisines, Dietary, Service, Accessibility, Amenities, Good to Know, Dress Code, Age Restriction, Capacity, Language Support, Parking Types, Access Restriction, Opening hours (a disclosure), Payment Methods; then the description, Read More and hashtags | the card's groups and `Tag` chips; opening hours as the Product / SDK example                      |

## 3. The route preview — `routeModeUI: "Preview panel"`

Sheet 265 tall. "To" 10/600 Readex Pro grey, the destination 17/600. **Four option cards** in a
horizontal scroll: 132 × 64, radius 14, border; icon + label 13/600, time 17/600, "· 210 m" 12
grey; the selected one on a light-blue tint with a `#135BEC` border. Quickest 12 min · 210 m,
Step-free 17 · 241, Healthy 14 · 200, Scenic 19 · 284. Below, a note 33 tall on a green tint,
radius 12, 12.5 Readex Pro: "Step-free throughout — lifts only, no stairs or escalators". Then a 52
circular Back (outline) and Continue, 308 × 52, `#135BEC`, Readex Pro 16/600.

Kozmos: `RoutePreviewPanel` with `RouteOptionCard` is the same composition — destination label and
name, option cards, an alert slot, Back and Continue. Deviations: four preferences where Kozmos
names quickest, step-free and custom (Healthy and Scenic would be custom with their icons); cards
132 wide where Kozmos's are 208 (the width cut at the panel's edge, decision 10 of the handoff, is
the prototype's answer: narrower cards, and the fourth scrolls in); the note is a tinted row, not
an alert box.

## 4. Turn-by-turn — `routeModeUI: "In-map toggle"` (the default)

Go starts navigation at once. **Instruction card** at the top: 378 × 119 at (12, 56), radius 18,
white at 90 %; a 32 transition icon at the left; "Follow the line towards Very Nice Fish
Restaurant" 20/600 over "12 min (210 m)" 14 grey; a 36 × 5 grabber at its foot. Tapped, it
**opens the itinerary** (197 tall): "FROM" 11 grey + "Current Location" 15 grey; each step 15,
the current one 15/600 in `#0D44C2`; "TO" + the destination 15/600. **Step-free pill** where
Focus was: 108 × 46, radius 16, white at 88 %, border, wheelchair icon, "Step-free" 11 grey over
"Off" or "On" 13/600 (blue when on); tapping recalculates — 17 min · 241 m — and the route
redraws. Level pill unchanged. **Bottom sheet** 167 tall: the destination 20/600 with **End**,
71 × 40 pill, outline `#E43458`, Readex Pro 15/600; the row "12 min" 15/600, "210 m" 15, the
arrival "12:04 pm" 15 at the right; a **progress rail**: a 10 blue dot, a 34 blue disc with the
current manoeuvre's icon, a 284 × 6 grey track, a 10 grey dot at the end. The route line is a
teal-to-blue gradient.

Kozmos: `RouteSummary` carries the arrival and the distance with End; the rail, the instruction
card and the itinerary have no part — the scope document's missing "in-surface status message",
"banner with pointer" and "directions rail", seen here in one screen. `NavigationAnnouncer` exists
for the spoken side. The map-side step-free toggle is `MapControlButton` with a stacked
`stateLabel` — exists.

## 5. Levels and the web

The level pill opens **in place** into a column of 66 × 40 rows, radius 12, Readex Pro 15/500 —
"2F, 1F, GF, B1", the current one filled `#135BEC` 600 white — inside an 80 × 180 white box,
radius 18, border. **Short labels only, no names**: a different answer from this morning's choice
of names beside labels (§6).

The WebSDK tab draws a browser frame around the same screens: the card in a **404 × 664 floating
panel, radius 16, 16 from the edges** (Kozmos's shell floats `min(416, 42%)` with 16 gutters); a
floor control "Ground Floor GF" with Floor up / Floor down, 183 × 52, radius 16 — the
compact-stepper variant with the floor's name; a zoom cluster 52 × 98; a "Change language" pill
"English" 106 × 44 bottom-left; the venue info button top-right; the pin with a 36 label pill.

## 6. Decisions the prototype puts to Olcay — and the answers, the same afternoon

Olcay ruled on four of the five: **the 16px squares stay** (the prototype's circles are its
own); **system fonts on each platform** — Readex Pro is the old font, not a target; **no
wayfinding modes yet, and no preview step**: Go starts wayfinding at once when the visitor has
a GPS or Bluetooth position, and asks for a starting point before static step-by-step
wayfinding when they do not; and with no modes, no step-free toggle anywhere. The level list
(2) is still open: the question is put with a picture of both lists.

The QA app follows the flow decision (`6527d7a`): Go opens the starting-point picker, one
calculation, the directions as soon as it returns, the picker keeping a failure's reason. The
font decision turned out to be the code's state already: the web's `sans` role is the
`Semantics.Typography.Family.System` stack (SF Pro, Roboto, Segoe UI by platform), iOS and
Android use their system fonts, and Readex Pro survives only as the opt-in `Brand` role that
nothing loads — `Primitives.Typography.font.family.primary` and the Figma file's text styles are
what still say it, a Figma-side cleanup through the importer, not a code change.

1. **Quick buttons on the card: circles or 16px squares.** The earlier decision (Astra's handoff §2)
   fixed 16px corners and "not circular quick-action buttons"; the prototype draws 40px circles.
2. **The open level list: names or labels only.** This morning's choice was names beside the
   short labels; the prototype's column is labels only, 66 wide, replacing the pill. The chevron
   on the closed pill is in the prototype and should be built either way.
3. **Readex Pro.** The prototype sets it on buttons, inputs, chips and the route preview; the
   native typography policy keeps the system font, and the font is not bundled or approved.
4. **Four route modes, 132px cards.** Whether `RoutePreference` grows Healthy and Scenic, and
   whether the option card narrows to the prototype's width.
5. **The card's step-free toggle** the older boards showed is not in the prototype's card; the
   toggle lives on the map during navigation.

## 7. What is missing, from these screens

_Later the same day the first three were built on iOS, React and Android —
[navigation-parts-2026-09-20.md](navigation-parts-2026-09-20.md) — and the QA app's directions put
on them._

- ~~A **manoeuvre card** over the map with a grabber that opens the itinerary (§4).~~ Built.
- ~~A **route progress rail** with a manoeuvre disc and end dots (§4).~~ Built.
- ~~An **itinerary list** — FROM, steps with the current one emphasised, TO (§4).~~ Built.
- An **AI search button**: a gradient-ring icon button (§1).
- A location marker with a halo and pulse (§1).
- Everything already recorded: the in-surface status message, the collapsible selector on the
  web and Android, a floor slot and current-step state on a step. ~~Transition arrows~~ — built,
  [transition-arrows-2026-09-20.md](transition-arrows-2026-09-20.md).

## 8. What was not reached

The "Calculating…" confirmation (the recalculation was too quick to catch), press-and-hold on Go
(the modes inside the pill), the AI search's own flow beyond expanding the sheet, the venue info
sheet, a multi-level route (the mock route stays on 1F), and the Filters panel.
