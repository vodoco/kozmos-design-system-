import SwiftUI

public struct KozmosUserLocationMarker: View {
    public let heading: Double
    public let showHeading: Bool

    /// One full expand-and-fade of the pulse, in seconds.
    private static let pulsePeriod: Double = 1.5

    public init(heading: Double = 0, showHeading: Bool = true) {
        self.heading = heading
        self.showHeading = showHeading
    }

    public var body: some View {
        ZStack {
            // Pulsing background.
            //
            // Driven from the timeline rather than a `repeatForever` animation
            // on `@State` set in `onAppear`. A marker on a map is rebuilt
            // constantly — the floor changes, the camera moves — and a
            // repeating implicit animation left mid-flight by a rebuild renders
            // a stray ring adrift from the marker. A clock cannot get stranded.
            TimelineView(.animation) { context in
                let phase = Self.pulsePhase(at: context.date)
                Circle()
                    .fill(KozmosColors.semanticsDataBlue)
                    .frame(width: 24, height: 24)
                    .scaleEffect(1 + 0.8 * phase)
                    .opacity(0.5 * (1 - phase))
            }

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
    }

    /// 0 at the start of a pulse, approaching 1 as it fades out.
    private static func pulsePhase(at date: Date) -> Double {
        let elapsed = date.timeIntervalSinceReferenceDate
            .truncatingRemainder(dividingBy: pulsePeriod)
        return elapsed / pulsePeriod
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
