import SwiftUI

public struct KozmosBottomNavigation: View {
    @Binding var selection: Int
    let items: [(icon: String, title: String)]
    let onSelect: (Int) -> Void
    
    public init(
        selection: Binding<Int>,
        items: [(icon: String, title: String)],
        onSelect: @escaping (Int) -> Void = { _ in }
    ) {
        self._selection = selection
        self.items = items
        self.onSelect = onSelect
    }
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing0) {
            ForEach(items.indices, id: \.self) { index in
                KozmosNavigationItem(
                    label: items[index].title,
                    placement: .rail,
                    density: .compact,
                    content: .iconLabel,
                    selected: selection == index,
                    action: {
                        selection = index
                        onSelect(index)
                    },
                    icon: {
                        Image(systemName: items[index].icon)
                    }
                )
                .frame(maxWidth: .infinity)
                .accessibilityAddTraits(selection == index ? .isSelected : [])
            }
        }
        .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing100)
        .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing50)
        .background(KozmosColors.primitivesColorsBackground0)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(KozmosColors.primitivesColorsBackground300),
            alignment: .top
        )
    }
}
