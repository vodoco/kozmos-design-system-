import SwiftUI

public struct KozmosTabs<Content: View>: View {
    @Binding var selection: String
    let content: Content
    
    public init(selection: Binding<String>, @ViewBuilder content: () -> Content) {
        self._selection = selection
        self.content = content()
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            content
        }
    }
}

public struct KozmosTabsList<Content: View>: View {
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            content
        }
        .background(KozmosColors.primitivesColorsBackground0)
    }
}

public struct KozmosTabsTrigger: View {
    let value: String
    let title: String
    @Binding var selection: String
    @Environment(\.kozmosAnalytics) var trackEvent
    
    public init(value: String, title: String, selection: Binding<String>) {
        self.value = value
        self.title = title
        self._selection = selection
    }
    
    public var body: some View {
        Button(action: {
            trackEvent(KozmosAnalyticsEvent(eventName: "tab_switched", component: "Tabs", properties: ["value": value]))
            selection = value
        }) {
            Text(title)
                .font(KozmosTypography.subheadline)
                .fontWeight(selection == value ? .semibold : .regular)
                .foregroundColor(selection == value ? KozmosColors.primitivesColorsForeground100 : KozmosColors.primitivesColorsForeground500)
                .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing100)
                .frame(maxWidth: .infinity)
                .overlay(
                    Rectangle()
                        .fill(selection == value ? KozmosColors.primitivesColorsTheme500 : Color.clear)
                        .frame(height: 2)
                        .offset(y: 14) // Align to bottom
                    , alignment: .bottom
                )
        }
    }
}

public struct KozmosTabsContent<Content: View>: View {
    let value: String
    @Binding var selection: String
    let content: Content
    
    public init(value: String, selection: Binding<String>, @ViewBuilder content: () -> Content) {
        self.value = value
        self._selection = selection
        self.content = content()
    }
    
    public var body: some View {
        if selection == value {
            content
                .padding(.top, KozmosDimensions.primitivesLayoutSpacing100)
        }
    }
}
