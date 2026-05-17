import SwiftUI

public struct KozmosRadioGroup<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing150) {
            content
        }
    }
}

public struct KozmosRadioGroupItem: View {
    let value: String
    let label: String?
    @Binding var selection: String
    @Environment(\.kozmosAnalytics) var trackEvent
    
    public init(value: String, label: String? = nil, selection: Binding<String>) {
        self.value = value
        self.label = label
        self._selection = selection
    }
    
    public var body: some View {
        Button(action: {
            trackEvent(KozmosAnalyticsEvent(eventName: "radio_selection_changed", component: "RadioGroup", properties: ["value": value]))
            selection = value
        }) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                ZStack {
                    Circle()
                        .stroke(selection == value ? KozmosColors.primitivesColorsTheme500 : KozmosColors.primitivesColorsForeground400, lineWidth: 1)
                        .frame(width: 20, height: 20)
                    
                    if selection == value {
                        Circle()
                            .fill(KozmosColors.primitivesColorsTheme500)
                            .frame(width: 10, height: 10)
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
