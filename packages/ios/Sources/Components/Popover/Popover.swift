import SwiftUI

public struct KozmosPopover<PopoverContent: View>: ViewModifier {
    @Binding var isPresented: BooleanLiteralType
    let content: PopoverContent
    
    public init(isPresented: Binding<Bool>, @ViewBuilder content: () -> PopoverContent) {
        self._isPresented = isPresented
        self.content = content()
    }
    
    public func body(content: Content) -> some View {
        content
            .popover(isPresented: $isPresented) {
                if #available(iOS 16.4, macOS 13.3, *) {
                    self.content
                        .presentationCompactAdaptation(.popover)
                } else {
                    self.content
                }
            }
    }
}

public extension View {
    func kozmosPopover<Content: View>(isPresented: Binding<Bool>, @ViewBuilder content: @escaping () -> Content) -> some View {
        self.modifier(KozmosPopover(isPresented: isPresented, content: content))
    }
}
