import SwiftUI

public enum KozmosChipVariant {
    case neutral
    case brand
    case destructive
}

public enum KozmosChipSize {
    case sm
    case `default`
    case lg
}

public struct KozmosChip<Icon: View>: View {
    public let text: String
    public let variant: KozmosChipVariant
    public let size: KozmosChipSize
    public let selected: Bool
    public let disabled: Bool
    public let icon: Icon?
    public let onRemove: (() -> Void)?
    public let action: (() -> Void)?

    public init(
        text: String,
        variant: KozmosChipVariant = .neutral,
        size: KozmosChipSize = .default,
        selected: Bool = false,
        active: Bool? = nil,
        disabled: Bool = false,
        onRemove: (() -> Void)? = nil,
        @ViewBuilder icon: () -> Icon,
        action: (() -> Void)? = nil
    ) {
        self.text = text
        self.variant = variant
        self.size = size
        self.selected = active ?? selected
        self.disabled = disabled
        self.icon = icon()
        self.onRemove = onRemove
        self.action = action
    }

    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
            if let icon {
                icon
                    .frame(width: 16, height: 16)
            }

            Text(text)
                .font(.system(size: fontSize, weight: .medium))
                .lineLimit(1)

            if let onRemove {
                Button(action: onRemove) {
                    Image(systemName: "xmark")
                        .font(.system(size: 10, weight: .bold))
                        .frame(width: 20, height: 20)
                        .contentShape(Circle())
                }
                .buttonStyle(.plain)
                .disabled(disabled)
                .accessibilityLabel("Remove \(text)")
            }
        }
        .padding(.horizontal, horizontalPadding)
        .padding(.vertical, verticalPadding)
        .frame(minHeight: minHeight)
        .foregroundColor(foregroundColor)
        .background(backgroundColor)
        .clipShape(Capsule())
        .overlay(
            Capsule().stroke(borderColor, lineWidth: 1)
        )
        .opacity(disabled ? 0.5 : 1)
        .contentShape(Capsule())
        .onTapGesture {
            guard !disabled else { return }
            action?()
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(text)
        .accessibilityAddTraits(action == nil ? [] : .isButton)
    }

    private var horizontalPadding: CGFloat {
        switch size {
        case .sm:
            return KozmosDimensions.primitivesLayoutSpacing100
        case .default:
            return KozmosDimensions.primitivesLayoutSpacing150
        case .lg:
            return KozmosDimensions.primitivesLayoutSpacing200
        }
    }

    private var verticalPadding: CGFloat {
        return KozmosDimensions.primitivesLayoutSpacing0
    }

    private var fontSize: CGFloat {
        switch size {
        case .sm:
            return 12
        case .default, .lg:
            return 14
        }
    }

    private var minHeight: CGFloat {
        switch size {
        case .sm:
            return 28
        case .default:
            return 32
        case .lg:
            return 36
        }
    }

    private var backgroundColor: Color {
        if selected {
            switch variant {
            case .destructive:
                return KozmosColors.componentsPrimaryButtonsDangerButtonBackgroundIdle
            case .neutral, .brand:
                return KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle
            }
        }

        switch variant {
        case .neutral:
            return KozmosColors.primitivesColorsBackground0
        case .brand:
            return KozmosColors.primitivesColorsTheme0
        case .destructive:
            return KozmosColors.primitivesColorsEmotionalDanger0
        }
    }

    private var foregroundColor: Color {
        if selected {
            switch variant {
            case .destructive:
                return KozmosColors.componentsPrimaryButtonsDangerButtonForegroundContentIdle
            case .neutral, .brand:
                return KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
            }
        }

        switch variant {
        case .neutral:
            return KozmosColors.primitivesColorsForeground100
        case .brand:
            return KozmosColors.componentsSecondaryButtonsThemedButtonForegroundContentIdle
        case .destructive:
            return KozmosColors.componentsSecondaryButtonsDangerButtonForegroundContentIdle
        }
    }

    private var borderColor: Color {
        if selected {
            switch variant {
            case .destructive:
                return KozmosColors.componentsPrimaryButtonsDangerButtonBackgroundIdle
            case .neutral, .brand:
                return KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle
            }
        }

        switch variant {
        case .neutral:
            return KozmosColors.primitivesColorsBackground200
        case .brand:
            return KozmosColors.primitivesColorsTheme200
        case .destructive:
            return KozmosColors.primitivesColorsEmotionalDanger200
        }
    }
}

public extension KozmosChip where Icon == EmptyView {
    init(
        text: String,
        variant: KozmosChipVariant = .neutral,
        size: KozmosChipSize = .default,
        selected: Bool = false,
        active: Bool? = nil,
        disabled: Bool = false,
        onRemove: (() -> Void)? = nil,
        action: (() -> Void)? = nil
    ) {
        self.text = text
        self.variant = variant
        self.size = size
        self.selected = active ?? selected
        self.disabled = disabled
        self.icon = nil
        self.onRemove = onRemove
        self.action = action
    }
}

public struct KozmosChipGroup<Content: View>: View {
    let spacing: CGFloat
    let content: Content

    public init(
        spacing: CGFloat = KozmosDimensions.primitivesLayoutSpacing100,
        @ViewBuilder content: () -> Content
    ) {
        self.spacing = spacing
        self.content = content()
    }

    public var body: some View {
        if #available(iOS 16.0, macOS 13.0, *) {
            ViewThatFits(in: .horizontal) {
                HStack(spacing: spacing) { content }
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: spacing) { content }
                }
            }
        } else {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: spacing) { content }
            }
        }
    }
}
