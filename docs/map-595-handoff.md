# MAP-595 — handoff for the next session

Written 2026-09-11, evening, at the end of the second long session (the record now runs §1–§197).
Every node ID, hash and number below was read back from the Figma file, the repo and the record at
the time of writing. The earlier handoff (written that morning, then patched through the day) is
archived at `docs/archive/map-595-handoff-2026-09-11-a.md`; nothing in it overrides this one.

## 0 · Start here

Paste this as the first message of the new chat:

> Continue MAP-595 (Easier Content Editing — Part 2). Read `docs/map-595-handoff.md` first, then the
> "Where it stands" summary at the top of `docs/map-595-figma-2026-09-07.md` and §190–§197. The
> subject is the stories document and the Figma file `nm6qdzaC9B1lknllbwaMTh` — the team's reference
> for QA and implementation. The prototype `apps/mapscale-review` is not the subject. Pick up from §5,
> "Open — waiting on Olcay".

Read order: this file → the record's "Where it stands" → §190–§197 → the two change lists
(`docs/map-595-stories-revision-2026-09-11.md`, `docs/map-595-file-changes-2026-09-11-pm.md`) → the
memory files named in §7.

## 1 · The work, and how Olcay works

- **What:** MAP-595 "Easier Content Editing — Part 2" at Pointr: editing map content in the Map Content
  screen — one-click selection (US1), leaving and switching (US2), copy and paste (US3), several at
  once (US4), Transform on the floor plan alignment page (US5), ten alignment snaps (US6), metadata in
  its own panel (US7), search results that stay (US8). The stories live in their own document (revised
  2026-09-11, no longer a draft); ④ links to it and summarises each story. **The Figma file is the
  team's reference for QA and implementation** (Olcay, 2026-09-11) — "the rest of the team doesn't
  need to know about the prototype and its notes". No note in the file names the prototype, its code,
  the record or a person's ruling; notes speak of the product, the stories and the file.
- **The prototype** matters only as a source of measured behaviour (§7 says where the geometry
  numbers came from). Do not touch `apps/mapscale-review`, PR #17, CI or iOS unless asked.
- **The standing instruction** — Olcay repeats it; treat it as the default mode:

  > "Once more, please analyse extensively to see if anything is overlooked, missed,
  > mis-implemented or could have done better. No hacks - no cheats - do it propertly and perfectly.
  > Otherwise please proceed with your recommendation. Provide me everything I'd need if I need to
  > make changes myself. But remember you have CLI access. I don't want to miss anything"

- **How Olcay likes it:** an adversarial self-audit before "done"; verify by measuring and rendering,
  never assert; decisions as short multiple-choice questions with the recommended option first; every
  change in the record with its numbers; a change list a person can redo by hand; mistakes stated
  plainly; pushes, PR edits and merges only on a go-ahead; commits only when asked ("commit the docs").

## 2 · Where everything is

**The Figma file** `nm6qdzaC9B1lknllbwaMTh`, "[MAP-595] Easier Content Editing — Part 2". Pages
(never deleted — only notes about unrelated things go): 📕 Cover · 📑 Contents · ① Context & decisions
(`1:4`… find by name) · ② Research · ③ Flows `1:5` · ④ User Stories `1:6` · ⑥ True vs Representative
`1:8` · ⑤ UI Kit `1:7` · ⑦ Handover `1:9` · 🛠 Workbench `20:4`.

**③ Flows** — one section per story, each: title, a one-paragraph intent, numbered step cards
(380 wide, 400 pitch), ⚠️ notes (glyph at x 80, text at x 104, 28px pitch), a coverage box on US1
and US7, then the screens (1440×900, two per row at x 80 and 1600, caption 12px under each).
Sections and screens:

| Section       | y     | Screens                                                                                                                                                          |
| ------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US1 `153:8`   | 320   | a `820:4979` hover + selected · b `820:5007` context menu picker · c `286:201` detail card (Cancel/Update before and after) · d `878:9382` Delete's confirmation |
| US2 `153:44`  | 3076  | `820:5150` the unsaved guard over the panel                                                                                                                      |
| US3 `153:73`  | 4742  | `820:5178` v9's placement mode as pasted (Confirm bar — a discrepancy for the author)                                                                            |
| US4 `154:8`   | 6380  | `880:13436` shift-right-click checklist + the panel's selection list expanded                                                                                    |
| US5 `154:46`  | 8130  | `820:5285` the floor plan page with the Transform frame                                                                                                          |
| US6 `155:8`   | 9824  | `875:9918` Map View Preferences open, Snap on                                                                                                                    |
| US7 `156:8`   | 11794 | a `820:5066` nothing selected · b `820:5094` one selected · c `820:5122` several · d `878:9503` the Saved notice after Update                                    |
| US8 `790:574` | 14914 | `878:10528` the list searched for "check-in"                                                                                                                     |

Every Map Content screen is a clone of a pasted v9 frame: `headerMenu` + `body` (rail `sideMenu`,
list `mapContentSideDrawer` 440 wide, `mapBody` 904×844). Inside `mapBody`, in order: the map
instance (its "Mapsicle Map" image fill is the per-state bitmap), the **geometry states** clipping
frame (index 1), the toast, `topLeft` (hidden), the Building-Level Selector (x 312, or 518 beside a
panel), then the panel / menu / toolbar / checklist / overlay instances, and the **Map View
Preferences button** (16, 796 — or x 428 while the panel is open). US2 and US1·d carry their scrim
and overlay at the ROOT's indices 0 and 1 (the root stacks first-on-top). Data conventions: the
selected feature is **Check-in 3** everywhere (panel header, Section "Bag Drop / Check-in", Name,
the Delete question, the Saved notice); one lit list row; the selector reads **Ground Floor (GF)**,
the floor the list has expanded.

**⑤ UI Kit** — the panel section `406:988` (x 0–3016, y 10300–12392) holds:

| Component                               | Node       | Variants / notes                                                                                                                  |
| --------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Properties panel                        | `396:1093` | `Selection=one, List=collapsed` `396:1091` · `several, collapsed` `396:1092` · `several, expanded` `879:1964`                     |
| Persona row                             | `395:1020` | 6 personas × on / off / indeterminate (checkboxes)                                                                                |
| Confirmation overlay                    | `733:1991` | `Tone=danger` `733:1957` (Delete: Keep · Delete) · `Tone=warning` `733:1973` (the guard: Keep editing · Discard changes · Update) |
| Saved notice                            | `741:1974` | `Action=updated` `733:1995` · `Action=deleted` `741:1966`                                                                         |
| Context menu                            | `794:2062` | `Features at point=one` `794:2060` · `several` `794:2061` (the picker); drawn to v9's contextualMenu                              |
| Selection checklist (shift-right-click) | `879:1921` | Context-menu chrome, "FEATURES AT THIS POINT" + ✕, rows with the Persona row's checkbox                                           |
| Map View Preferences                    | `874:5070` | v9's PreferencesOverlay pasted; Editing › Snap on; Focus rows hidden (out of scope)                                               |
| Map View Preferences button             | `874:5097` | v9's 32×32 Buttons trigger                                                                                                        |
| Edit panel — the design                 | `589:1082` | "a POI with everything", in section `479:874`                                                                                     |
| Geometry toolbar                        | `101:1690` | Entity × Mode, 12 variants; Map Content / Edit `101:1683` = Adjust · Split · Cut-out · Straighten · Undo · Redo · Clear, 512px    |
| Toolbar tile                            | `98:160`   | idle · hover · selected · disabled                                                                                                |

Also on ⑤: the ten toolbar state bars (`102:709`… — two Combine examples marked SUPERSEDED), the
Transform anatomy section `122:1148` (drawn at the SVG's rendered sizes), the snap family and the
ten US6 snaps at true size, the layer sections, the six custom controls and the type picker, the
accordion proposal `392:900` (kept as the case against). Dev Mode descriptions on every set say what
it does.

**Other pages:** ① the scope list and the decision log (46px rows; the last rows are 2026-09-11's);
④ one row per story with "WHERE IT IS DRAWN" links (row frames 112/126/148 tall); ⑥ one line per
drawn thing, TRUE / REPRESENTATIVE / MIXED; ⑦ the coverage table (what is drawn, what is stated
only), developer notes, the keyboard list, the open-decisions table with an owner each, and the
panel's developer notes at the end.

**🛠 Workbench:** Chris's mock-ups `20:11` (untouched, by ruling); the v9 sources at x ≥ 9200
(`807:10227` Default Contextual Menu, `807:11850` Overlapping Features, `807:12844` placement,
`807:26970` Adding Level, `872:35961` Map View Preferences + button) under their own heading; two
2026-08 exploration frames (`46:15`, `59:62`) marked superseded; the C frame `589:1079` as a pointer.

**The dashboard's own file** (read-only, unpublished): Pointr Cloud Dashboard v9
`b8dqhE3CPxitYfqlXuQJTC` — page "0 - Common UI Components" (PreferencesOverlay `19452:258615`, the
error overlay `7581:268934`), page "2.5 - Map Content", page "2.4 - Levels". It publishes only
`listItem`; everything else arrives by copy-paste through the desktop app (§7).

**The docs:** the record `docs/map-595-figma-2026-09-07.md` ("Where it stands" at the top, then
§1–§197); the morning's change list `docs/map-595-stories-revision-2026-09-11.md` (the stories' diff
and every node); the afternoon's `docs/map-595-file-changes-2026-09-11-pm.md`; the bitmap pipeline
`docs/map-595-assets/` (the 2× source render, `geometry.json`, `retouch-map.py`).

**The stories document:** Google Doc, linked from ④ (`157:12`). The 2026-09-07 and 2026-09-11 texts
were pasted in chat; the diff is in the morning's change list. US9–US10 are empty stubs.

**Git:** branch `codex/wayfinding-map-panel`, pushed to `origin` (`49eaf22` at the time of writing).
PR #17 targets `main` and is not this workstream's concern unless asked.

## 3 · Decided — do not reopen

Olcay's rulings, each in ①'s decision log and the record.

1. **The file is the team's reference; the prototype is out of it** (2026-09-11, §190).
2. **Colours are the product's own tokens** — the dashboard's four-mode Primitive Tokens cached in
   the file, Kozmos DS 2.0 `Primitives` where a step is missing; never Kozmos DS - Core Library on the
   file's own layers (2026-09-11, reversing 2026-09-10). Switches `theme/500` `#346df1`.
3. **Pages are never deleted; Chris's mock-ups stay as they are** (2026-09-11).
4. **③'s screens use the actual components on the dashboard's own chrome** (2026-09-11).
5. **The geometry states are drawn as the prototype implements them** — the dashboard's highlight
   for hover and selection, the editor's overlay on top: face theme/800 at 10% with a 2px edge (others
   6%, 1.5px at 55%), r5 corners, r3.5 midpoints, the box 18px out (12 in plain transform) dashed 5/4
   at 70%, r7 knob on a 26px stem, 9px scale squares (2026-09-11, §193).
6. **Combine is hidden — out of scope** (2026-09-11, §193). **Reset is hidden — Undo and Redo
   suffice** (2026-09-11, §197). Simplify and Eraser were already off.
7. **Map View Preferences carries Snap; Grey out unchanged and Hide POI labels are out of scope; the
   button steps right of an open panel (x 428) as the prototype does** (2026-09-11, §194).
8. **The unsaved guard's third button reads Update**, the footer's verb (2026-09-11, §192).
9. **The stories' 2026-09-11 revision is applied:** US4 prompts before a selection with unsaved
   changes changes (no freeze); a second Esc de-selects after the first cancels an action; a pasted
   feature belongs to the floor and building it lands on; Transform rotates or scales a selection;
   indeterminate is in the persona cycle only where the features differed at selection (§192).
10. **From 2026-09-10 (still standing):** C is the design; Cancel and Update never hidden — Update
    greyed until a change; one 1px `#c7cad1` field border; Delete confirms in v9's danger tone with
    Keep focused; a delete leaves a notice and has no Undo (undo is for geometry drawing only, for
    now); several selected edits every applicable property, "Multiple values" where they differ.
11. **Settled earlier:** the Featured star is amber; ⑤'s panel is a component set and ③ instances
    it; no accordions; the panel is flat, no shadow.

## 4 · The Figma file now — what is drawn, what is stated only

- **Drawn:** every story has a flow and at least one screen (see the §2 table). Components on ⑤ for
  everything the screens instance. The map bitmaps are v9's, retouched per state so the baked
  selection matches (clean · selected · selected + hovered · all three lit).
- **Stated only (⑦ says so):** the cross-floor and cross-building block; cut-out, split and
  straighten across a selection; the guard firing before a selection with unsaved changes changes;
  clearing a search without the map jumping; the paste-meets-unsaved prompt (the same guard); US1's
  "select from the list" and "leave" steps; US6's mark at the moment a snap takes; the 10%–400% clamp
  (a number on ⑤).
- **Known compromises, written on the file:** the map is illustrative; US8 shows six results because
  Terminal C is hidden (rows inside an instance cannot be reordered); v9's placement bar ends with
  Confirm while US3 commits on a left-click; the geometry bar (512px) does not fit beside the 400px
  panel in a 904px map, so the panel screens leave it off and move the selector right.

## 5 · Open — waiting on Olcay

1. **Colours with no identical token** (§189): the old ink `#1a1c24` on ③, the near-grey grounds,
   `#b81c1c` and `#7a8699` on ⑤ — snap the ink to `foreground/100`, leave the greys (recommended, not
   approved).
2. **Featured's look with several selected** (§181) — reports "mixed", looks off.
3. **The one border's contrast** — `#c7cad1` on white is 1.64:1; `Border/Input` `#747b8b` would pass.
4. **C's band ✕** sits 8px higher and 4px further right than every other panel's.
5. **FID with several selected** shows the primary's FID.
6. **Touch targets:** 30px persona rows and 24px bins.
7. **Type and radius scales** — C's 12 / 12.5 / 11.5 / 9.5 and 16 / 8 / 6 / 10 against Kozmos's steps.
8. **The Terminal C row in US8** — hidden to keep the results under Terminal B; a third building
   needs a row below the POI rows in v9's tree, which changes its icon.
9. **PR #17's title** still names only the iOS sheet.

## 6 · Open — for others

- **The stories' author:** v9's placement bar ends with Confirm while US3 commits on a left-click and
  saves at once (⑦, US3 row).
- **The prototype (not this workstream's):** `src/ui/GeometryToolbar.tsx` still renders Reset and
  Combine tiles; its Map View Preferences trigger is 44×44 where v9's is 32×32; it carries the Kozmos
  role token names from §185 while the file binds the product's tokens.
- **Kozmos DS owners:** scopes for coloured text, strokes and icons; a neutral outline button; the
  destructive button's shade; the six custom controls missing from Core (Textarea first); v9's overlay
  is unpublished; ~228 PDS / Pointr bindings still on "Primitive Tokens"; the record's DS asks.
- **iOS / deploy** (not MAP-595): PR #17's iOS tests fail since 2026-09-08 (four tests in
  `KozmosAdaptiveMapShellTests.swift`); the deploy never rebuilds `@kozmos/react` — see the archived
  handoff §7 for the detail.

## 7 · How to work here — the traps that cost time

**Figma (`use_figma`, load the `figma-use` skill first):**

- One `setCurrentPageAsync` per call; `page.loadAsync()` for another page's nodes. A node inside an
  INSTANCE on another page is unreachable; a HIDDEN instance's children are invisible to `findAll`.
- A section child's `x`/`y` are section-relative — place by `absoluteTransform`, or append into the
  section and convert. `clone()` of a section child lands on the PAGE; `clone()` of a variant is
  already a COMPONENT and lands inside the set (`createComponentFromNode` on it throws).
- v9's screen frames stack first-on-top (`itemReverseZIndex`) on the root and `body` — insert added
  layers at index 0 there; `mapBody` is normal. `itemReverseZIndex` can only be set on auto-layout
  frames. Anything added to an auto-layout frame needs `layoutPositioning = 'ABSOLUTE'`.
- A bound paint with `opacity` renders opaque on new nodes and inside instances — use raw
  translucent paints; bind only opaque strokes. A library variable imported by key is gone in the next
  call unless bound. Rebind only where the light value is identical.
- The dashboard's `listItem` rows: rename by the `entitiyName` property, never by editing the text
  (the text is bound to the property and rewrites it); `Property 1` is idle | inFocus; rows inside an
  instance cannot be reordered — hide instead.
- Renders: `get_screenshot` never upscales — render a temp frame at the size you want; a REST render
  of an unchanged INSTANCE can be stale after its master changed — render the master; download with
  `curl -k` (the sandbox has no CA bundle). Images go in through `upload_assets` (single-use URLs,
  multipart POST) and land as 400×300 frames on the desktop app's current page — read the hash, set
  it as a fill, delete the frame.
- Copying from v9: `osascript -e 'tell application "Figma" to activate'`, then
  `open "figma://file/<key>?node-id=<id>"` selects the node; `computer_batch` ⌘C, `open` this file's
  Workbench, ⌘V (needs the screen-takeover approval — ask Olcay to watch for the card).
- Measure text fit before editing: ③ notes 28px pitch, one line; ⑦ / ① / ⑥ rows 46px; developer-note
  bullets 24px; ④ row frames grow with their summary (WHERE line at 78 or 92). Check overlaps
  pairwise after moving anything; captions sit 12px under screens.
- `search_design_system` is clamped to one query per call; `fetch` is undefined; import by key works
  only for published assets (the Pointr Icon Library is: `settings-04` `4a7bc953…`, `x-close`
  `6c340143…`).

**The geometry numbers** come from `apps/mapscale-review/public/map/index.html` (readable source):
`EDIT_INK`, `geomDrawFaces`, `geomDrawHandles`, `orientedBox`, `dominantAngle`, `BOX_PAD`,
`BOX_PAD_ADJUST`, `BOX_STEM`, `HANDLE_R`, `highlightFeatures`. The box engine is ported into
`docs/map-595-assets/retouch-map.py`'s companion script in §193 of the record; the corners of the
bitmap's features are in `geometry.json`.

**Shell (zsh):** `set -e` does not gate and `cmd | tail || exit 1` tests `tail`; unquoted
`--include=*.ts` aborts; `====` in an `echo` is an equals-expansion; ugrep chokes on long regexes —
use Python. Stage by file, never `git add -A` (shared checkout); lint-staged runs prettier on commit.

**Memory files with the detail:** `map-595-handoff-pointer`, `figma-use-figma-traps`,
`kozmos-token-roles`, `figma-hidden-instances-read-layerless`, `figma-pages-read-empty-until-loaded`,
`bash-tool-set-e-does-not-gate`, `shell-is-zsh-three-traps`, `kozmos-shared-checkout-stage-by-file`,
`browser-pane-never-paints-shim-raf`, `mapscale-tsc-noemit-checks-nothing`.

## 8 · Today's commits, newest first

| Commit    | What                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------- |
| `49eaf22` | §197 — the last sweep's leftovers                                                                        |
| `465dc68` | §193–§197 — toolbars and Combine, geometry states, Map View Preferences, four gap screens, layout, Reset |
| `13c9f1b` | §192 — the stories' 2026-09-11 revision applied; the morning's change list                               |
| `69bb194` | §190–§191 — the product's tokens back, the prototype out, ③ on the dashboard's chrome                    |
| `f29a501` | The morning's handoff (now archived)                                                                     |
