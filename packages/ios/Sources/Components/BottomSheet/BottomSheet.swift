import SwiftUI

public struct KozmosBottomSheetModifier<SheetContent: View>: ViewModifier {
    @Binding var isPresented: Bool
    let detents: Set<PresentationDetent>
    let dragIndicator: Visibility
    let interactiveDismissDisabled: Bool
    let sheetContent: SheetContent

    public init(
        isPresented: Binding<Bool>,
        detents: Set<PresentationDetent> = [.medium, .large],
        dragIndicator: Visibility = .visible,
        interactiveDismissDisabled: Bool = false,
        @ViewBuilder content: () -> SheetContent
    ) {
        self._isPresented = isPresented
        self.detents = detents
        self.dragIndicator = dragIndicator
        self.interactiveDismissDisabled = interactiveDismissDisabled
        self.sheetContent = content()
    }

    public func body(content host: Content) -> some View {
        host.sheet(isPresented: $isPresented) {
            sheetContent
                .frame(maxWidth: .infinity, alignment: .topLeading)
                .background(KozmosColors.primitivesColorsBackground0)
                .presentationDetents(detents)
                .presentationDragIndicator(dragIndicator)
                .interactiveDismissDisabled(interactiveDismissDisabled)
        }
    }
}

public struct KozmosBottomSheet<SheetContent: View>: View {
    @Binding var isPresented: Bool
    let detents: Set<PresentationDetent>
    let dragIndicator: Visibility
    let interactiveDismissDisabled: Bool
    let sheetContent: SheetContent

    public init(
        isPresented: Binding<Bool>,
        detents: Set<PresentationDetent> = [.medium, .large],
        dragIndicator: Visibility = .visible,
        interactiveDismissDisabled: Bool = false,
        @ViewBuilder content: () -> SheetContent
    ) {
        self._isPresented = isPresented
        self.detents = detents
        self.dragIndicator = dragIndicator
        self.interactiveDismissDisabled = interactiveDismissDisabled
        self.sheetContent = content()
    }

    public var body: some View {
        Color.clear
            .frame(width: 0, height: 0)
            .accessibilityHidden(true)
            .modifier(
                KozmosBottomSheetModifier(
                    isPresented: $isPresented,
                    detents: detents,
                    dragIndicator: dragIndicator,
                    interactiveDismissDisabled: interactiveDismissDisabled
                ) {
                    sheetContent
                }
            )
    }
}

public extension View {
    func kozmosBottomSheet<SheetContent: View>(
        isPresented: Binding<Bool>,
        detents: Set<PresentationDetent> = [.medium, .large],
        dragIndicator: Visibility = .visible,
        interactiveDismissDisabled: Bool = false,
        @ViewBuilder content: () -> SheetContent
    ) -> some View {
        modifier(
            KozmosBottomSheetModifier(
                isPresented: isPresented,
                detents: detents,
                dragIndicator: dragIndicator,
                interactiveDismissDisabled: interactiveDismissDisabled,
                content: content
            )
        )
    }
}
