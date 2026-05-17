import SwiftUI

public struct KozmosSelect<Trigger: View, Content: View>: View {
    let trigger: Trigger
    let content: Content
    
    public init(@ViewBuilder trigger: () -> Trigger, @ViewBuilder content: () -> Content) {
        self.trigger = trigger()
        self.content = content()
    }
    
    public var body: some View {
        Menu {
            content
        } label: {
            trigger
        }
    }
}

public struct KozmosSelectItem: View {
    let value: String
    let label: String
    @Binding var selection: String
    @Environment(\.kozmosAnalytics) var trackEvent
    
    public init(value: String, label: String, selection: Binding<String>) {
        self.value = value
        self.label = label
        self._selection = selection
    }
    
    public var body: some View {
        Button(action: {
            trackEvent(KozmosAnalyticsEvent(eventName: "select_value_changed", component: "Select", properties: ["value": value]))
            selection = value
        }) {
            HStack {
                Text(label)
                if selection == value {
                    Image(systemName: "checkmark")
                }
            }
        }
    }
}
