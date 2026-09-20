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
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(KozmosColors.primitivesColorsForeground500)
                // Decoration: the field says what it is. Left audible, the
                // symbol read "Search" before it.
                .accessibilityHidden(true)
            
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
                    // A 24 grey circle to see; the 44 button around it to hit.
                    Image(systemName: "xmark")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                        .frame(width: KozmosDimensions.primitivesLayoutSizing300, height: KozmosDimensions.primitivesLayoutSizing300)
                        .background(Circle().fill(KozmosColors.primitivesColorsBackground300))
                        .frame(width: 44, height: 44)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Clear search")
            }
        }
        .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing150)
        // 44 tall: a control's height, the prototype's field.
        .frame(height: 44)
        .background(KozmosColors.primitivesColorsBackground0)
        .cornerRadius(KozmosDimensions.semanticsRadiusControl)
        .kozmosElevation(KozmosShadows.semanticsElevationFloating)
        // No outer margins. A component that pads itself decides its caller's
        // layout for them, and here it meant the field could never sit the same
        // distance from the top of a sheet as it did from the sides.
    }
}
