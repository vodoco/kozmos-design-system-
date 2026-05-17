import SwiftUI

public struct KozmosSkeleton: View {
    @State private var phase: CGFloat = 0
    
    public init() {}
    
    public var body: some View {
        Rectangle()
            .fill(KozmosColors.primitivesColorsBackground300)
            .overlay(
                GeometryReader { geometry in
                    Rectangle()
                        .fill(
                            LinearGradient(
                                gradient: Gradient(colors: [.clear, .white.opacity(0.4), .clear]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .offset(x: -geometry.size.width + (geometry.size.width * 2 * phase))
                        .animation(
                            Animation.linear(duration: 1.5)
                                .repeatForever(autoreverses: false),
                            value: phase
                        )
                }
            )
            .mask(Rectangle())
            .onAppear {
                phase = 1
            }
    }
}
