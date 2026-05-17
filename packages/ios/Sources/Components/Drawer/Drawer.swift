import SwiftUI

public struct KozmosDrawer<Content: View>: View {
    @Binding var isPresented: Bool
    let content: Content
    
    public init(isPresented: Binding<Bool>, @ViewBuilder content: () -> Content) {
        self._isPresented = isPresented
        self.content = content()
    }
    
    public var body: some View {
        ZStack(alignment: .leading) {
            if isPresented {
                KozmosColors.primitivesColorsBackground900.opacity(0.4)
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        withAnimation {
                            isPresented = false
                        }
                    }
                
                content
                    .frame(width: 300)
                    .background(KozmosColors.primitivesColorsBackground0)
                    .edgesIgnoringSafeArea(.vertical)
                    .transition(.move(edge: .leading))
            }
        }
    }
}
