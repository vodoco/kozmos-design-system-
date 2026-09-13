// Do not edit directly, this file was auto-generated.
package com.kozmos.tokens

import androidx.compose.ui.unit.dp

/**
 * The three elevation roles, mirroring `Semantics.Elevation` in
 * `packages/tokens` — which aliases `shadow.sm` / `shadow.md` / `shadow.lg` —
 * and which `pnpm tokens:elevation:check` holds to these values.
 *
 * Compose models a shadow as a single elevation in dp rather than as an
 * offset, blur and alpha, so these carry the blur radius of each role: 4 / 8 /
 * 16.
 */
object KozmosShadows {
    /** A surface lifted just off the page: cards, list rows. Barely there on
     * purpose — the surface and its border do the work. */
    val semanticsElevationRaised = 4.dp

    /** A control floating over content it does not belong to: map chrome, a
     * search bar over a map, a content card presented on top of the map, a
     * status message. */
    val semanticsElevationFloating = 8.dp

    /** Above everything, with what is behind it dimmed or ignored: dialogs,
     * drawers, tooltips, popovers, detail panels, and the map panels that take
     * focus. */
    val semanticsElevationOverlay = 16.dp
}
