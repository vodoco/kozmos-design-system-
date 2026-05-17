import SwiftUI

public struct KozmosBadge: View {
    let text: String
    let variant: KozmosBadgeVariant
    
    public enum KozmosBadgeVariant {
        case `default`, secondary, destructive, outline, success
        
        var color: Color {
            switch self {
            case .default: return KozmosColors.primitivesColorsTheme500
            case .secondary: return KozmosColors.primitivesColorsForeground500
            case .destructive: return KozmosColors.semanticsDataRed
            case .outline: return KozmosColors.primitivesColorsForeground900
            case .success: return KozmosColors.semanticsDataTeal
            }
        }
    }
    
    public init(_ text: String, variant: KozmosBadgeVariant = .default) {
        self.text = text
        self.variant = variant
    }
    
    public var body: some View {
        Text(text)
            .font(.caption)
            .fontWeight(.semibold)
            .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing100)
            .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing50)
            .background(variant == .outline ? Color.clear : variant.color.opacity(0.15))
            .foregroundColor(variant.color)
            .cornerRadius(KozmosDimensions.primitivesLayoutRadius50)
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius50)
                    .stroke(variant == .outline ? variant.color.opacity(0.3) : Color.clear, lineWidth: variant == .outline ? 1 : 0)
            )
    }
}
