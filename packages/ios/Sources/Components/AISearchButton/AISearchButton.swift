import SwiftUI

/// The AI search, beside the search field: a 44 disc inside a 66 ring whose
/// gradient runs through the theme's own ramp — 300 to 600 and back, the
/// first gradient the system draws, made of tokens — with a 16 icon. The
/// button shows the icon alone and is named by its label.
public struct KozmosAISearchButton: View {
    let label: String
    let action: () -> Void

    public init(label: String = "AI search", action: @escaping () -> Void) {
        self.label = label
        self.action = action
    }

    static let ring: CGFloat = 66
    static let disc: CGFloat = 44

    public var body: some View {
        Button(action: action) {
            ZStack {
                Circle()
                    .fill(
                        AngularGradient(
                            colors: [
                                KozmosColors.primitivesColorsTheme300,
                                KozmosColors.primitivesColorsTheme600,
                                KozmosColors.primitivesColorsTheme300,
                            ],
                            center: .center
                        )
                    )
                    .frame(width: Self.ring, height: Self.ring)
                Circle()
                    .fill(KozmosColors.primitivesColorsBackground0)
                    .frame(width: Self.disc, height: Self.disc)
                    .kozmosElevation(KozmosShadows.semanticsElevationRaised)
                Image(systemName: "sparkles")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(KozmosColors.primitivesColorsTheme500)
                    .accessibilityHidden(true)
            }
            .frame(width: Self.ring, height: Self.ring)
            .contentShape(Circle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }
}
