import SwiftUI

public struct KozmosCheckbox: View {
    @Binding var checked: Bool
    let label: String?
    @Environment(\.kozmosAnalytics) var trackEvent
    
    public init(checked: Binding<Bool>, label: String? = nil) {
        self._checked = checked
        self.label = label
    }
    
    public var body: some View {
        Button(action: {
            trackEvent(KozmosAnalyticsEvent(eventName: "checkbox_toggled", component: "Checkbox", properties: ["checked": !checked]))
            checked.toggle()
        }) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                ZStack {
                    RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius50)
                        .stroke(checked ? KozmosColors.primitivesColorsTheme500 : KozmosColors.primitivesColorsForeground400, lineWidth: 1)
                        .background(checked ? KozmosColors.primitivesColorsTheme500 : Color.clear)
                        .frame(width: 20, height: 20)
                        .cornerRadius(KozmosDimensions.primitivesLayoutRadius50)
                    
                    if checked {
                        Image(systemName: "checkmark")
                            .font(.caption)
                            .bold()
                            .foregroundColor(KozmosColors.primitivesColorsBackground0)
                    }
                }
                
                if let label = label {
                    Text(label)
                        .font(.subheadline)
                        .foregroundColor(KozmosColors.primitivesColorsForeground100)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}
