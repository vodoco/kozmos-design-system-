import SwiftUI

public struct KozmosMapView<Content: View>: View {
    let content: () -> Content
    
    public init(@ViewBuilder content: @escaping () -> Content = { EmptyView() }) {
        self.content = content
    }
    
    public var body: some View {
        ZStack {
            KozmosColors.primitivesColorsBackground200

            content()
        }
        .cornerRadius(KozmosDimensions.semanticsRadiusControl)
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl)
                .stroke(KozmosColors.primitivesColorsBackground300, lineWidth: 1)
        )
        .frame(minHeight: 400)
    }
}
