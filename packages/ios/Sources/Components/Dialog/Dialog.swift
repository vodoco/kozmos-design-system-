import SwiftUI
import Kozmos

public struct KozmosDialog<Content: View>: View {
    @Binding var isPresented: Bool
    let content: () -> Content
    
    public init(isPresented: Binding<Bool>, @ViewBuilder content: @escaping () -> Content) {
        self._isPresented = isPresented
        self.content = content
    }
    
    public var body: some View {
        ZStack {
            if isPresented {
                // Dimming Backdrop
                KozmosColors.primitivesColorsBackground900.opacity(0.4)
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        isPresented = false
                    }
                
                // Content Payload
                VStack(spacing: KozmosDimensions.primitivesLayoutSpacing300) {
                    content()
                }
                .padding(KozmosDimensions.primitivesLayoutSpacing300)
                .background(KozmosColors.primitivesColorsTheme0)
                .cornerRadius(KozmosDimensions.primitivesLayoutRadius200)
                .shadow(color: KozmosColors.primitivesColorsBackground900.opacity(0.15), radius: 20, x: 0, y: 10)
                .padding(KozmosDimensions.primitivesLayoutSpacing400)
            }
        }
        .animation(.easeInOut(duration: 0.2), value: isPresented)
    }
}
