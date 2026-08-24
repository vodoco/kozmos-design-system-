import SwiftUI

public struct KozmosAlert<Content: View>: View {
    let variant: KozmosAlertVariant
    let content: Content

    public enum KozmosAlertVariant {
        case `default`, info, success, warning, destructive

        var foregroundColor: Color {
            switch self {
            case .default: return KozmosColors.primitivesColorsForeground0
            case .info: return KozmosColors.primitivesColorsTheme600
            case .success: return KozmosColors.primitivesColorsEmotionalSuccess900
            case .warning: return KozmosColors.primitivesColorsEmotionalAlert900
            case .destructive: return KozmosColors.primitivesColorsEmotionalDanger600
            }
        }

        var borderColor: Color {
            switch self {
            case .default: return KozmosColors.primitivesColorsForeground500
            default: return foregroundColor
            }
        }

        var icon: String {
            switch self {
            case .default: return "info.circle"
            case .info: return "info.circle"
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
        .background(KozmosColors.semanticsSurface0)
        .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                .stroke(variant.borderColor, lineWidth: 1)
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
            .foregroundColor(variant.foregroundColor)
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
    let color: Color

    public init(_ title: String, color: Color = KozmosColors.primitivesColorsForeground0) {
        self.title = title
        self.color = color
    }

    public var body: some View {
        Text(title)
            .font(.headline)
            .bold()
            .foregroundColor(color)
    }
}

public struct KozmosAlertDescription: View {
    let description: String
    let color: Color

    public init(_ description: String, color: Color = KozmosColors.primitivesColorsForeground500) {
        self.description = description
        self.color = color
    }

    public var body: some View {
        Text(description)
            .font(.subheadline)
            .foregroundColor(color)
    }
}
