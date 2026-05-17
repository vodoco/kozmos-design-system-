import SwiftUI

public struct KozmosBottomNavigation: View {
    @Binding var selection: Int
    let items: [(icon: String, title: String)]
    
    public init(selection: Binding<Int>, items: [(icon: String, title: String)]) {
        self._selection = selection
        self.items = items
    }
    
    public var body: some View {
        TabView(selection: $selection) {
            ForEach(0..<items.count, id: \.self) { index in
                Text(items[index].title) // Placeholder for content
                    .tabItem {
                        Image(systemName: items[index].icon)
                        Text(items[index].title)
                    }
                    .tag(index)
            }
        }
        .accentColor(KozmosColors.primitivesColorsTheme500)
    }
}
