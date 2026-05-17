import SwiftUI

public struct KozmosFloorSelector: View {
    let floors: [String]
    @Binding var selectedFloor: String
    @Environment(\.kozmosAnalytics) var trackEvent
    
    public init(floors: [String], selectedFloor: Binding<String>) {
        self.floors = floors
        self._selectedFloor = selectedFloor
    }
    
    public var body: some View {
        VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            ForEach(floors, id: \.self) { floor in
                Button(action: {
                    trackEvent(KozmosAnalyticsEvent(eventName: "floor_selected", component: "FloorSelector", properties: ["floor": floor]))
                    withAnimation {
                        selectedFloor = floor
                    }
                }) {
                    Text(floor)
                        .font(.subheadline)
                        .bold()
                        .frame(width: KozmosDimensions.primitivesLayoutSizing500, height: KozmosDimensions.primitivesLayoutSizing500)
                        .background(selectedFloor == floor ? KozmosColors.primitivesColorsTheme500 : Color.clear)
                        .foregroundColor(selectedFloor == floor ? KozmosColors.primitivesColorsBackground0 : KozmosColors.primitivesColorsForeground100)
                        .cornerRadius(KozmosDimensions.primitivesLayoutRadius300)
                }
            }
        }
        .padding(KozmosDimensions.primitivesLayoutSpacing75)
        .background(KozmosColors.primitivesColorsBackground0.opacity(0.9))
        .cornerRadius(KozmosDimensions.primitivesLayoutRadius300)
        .shadow(color: KozmosColors.primitivesColorsForeground900.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}
