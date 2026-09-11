# MAP-595 — handoff for the next session

Written 2026-09-11 at the end of a long session (the record runs §1–§189). Every node ID, hash,
quote and colour below was checked against the repo, the record and the design system's built CSS
at the time of writing.

## 0 · Start here

Paste this as the first message of the new chat:

> Continue MAP-595 (Easier Content Editing — Part 2). Read `docs/map-595-handoff.md` first, then the
> "Where it stands" summary at the top of `docs/map-595-figma-2026-09-07.md` and its latest sections
> (§178–§189). The focus is the Figma file `nm6qdzaC9B1lknllbwaMTh`; the prototype
> `apps/mapscale-review` implements it. Pick up from §6, "Open — waiting on Olcay".

Read order: this file → the record's "Where it stands" → §184–§189 → the memory files named in §8.

## 0a · 2026-09-11 — what changed after this handoff was written (read before §1–§9)

Olcay's rulings on 2026-09-11 (record §190) reverse or narrow several items below:

- **Focus is the stories and the Figma file only.** The prototype is not the subject; do not touch
  `apps/mapscale-review` or PR #17 unless asked. "The rest of the team doesn't need to know about the
  prototype and its notes" — every note naming the prototype, its code, the record or a person's ruling
  was rewritten or deleted. Keep it that way: new notes speak of the product, the stories and the file.
- **Colours are the product's own tokens, not Kozmos DS - Core Library.** §3's rulings 4 and 5 are
  reversed: every paint on the file's own layers binds the dashboard's four-mode **Primitive Tokens**
  (cached in the file; 14 variables) or, where a step is missing there, the same-named **Kozmos DS 2.0
  `Primitives`**. Switches are `theme/500 (base)` `#346df1`; Delete's block is raw `#fdf2f2` on
  `#b42318`. Kozmos DS component instances keep their own defaults. §9's colour map is obsolete on the
  Figma side.
- **The stories document now has US1–US8** (pasted in §190): US2 prompts (keep editing · save ·
  discard); US3 saves pasted features at once and does not select them; US4 edits type, name and
  additional fields across a selection, adds shift-right-click with checkboxes and an expandable
  selection list; **US5 is Transform on the floor plan alignment page**; US6 has a value order for
  the snaps; **US8 is new** (search results that stay). ①, ③, ④, ⑦ follow it. §1's "US5 ships with
  MAP-272" is out of date.
- **C lives on ⑤** as "Edit panel — the design (a POI with everything)" `589:1082`; the Kit copy
  `678:2010` is gone. A new **Context menu** set `794:2062` on ⑤ is drawn to v9's design.
- **③'s screens use the actual components and the dashboard's own chrome** (record §191): the panel,
  personas, context menu and toolbar are instances of ⑤'s sets; header, rail, list, level selector and
  toast are v9 instances from four screens pasted onto the Workbench (x ≥ 9200, `v9 · …`) by driving the
  Figma desktop app (`open figma://…` to select, `osascript` to activate, cmd-C/cmd-V as display-scope
  keystrokes). The map is a per-screen bitmap and is captioned as illustrative. Not drawn: US4's
  shift-right-click checklist and expanded selection list, US3's paste prompt, US5's Transform frame on
  the plan, US8's searched list.
- **Pages are never deleted.** ②, ⑥ and the Workbench stay; delete only notes about unrelated
  things. Chris's mock-ups (Workbench `20:11`) stay exactly as they are.
- **New traps** (§190): a library variable imported by key in one `use_figma` call is gone in the
  next unless bound — import inside the call that binds; `getNodeByIdAsync` across pages returns
  instances without children — hash from the node's own page; a paint's `opacity` is dropped by
  `setBoundVariableForPaint` and a change to it on a master did not reach an existing instance;
  `search_design_system` is clamped to one query per call; `fetch` is undefined in the sandbox.

## 1 · The work, and how Olcay works

- **What:** MAP-595 "Easier Content Editing — Part 2" at Pointr — editing map content in the Map
  Content screen: one-click selection, several at once, copy and paste, transform, snaps, and the
  **metadata panel** (the edit panel), which is this workstream's main deliverable. The stories,
  US1–US7, are on ④. US5 (Transform) is MAP-272's and ships with it, not in this phase.
- **Figma is the subject.** Olcay, 2026-09-10: _"Why are we talking about the app? We should be
  talking about the Figma for Easier Content Editing Phase 2."_ The prototype matters as Figma's
  implementation. Do not drift into PR, CI or iOS work unless asked.
- **The standing instruction** — Olcay repeats it; treat it as the default mode:

  > "Once more, please analyse extensively to see if anything is overlooked, missed,
  > mis-implemented or could have done better. No hacks - no cheats - do it propertly and perfectly.
  > Otherwise please proceed with your recommendation. Provide me everything I'd need if I need to
  > make changes myself. But remember you have CLI access. I don't want to miss anything"

- **How Olcay likes it:**
  - an adversarial self-audit before "done";
  - verify by measuring, never assert;
  - decisions put as short multiple-choice questions, with the recommended option first;
  - every change recorded in the record with its measurements;
  - Figma and prototype kept in step;
  - mistakes stated plainly.

## 2 · Where everything is

**The design:** Workbench **C** `589:1079` (panel `589:1082`, note `589:1081`).

**The Figma file:** `nm6qdzaC9B1lknllbwaMTh`, "[MAP-595] Easier Content Editing — Part 2". Pages: 📕
Cover · 📑 Contents · ① Context & decisions · ② Research · ③ Flows · ④ User Stories · ⑤ UI Kit · ⑥
True vs Representative · ⑦ Handover · 🛠 Workbench.

**⑤ UI Kit.** The panel's four sets are in section `406:988`:

| Set                  | Node       | Variants                                                              |
| -------------------- | ---------- | --------------------------------------------------------------------- |
| Properties panel     | `396:1093` | `Selection=one` `396:1091` · `Selection=several` `396:1092`           |
| Persona row          | `395:1020` | 6 personas × on / off / indeterminate                                 |
| Confirmation overlay | `733:1991` | `Tone=danger` `733:1957` (Delete) · `Tone=warning` `733:1973` (guard) |
| Saved notice         | `741:1974` | `Action=updated` `733:1995` · `Action=deleted` `741:1966`             |

The same section holds the heading `733:1992` and the captions `733:1993`, `733:1994` and `733:2003`.

Elsewhere on ⑤:

- the Kit copy of C, `678:2010`: it replaced the stale example `479:877`, in the section "Properties
  panel — every control the taxonomy can ask for" (`479:874`; intro `479:876`, controls table
  `484:1566`);
- the six custom controls, in "The controls the taxonomy leaves to us" (the type picker is `495:1832`);
- the Geometry toolbar set `101:1690` and the Toolbar tile set `98:160`;
- `392:900`, the accordion proposal, kept as the case against accordions.

**The other pages:**

- **③ Flows:** the panel set's instances `396:1164` (one) and `396:1238` (several). US7's screens are
  a `285:8`, b `284:8` and c `285:94`.
- **① and ⑦:**
  - ① has the decision log;
  - ⑦ has the coverage table, the open-decisions table, and the panel's developer notes (seven lines
    at the end of the page).
- **v9 overlay** (reference only): the v9 file `b8dqhE3CPxitYfqlXuQJTC`, node `7581:268934`. It is
  unpublished, so it cannot be instanced.

**The prototype,** `apps/mapscale-review`:

| What                                    | File                           |
| --------------------------------------- | ------------------------------ |
| The panel                               | `src/ui/FeaturePanel.tsx`      |
| Field shells and the `FIELD` tokens     | `src/ui/fields.tsx`            |
| Header                                  | `src/ui/PanelHeader.tsx`       |
| Personas                                | `src/ui/PersonaVisibility.tsx` |
| Type picker                             | `src/ui/TypePicker.tsx`        |
| Overlays                                | `src/ui/ConfirmOverlay.tsx`    |
| Notice                                  | `src/ui/SavedNotice.tsx`       |
| Delete, the guard and the notice, wired | `src/screens/MapContent.tsx`   |
| Focus rules                             | `src/index.css`                |

**Verify on the bench:** `http://localhost:5173/scratch/toolbar-preview.html`
(`scratch/toolbar-preview.tsx`). It holds:

- the real panel in four cases: one, 3 selected, after combine, Featured on;
- Delete, both notices, and the Delete confirmation.

Start the dev server with `preview_start {name: "mapscale-dev"}`.

**Live:** https://mapscale-review.vercel.app serves `index-BqD_OzCb.js` / `index-DSiRWmOd.css`,
built from `3d57df1`. The merged branch builds the same bundle.

**Git:** branch `codex/wayfinding-map-panel`. PR #17 targets `main`, is open and mergeable. CI is red
on iOS only (see §7).

**The record:** `docs/map-595-figma-2026-09-07.md`. "Where it stands" is at the top, then §1–§189 in
order.

## 3 · Decided — do not reopen

These are Olcay's rulings from 2026-09-10 unless dated otherwise. Each is in ①'s decision log and in
the record.

1. **C is the design** — _"implement C on Figma then implement it on Prototype"_. ⑤'s variants and
   the Kit copy are built from it, and the prototype was rebuilt to it (§179).
2. **Cancel and Update are never hidden** — _"let's not hide the buttons but show as greyed out. as
   before - as in the prototype."_ Update stays greyed until something changes (§178).
3. **One field border** — _"use one border style, the 1px box one"_: 1px `#c7cad1` (`Border/Subtle`)
   on every field. Then _"yes, make them #c7cad1 too"_ extended it to Featured when off, the
   several-features strip, and the footer's rule. The footer is white under that rule (§180–§182).
4. ~~Colours by DS role, both sides.~~ **Reversed 2026-09-11 (§0a, §190): the file binds the product's
   own Primitive Tokens; the code still carries the Kozmos-role names from §185.**
5. ~~Switches are Kozmos `theme-500`, `#135bec`, in Figma too.~~ **Reversed 2026-09-11: the product's
   `theme/500 (base)`, `#346df1`, in Figma.**
6. **Delete confirms in v9's danger tone**: a danger header and icon, the DS destructive "Delete"
   button, and an outlined "Keep" that takes focus, so Enter never deletes. The unsaved-changes
   guard stays in the warning tone (§186).
7. **Delete leaves a notice, and there is no Undo** — _"no undo for deleted features. undo is only
   for geometry drawings for now."_ (§187)
8. **Several selected is the design — every property.** Each applicable property is editable across
   the selection and reads "Multiple values" where the selection disagrees, alongside personas and
   Delete. US4 ("persona visibility is the only metadata it accepts") and US7 ("a message instead of
   fields") are for their author to update (§189).
9. **The panel's other states are drawn on ⑤.** Done: the Confirmation overlay and Saved notice sets
   (§186–§187).
10. **Settled earlier:**
    - The Featured star is amber — _"featured star should be accent color. yellowish."_ (2026-09-09,
      §157).
    - ⑤'s panel is a component set, and ③ uses its instances.
    - No accordions: the properties sit in one flat column.
    - The panel is flat, with no shadow (settled by C).
    - Undo and redo cover geometry drawing only, for now (⑦, §189).

## 4 · The Figma file now

**The panel** (C, ⑤'s Properties panel, the Kit copy, ③'s instances) has:

- C's layout and the one border;
- a white footer under the rule;
- Featured amber when on: border `alert/300`, star `alert/600`, no ground, grey caption;
- Delete in `danger/0` on `danger/700`.

The several variant shows:

- the strip;
- "Multiple values" fields;
- indeterminate personas;
- "Delete 3 features" and its note, "The confirmation will name all 3".

Until §188 a fixed 36px block clipped that note. The block now hugs (54px) and the variant is 713px.

**Colour sources:**

- **Kozmos DS - Core Library, by role:**
  - the panel, the overlays and the notice;
  - the toolbar sets, Transform and the guides;
  - the US6 snaps, the layer marks and the control drawings;
  - ③'s screen mock-ups.

  1,559 paints moved, every one with an identical light value: 630 in §185 and 929 in §189.

- **Kozmos DS 2.0's one-mode `Primitives`:** documentation text only, by choice.
- **The orphaned "Primitive Tokens":** still in the Workbench's A/B drafts, and in about 228 bindings
  that the PDS and Pointr library components carry themselves.

**Notes brought up to date (§187–§189):**

- **①:** the decision log has 2026-09-10's rulings in its own rows.
- **③:**
  - the two notes that said Save and Discard stay hidden now say Update is greyed, not hidden;
  - the US7 note, and screen c, now read "SEVERAL selected — every property, personas, Delete".
- **④:**
  - US1's and US7's panel links pointed at a dead node (`12:23`); they now open the Properties panel
    set;
  - US4's multi-edit link now reads "live again";
  - new links: US1 → the Delete confirmation; US4 and US7 → the several variant.
- **⑦:**
  - the coverage table links the Delete confirmation (US1) and the unsaved guard (US2), and has a US4
    coverage note;
  - the open decisions that had been decided are marked settled: undo, elevation, accordions, and
    the type picker. The six controls are noted as built in the prototype, not in Core;
  - the several-selected decision is a new settled row;
  - the panel's developer notes are new.
- **📑 Contents:** names the panel and its states under ⑤, and the developer notes under ⑦.
- **Dev Mode:** the four panel components' descriptions each name their code file.

## 5 · The prototype now

- **Built to C:**
  - the header band (type · building / level), where long names wrap;
  - the FID, the type picker and Name;
  - Featured, a toggle button with `aria-pressed` true / false / mixed;
  - "+ Add additional field";
  - the properties in C's shells;
  - personas (TriCheck);
  - Delete;
  - a pinned footer.
- **Colours:** `FIELD` in `fields.tsx` (map in §9). The strip uses `--semantics-surface-100`.
- **Delete:**
  - It opens the confirmation: `ConfirmOverlay` in the `danger` tone, an `alertdialog` described by
    its body, with Keep focused.
  - On confirm, the feature leaves the map and the list, and a notice reads "‹name› deleted —
    Applied to this session — not published" ("3 features deleted" for several).
  - There is no Undo.
  - Update leaves "‹name› updated" ("3 features updated" for several).
- **Focus:**
  - Fields light up through `.inner-field:focus-within` (a theme border and ring), including the
    Description textarea and the chips box.
  - Featured, the strip and the Add row share `.panel-control:focus-visible`.
- **Verified** on the bench through computed styles, on every pass. The token rename was proved
  value-identical in light and dark across 518 elements (§185).
- ⚠️ **The real app needs a Pointr Cloud sign-in** (design-qa-v10), which the agent must never type.
  Olcay signed in once in the Browser pane for an end-to-end check. That check was set aside when
  the focus moved to Figma; offer it again if a real-app check is wanted.

## 6 · Open — waiting on Olcay

1. **Colours with no identical token** — left alone and reported in §189.
   - **③:**
     - the old ink `#1a1c24` ×40; the nearest token is `foreground/100` `#17191c`, the shift §183
       made in code;
     - US1·c's Delete block, still `#fdf2f2` on `#b42318`; ⑤ binds `danger/0` / `danger/700`;
     - near-grey grounds with no token: `#e2e6ea` ×15, `#eaf0fb` ×9, `#f4f5f7` `#f2f4f6` `#eef0f2`
       `#e8ebee` ×5 each, and `#d7dde6` `#cdd5e0` `#c3ccdb` `#f7f8f9` once each;
     - `#9aa3b2` ×3 and `#7b8aa6` ×2;
     - an amber note, `#fff6e5` / `#f0d9a8`.
   - **⑤:** `#b81c1c` ×5, `#1a1c24` ×2, `#7a8699` ×2, `#0ea5e9` (the documented hover sky) and
     `#fbfcfd`.
   - **Recommended, not yet approved:** snap the ink and the Delete block to tokens; leave the greys.
2. **Featured's look with several selected.** It reports "mixed" to assistive technology but looks
   off (§181).
3. **The one border's contrast.** `#c7cad1` on white is 1.64:1, against WCAG 1.4.11's 3:1.
   `Border/Input` (`#747b8b`, 4.24:1) would pass; the fix is one token on each side (§180).
4. **C's band ✕** sits 8px higher and 4px further right than every other panel's (§179).
5. **FID with several selected** shows the primary feature's FID.
6. **Touch targets:** the 30px persona rows and 24px bins are under 44px.
7. **Deletions last only the session** in the prototype; nothing is written back.
8. **Type and radius scales.**
   - The panel's type is 12 (11×), 12.5 (7×), 11.5 (5×) and 9.5px (4×); Kozmos's type steps are
     8, 10, 11, 13, 16 and 20.
   - Its radii are 16 (panel), 8 (inputs), 6 (the Add row and Delete) and 10 (the strip); Kozmos's
     radius roles are Container 20, Control 16 and Marker 4.
   - C was approved as drawn; which scale wins is Olcay's call (§186).
9. **④'s US4 summary** could not take the "the design goes further" note: its frame is 134px and
   full. Either grow the frame, or let its "several variant" link be the pointer.
10. **PR #17's title** still names only the iOS sheet. Asked, not answered.

## 7 · Open — for others

- **The stories' author:** update US4 and US7 to the several-selected decision.
- **Kozmos DS owners:**
  - scopes for coloured text, strokes and icons (theme, emotional and foreground are scoped to fills
    or text only);
  - a neutral outline button (v9's Secondary Neutral);
  - the destructive button's shade (DS `danger-700` against v9's `danger-500`);
  - the six custom controls missing from Core, Textarea first;
  - v9's overlay, which is unpublished;
  - the ~228 PDS / Pointr library bindings still on "Primitive Tokens";
  - the record's numbered DS asks.
- **iOS (not MAP-595):** since 2026-09-08 every CI run on PR #17 fails "Test iOS Package".
  - The failures are four tests in `packages/ios/Tests/KozmosTests/KozmosAdaptiveMapShellTests.swift`
    (bottom controls, caller insets, the docked panel, right-to-left), seven assertions.
  - This branch's own iOS commits introduced them; the base branch is green.
  - A task chip was created for it: "Fix iOS AdaptiveMapShell tests failing PR #17".
- **Process:** the deploy never rebuilds `@kozmos/react`.
  - Its `dist/` is local and uncommitted, last built 2026-09-09 11:50.
  - Run `pnpm --filter @kozmos/react build` whenever the design system has changed, and always on a
    fresh clone.

## 8 · How to work here — the traps that cost time

- **Figma:**
  - Load the `figma-use` skill before `use_figma`.
  - Use one `setCurrentPageAsync` per call, and `loadAsync()` for other pages.
  - `resize()` resets auto-layout sizing to FIXED, so set `primaryAxisSizingMode` / `layoutSizing*`
    after it.
  - Measure text fit before editing a note. Rows keep fixed pitches (46px in ⑦).
  - Rebind only where the light value is identical, and report the rest.
  - Bind from **Kozmos DS - Core Library** by role. Never bind "Primitive Tokens" (orphaned); use
    Kozmos DS 2.0's one-mode set only for documentation.
  - Import by key works only for published assets; v9's overlay is not published.
- **Verify:**
  - The Browser pane never paints (`requestAnimationFrame` never fires), so use the bench and read
    computed styles. Screenshots can be stale.
  - Type-check with `pnpm -s typecheck` (not `tsc --noEmit`), then run eslint, `test:geometry` (732)
    and `test:cycles`.
- **Shell (zsh):**
  - `set -e` does not gate, and `cmd | tail || exit 1` tests `tail`.
  - Gate each step with `|| exit 1` before any pipe, logging to a file.
  - Stage by file, never `git add -A`, because the checkout is shared.
  - lint-staged runs prettier and eslint on every commit.
- **Deploy (prebuilt):** in `apps/mapscale-review`:
  1. Run `vercel env pull .env.local --environment=production --yes`, then `pnpm -s build`.
  2. Check markers in the minified bundle:
     - strings become backticks, not quotes;
     - identifiers can be `$`, so match `[\w$]+`;
     - scope absence checks to the component's own block.
  3. Run `vercel deploy --prod --yes`.
  4. Read the live bundle back from the browser (curl fails here with error 77).

  Never print `.env.local` values.

- **GitHub:**
  - `gh pr edit` fails on GitHub's classic-Projects deprecation. Use `gh api -X PATCH
repos/vodoco/kozmos-design-system-/pulls/17 …` instead, and read the result back.
  - Pushes, PR edits and merges need Olcay's go-ahead each time.
- **Memory files with the detail:**
  - `map-595-handoff-pointer`
  - `kozmos-token-roles`
  - `bash-tool-set-e-does-not-gate`
  - `kozmos-vercel-lives-under-apps`
  - `browser-pane-never-paints-shim-raf`
  - `mapscale-tsc-noemit-checks-nothing`
  - `kozmos-drawing-a-disabled-button`
  - `figma-audit-bound-not-painted`
  - `kozmos-shared-checkout-stage-by-file`
  - `shell-is-zsh-three-traps`

## 9 · The colour map — one name on both sides

The values are from `packages/react/dist/style.css`, as `:root` / `[data-theme=dark]`.

| Role                                | Figma (Kozmos DS - Core Library)         | CSS (`FIELD` key)                      | Light / dark                                              |
| ----------------------------------- | ---------------------------------------- | -------------------------------------- | --------------------------------------------------------- |
| Ink — titles, row labels            | Primitives `foreground/100`              | `foreground-100` (`ink`)               | #17191c / #e8e6e3                                         |
| Input value                         | `foreground/200`                         | `foreground-200` (`value`)             | #2e3138 / #d1cec7                                         |
| Muted — notes, captions, icons      | `foreground/400`                         | `foreground-400` (`muted`)             | #5d626f / #a29d90                                         |
| Input label, placeholder            | `foreground/500`                         | `foreground-500` (`label`)             | #747b8b / #8b8474                                         |
| Faint — section heading             | `foreground/600`                         | `foreground-600` (`faint`)             | #9095a2 / #6f6a5d                                         |
| The one border, off switch's track  | Semantics `Border/Subtle`                | `--semantics-border-subtle` (`border`) | #c7cad1 / #2e3138                                         |
| White grounds                       | Semantics `Surface/0`                    | `--semantics-surface-0` (`surface`)    | #ffffff / #000000                                         |
| The several-features strip          | Semantics `Surface/100`                  | `--semantics-surface-100`              | #f8f9fa / #17191c                                         |
| FID box, chips                      | Primitives `background/100`              | `background-100` (`chip`)              | #e3e4e8 / #17191c                                         |
| Header band, Add row ground         | `theme/0`                                | `theme-0`                              | #f1f5fe / #051c4f                                         |
| Switch on, focus ring               | `theme/500`                              | `theme-500` (`on`)                     | #135bec / #135bec                                         |
| Checkbox on                         | `theme/600`                              | `theme-600`                            | #1051e8 / #5887f3                                         |
| Links                               | `theme/700`                              | `theme-700` (`link`)                   | #0d44c2 / #7ea2f6                                         |
| Add row text, persona label on      | `theme/800`                              | `theme-800` (`chosen`)                 | #0b369c / #a4bef9                                         |
| Featured on — border · star         | `emotional/alert/300` · `alert/600`      | same names                             | #fcd281 · #f9a707 / #cd8905 · #fbc459                     |
| Delete — ground · label             | `emotional/danger/0` · `danger/700`      | same names                             | #fceaee · #b01736 / #430915 · #ee7e95                     |
| Danger overlay — tint · rule · icon | `danger/0` · `danger/100` · `danger/600` | same names                             | #fceaee · #f8c6d0 · #d41c42 / #430915 · #670e20 · #e95a77 |

CSS primitives are `--primitives-colors-<name>` (the emotional ones `--primitives-colors-emotional-<name>`).
Border/Input is `#747b8b` / `#8b8474`, the same values as `foreground-500`.

## 10 · This workstream's recent commits, newest first

| Commits                                 | What                                                   |
| --------------------------------------- | ------------------------------------------------------ |
| `5161fa1`                               | §189                                                   |
| `19dc3b9`                               | §188: main merged in, and the DS-rebuild gap           |
| `8de4d45`                               | Merge main                                             |
| `1dabf8e`                               | §188                                                   |
| `3d57df1`                               | Long names wrap                                        |
| `bcb94d9` `2237c81` `6a963fe`           | Delete's notice and the alertdialog; "Where it stands" |
| `b5511f8` `23c7aaf`                     | Delete's danger tone, and the overlays' tokens         |
| `0d8a024` `b7219fc` `f8865c3` `427a250` | Colours by DS role                                     |
| `de364aa` `0e5c375` `97535e3`           | The parity pass                                        |
| `2762d89` `a6994fa` `84f7ce8`           | The footer                                             |
| `dffdca4` `0626492`                     | Featured and the strip                                 |
| `b637b00` `7b33a49` `6bb5721`           | One border                                             |
| `796d149` `abc56ea` `11dc4cf`           | The panel rebuilt to C                                 |
| `3bdb52a`                               | Cancel and Update never hidden                         |

`91e61fa` and `7c1f382`, between them, merge another workstream (elevation) and are not MAP-595's.
