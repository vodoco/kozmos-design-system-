import SwiftUI

public struct KozmosCheckbox: View {
    @Binding var checked: Bool
    let label: String?
    let disabled: Bool
    let error: Bool
    @Environment(\.kozmosAnalytics) var trackEvent
    
    public init(
        checked: Binding<Bool>,
        label: String? = nil,
        disabled: Bool = false,
        error: Bool = false
    ) {
        self._checked = checked
        self.label = label
        self.disabled = disabled
        self.error = error
    }
    
    public var body: some View {
        Button(action: {
            trackEvent(KozmosAnalyticsEvent(eventName: "checkbox_toggled", component: "Checkbox", properties: ["checked": !checked]))
            checked.toggle()
        }) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                ZStack {
                    RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusMarker)
                        .stroke(borderColor, lineWidth: 1)
                        .background(checked ? fillColor : Color.clear)
                        .frame(width: 20, height: 20)
                        .cornerRadius(KozmosDimensions.semanticsRadiusMarker)
                    
                    if checked {
                        Image(systemName: "checkmark")
                            .font(.caption)
                            .bold()
                            .foregroundColor(markColor)
                    }
                }
                
                if let label = label {
                    Text(label)
                        .font(.subheadline)
                        .foregroundColor(labelColor)
                }
            }
            .frame(minHeight: 44, alignment: .center)
        }
        .buttonStyle(PlainButtonStyle())
        .disabled(disabled)
    }

    private var borderColor: Color {
        if error { return KozmosColors.primitivesColorsEmotionalDanger600 }
        if checked { return disabled ? KozmosColors.primitivesColorsForeground500 : KozmosColors.primitivesColorsTheme500 }
        return KozmosColors.primitivesColorsForeground500
    }

    private var fillColor: Color {
        disabled ? KozmosColors.primitivesColorsBackground200 : KozmosColors.primitivesColorsTheme500
    }

    private var markColor: Color {
        disabled ? KozmosColors.primitivesColorsForeground500 : KozmosColors.primitivesColorsBackground0
    }

    private var labelColor: Color {
        if error { return KozmosColors.primitivesColorsEmotionalDanger600 }
        return disabled ? KozmosColors.primitivesColorsForeground500 : KozmosColors.primitivesColorsForeground100
    }
}
