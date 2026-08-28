# Note for whoever works on the review map — from the MAP-566 design record

Left here **2026-08-28** by the design-record session (`vodoco/map566-design-record`), which does not
write application code here. **No application code was changed** — this file is the whole of it, and
nothing in it has been built. It carries a ruling from Olcay plus four facts about
`public/map/index.html` that are cheap to read here and expensive to rediscover.

Fuller version: `Pointr Cloud/Building - Auto Level Updates/FOR_THE_APP_REPO.md` §8.

---

## The ruling (Olcay, 2026-08-28)

> _"The map should not have colored shapes remember? Let's also make default colorful not greyscale.
> We should hide/show the map data based on user's selection not draw new geometry and hide and show.
> Or make it look exactly the same. But I believe we could grab their fid's."_

Two decisions, taken after the options below were put to him:

1. **An undecided change draws a muted outline, no fill.** Not a coloured polygon.
2. **The review map defaults to full colour, not greyscale.**

---

## 1. The fid mechanism he asks for already exists — do not build a second one

`resolveChanges()` already captures the fid **and** the layers drawing it, in the block commented
_"the `fid` and the layers are captured HERE or nowhere"_. `applyPreviewHidden()` collects the fids
the preview wants hidden and hands them to **`geomApplyHiddenFilter`, the single owner of composed
layer filters**.

⚠️ **Do not add a second composer.** The comment there says why: two independent composers on one
layer each restore what the other applied. The preview deliberately contributes fids and lets that
one function do the work. Combine does the same.

⚠️ **`change.id` is NOT the fid.** The seeds are authored slugs (`costa`, `pharmacy`). The fid comes
off the tile feature `pickFeature` matched by name, and only during that one pass — after the hide
filter is applied the feature stops being findable.

## 2. What the four fates draw today

| `previewFate` | when                                  | drawn today                                                                             |
| ------------- | ------------------------------------- | --------------------------------------------------------------------------------------- |
| `plain`       | decided **and it stays**              | **nothing** — the product's own rendering shows through; muted ✓/✗ only                 |
| `ghost`       | rejected addition · confirmed removal | real feature **hidden by fid**; hollow **dashed** outline, `DECISION_INK`, `fill: none` |
| `mine`        | an edit / override                    | filled `OVERRIDE_INK` purple, 0.42–0.6                                                  |
| `diff`        | **undecided**                         | filled `COLORS[change.type]`, 0.42–0.6                                                  |

So "a decided change that stays draws nothing" is **already true**, and so is "hide the real data by
fid". Only `diff` and `mine` still paint colour.

## 3. ⚠️ The trap in the ruling — undecided must not become invisible, or a ghost

`redraw()` pushes a mark only when there is an outcome — `if (o) { marks.push(…) }` — and
`outcomeOf()` returns `null` for an undecided change. **An undecided change has no mark.** Its shape
is its only presence on the map _and its only hit area_. Two consequences:

- **Do not simply drop the fill.** `fill: "none"` is not hit-tested (`pointer-events: visiblePainted`
  ignores an unpainted fill), so the interior stops being clickable and only the stroke selects. Keep
  a fill value and set `fill-opacity: 0` — painted but invisible, and still hit-tested. A `ghost`
  already has this limitation; do not inherit it here, because undecided is the one row that must
  stay easy to reach.
- **Undecided and `ghost` must stay tellable apart.** This was the named risk when the option was
  chosen, so it has to be answered in the build, not left to chance. The honest difference is
  already there: a **ghost is dashed over an absence** (its feature is hidden by fid), an
  **undecided is solid over the feature, still drawn**. Keep the dash for `ghost` only.

## 4. Greyscale — the label oversells it, and the two asks are coupled

`prefs.greyscale` **already defaults to `false`** here; the _review screen_ turns it on.

`#map canvas.grey { filter: grayscale(1) }` greys **the whole canvas**, not just unchanged features —
the overlay survives only because `#hl` is a **sibling** of the canvas, sitting above the filter. The
popover's _"Grey out unchanged"_ is therefore a description of the effect, not of the mechanism.

That coupling is why both asks arrived together: greyscale exists to make coloured overlays legible.
Once the shapes are muted it desaturates the real floor and buys nothing. **Turning the shapes off
while leaving greyscale on is the worst of the three states.**

Three places move together, or the map and its controls disagree: the review screen's `MapPrefs`, the
Figma popover on `2642:20896` and its five clones, and the v9 Map Settings component.

## 5. One more, free: the agent CAN drive this map now

`public/map/index.html` boots standalone from URL params with **no sign-in** — the licence is a
client-side SDK key and `pointrConfig.ts` says so. The only blocker was that `requestAnimationFrame`
never fires in an agent browser pane, so MapLibre never applies the style. Load the shell in a
same-origin iframe and replace `requestAnimationFrame` with a `setTimeout` shim **before the
navigation commits and again after** (the realm is replaced on commit); it boots in ~5s.

Two traps that cost a session:

- **Never re-post `target` in a loop.** Each one bumps `switchGen` and stands the in-flight
  `resolveAndFrame` pass down, so the map never reaches `ready`. Wait for `ready`, then post.
- **`drawImage` ignores CSS filters**, and greyscale _is_ a CSS filter — a canvas readback of this
  map comes back fully saturated with every pref correctly applied.

Full recipe: `MAP-566_PROTOTYPE_PLATFORM.md` §5b in the design record.
