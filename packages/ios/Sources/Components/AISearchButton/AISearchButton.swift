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

    /// The prototype's: a 48 circle, the gradient a band two and a half wide
    /// around a 43 white disc, the 16 icon at the centre.
    static let ring: CGFloat = 48
    static let disc: CGFloat = 43
    static let band: CGFloat = 2.5
    /// The button's own footprint is the ring: nothing overflows the row.
    static let footprint: CGFloat = 48

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    /// The ring's gradient turns in place, the prototype's 3.6 seconds a
    /// turn, unless motion is reduced; the first frame is the resting one.
    @State private var ringAngle: Double = 0
    static let spinDuration: Double = 3.6

    public var body: some View {
        Button(action: action) {
            ZStack {
                // The gradient turns; the circle it fills does not move.
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
                    .rotationEffect(.degrees(ringAngle))
                Circle()
                    .fill(KozmosColors.primitivesColorsBackground0)
                    .frame(width: Self.disc, height: Self.disc)
                Image(systemName: "sparkles")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(KozmosColors.primitivesColorsTheme500)
                    .accessibilityHidden(true)
            }
            .frame(width: Self.footprint, height: Self.footprint)
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
