import SwiftUI

public struct KozmosTag: View {
    let text: String
    let variant: KozmosTagVariant
    let onRemove: (() -> Void)?
    
    public enum KozmosTagVariant {
        case `default`, secondary, destructive, outline, success
        
        var backgroundColor: Color {
            switch self {
            case .default: return KozmosColors.primitivesColorsTheme500
            case .secondary: return KozmosColors.primitivesColorsBackground100
            case .destructive: return KozmosColors.semanticsDataRed
            case .outline: return Color.clear
            case .success: return KozmosColors.semanticsDataTeal
            }
        }
        
        var foregroundColor: Color {
            switch self {
            case .default, .destructive, .success: return KozmosColors.primitivesColorsBackground0
            case .secondary, .outline: return KozmosColors.primitivesColorsForeground900
            }
        }
    }
    
    public init(_ text: String, variant: KozmosTagVariant = .default, onRemove: (() -> Void)? = nil) {
        self.text = text
        self.variant = variant
        self.onRemove = onRemove
    }
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
            Text(text)
                .font(.caption)
                .bold()
                .foregroundColor(variant.foregroundColor)
            
            if let onRemove = onRemove {
                Button(action: onRemove) {
                    Image(systemName: "xmark")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .foregroundColor(variant.foregroundColor)
                }
            }
        }
        .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing100)
        .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing50)
        .background(variant.backgroundColor)
        .cornerRadius(KozmosDimensions.primitivesLayoutSpacing150)
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutSpacing150)
                .stroke(variant == .outline ? variant.foregroundColor.opacity(0.3) : Color.clear, lineWidth: variant == .outline ? 1 : 0)
        )
    }
}
