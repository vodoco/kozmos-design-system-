import SwiftUI

public enum KozmosScrollAreaOrientation: String, CaseIterable {
    case vertical
    case horizontal
    case both
}

public struct KozmosScrollArea<Content: View>: View {
    let orientation: KozmosScrollAreaOrientation
    let showsIndicators: Bool
    let content: Content

    public init(
        orientation: KozmosScrollAreaOrientation = .vertical,
        showsIndicators: Bool = false,
        @ViewBuilder content: () -> Content
    ) {
        self.orientation = orientation
        self.showsIndicators = showsIndicators
        self.content = content()
    }

    public var body: some View {
        ScrollView(scrollAxes, showsIndicators: showsIndicators) {
            content
                .frame(
                    maxWidth: orientation == .horizontal ? nil : .infinity,
                    alignment: .topLeading
                )
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    private var scrollAxes: Axis.Set {
        switch orientation {
        case .vertical:
            return .vertical
        case .horizontal:
            return .horizontal
        case .both:
            return [.horizontal, .vertical]
        }
    }
}
