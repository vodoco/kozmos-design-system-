---
"@kozmos-ds/product-contracts": minor
"@kozmos-ds/react": minor
---

Four things a product could only work around, and the gate that should have
caught the first of them.

**The three product-contract files are one contract, and now something checks
that.** `pnpm contracts:parity:check` compares
`@kozmos-ds/product-contracts`, `ProductContracts.swift` and
`ProductContracts.kt` — the set of types, the fields of every shared struct,
whether a field may be omitted, and the wire values of every enumeration.
Nothing compared them before. What it found on its first run was ten drifts:
`POIResultMatch`, `SearchEmptyKind`, `SearchResponsePresentation`,
`unitLabel`, `nameLanguage` and optional `floorId`/`floorLabel` existed on the
web alone, so a single-storey venue still had to invent a floor on iOS and
Android — and `CategoryPresentation.iconUrl`, the taxonomy's own category
artwork, was web-only too, leaving a native SDK no way to show a category's
image at all. All ten are fixed here.

**`Card` takes a `padding`.** It was 24 on every side with no option, so the
only route to 16 was a caller passing `className="p-4"` — restyling the
component from outside, and on the web alone, since both native cards
hard-coded 24 as well (GAP-034). It is set on the card and reaches the header,
content and footer through context, because a card padded 16 at the top and 24
at the bottom is the bug, not the fix. On all three platforms.

**`Alert` no longer interrupts by default.** `role="alert"` was hard-coded
with no way out. That is an assertive live region, so a static page notice —
"View only. Only Dashboard admins can change these settings." — was read out
over whatever the visitor was doing, every time the page opened (GAP-006).
`live` is `off` by default, which is what SwiftUI and Compose already do:
neither native Alert announces anything. `live="polite"` is `role="status"`
and `live="assertive"` is the old behaviour, for a notice that really has just
appeared.

**`AlertTitle` has a size, and stops being an `h5`.** It carried no size class
at all, and the reset makes every heading `font-size: inherit`, so the title
rendered at the same size as the `text-sm` description below it, separated
only by weight (GAP-007). It is `text-base` now, which is what Compose already
uses. It is also a `<p>` by default, as it is on both native platforms — an
alert's title labels a notice, it does not open a section of the document, and
a hard-coded `h5` after a page's `h2` sections is a skipped level. Pass
`level={3}` where the alert really is a region of the page.

**`EmptyState` takes a `size`, and a slot can ask for it.** Measured inside
`POIResultList`: the same no-result content came to 258px, of which 48 was the
slot's own padding and 64 this component's. The slot stopped padding a
component last release; `size="compact"` takes the rest, bringing it to about
128 (GAP-009). A product does not have to know — the empty slot draws the box,
so it asks for compact itself, and an explicit `size` still wins. On all three
platforms.
