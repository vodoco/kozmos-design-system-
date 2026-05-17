import SwiftUI

public struct KozmosSegmentedControl: View {
    @Binding var selection: Int
    let items: [String]
    
    public init(selection: Binding<Int>, items: [String]) {
        self._selection = selection
        self.items = items
    }
    
    public var body: some View {
        Picker("", selection: $selection) {
            ForEach(items.indices, id: \.self) { index in
                Text(items[index]).tag(index)
            }
        }
        .pickerStyle(.segmented) // Native iOS segmented control
    }
}
