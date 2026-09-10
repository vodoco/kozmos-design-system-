import SwiftUI

public struct KozmosSearchBar: View {
    @Environment(\.kozmosAnalytics) var trackEvent
    @Binding var text: String
    let placeholder: String
    let onClear: (() -> Void)?
    
    public init(text: Binding<String>, placeholder: String = "Search...", onClear: (() -> Void)? = nil) {
        self._text = text
        self.placeholder = placeholder
        self.onClear = onClear
    }
    
    public var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(KozmosColors.primitivesColorsForeground500)
            
            TextField(placeholder, text: $text)
                .onSubmit {
                    trackEvent(KozmosAnalyticsEvent(eventName: "search_initiated", component: "SearchBar", properties: ["query": text]))
                }
                
            if !text.isEmpty {
                Button(action: {
                    trackEvent(KozmosAnalyticsEvent(eventName: "search_cleared", component: "SearchBar"))
                    text = ""
                    onClear?()
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                }
            }
        }
        .padding(EdgeInsets(top: KozmosDimensions.primitivesLayoutSpacing200, leading: KozmosDimensions.primitivesLayoutSpacing200, bottom: KozmosDimensions.primitivesLayoutSpacing200, trailing: KozmosDimensions.primitivesLayoutSpacing200))
        .background(KozmosColors.primitivesColorsBackground0)
        .cornerRadius(KozmosDimensions.semanticsRadiusContainer)
        .kozmosElevation(KozmosShadows.semanticsElevationFloating)
        .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing200)
        .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing100)
    }
}
