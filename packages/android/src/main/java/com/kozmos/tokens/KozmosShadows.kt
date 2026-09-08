package com.kozmos.tokens

import androidx.compose.ui.unit.dp

/**
 * The three elevation roles, mirroring `Semantics.Elevation` in
 * `packages/tokens` — which aliases `shadow.sm` / `md` / `lg`, and which
 * `pnpm tokens:elevation:check` holds to these values.
 *
 * Compose models a shadow as a single elevation in dp rather than as an offset,
 * blur and alpha, so these carry the blur radius of each role: 4 / 8 / 16.
 *
 * These existed in `packages/tokens/dist/android/.../KozmosShadows.kt` from the
 * day the roles were added, but nothing ever copied them into this package. So
 * every component picked its own number — 4.dp, 6.dp, 20.dp — which is the
 * situation the roles were introduced to end, surviving where they could not be
 * seen.
 */
object KozmosShadows {
    /** A surface lifted just off the page: cards, list rows. */
    val semanticsElevationRaised = 4.dp

    /** A control floating over content it does not belong to: map chrome, a
     * card presented on top of the map, a status message. */
    val semanticsElevationFloating = 8.dp

    /** Above everything, with what is behind it dimmed or ignored: dialogs,
     * drawers, tooltips, popovers, detail panels. */
    val semanticsElevationOverlay = 16.dp
}
