import SwiftUI

public struct KozmosAlert<Content: View>: View {
    let variant: KozmosAlertVariant
    let content: Content
    
    public enum KozmosAlertVariant {
        case `default`, success, warning, destructive
        
        var color: Color {
            switch self {
            case .default: return KozmosColors.semanticsDataBlue
            case .success: return KozmosColors.semanticsDataTeal
            case .warning: return KozmosColors.semanticsDataYellow
            case .destructive: return KozmosColors.semanticsDataRed
            }
        }
        
        var icon: String {
            switch self {
            case .default: return "info.circle"
            case .success: return "checkmark.circle"
            case .warning: return "exclamationmark.triangle"
            case .destructive: return "xmark.circle"
            }
        }
    }
    
    public init(variant: KozmosAlertVariant = .default, @ViewBuilder content: () -> Content) {
        self.variant = variant
        self.content = content()
    }
    
    public var body: some View {
        HStack(alignment: .top, spacing: KozmosDimensions.primitivesLayoutSpacing150) {
            content
        }
        .padding()
        .background(variant.color.opacity(0.1))
        .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                .stroke(variant.color.opacity(0.3), lineWidth: 1)
        )
    }
}

public struct KozmosAlertIcon: View {
    let variant: KozmosAlert<AnyView>.KozmosAlertVariant
    
    public init(variant: KozmosAlert<AnyView>.KozmosAlertVariant = .default) {
        self.variant = variant
    }
    
    public var body: some View {
        Image(systemName: variant.icon)
            .foregroundColor(variant.color)
            .font(.title3)
    }
}

public struct KozmosAlertContent<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing50) {
            content
        }
    }
}

public struct KozmosAlertTitle: View {
    let title: String
    
    public init(_ title: String) {
        self.title = title
    }
    
    public var body: some View {
        Text(title)
            .font(.headline)
            .bold()
    }
}

public struct KozmosAlertDescription: View {
    let description: String
    
    public init(_ description: String) {
        self.description = description
    }
    
    public var body: some View {
        Text(description)
            .font(.subheadline)
            .foregroundColor(KozmosColors.primitivesColorsForeground500)
    }
}
