import SwiftUI

/// The glass surface role: what a surface over content it does not belong to
/// is made of — the manoeuvre card, the navigation summary, the map's cards.
/// Composed from `Semantics.Effect.glass` (`KozmosEffects.semanticsEffectGlass`):
/// the background colour at the token's opacity as the tint, over the system's
/// thin material, which blurs what shows through — its blur and saturation are
/// the system's, where the web draws the token's numbers — and an edge at the
/// token's border opacity, light in both themes. With Reduce Transparency on,
/// the surface is the plain background colour: a preference, not a look.
///
/// Not the system's own glass (`glassEffect`, iOS 26): a hosted snapshot
/// renders it black, so every surface on it would be invisible to the
/// package's pixel tests and to CI's simulator step. The material composition
/// is what the tests see; the system's glass is a decision, not a default.
public struct KozmosGlassSurface<S: InsettableShape>: ViewModifier {
    let shape: S
    /// Tests set this; products leave it to the environment.
    let reduceTransparencyOverride: Bool?
    @Environment(\.accessibilityReduceTransparency) private var environmentReduceTransparency

    public init(shape: S) {
        self.shape = shape
        self.reduceTransparencyOverride = nil
    }

    init(shape: S, reduceTransparency: Bool?) {
        self.shape = shape
        self.reduceTransparencyOverride = reduceTransparency
    }

    private var reduceTransparency: Bool { reduceTransparencyOverride ?? environmentReduceTransparency }
    private var glass: GlassEffectToken { KozmosEffects.semanticsEffectGlass }
    private var tint: Color { KozmosColors.primitivesColorsBackground0.opacity(glass.opacity) }

    public func body(content: Content) -> some View {
        if reduceTransparency {
            content
                .background(shape.fill(KozmosColors.primitivesColorsBackground0))
        } else {
            content
                .background(
                    ZStack {
                        shape.fill(.ultraThinMaterial)
                        shape.fill(tint)
                    }
                )
                .clipShape(shape)
                .overlay(shape.strokeBorder(Color.white.opacity(glass.borderOpacity), lineWidth: 1))
        }
    }
}

extension View {
    /// The glass surface role, in `shape`.
    public func kozmosGlassSurface<S: InsettableShape>(_ shape: S) -> some View {
        modifier(KozmosGlassSurface(shape: shape))
    }
}
