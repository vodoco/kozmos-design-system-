import SwiftUI

public struct KozmosWayfindingCard<Content: View>: View {
    let title: String
    let onClose: (() -> Void)?
    let content: Content
    
    public init(title: String = "Navigation", onClose: (() -> Void)? = nil, @ViewBuilder content: () -> Content) {
        self.title = title
        self.onClose = onClose
        self.content = content()
    }
    
    public var body: some View {
        VStack(spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            HStack {
                Text(title)
                    .font(KozmosTypography.headline)
                Spacer()
                if let onClose = onClose {
                    Button(action: onClose) {
                        Image(systemName: "xmark")
                            .foregroundColor(KozmosColors.primitivesColorsForeground500)
                    }
                }
            }
            .padding()
            
            content
                .padding(.horizontal)
                .padding(.bottom)
        }
        .background(KozmosColors.primitivesColorsBackground0)
        .cornerRadius(KozmosDimensions.semanticsRadiusContainer)
        .kozmosElevation(KozmosShadows.semanticsElevationFloating)
    }
}

public struct KozmosWayfindingInputRow: View {
    @Environment(\.kozmosAnalytics) var trackEvent
    @Binding var originValue: String
    @Binding var destinationValue: String
    let originPlaceholder: String
    let destinationPlaceholder: String
    let onSwap: () -> Void
    
    public init(
        originValue: Binding<String>,
        destinationValue: Binding<String>,
        originPlaceholder: String = "Choose starting point...",
        destinationPlaceholder: String = "Choose destination...",
        onSwap: @escaping () -> Void
    ) {
        self._originValue = originValue
        self._destinationValue = destinationValue
        self.originPlaceholder = originPlaceholder
        self.destinationPlaceholder = destinationPlaceholder
        self.onSwap = onSwap
    }
    
    public var body: some View {
        VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            TextField(originPlaceholder, text: $originValue)
                .padding(KozmosDimensions.primitivesLayoutSpacing150)
                .background(KozmosColors.primitivesColorsBackground0)
                .cornerRadius(KozmosDimensions.semanticsRadiusControl)
                .overlay(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl).stroke(KozmosColors.primitivesColorsForeground300, lineWidth: 1))
            
            HStack {
                Spacer()
                Button(action: {
                    trackEvent(KozmosAnalyticsEvent(eventName: "wayfinding_route_swapped", component: "WayfindingInputRow", properties: ["origin": originValue, "destination": destinationValue]))
                    onSwap()
                }) {
                    Image(systemName: "arrow.up.arrow.down.circle.fill")
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                        .font(KozmosTypography.title2)
                }
            }
            
            TextField(destinationPlaceholder, text: $destinationValue)
                .padding(KozmosDimensions.primitivesLayoutSpacing150)
                .background(KozmosColors.primitivesColorsBackground0)
                .cornerRadius(KozmosDimensions.semanticsRadiusControl)
                .overlay(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl).stroke(KozmosColors.primitivesColorsForeground300, lineWidth: 1))
        }
    }
}
