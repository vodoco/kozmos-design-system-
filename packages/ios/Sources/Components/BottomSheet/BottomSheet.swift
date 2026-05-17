import SwiftUI

public struct KozmosBottomSheet<Content: View>: View {
    @Binding var isPresented: Bool
    let content: Content
    let detents: Set<PresentationDetent>
    
    public init(isPresented: Binding<Bool>, detents: Set<PresentationDetent> = [.medium, .large], @ViewBuilder content: () -> Content) {
        self._isPresented = isPresented
        self.detents = detents
        self.content = content()
    }
    
    public var body: some View {
        EmptyView() // The sheet is attached to the view hierarchy via modifier usually, this component might need to be used differently or wraps a dummy view with .sheet
            .sheet(isPresented: $isPresented) {
                content
                    .presentationDetents(detents)
                    .presentationDragIndicator(.visible)
            }
    }
}

// Extension for easier usage
public extension View {
    func kozmosBottomSheet<Content: View>(isPresented: Binding<Bool>, @ViewBuilder content: @escaping () -> Content) -> some View {
        self.sheet(isPresented: isPresented) {
            content()
                .presentationDragIndicator(.visible)
        }
    }
}
