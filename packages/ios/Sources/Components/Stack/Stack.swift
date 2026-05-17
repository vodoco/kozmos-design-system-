import SwiftUI

public enum StackDirection {
    case horizontal
    case vertical
}

public struct Stack<Content: View>: View {
    let direction: StackDirection
    let spacing: CGFloat
    let content: Content
    
    public init(
        direction: StackDirection = .vertical,
        spacing: CGFloat = 8,
        @ViewBuilder content: () -> Content
    ) {
        self.direction = direction
        self.spacing = spacing
        self.content = content()
    }
    
    public var body: some View {
        switch direction {
        case .horizontal:
            HStack(spacing: spacing) {
                content
            }
        case .vertical:
            VStack(spacing: spacing) {
                content
            }
        }
    }
}
