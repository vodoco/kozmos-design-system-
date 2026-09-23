---
"@kozmos/react": patch
---

Every animation that loops now rests when the visitor has asked for less
motion, and by either route (GAP-50). `Skeleton`'s pulse read neither the
preference nor the design config; the spinner and the assistant's ring read the
preference only. One owned rule governs all three, last in the owned block
because they are all a single class and source order is what decides.

The design config's `motion: reduced` reaches them too. It scales
`--semantics-motion-duration-scale` to 0.001, which turns a transition into a
cut — and a one-second spin into a strobe, so an animation that loops has to be
told to stop rather than scaled. `DesignConfigProvider` marks its scope
`data-kozmos-motion="reduced"` and the rules read the mark.

On the natives the same: SwiftUI's skeleton holds its sheen still under
`accessibilityReduceMotion`, and Compose's under the system's animation scale,
as the spinner and the ring already did on both.

`ToggleButton` keeps 8 between an icon and its label, and `Tag` 4 (GAP-75).
`ToggleButton` is a Radix Toggle styled on its own, so `Button`'s fix left it at
zero while SwiftUI and Compose had been drawing 8 all along; `Tag` takes
arbitrary children on React alone, where an icon beside its text touched, and 4
is the spacing SwiftUI's `Tag` uses. `Chip` is unchanged: its 6 is `Chip/gap`,
bound to `Layout/spacing/75` in Figma.
