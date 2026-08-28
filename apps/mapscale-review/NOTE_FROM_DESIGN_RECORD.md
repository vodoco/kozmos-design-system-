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

## 5. The agent CAN drive this map now — and one real DEFECT found doing it

`public/map/index.html` boots standalone from URL params with **no sign-in** — the licence is a
client-side SDK key and `pointrConfig.ts` says so. Load it in a same-origin iframe, shim it **before
the navigation commits and again after** (the realm is replaced on commit), and it boots.

### 🔴 DEFECT — `ensureTiles` accepts the WRONG tiles, and boot then hangs for ever

Symptom: the outdoor basemap instead of the floor, the console full of
`Source layer "wall" does not exist on source "source_ptr"`, `started` stuck `false`, so
`post("ready")` never fires and anything driving the shell waits for ever. It reads as an SDK or
network fault. It is neither:

```js
const src = ... map.getSource("source_ptr") ...;
if (src && src.url) return cb();          // ← true for ANY url, including a basemap placeholder
if (tries % 6 === 0) { ... updateMapTiles(TARGET.site); ... }   // ← never reached
```

`source_ptr` can arrive already pointing at `https://api.maptiler.com/tiles/v3/...`. That url is
truthy, so `ensureTiles` returns on its **first** call, `updateMapTiles` is never invoked, and boot
then waits on `poll(levelIsRendering, start, …)` — which can never come true, because a basemap has
no `wall` layer. The comment above that line assumes the only pre-resolution state is `""`; it is
not. **Intermittent — both states appeared in one session**, so one green boot does not clear it.

Proven by calling the skipped line by hand: url swapped in **200 ms**, then `applyLevel()` gave
**4,792** wall features in ~2 s, then `start()` set `started === true`.

**Fix:** test for the tiles you want, not for a truthy string —
`if (src && src.url && !/api\.maptiler\.com|openmaptiles/.test(src.url)) return cb();`

### ⚠️ `setTimeout(cb, 16)` is NOT a working rAF shim here — corrected 2026-08-28

An earlier version of this note said timers were unthrottled because a 0 ms timer measured 0 ms.
**True measurement, wrong conclusion.** A zero delay is instant; **any non-zero delay is clamped to
≥1 s, and was seen at 16 s.** So that shim ran MapLibre at ~1 fps and every `poll()` in this file
crawled with it. Pump a due-timer queue through **`MessageChannel`** instead — unthrottled, and
delays keep their meaning — and install it in the **parent** window too, or the re-patch loop is
itself throttled and lands after the SDK has already captured the unshimmed rAF.

### Other traps

- **Never re-post `target` in a loop.** Each bumps `switchGen` and stands the in-flight
  `resolveAndFrame` down, so the map never reaches `ready`. Wait for `ready`, then post.
- **`drawImage` ignores CSS filters**, and greyscale _is_ one — a canvas readback comes back fully
  saturated with every pref correctly applied.
- ⚠️ **`queryRenderedFeatures` lags `setFilter`.** It reads the last rendered frame, so a check taken
  straight after a filter change is stale. A wall-hide test read `2 → 2 → 0` — off by one step, and
  indistinguishable from "the filter does nothing" — until it waited for the map's `idle` event
  between steps.
- **More is reachable than the message protocol.** Top-level `function`s land on the window, so
  `getMap()`, `applyLevel()`, `geomApplyHiddenFilter()`, `geomBegin()` and `pw` are all callable;
  top-level `let`/`const` (`map`, `GEOM`, `RESOLVED`, `PREVIEW_HIDDEN`) are reachable through the
  frame's own global lexical scope.

Full recipe: `MAP-566_PROTOTYPE_PLATFORM.md` §5b in the design record.

---

## 6. 🟢 NEW 2026-08-28 — the editor MAY now write to Pointr Cloud, and the spec is written

Olcay lifted the two-week block: _"ok let's write to Pointr Cloud. but mapScale output and review
results would be fake still."_ Scoped the same day: **per-feature `PUT` straight to draft**,
**Combine does NOT delete**, and **the design-record repo does not build it** — so this is yours.

Full spec, with endpoint, payload, conflict handling and the retraction list:
`Pointr Cloud/Building - Auto Level Updates/FOR_THE_APP_REPO.md` **§12**. The three things most
likely to be got wrong:

1. ⚠️ **A review decision must never write.** The change list is authored seeds in `mock/diff.ts`, so
   a decision-driven write would `DELETE` real features on the strength of change detection that
   never happened. Gate on **what the user pressed** — an explicit Update in the panel — not on
   whether the fid is real. **The fid is always real**: `beginchange` resolves a change to a real
   tile feature by name, so "is this a genuine feature?" is the wrong question and always answers yes.
2. ⚠️ **Never `PUT …/levels/{lvl}/features`.** `levelGeometry()` drops features at ingest via
   `visibleToPersona()` and merely counts them, so the cached collection is the level **minus
   everything `facilityManager` cannot see**. Writing it back as the whole collection would silently
   destroy every feature the persona filtered out.
3. ⚠️ **The "nothing is written back to Pointr Cloud" promise appears in five places**, two of them
   user-visible copy, and one of them is **decision D3**. Retract them in the same commit as the
   write — a UI that still promises nothing is written while it writes is worse than either state.
   On the review screen the footnote may well remain true, so decide per surface rather than
   search-and-replacing the string.

Still explicitly out: Combine's wall `DELETE`, the wayfinding network's site-wide destructive
`POST …/sites/{sid}/paths`, and creating features or network edges.
