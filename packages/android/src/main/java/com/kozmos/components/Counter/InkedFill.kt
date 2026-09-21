package com.kozmos.components.counter

import androidx.compose.ui.graphics.Color

/**
 * A fill and the ink that reads on it: a pair, because no one ink reads on
 * every colour a host may fill with — white fails on the taxonomy's yellow,
 * the dark ink on its navy. `KozmosColors.semanticsCategoryFill*` and
 * `…Onfill*` carry such pairs for the taxonomy's eight colours, and
 * `pnpm tokens:contrast:check` holds each to 4.5:1.
 */
data class KozmosInkedFill(val fill: Color, val ink: Color)
