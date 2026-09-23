---
"@kozmos-ds/react": patch
---

The spinner is one drawing on every platform. It was four: lucide's `Loader2`
in React, `ProgressView().tint(.blue)` on iOS — a hard-coded blue that ignored
the theme, at a size the caller could not set — material3's
`CircularProgressIndicator` on Android, and in Figma an ellipse with
`dashPattern: [8, 4]`, a dashed ring standing in for motion a static node
cannot show. No two matched.

`Spinner` now draws the system's arc: three quarters of a circle of radius 9 in
the icons' own 24 box, round caps, stroke 2, so its weight scales with its size
as every Kozmos icon's does, in `currentColor` so it follows the text around it.
`size` reaches iOS and Android for the first time — 16, 24, 32, 48 — and
`label` names the wait for assistive technology. `Button`'s loading state draws
the same arc, as do `KozmosButton` on SwiftUI and Compose.

The turn now rests under `prefers-reduced-motion` (part of GAP-50), on one
owned rule, so `Spinner` and a loading `Button` cannot drift apart; the status
role keeps announcing the wait when the turn stops.
