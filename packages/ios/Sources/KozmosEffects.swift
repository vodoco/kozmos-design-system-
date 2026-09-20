// Do not edit directly, this file was auto-generated.
import CoreGraphics

/// The glass surface role's effect, mirroring `Semantics.Effect.glass` in
/// `packages/tokens`: the tint's opacity, the blur and saturation of what shows
/// through, the noise, edge and refraction opacities. The same numbers in both
/// themes — the theme decides the tint's colour, not the effect. `pnpm
/// tokens:glass:check` holds every number here to the token files.
public struct GlassEffectToken {
    public let opacity: CGFloat
    public let blur: CGFloat
    public let saturation: CGFloat
    public let noiseOpacity: CGFloat
    public let borderOpacity: CGFloat
    public let refractionOpacity: CGFloat

    public init(opacity: CGFloat, blur: CGFloat, saturation: CGFloat, noiseOpacity: CGFloat, borderOpacity: CGFloat, refractionOpacity: CGFloat) {
        self.opacity = opacity
        self.blur = blur
        self.saturation = saturation
        self.noiseOpacity = noiseOpacity
        self.borderOpacity = borderOpacity
        self.refractionOpacity = refractionOpacity
    }
}

public enum KozmosEffects {
    public static let semanticsEffectGlass = GlassEffectToken(opacity: 0.699999988079071, blur: 20, saturation: 1.7999999523162842, noiseOpacity: 0.029999999329447746, borderOpacity: 0.20000000298023224, refractionOpacity: 0.4000000059604645)
}
