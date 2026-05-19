import SwiftUI

public struct KozmosBadge: View {
    let text: String
    let variant: KozmosBadgeVariant
    let size: KozmosBadgeSize
    
    public enum KozmosBadgeVariant {
        case `default`
        case secondary
        case destructive
        case outline
        case ghost
        case link
        case success
        
        var color: Color {
            switch self {
            case .default: return KozmosColors.primitivesColorsTheme500
            case .secondary: return KozmosColors.primitivesColorsForeground500
            case .destructive: return KozmosColors.semanticsDataRed
            case .outline, .ghost, .link: return KozmosColors.primitivesColorsTheme500
            case .success: return KozmosColors.semanticsDataTeal
            }
        }
    }

    public enum KozmosBadgeSize {
        case `default`
        case sm
        case lg
        case icon
    }
    
    public init(
        _ text: String,
        variant: KozmosBadgeVariant = .default,
        size: KozmosBadgeSize = .default
    ) {
        self.text = text
        self.variant = variant
        self.size = size
    }
    
    public var body: some View {
        Text(text)
            .font(.subheadline)
            .fontWeight(.medium)
            .underline(variant == .link)
            .padding(.horizontal, horizontalPadding)
            .padding(.vertical, 0)
            .frame(minWidth: size == .icon ? 44 : nil, minHeight: 44)
            .background(backgroundColor)
            .foregroundColor(variant.color)
            .cornerRadius(KozmosDimensions.primitivesLayoutRadius50)
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius50)
                    .stroke(variant == .outline ? variant.color.opacity(0.3) : Color.clear, lineWidth: variant == .outline ? 1 : 0)
            )
    }

    private var horizontalPadding: CGFloat {
        switch size {
        case .sm: return KozmosDimensions.primitivesLayoutSpacing150
        case .default: return KozmosDimensions.primitivesLayoutSpacing200
        case .lg: return KozmosDimensions.primitivesLayoutSpacing400
        case .icon: return 0
        }
    }

    private var backgroundColor: Color {
        switch variant {
        case .outline, .ghost, .link: return Color.clear
        default: return variant.color.opacity(0.15)
        }
    }
}
