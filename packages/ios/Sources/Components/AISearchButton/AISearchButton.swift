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
    /// The button's own footprint, the prototype's 48: the ring overflows it,
    /// so a row that holds the field and this button stays the field's height.
    static let footprint: CGFloat = 48

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    /// The ring's gradient turns in place, once every three seconds, unless
    /// motion is reduced; the first frame is the resting one.
    @State private var ringAngle: Double = 0
    static let spinDuration: Double = 3

    public var body: some View {
        Button(action: action) {
            ZStack {
                Circle()
                    .fill(KozmosColors.primitivesColorsBackground0)
                    .frame(width: Self.disc, height: Self.disc)
                    .kozmosElevation(KozmosShadows.semanticsElevationRaised)
                Image(systemName: "sparkles")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(KozmosColors.primitivesColorsTheme500)
                    .accessibilityHidden(true)
            }
            .frame(width: Self.footprint, height: Self.footprint)
            // Drawn, not laid out: the ring takes no room from the row.
            .background(
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
                    // The gradient turns; the circle it fills does not move.
                    .rotationEffect(.degrees(ringAngle))
            )
            .contentShape(Circle())
        }
        .onAppear {
            guard !reduceMotion else { return }
            withAnimation(.linear(duration: Self.spinDuration).repeatForever(autoreverses: false)) {
                ringAngle = 360
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }
}
