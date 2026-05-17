import SwiftUI

public struct KozmosEmptyState<Icon: View, Action: View>: View {
    public let title: String
    public let description: String?
    public let icon: Icon?
    public let action: Action?

    public init(
        title: String,
        description: String? = nil,
        @ViewBuilder icon: () -> Icon,
        @ViewBuilder action: () -> Action
    ) {
        self.title = title
        self.description = description
        self.icon = icon()
        self.action = action()
    }

    public var body: some View {
        VStack(spacing: 16) {
            if let icon = icon {
                icon
                    .foregroundColor(KozmosColors.primitivesColorsForeground300)
            }
            
            VStack(spacing: 4) {
                Text(title)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(KozmosColors.primitivesColorsForeground100)
                    .multilineTextAlignment(.center)
                
                if let description = description {
                    Text(description)
                        .font(.system(size: 14))
                        .foregroundColor(KozmosColors.primitivesColorsForeground300)
                        .multilineTextAlignment(.center)
                }
            }
            
            if let action = action {
                action
            }
        }
        .padding(24)
        .frame(maxWidth: .infinity)
    }
}

// Convenience init for no views
public extension KozmosEmptyState where Icon == EmptyView, Action == EmptyView {
    init(title: String, description: String? = nil) {
        self.title = title
        self.description = description
        self.icon = nil
        self.action = nil
    }
}
