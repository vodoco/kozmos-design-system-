import SwiftUI

public enum KozmosOverlayPosition {
    case topLeft, topRight, bottomLeft, bottomRight, topCenter, bottomCenter
}

public struct KozmosMapOverlay<Content: View>: View {
    public var position: KozmosOverlayPosition
    public var content: () -> Content

    public init(position: KozmosOverlayPosition = .topLeft, @ViewBuilder content: @escaping () -> Content) {
        self.position = position
        self.content = content
    }

    public var body: some View {
        let alignment: Alignment = {
            switch position {
            case .topLeft: return .topLeading
            case .topRight: return .topTrailing
            case .bottomLeft: return .bottomLeading
            case .bottomRight: return .bottomTrailing
            case .topCenter: return .top
            case .bottomCenter: return .bottom
            }
        }()

        // ZStack mathematically mimics `absolute z-50` bounds natively isolating domain components
        ZStack(alignment: alignment) {
            KozmosColors.primitivesColorsBackground0.opacity(0.0001) // Transparent hit box forcing strict ZStack global projection coordinates 
                .ignoresSafeArea()
                .allowsHitTesting(false) // CRITICAL: Ensures the projection layer DOES NOT intercept map gestures!
            
            content()
                .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing200)
                .padding(.top, position == .topLeft || position == .topRight || position == .topCenter ? KozmosDimensions.primitivesLayoutSpacing200 : KozmosDimensions.primitivesLayoutSpacing0)
                // Adds extra structural padding to evade iOS Home Indicator AND MapKit / MapLibre compass icons
                .padding(.bottom, position == .bottomLeft || position == .bottomRight || position == .bottomCenter ? KozmosDimensions.primitivesLayoutSpacing600 : KozmosDimensions.primitivesLayoutSpacing200)
                .frame(maxWidth: 384) // `md:w-96` analog limits
        }
    }
}
