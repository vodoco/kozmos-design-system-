---
"@kozmos-ds/react": minor
---

Six places that read wrongly in another language.

`Text` aligns from the **start**, not the left, and `align` gains `start` and
`end` beside the physical `left`. The default is what matters: almost nothing
passes `align`, so whatever it defaults to is what an Arabic interface gets.
`left` stays for the rare thing that means LEFT in any direction.

`POIResultCard`'s row aligns from the start too.

`SearchBar` takes `clearLabel` — its clear button said "Clear search" in
English whatever the interface language — and uses logical margins, so the
search icon sits before the field rather than always to its left.

`AdaptiveMapShell` takes `panelHandleLabel`. The sheet handle is a slider, and
"Panel height" was all a screen reader had to go on.

`NavigationItem` wraps a rail label over two lines instead of truncating it:
"Overvi…" loses the word where two lines shorten nothing. A side row stays
truncated, because it is wide enough that one line is the right compromise.

`CategoryTile` no longer breaks a CJK name mid-word. `line-clamp` alone splits
レストラン across two lines as two words that do not exist.
