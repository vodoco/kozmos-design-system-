package com.kozmos.components.surface

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
 * What a surface is made of. Solid — the background colour with the subtle
 * border — is the default everywhere; glass, the glass surface role composed
 * from `Semantics.Effect.glass` (`KozmosEffects.semanticsEffectGlass`), is a
 * choice a product makes per surface.
 *
 * Glass here is the tint and the edge alone: Compose blurs a node's own
 * content (`Modifier.blur`, API 31), not what lies behind it, and a backdrop
 * blur needs a capture of the layer beneath that the framework does not offer.
 * The blur and saturation are the web's and iOS's numbers.
 */
enum class KozmosSurfaceStyle {
    Solid,
    Glass
}

object KozmosSurfaceDefaults {
    /** The fill: the background colour, whole, or at the token's opacity for glass. */
    fun tint(style: KozmosSurfaceStyle): Color = when (style) {
        KozmosSurfaceStyle.Solid -> KozmosColors.primitivesColorsBackground0
        KozmosSurfaceStyle.Glass -> KozmosColors.primitivesColorsBackground0.copy(alpha = KozmosEffects.semanticsEffectGlass.opacity)
    }

    /** The edge: the subtle border, or for glass a light line at the token's border opacity. */
    fun border(style: KozmosSurfaceStyle): BorderStroke = when (style) {
        KozmosSurfaceStyle.Solid -> BorderStroke(1.dp, KozmosColors.semanticsBorderSubtle)
        KozmosSurfaceStyle.Glass -> BorderStroke(1.dp, Color.White.copy(alpha = KozmosEffects.semanticsEffectGlass.borderOpacity))
    }
}

/** A surface in `shape`, for a node that is not a `Surface`: solid by default, or glass. */
fun Modifier.kozmosSurface(shape: Shape, style: KozmosSurfaceStyle = KozmosSurfaceStyle.Solid): Modifier = this
    .clip(shape)
    .background(KozmosSurfaceDefaults.tint(style), shape)
    .border(KozmosSurfaceDefaults.border(style), shape)
