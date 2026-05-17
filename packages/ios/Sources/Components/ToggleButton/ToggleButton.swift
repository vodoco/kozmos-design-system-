import SwiftUI

public struct KozmosToggleButton: View {
    @Binding var isOn: Bool
    let label: String
    let iconName: String?
    let variant: Variant
    let size: Size
    @Environment(\.kozmosAnalytics) var trackEvent
    
    public enum Variant {
        case `default`, outline
    }
    
    public enum Size {
        case sm, `default`, lg
    }

    public init(isOn: Binding<Bool>, label: String, iconName: String? = nil, variant: Variant = .default, size: Size = .default) {
        self._isOn = isOn
        self.label = label
        self.iconName = iconName
        self.variant = variant
        self.size = size
    }
    
    public var body: some View {
        Button(action: {
            isOn.toggle()
            trackEvent(KozmosAnalyticsEvent(eventName: "toggle_pressed", component: "ToggleButton", properties: ["pressed": isOn]))
        }) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                if let iconName = iconName {
                    Image(systemName: iconName)
                }
                Text(label)
            }
            .font(size == .sm ? .caption : (size == .lg ? .headline : .subheadline))
            .padding(.horizontal, size == .sm ? KozmosDimensions.primitivesLayoutSpacing150 : (size == .lg ? KozmosDimensions.primitivesLayoutSpacing400 : KozmosDimensions.primitivesLayoutSpacing200))
            .padding(.vertical, size == .sm ? KozmosDimensions.primitivesLayoutSpacing100 : (size == .lg ? KozmosDimensions.primitivesLayoutSpacing200 : KozmosDimensions.primitivesLayoutSpacing150))
            .background(
                Group {
                    if isOn {
                        variant == .outline ? KozmosColors.primitivesColorsBackground200 : KozmosColors.primitivesColorsTheme500
                    } else {
                        variant == .outline ? Color.clear : KozmosColors.primitivesColorsBackground100
                    }
                }
            )
            .foregroundColor(
                isOn ? (variant == .outline ? KozmosColors.primitivesColorsForeground100 : KozmosColors.primitivesColorsBackground0) : KozmosColors.primitivesColorsForeground100
            )
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                    .stroke(variant == .outline ? KozmosColors.primitivesColorsBackground400 : Color.clear, lineWidth: variant == .outline ? 1 : 0)
            )
            .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
        }
    }
}
