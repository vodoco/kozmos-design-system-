import SwiftUI

public struct KozmosMapView<Content: View>: View {
    let content: () -> Content
    
    public init(@ViewBuilder content: @escaping () -> Content = { EmptyView() }) {
        self.content = content
    }
    
    public var body: some View {
        ZStack {
            // Structural Placeholder Grid Mimicking React Web Component
            KozmosColors.primitivesColorsBackground200
            
            VStack {
                Text("Map View Container")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            // Injected Parent Mapping Engine Payload natively floating above the placeholder
            content()
        }
        .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                .stroke(KozmosColors.primitivesColorsBackground300, lineWidth: 1)
        )
        .frame(minHeight: 400)
    }
}
