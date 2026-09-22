package com.kozmos.components.categorytile

import androidx.compose.ui.graphics.Color
import com.kozmos.components.counter.KozmosInkedFill

/**
 * A category's colours, as its tile, its chip and its pin wear them: the
 * accent draws the icon, the strokes and the label; the inked fill fills a
 * count pill or counter with an ink that reads on it. The taxonomy's eight
 * quick-access colours are `KozmosThemeTokens.semanticsCategoryAccent*`, `…Fill*`
 * and `…Onfill*`.
 */
data class KozmosCategoryTint(val accent: Color, val fill: KozmosInkedFill)
