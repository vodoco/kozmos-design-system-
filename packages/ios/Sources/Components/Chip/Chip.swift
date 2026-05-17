import SwiftUI

public struct KozmosChip<Icon: View>: View {
    public let text: String
    public let active: Bool
    public let icon: Icon?
    public let action: () -> Void

    public init(
        text: String,
        active: Bool = false,
        @ViewBuilder icon: () -> Icon,
        action: @escaping () -> Void
    ) {
        self.text = text
        self.active = active
        self.icon = icon()
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon = icon {
                    icon
                }
                
                Text(text)
                    .font(.system(size: 14, weight: .medium))
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .foregroundColor(active ? Color.white : KozmosColors.primitivesColorsForeground100)
            .background(active ? KozmosColors.primitivesColorsTheme500 : Color.clear)
            .cornerRadius(50)
            .overlay(
                RoundedRectangle(cornerRadius: 50)
                    .stroke(active ? KozmosColors.primitivesColorsTheme500 : KozmosColors.primitivesColorsBackground200, lineWidth: 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// Convenience init without icon
public extension KozmosChip where Icon == EmptyView {
    init(text: String, active: Bool = false, action: @escaping () -> Void) {
        self.text = text
        self.active = active
        self.icon = nil
        self.action = action
    }
}

// Wrapping group using standard Flow layout if iOS 16+, or HStack fallback
public struct KozmosChipGroup<Content: View>: View {
    let content: Content

    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    public var body: some View {
        if #available(iOS 16.0, *) {
            ViewThatFits(in: .horizontal) {
                HStack(spacing: 8) { content }
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) { content }
                }
            }
        } else {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) { content }
            }
        }
    }
}
