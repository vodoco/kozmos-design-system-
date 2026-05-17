import SwiftUI

public struct KozmosUserLocationMarker: View {
    public let heading: Double
    public let showHeading: Bool

    @State private var isAnimating = false

    public init(heading: Double = 0, showHeading: Bool = true) {
        self.heading = heading
        self.showHeading = showHeading
    }

    public var body: some View {
        ZStack {
            // Pulsing Background
            Circle()
                .fill(KozmosColors.semanticsDataBlue)
                .frame(width: 24, height: 24)
                .scaleEffect(isAnimating ? 1.8 : 1.0)
                .opacity(isAnimating ? 0.0 : 0.5)
                .animation(
                    Animation.easeOut(duration: 1.5)
                        .repeatForever(autoreverses: false),
                    value: isAnimating
                )

            // Static Ring
            Circle()
                .fill(KozmosColors.semanticsDataBlue)
                .opacity(0.2)
                .frame(width: 36, height: 36)

            // Heading Cone
            if showHeading {
                ConeShape()
                    .fill(
                        RadialGradient(
                            gradient: Gradient(colors: [
                                KozmosColors.semanticsDataBlue.opacity(0.4),
                                Color.clear
                            ]),
                            center: .center,
                            startRadius: 0,
                            endRadius: 32
                        )
                    )
                    .frame(width: 64, height: 64)
                    .rotationEffect(.degrees(heading))
            }

            // Core Dot
            Circle()
                .fill(KozmosColors.semanticsDataBlue)
                .frame(width: 16, height: 16)
                .overlay(
                    Circle()
                        .stroke(Color.white, lineWidth: 2)
                )
        }
        .frame(width: 64, height: 64)
        .onAppear {
            isAnimating = true
        }
    }
}

private struct ConeShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        
        path.move(to: center)
        path.addLine(to: CGPoint(x: rect.width * 0.15, y: 0))
        path.addQuadCurve(
            to: CGPoint(x: rect.width * 0.85, y: 0),
            control: CGPoint(x: rect.midX, y: -rect.height * 0.1)
        )
        path.closeSubpath()
        return path
    }
}
