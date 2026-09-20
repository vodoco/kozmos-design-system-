// Do not edit directly, this file was auto-generated.
package com.kozmos.tokens

/**
 * The glass surface role's effect, mirroring `Semantics.Effect.glass` in
 * `packages/tokens`: the tint's opacity, the blur and saturation of what shows
 * through, the noise, edge and refraction opacities. The same numbers in both
 * themes — the theme decides the tint's colour, not the effect. `pnpm
 * tokens:glass:check` holds every number here to the token files.
 */
data class GlassEffectToken(
    val opacity: Float,
    val blur: Float,
    val saturation: Float,
    val noiseOpacity: Float,
    val borderOpacity: Float,
    val refractionOpacity: Float
)

object KozmosEffects {
    val semanticsEffectGlass = GlassEffectToken(
        opacity = 0.699999988079071f,
        blur = 20f,
        saturation = 1.7999999523162842f,
        noiseOpacity = 0.029999999329447746f,
        borderOpacity = 0.20000000298023224f,
        refractionOpacity = 0.4000000059604645f
    )
}
