import SwiftUI

public struct KozmosSidebar<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing200) {
                content
                Spacer()
            }
            .padding()
            .frame(width: 250)
            .background(KozmosColors.primitivesColorsBackground100)
            .overlay(
                Rectangle()
                    .frame(width: 1)
                    .foregroundColor(KozmosColors.primitivesColorsBackground300),
                alignment: .trailing
            )
            
            Spacer()
        }
    }
}
