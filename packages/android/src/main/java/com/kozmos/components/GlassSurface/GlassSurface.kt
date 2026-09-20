package com.kozmos.components.glasssurface

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.dp
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosEffects

/**
 * The glass surface role: what a surface over content it does not belong to
 * is made of — the manoeuvre card, the navigation summary, the map's cards.
 * Composed from `Semantics.Effect.glass` (`KozmosEffects.semanticsEffectGlass`):
 * the background colour at the token's opacity as the tint, and an edge at the
 * token's border opacity, light in both themes.
 *
 * What shows through is not blurred: Compose blurs a node's own content
 * (`Modifier.blur`, API 31), not what lies behind it, and a backdrop blur
 * needs a capture of the layer beneath that the framework does not offer.
 * The tint alone is the role here; the blur and saturation are the web's and
 * iOS's numbers.
 */
object KozmosGlassSurfaceDefaults {
    /** The tint: the background colour at the token's opacity. */
    val tint: Color
        get() = KozmosColors.primitivesColorsBackground0.copy(alpha = KozmosEffects.semanticsEffectGlass.opacity)

    /** The edge: light in both themes, at the token's border opacity. */
    val border: BorderStroke
        get() = BorderStroke(1.dp, Color.White.copy(alpha = KozmosEffects.semanticsEffectGlass.borderOpacity))
}

/** The glass surface role, in `shape`, for a node that is not a `Surface`. */
fun Modifier.kozmosGlassSurface(shape: Shape): Modifier = this
    .clip(shape)
    .background(KozmosGlassSurfaceDefaults.tint, shape)
    .border(KozmosGlassSurfaceDefaults.border, shape)
