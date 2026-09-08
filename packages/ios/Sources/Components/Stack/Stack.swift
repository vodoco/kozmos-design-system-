import SwiftUI

public enum StackDirection: String, CaseIterable, Sendable {
    case vertical
    case horizontal
}

/// Where a stack's children line up across its cross axis.
///
/// Direction-agnostic on purpose: `start` is the leading edge of a vertical
/// stack and the top of a horizontal one, so a caller can flip the direction
/// without rewriting the alignment.
public enum StackAlignment: String, CaseIterable, Sendable {
    case start
    case center
    case end

    var horizontal: HorizontalAlignment {
        switch self {
        case .start: return .leading
        case .center: return .center
        case .end: return .trailing
        }
    }

    var vertical: VerticalAlignment {
        switch self {
        case .start: return .top
        case .center: return .center
        case .end: return .bottom
        }
    }
}

/// A stack in either direction.
///
/// It had no alignment, so every layout that needed its children on the
/// leading edge — which is most of them — had to drop to a raw `VStack` and
/// lose the token spacing with it.
public struct Stack<Content: View>: View {
    let direction: StackDirection
    let alignment: StackAlignment
    let spacing: CGFloat
    let content: Content

    public init(
        direction: StackDirection = .vertical,
        alignment: StackAlignment = .center,
        spacing: CGFloat = KozmosDimensions.primitivesLayoutSpacing100,
        @ViewBuilder content: () -> Content
    ) {
        self.direction = direction
        self.alignment = alignment
        self.spacing = spacing
        self.content = content()
    }

    public var body: some View {
        switch direction {
        case .horizontal:
            HStack(alignment: alignment.vertical, spacing: spacing) {
                content
            }
        case .vertical:
            VStack(alignment: alignment.horizontal, spacing: spacing) {
                content
            }
        }
    }
}
