import SwiftUI

public enum KozmosButtonVariant {
    case `default`
    case destructive
    case outline
    case secondary
    case ghost
    case link
    case glass
}

public enum KozmosButtonSize {
    case `default`
    case sm
    case lg
    case icon
}

public struct KozmosButton: View {
    let label: String
    let variant: KozmosButtonVariant
    let size: KozmosButtonSize
    let isDisabled: Bool
    let isLoading: Bool
    let action: () -> Void
    
    public init(
        _ label: String,
        variant: KozmosButtonVariant = .default,
        size: KozmosButtonSize = .default,
        isDisabled: Bool = false,
        isLoading: Bool = false,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.variant = variant
        self.size = size
        self.isDisabled = isDisabled
        self.isLoading = isLoading
        self.action = action
    }
    
    public var body: some View {
        Button(action: action) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                if isLoading {
                    ProgressView()
                        .controlSize(.small)
                        .tint(foregroundColor)
                }
                Text(label)
                    .font(KozmosTypography.subheadline)
                    .fontWeight(.medium)
            }
            .padding(padding)
            .foregroundColor(foregroundColor)
            .frame(
                minWidth: size == .icon ? 44 : nil,
                minHeight: 44
            )
            .background(backgroundColor)
            .cornerRadius(KozmosDimensions.semanticsRadiusControl)
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl)
                    .stroke(borderColor, lineWidth: variant == .outline ? 1 : 0)
            )
        }
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.5 : 1)
    }
    

    
    private var padding: EdgeInsets {
        switch size {
        case .default: return EdgeInsets(top: 0, leading: KozmosDimensions.primitivesLayoutSpacing200, bottom: 0, trailing: KozmosDimensions.primitivesLayoutSpacing200)
        case .sm: return EdgeInsets(top: 0, leading: KozmosDimensions.primitivesLayoutSpacing150, bottom: 0, trailing: KozmosDimensions.primitivesLayoutSpacing150)
        case .lg: return EdgeInsets(top: 0, leading: KozmosDimensions.primitivesLayoutSpacing400, bottom: 0, trailing: KozmosDimensions.primitivesLayoutSpacing400)
        case .icon: return EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0)
        }
    }
    
    private var backgroundColor: Color {
        switch variant {
        case .default: return KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle // Used specific component token
        case .destructive: return KozmosColors.componentsPrimaryButtonsDangerButtonBackgroundIdle
        case .outline, .ghost: return Color.clear
        case .secondary: return KozmosColors.componentsPrimaryButtonsNeutralButtonBackgroundIdle
        case .link: return Color.clear
        case .glass: return KozmosColors.primitivesColorsForeground0.opacity(0.16)
        }
    }
    
    private var foregroundColor: Color {
        switch variant {
        case .default: return KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle // Semantic Token
        case .destructive: return KozmosColors.componentsPrimaryButtonsDangerButtonForegroundContentIdle
        case .outline, .ghost, .link: return KozmosColors.primitivesColorsTheme500
        case .secondary: return KozmosColors.primitivesColorsForeground100
        case .glass: return KozmosColors.primitivesColorsForeground1000
        }
    }
    
    private var borderColor: Color {
        switch variant {
        case .outline: return KozmosColors.primitivesColorsForeground300
        default: return Color.clear
        }
    }
}
