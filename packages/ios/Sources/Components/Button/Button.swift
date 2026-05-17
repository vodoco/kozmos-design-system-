import SwiftUI

public enum KozmosButtonVariant {
    case `default`
    case destructive
    case outline
    case secondary
    case ghost
    case link
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
    let action: () -> Void
    
    public init(
        _ label: String,
        variant: KozmosButtonVariant = .default,
        size: KozmosButtonSize = .default,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.variant = variant
        self.size = size
        self.action = action
    }
    
    public var body: some View {
        Button(action: action) {
            Text(label)
                .font(.subheadline)
                .fontWeight(.medium)
                .padding(padding)
                .background(backgroundColor)
                .foregroundColor(foregroundColor)
                .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
                .overlay(
                    RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                        .stroke(borderColor, lineWidth: variant == .outline ? 1 : 0)
                )
        }
    }
    

    
    private var padding: EdgeInsets {
        switch size {
        case .default: return EdgeInsets(top: KozmosDimensions.primitivesLayoutSpacing100, leading: KozmosDimensions.primitivesLayoutSpacing200, bottom: KozmosDimensions.primitivesLayoutSpacing100, trailing: KozmosDimensions.primitivesLayoutSpacing200) // h-10 px-4 py-2
        case .sm: return EdgeInsets(top: KozmosDimensions.primitivesLayoutSpacing75, leading: KozmosDimensions.primitivesLayoutSpacing150, bottom: KozmosDimensions.primitivesLayoutSpacing75, trailing: KozmosDimensions.primitivesLayoutSpacing150) // h-9 px-3
        case .lg: return EdgeInsets(top: KozmosDimensions.primitivesLayoutSpacing150, leading: KozmosDimensions.primitivesLayoutSpacing400, bottom: KozmosDimensions.primitivesLayoutSpacing150, trailing: KozmosDimensions.primitivesLayoutSpacing400) // h-11 px-8
        case .icon: return EdgeInsets(top: KozmosDimensions.primitivesLayoutSpacing100, leading: KozmosDimensions.primitivesLayoutSpacing100, bottom: KozmosDimensions.primitivesLayoutSpacing100, trailing: KozmosDimensions.primitivesLayoutSpacing100) // h-10 w-10
        }
    }
    
    private var backgroundColor: Color {
        switch variant {
        case .default: return KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle // Used specific component token
        case .destructive: return KozmosColors.componentsPrimaryButtonsDangerButtonBackgroundIdle
        case .outline, .ghost: return Color.clear
        case .secondary: return KozmosColors.componentsPrimaryButtonsNeutralButtonBackgroundIdle
        case .link: return Color.clear
        }
    }
    
    private var foregroundColor: Color {
        switch variant {
        case .default: return KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle // Semantic Token
        case .destructive: return KozmosColors.componentsPrimaryButtonsDangerButtonForegroundContentIdle
        case .outline, .ghost, .link: return KozmosColors.primitivesColorsTheme500
        case .secondary: return KozmosColors.primitivesColorsForeground100
        }
    }
    
    private var borderColor: Color {
        switch variant {
        case .outline: return KozmosColors.primitivesColorsForeground300
        default: return Color.clear
        }
    }
}
