# MAP-595 — the Figma file, 2026-09-12: the nine open items ruled and applied, and how to redo any of it by hand

Companion to `docs/map-595-stories-revision-2026-09-11.md` and `docs/map-595-file-changes-2026-09-11-pm.md`.
Record §198. Every node below was read before it was changed and read back afterwards; where a
script guarded a value ("was #1a1c24") and found something else it threw and rolled back, and the
retry is what is recorded here. Open any node with
`https://www.figma.com/design/nm6qdzaC9B1lknllbwaMTh/?node-id=<id>` (`154:41` → `node-id=154-41`).

Olcay, 2026-09-12: _"analyse extensively … proceed with your recommendation. Provide me everything
I'd need if I need to make changes myself."_ Every recommended option was applied.

---

## 0 · The rulings, as ①'s decision log now carries them (seven rows dated 2026-09-12)

| ① row (WHAT · WHY · rule)        | Ruling                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `907:18622`–`907:18625` (y 2183) | **Colours:** the old ink `#1a1c24`, the near-misses `#171a1c` and `#5c616b` and the identical-value greys bind the product's steps; the file's own annotation palette (callouts, status chips, coverage-box grey, legend dots, taxonomy swatches) stays raw; the Textarea's error red is the product's Delete red `#b42318` (danger/500 fails as text) |
| `907:18626`–`907:18629` (y 2229) | **Featured has a third look with several selected:** mixed = the on-state amber border (alert/300) with a half-filled star (alert/600); on → off → mixed like the personas, mixed only where the features differed at selection; left mixed at Update it writes nothing                                                                                |
| `907:18630`–`907:18633` (y 2275) | **The one border stays foreground/200;** the 3:1 bar is the product's, logged on ⑦ for the product and Kozmos DS                                                                                                                                                                                                                                       |
| `907:18634`–`907:18637` (y 2321) | **The FID row is hidden with several selected**                                                                                                                                                                                                                                                                                                        |
| `907:18638`–`907:18641` (y 2367) | **Hit areas are a developer note, not a redraw**                                                                                                                                                                                                                                                                                                       |
| `907:18642`–`907:18645` (y 2413) | **The panel's numbers sit on the product's scales:** 9 and 9.5 → 10; 11.5 → 12 (rows, placeholders) and → 11 (chips, the dashboard's tag size); radius 3 → 4, 6 → 8, 999 → full; body top padding 14 → 16; the Kozmos Toggle keeps its own 30                                                                                                          |
| `907:18646`–`907:18649` (y 2459) | **Closed:** the ✕ is consistent (C and all three variants: 44×44 at (340, 8) in the 60px header; the dashboard chrome on the screens has no close icon); Terminal C stays hidden in US8                                                                                                                                                                |

By hand, a new ① row: duplicate the last row's three texts and its rule, move them down 46, edit.
The rows are 46 apart; a WHY text may take two lines (28px) above the rule at +30.

---

## 1 · Colours (ruling 1)

Bound by ID to the dashboard's four-mode **Primitive Tokens** where the step is cached in the file,
to **Kozmos DS 2.0 `Primitives`** where it is not (foreground/700). Light values in brackets.

### ⑤ UI Kit

| Node                                                                                              | Was                               | Now                                                              |
| ------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------- |
| `1:28` DevNote (component) ground                                                                 | `#1a1c24` raw                     | `Colors/foreground/900` (`#17191c`) — `12:16` follows it         |
| `126:1213` DevNote instance (own override), `12:8`, `12:10` GeometryCaption grounds               | `#1a1c24` raw                     | `Colors/foreground/900`                                          |
| `407:988`, `733:1992`, `794:2063`, `874:5105` (headings)                                          | `#171a1c` raw (a typo of the ink) | `Colors/foreground/900`                                          |
| `407:989`, `733:1993`, `733:1994`, `733:2003`, `794:2064`, `874:5106` (captions)                  | `#5c616b` raw                     | `Colors/foreground/600` (`#5d626f`)                              |
| `874:5053` fill, `874:5052` stroke (the transparency glyph inside Map View Preferences)           | `#5d626f` raw                     | `Colors/foreground/600`                                          |
| `486:1551`, `486:1554`, `486:1542`, `486:1548` (Textarea · State=Error texts) · `486:1550` stroke | `#b81c1c` raw                     | `#b42318` raw — the product's Delete red, as on the Delete block |

### ③ Flows

| Node                                                                                                   | Was           | Now                                                |
| ------------------------------------------------------------------------------------------------------ | ------------- | -------------------------------------------------- |
| `286:202`, `294:13`, `294:17`, `342:19`, `342:20`, `342:22`, `342:24` (texts) · `294:8` DevNote ground | `#1a1c24` raw | `Colors/foreground/900`                            |
| `294:14`, `294:18` (coverage-box "DRAWN" lines)                                                        | `#464a53` raw | Kozmos DS 2.0 `Colors/foreground/700` (same value) |
| `294:12`, `294:16` (coverage boxes) stroke                                                             | `#c7cad1` raw | `Colors/foreground/200` (same value)               |

**Left raw on purpose** (the file's own annotation palette, not the product): the Callout amber
`#fff6e5` / `#f0d9a8`, the Status chips (`#fdf3e3`, `#d98c0d`, `#23b26b`, `#eef0f3`, `#e8f7ef`,
`#8a5a00`), the coverage boxes' `#f4f5f7` ground, the layer legend's `#7a8699` dots and its
documented `#0ea5e9` hover, the six taxonomy swatches, the drop zone `#fbfcfd`, the `#e5e7eb` menu
edge, the `#f8f9fa` strips and the Delete block (§190's decisions), the section chrome. ②, ④, ⑥, ⑦,
the Cover and the Contents carry nothing raw beyond those components. The Workbench was not touched.

**By hand:** select the layer → Fill (or Stroke) → the variable icon → search the name.

---

## 2 · Featured's third look (ruling 2) — ⑤ `679:2330` and `879:1984`

| What                | Node                                                                                                  | Value                                                                                                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The tile's border   | `679:2330`, `879:1984` stroke                                                                         | `foreground/200` → **`Colors/emotional/alert/300`** (`#fcd281`, Kozmos DS 2.0) — the on-state border                                                                                                                                       |
| The star's outline  | `I679:2332;1007:10448`, `I879:1986;1007:10448` (the Vector inside the `star-01` icon instance) stroke | `foreground/600` → **`alert/600`** (`#f9a707`)                                                                                                                                                                                             |
| The half fill (new) | clip frame `907:18615` › vector `907:18614`; clip `907:18617` › vector `907:18616`                    | A copy of the star's own path filled `alert/600`, no stroke, in a 6.284 × 11.982 frame with Clip content at (27.716, 23.753) in the tile (absolute), placed **under** the icon in the layer list so the outline draws over the fill's edge |

The label stays "Featured". ③'s US7·c (`821:8241`) and US4 (`880:13486`) instances follow.
By hand: draw the vector by copying the star's path (select the Vector inside the icon instance →
⌘C → ⌘V at page level → fill alert/600, remove the stroke), wrap it in a frame half its width with
Clip content, position as above, and drag it below `star-01` in the tile's layer list.

---

## 3 · The one border (ruling 3)

| Where                           | Node                                                                                    | Text / value                                                                                                                                                                                                                                                                                                            |
| ------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⑦ open table, NEW row at y 2732 | `908:18618` (what) · `908:18619` (whose) · `908:18620` (why) · rule `908:18621` at 2762 | "Input border contrast — the 3:1 bar" · "product · Kozmos DS" · the numbers: the dashboard's input border foreground/100 at 2px is 1.27:1, the panel's foreground/200 1.64:1, WCAG 1.4.11 asks 3:1, foreground/500 (4.24:1) would pass — a product-wide change; decided 2026-09-12 the panel keeps the product's border |
| ⑦ developer note                | `743:304`                                                                               | "1px Border/Subtle on every field" → "1px foreground/200 (#c7cad1) on every field" (a Kozmos-Core name left from 2026-09-10)                                                                                                                                                                                            |
| ① decision row (2026-09-10)     | `739:1973`                                                                              | "One field border — 1px Border/Subtle" → "One field border — 1px foreground/200"                                                                                                                                                                                                                                        |

Nothing drawn changed. By hand for a new ⑦ open row: duplicate the row above (three texts + rule),
move down 46, edit; everything below moves down 46.

---

## 4 · The ✕ — closed

Measured: C `589:1082` and the three variants place "Close feature properties" at (340, 8), 44×44,
in the 60px header; the pasted dashboard chrome on the screens has no close icon. ① row at y 2459.
No node changed.

---

## 5 · The FID row hidden with several selected (ruling 5)

| Node                                                                | Was        | Now                                                                                                                                          | By hand                     |
| ------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `679:2322` "FID · read-only" in `Selection=several, List=collapsed` | visible    | hidden                                                                                                                                       | select the row → hide (eye) |
| `879:1976` "FID · read-only" in `Selection=several, List=expanded`  | visible    | hidden                                                                                                                                       | same                        |
| `396:1092` (several, collapsed)                                     | 400 × 713  | 400 × **646** — the body fits its content exactly (60 header + 518 + 68 footer)                                                              | resize the variant          |
| `879:1964` (several, expanded)                                      | 400 × 713  | 400 × **646** — the same height as the collapsed variant; the opened list pushes 87px below the fold, as the product's scrolling panel would | resize                      |
| `396:1091` (one)                                                    | 400 × 649  | 400 × **651** — the 2px top padding of ruling 7 (its body fits exactly again)                                                                | resize                      |
| The set `396:1093`                                                  | 1344 × 777 | 1344 × 715                                                                                                                                   | —                           |
| ③ US1·c card `286:201` › `797:623`, `797:764`                       | 649        | 651 — they follow the master (no size override)                                                                                              | —                           |

③'s panel screens are 820 tall and unchanged; US7·c and US4 show no FID row now.

---

## 6 · Hit areas (ruling 6) — a developer note

⑦ `908:18622` (y 3010): "Hit areas: the whole persona row — label and box, 360×30 — is the click
target; the field bins (20px trash icons) and the chip ✕ (16px) carry a 24×24 hit area in code.
Every one passes WCAG 2.2 AA (2.5.8) by size or by spacing, so nothing is redrawn." Measured:
persona rows 360×30 with a 20×20 checkbox at a 32px pitch (`395:1020`); bins `Icon / trash-01`
20×20 at a 52px pitch (C `589:1103` …); chip ✕ 16×16 (`617:1572`); the dashboard's own buttons 28–32.

---

## 7 · Type, radius and padding (ruling 7)

The dashboard's own list (the pasted drawer on ③) runs at 10 · 11 · 12 · 13 · 16 Readex Pro; its
small tag at 11; the token scale has 10 · 11 · 13 · 16 and radius 4 · 8 · 16 · 24 · full.

### Type

| Change      | Nodes                                                                                                                                                                                                                                                                 | Note                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 9.5 → 10    | C labels `589:1099` Description · `589:1127` Cuisines · `589:1144` Dietary Options · `589:1203` Tags · `589:1233` Opening Hours · `589:1269` Images · `589:1291` Logo · `589:1315` Rating; constraints `600:1488`, `600:1491`; the Delete note `679:2708`, `879:2000` | Readex Pro Regular                                                                      |
| 9 → 10      | C counters `589:1102` "233 characters", `589:1271` "5 / 7"                                                                                                                                                                                                            |                                                                                         |
| 11.5 → 11   | C's 13 chips `589:1131`, `589:1134`, `589:1137`, `589:1148`, `589:1151`, `589:1154`, `589:1207`, `589:1210`, `589:1213`, `589:1216`, `589:1219`, `589:1222`, `589:1225`                                                                                               | the dashboard's tag size; chips shrank 1–2px each, no row re-wrapped                    |
| 11.5 → 12   | placeholders `600:1487`, `600:1490`; "+ Add additional field" `589:1320`, `679:2177`, `679:2569`, `879:1988`; "Delete feature / 3 features" `589:1361`, `679:2188`, `679:2580`, `879:1999`                                                                            | Medium on the rows; the rows are fixed 36 tall and did not grow                         |
| auto-resize | `589:1099`, `589:1291`, `589:1315`                                                                                                                                                                                                                                    | were fixed 308×13 boxes; now hug width and height (56/25/32 × 13) like the other labels |

⚠️ Switching those three from a fixed box to auto-height first wrapped each single word onto two
lines (13 → 26 tall) because the horizontal label row gave the text its hug width rounded down;
width-and-height hugging fixed it. C is 2377 tall (was 2369): +2 padding, +1 on six labels.

### Radius and padding

| Change              | Nodes                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 999 → 9999          | the 13 chips `589:1130`, `589:1133`, `589:1136`, `589:1147`, `589:1150`, `589:1153`, `589:1206`, `589:1209`, `589:1212`, `589:1215`, `589:1218`, `589:1221`, `589:1224` |
| 3 → 4               | image thumbnails `589:1273`, `589:1276`, `589:1279`, `589:1282`, `589:1285`; the logo thumbnail `589:1294`                                                              |
| 6 → 8               | "+ Add additional field" rows `589:1319`, `679:2176`, `679:2568`, `879:1987`; "Delete" rows `589:1360`, `679:2187`, `679:2579`, `879:1998`                              |
| top padding 14 → 16 | the body "scrolls" frames `589:1088` (C), `679:1929`, `679:2321`, `879:1970`                                                                                            |
| untouched           | the Kozmos Toggle's own 30 (a DS default inside its instances); the 1px-radius diamond swatches                                                                         |

C's own text sizes now: 10 (24), 11 (29), 12 (13), 13 (1) — plus the DS buttons' 14 inside their
instances. ⑦ `908:18623` (y 3034) states the scales for developers. By hand: select the text → type
size; the frame → corner radius; the body frame → auto layout padding.

---

## 8 · Terminal C — closed

US8 `878:10528` keeps Terminal C hidden (rows inside the dashboard's list instance cannot be
reordered). ① row at y 2459. No node changed.

---

## 9 · PR #17

Title "The map panel is a sheet you can drag, and an app that proves it" → **"iOS map-panel sheet ·
MAP-595 edit panel and its Figma record · DS tooling"** (REST PATCH, read back). Base `main`, open.

---

## 10 · Found by the audit, and fixed

### Texts that still named Kozmos-Core tokens (from the 2026-09-10 day)

`743:304` and `739:1973` — see §3. ①'s `739:1978` and `739:1982` still say the Core move "was
reversed": history, kept.

### Texts written on 2026-09-11 that named the prototype

Ruling 1 (§190): notes speak of the product, the stories and the file. Each now says "as implemented":

| Page | Node                                | Was → now                                                                                                                                                 |
| ---- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ③    | `821:14352`                         | "… 9px scale corners — drawn to the prototype." → "— drawn as implemented."                                                                               |
| ③    | `821:14359`                         | "… Transform frame drawn to the prototype:" → "drawn as implemented:"                                                                                     |
| ③    | `821:14356`                         | "… one transform box around the group — as the prototype does." → "— as implemented."                                                                     |
| ③    | `I294:8;1:27` (DevNote text)        | "vectors drawn to the prototype's numbers (⑤ Transform)" → "drawn to the implementation's numbers (⑤ Transform)"                                          |
| ⑥    | `825:8293`                          | "drawn to the prototype's overlay." → "drawn to the editor's overlay as implemented."                                                                     |
| ⑥    | `880:14745`                         | "The prototype's box engine applied to v9's page:" → "The implemented box engine applied to v9's page:"                                                   |
| ⑥    | `886:14433`                         | "is the prototype's rule." → "is the implemented rule (12 + 400 + 16)."                                                                                   |
| ⑦    | `797:995`                           | "to x 428, as the prototype does." → "to x 428 (12 + 400 + 16)."                                                                                          |
| ⑦    | `160:37`                            | "Transform frame drawn to the prototype — box 12px out" → "drawn as implemented — box 12px out"                                                           |
| ⑤    | `874:5106`                          | "right of the panel, as the prototype does." → "right of the panel (12 + 400 + 16)."                                                                      |
| ⑤    | `874:5097` description              | "= x 428 — as the prototype does (its button is 44×44); it never crosses" → "= x 428; it never crosses"                                                   |
| ⑤    | `107:1150`                          | "(Olcay, 2026-09-11)" → "(decided 2026-09-11)"                                                                                                            |
| ①    | `864:8379`, `864:8380`, `875:11020` | "drawn to the prototype" / "what the prototype implements" / "as in the prototype" → "as implemented" / "the implementation"                              |
| ①    | `890:2043`                          | the sentence "⚠️ The prototype's bar still carries a Reset tile — a code follow-up, not this file's." removed (it lives in the handoff's list for others) |

Kept: ①'s `789:19` ("Notes about a prototype and its code were removed …" — the ruling's own
sentence) and Olcay's quoted words in ①'s rows.

### Descriptions

`396:1093` (Properties panel) now ends: "With several selected the FID row is hidden (an FID is
per feature; the expanded list names each one) and Featured has a third look — mixed: the on-state
amber border with a half-filled star — shown only where the features differed at selection; it
cycles on → off → mixed like the persona control, and left mixed at Update it writes nothing.
Developer notes on ⑦ Handover." ⚠️ The API's `description` getter returns HTML-escaped text
(`&#39;` for an apostrophe); writing a read-back stores the escaped form. Both descriptions were
rewritten with plain apostrophes and read back in the same form as untouched ones.

### ⑦ — the rest of the page

`743:307` rewritten (Featured's third look and the hidden FID row replace "how it looks is still
open"); the notes block `743:302`–`743:309` moved down 46 for the new open row; the notes re-pitched
from y 2852 (14-tall lines 24 apart, the 28-tall `743:307` followed at 38); new notes `908:18622`
(hit areas) and `908:18623` (the numbers); page bottom 3048; a pairwise box check finds no overlap.

### Checked and found right

④'s 24 node links all resolve; ②, ④, ⑥, ⑦, the Cover and the Contents carry no raw paint beyond
the annotation components; the Workbench's `256:97` "stray grey rectangle — was covering US6
(hidden, not deleted)" is hidden; the ③ sections and fourteen screens are where the handoff says.

---

## 11 · Still open — Olcay

**The geometry bar beside the floating panel** (⑦ `797:993`, owner "design"): Map Content / Edit is
512px — 7 tiles of 64 plus two 8px separators, 8px padding, 8px gaps — and beside the 400px panel a
904px map leaves a 492px strip whose top holds the Building-Level Selector and whose bottom edge
holds the preferences button and the zoom control. The bar does not fit the strip at any height and
cannot hide while the panel is open (a selection opens the panel; the tools are for the selection).
③'s panel screens leave the bar off. This row was in the record's open list but had dropped out of
the handoff's; the first option put to Olcay ("top centre of the strip, no component change") was
wrong by 20px and was withdrawn — the real options are in the handoff §5.

## 12 · Records

- Record: `docs/map-595-figma-2026-09-07.md` §198 and its "Where it stands" summary.
- Handoff: `docs/map-595-handoff.md` (rewritten 2026-09-12; the 2026-09-11 evening version is
  archived at `docs/archive/map-595-handoff-2026-09-11-b.md`).
