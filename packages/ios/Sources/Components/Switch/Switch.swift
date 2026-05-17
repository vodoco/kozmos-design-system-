import SwiftUI

public struct KozmosSwitch: View {
    @Binding var checked: Bool
    @Environment(\.kozmosAnalytics) var trackEvent
    
    public init(checked: Binding<Bool>) {
        self._checked = checked
    }
    
    public var body: some View {
        Toggle("", isOn: Binding(
            get: { self.checked },
            set: { newValue in
                trackEvent(KozmosAnalyticsEvent(eventName: "switch_toggled", component: "Switch", properties: ["checked": newValue]))
                self.checked = newValue
            }
        ))
            .toggleStyle(SwitchToggleStyle(tint: KozmosColors.primitivesColorsTheme500))
            .labelsHidden()
    }
}
