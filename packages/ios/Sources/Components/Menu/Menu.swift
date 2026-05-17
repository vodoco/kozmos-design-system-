import SwiftUI

public struct KozmosMenu: View {
    let title: String
    let items: [String]
    let onSelect: (String) -> Void
    
    public init(title: String, items: [String], onSelect: @escaping (String) -> Void) {
        self.title = title
        self.items = items
        self.onSelect = onSelect
    }
    
    public var body: some View {
        Menu(title) {
            ForEach(items, id: \.self) { item in
                Button(action: {
                    onSelect(item)
                }) {
                    Text(item)
                }
            }
        }
    }
}
