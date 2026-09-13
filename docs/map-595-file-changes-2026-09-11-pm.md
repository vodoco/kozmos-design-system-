# MAP-595 — the Figma file, 2026-09-11 afternoon: every change, and how to redo any of it by hand

Companion to `docs/map-595-stories-revision-2026-09-11.md` (the morning: the stories' revision).
This one covers the afternoon: the toolbars and Combine (record §193), the geometry states and the
retouched map bitmaps (§193), Map View Preferences and its button (§194), the four gap screens (§195),
the layout pass (§195) and the closing audit (§196). Open any node with
`https://www.figma.com/design/nm6qdzaC9B1lknllbwaMTh/?node-id=<id>` (`154:41` → `node-id=154-41`).

---

## 1 · Toolbars and Combine

| Where                  | Node(s)                                                       | What is there now                                                                                                                                                               | By hand                                                          |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| ⑤ Geometry toolbar set | `101:1690`                                                    | Every variant hides `tool / Combine` (and Reset on the Edit bars). Map Content / Edit `101:1683` is 7 tiles, 512px: Adjust · Split · Cut-out · Straighten · Undo · Redo · Clear | Select the tile inside a variant → hide (eye)                    |
| ⑤ ten state bars       | `102:709 … 102:1944`                                          | The Combine tile is hidden in each (eight carried it visible as an override, 576 → 512 wide)                                                                                    | Select the tile inside the instance → hide                       |
| ⑤ captions             | `10:12`, `11:63`/`11:64`, `11:113`/`11:114`, `9:12`, `40:104` | No Combine; the two Combine examples are titled "… · SUPERSEDED" with the reason                                                                                                | Edit text                                                        |
| ⑦                      | `408:14`, `161:33`/`161:35`, `797:995`                        | "7, 512px wide"; Combine hidden, out of scope; the bar beside the panel row has 512                                                                                             | Edit text                                                        |
| ②                      | `152:36`/`152:37`                                             | "no — hidden", Combine hidden for this phase                                                                                                                                    | Edit text                                                        |
| ①                      | `864:8374`–`864:8377`                                         | Decision row "Combine is hidden — out of scope for this phase"                                                                                                                  | Duplicate the row above (three texts + rule), move 46 down, edit |
| Workbench              | `863:13864`, `863:13865`                                      | Heading + note over the two 2026-08 exploration frames (`46:15`, `59:62`): superseded                                                                                           | Text                                                             |
| ③ US1·a                | `821:7780`                                                    | Instance of the set — follows it (no override)                                                                                                                                  | —                                                                |

⚠️ A REST render of an instance can be stale after its master changed (US1·a first showed 9 tiles);
render the master to check a master change.

## 2 · Geometry states drawn to the prototype (③), and the map bitmaps

**The numbers, read off `apps/mapscale-review/public/map/index.html`:** `EDIT_INK #0b369c`
(theme/800); primary face fill .10, stroke 2 at 1; other members fill .06, stroke 1.5 at .55;
corner handles r5 white on 2 (`HANDLE_R = 5`; r6 filled when selected); midpoints r3.5 white on 1.5;
transform box at the dominant angle, `BOX_PAD_ADJUST 18` (12 in plain transform), 1px dashed "5 4" at
.7; stem `BOX_STEM 26` along the top edge's normal, 1px at .7; knob r7 white on 2; scale squares 9px
rx 2 white on 2 at the box corners, never rotated. Hover and selection both light the dashboard's own
selection layer (`hoverMark → highlightFeatures → source_selected_ptr`); selection adds the overlay.
SVG strokes are centred, so drawn outer sizes are 12 (corners), 8.5 (midpoints), 16 (knob), 11
(squares) with INSIDE strokes.

**Geometry (map-body px, from the bitmap — PCA fits; `docs/map-595-assets/geometry.json`):**
Check-in 3 (327.6,508.2) (451.8,303.1) (503.0,334.1) (378.8,539.3) · Check-in 5 (493.9,239.9)
(630.5,7.7) (680.4,37.1) (543.8,269.2) · Check-in 4 (689.1,711.4) (808.9,523.9) (856.0,553.9)
(736.2,741.5) · single box (445.7,278.4) (527.8,328.1) (384.9,564.0) (302.8,514.3), knob
(500.2,281.0) · group box (624.9,−17.8) (1062.8,249.1) (739.2,780.1) (301.4,513.3), knob (857.4,93.4).

| Screen | Node        | Bitmap (hash)                    | States frame                                                                    |
| ------ | ----------- | -------------------------------- | ------------------------------------------------------------------------------- |
| US1·a  | `820:4979`  | selected + hovered `6c57f760`    | `864:8259` — highlight on Check-in 5 and 3, overlay on 3, single box (18 nodes) |
| US1·b  | `820:5007`  | selected `db323a1d`              | `864:8278` (17)                                                                 |
| US1·d  | `878:9382`  | selected                         | clone of US7·b                                                                  |
| US2    | `820:5150`  | selected                         | `864:8352` (17)                                                                 |
| US4    | `880:13436` | all three `207b4cdc`             | clone of US7·c                                                                  |
| US6    | `875:9918`  | selected                         | clone of US7·b                                                                  |
| US7·a  | `820:5066`  | clean `42444f03`                 | none                                                                            |
| US7·b  | `820:5094`  | selected                         | `864:8296` (17)                                                                 |
| US7·c  | `820:5122`  | all three                        | `864:8314` — three highlights, primary + two others, group box (37)             |
| US7·d  | `878:9503`  | selected                         | clone of US7·b                                                                  |
| US8    | `878:10528` | selected                         | clone of US7·b                                                                  |
| US3    | `820:5178`  | v9's placement bitmap `cb236e99` | none (v9's preview)                                                             |
| US5    | `820:5285`  | v9's floor plan page `927409d4`  | `878:9370` — the Transform frame (see §4)                                       |

Each states frame is a 904×844 clipping frame inserted at index 1 of `mapBody` (above the map, below
the toast, selector, panel, menus). Layer names carry the numbers ("face · primary 10% / 2px",
"corner handle · r5", "transform box · 1px dashed 5/4 @70% · 18px out" …). Colours: strokes bound to
the product's theme/800 where opaque, raw translucent paints elsewhere (a bound paint with opacity
renders opaque).

**The bitmaps.** v9's map had Check-in 3's selection baked in. `docs/map-595-assets/retouch-map.py`
regenerates the four variants from `v9-map-terminal-b-4f-2x.png` (the 2× render) in seconds; to put
them in: `upload_assets` (count 4) → `curl -k -F "file=@map2x-clean.png;type=image/png" <submitUrl>`
→ each answer carries `imageHash` and drops a 400×300 frame on the desktop app's current page →
set `{type:'IMAGE', imageHash, scaleMode:'FILL'}` on the screen's "Mapsicle Map" node → delete the
frame. By hand: select the "Mapsicle Map" layer inside the map instance → Fill → choose image → Fill.

## 3 · Map View Preferences

| Node                                | What                                                                                                                                                                           | By hand                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Workbench `872:35961`               | v9's "Map Container": PreferencesOverlay (19452:258615) + its 32×32 Buttons trigger, pasted; the source                                                                        | In v9, select 19452:258615's parent, ⌘C; here ⌘V                                         |
| ⑤ `874:5070`                        | **Map View Preferences** — the overlay as a component, `focusContainer` (Grey out unchanged · Hide POI labels) hidden, Snap toggle On                                          | Paste v9's frame → Create component → hide focusContainer → set the Snap row's Toggle=On |
| ⑤ `874:5097`                        | **Map View Preferences button** — wraps v9's Buttons instance                                                                                                                  | Create component around the pasted button                                                |
| ⑤ `874:5105`, `874:5106`, `407:989` | Heading, caption, and the rewritten Snap note (v9 already carries the Editing › Snap row)                                                                                      | Text                                                                                     |
| ③ buttons                           | `875:9862` (US1·a), `875:9870` (US1·b), `875:9878` (US7·a), `875:9886` (US7·b), `875:9894` (US7·c), `875:9902` (US2), `875:9910` (US3) + clones on US1·d, US4, US6, US7·d, US8 | At (16, 796); x 428 where the panel is open — panel inset 12 + 400 + 16                  | Place the instance in `mapBody`, absolute             |
| ③ US6 screen                        | `875:9918` (overlay instance `875:10729` at 428,447; caption `875:10782`)                                                                                                      | The overlay open above the button                                                        | Clone US7·b, add the overlay instance                 |
| ⑦                                   | `160:41`, `391:906`, `797:995`, `743:309`                                                                                                                                      | Snap's home, the button's step, the components list                                      | Text                                                  |
| ⑥                                   | `886:14431`–`886:14434`                                                                                                                                                        | "Map View Preferences and its button — TRUE"                                             | Duplicate the last row                                |
| ①                                   | `875:11018`–`875:11021`                                                                                                                                                        | Decision row                                                                             | Duplicate the last row                                |
| ④                                   | `886:14426`                                                                                                                                                                    | US6 link "⑤ Map View Preferences ↗"                                                      | Duplicate a link text, set hyperlink node-id=874-5070 |

## 4 · The four gap screens

| Screen       | Node                                                                                                                                                                                                  | What is on it                                                                                                                                                                                                                                                                                                                                                                                                       | By hand                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| US5          | `820:5285` (frame `878:9370`)                                                                                                                                                                         | Transform frame from the plan's real corners (`referenceFloorPlan`, 513×407 at −9.8°): box 12px out at 9.8°, knob (502,150) on its stem, four scale squares, readouts "100%" and "0°" (⑤'s pill `126:1150`/`126:1151` cloned); anchors `820:5573`, `820:5575`, `820:5578` hidden; v9's Tools bar: 2Dot Align `idle`, Transform `selected`; hint "Drag the plan to move it · the box corners scale · the knob turns" | Draw the polygon; the `drawingToolItem` instances take `state`   |
| US8          | `878:10528`                                                                                                                                                                                           | Clone of US7·b; the drawer's `listItem` rows renamed/hidden by their `entitiyName`: search "check-in", "6 results for “check-in”", Terminal A (2), Terminal B (4), Check-in 1 · **Check-in 3 (inFocus)** · Check-in 4 · Check-in 5; floors, categories, other POIs and Terminal C hidden (rows cannot be reordered inside an instance)                                                                              | Select a row → Property 1, entitiyName, Show Counter, visibility |
| US4          | `880:13436`                                                                                                                                                                                           | Clone of US7·c; panel `List=expanded`; Selection checklist instance `880:14681` with its top-right corner on Check-in 4 at (790,600)                                                                                                                                                                                                                                                                                | Set the panel's List property; place the checklist               |
| US1·d        | `878:9382`                                                                                                                                                                                            | Clone of US7·b; scrim + Confirmation overlay Tone=danger at (520,319), both inserted at index 0 of the ROOT (v9's root stacks first-on-top); "Delete Check-in 3?"                                                                                                                                                                                                                                                   | Insert at the top of the layer list                              |
| US7·d        | `878:9503`                                                                                                                                                                                            | Clone of US7·b; Saved notice Action=updated at (599,693), bottom-right above the zoom control; "Check-in 3 updated"                                                                                                                                                                                                                                                                                                 | Place the instance                                               |
| ⑤ `879:1921` | **Selection checklist (shift-right-click)** — the Context menu's card: header "FEATURES AT THIS POINT" + x-close, rows Check-in 4 (on) · Excess Baggage Cashier (off) with the Persona row's checkbox | Duplicate a Context menu variant OUT of the set, rebuild rows                                                                                                                                                                                                                                                                                                                                                       |
| ⑤ `879:1964` | Properties panel `Selection=several, List=expanded`; the other two variants are `List=collapsed`                                                                                                      | Duplicate the several variant inside the set, rename, open the strip: chevron −90°, "Hide", three rows with x-close                                                                                                                                                                                                                                                                                                 |
| Sections     | US4 630 → 1630, US8 546 → 1546, US1 +23, US7 2710 → 3000 (the "panel floats" note `342:18` moved under the captions; the coverage box `294:16` moved to y 545)                                        | Resize the section, move what is below                                                                                                                                                                                                                                                                                                                                                                              |

## 5 · The closing audit (§196) — what it changed

- **One selection, one lit row:** v9's sample lit "Dubai Ahlan Counter" as well as Check-in 3 on every
  cloned list; that row is `idle` on all twelve Map Content screens.
- **The panel names the feature the map shows selected:** on US7·b, US2, US6, US8, US1·d and US7·d the
  panel header, subtitle, Section and Name read Check-in 3 · Bag Drop / Check-in · Terminal B /
  Ground Floor (GF); the Delete question and the Saved notice say Check-in 3. ⑤'s specimen keeps
  "Immigration Control Access".
- **The level selector reads Ground Floor (GF)** on the Map Content screens — the floor the list has
  expanded (v9's sample said 4F on the selector and GF in the list).
- **⑤'s Transform anatomy** uses the rendered sizes (knob 16, corners 12, squares 11 r3) so ⑤ and ③
  match; the numbers heading says the radii are the SVG's.
- **④ links:** US4 → the checklist and expanded list; US6 → Map View Preferences.
- ⑦ `743:309` lists the new components; Workbench note `825:12329` names the third paste.

## 6 · Reset hidden (§197)

The master already hid `tool / Reset` in every variant; the notes followed: ⑤ `107:1150`, `40:104`,
`104:1400`; ⑦ `408:14`; ② `152:43`; ① a new row. By hand: nothing to hide — check a bar shows
Undo · Redo · Clear, and edit the texts.
