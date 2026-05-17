import SwiftUI

public struct KozmosSplitButton: View {
    let label: String
    let mainAction: () -> Void
    let menuItems: [(String, () -> Void)]
    
    public init(label: String, mainAction: @escaping () -> Void, menuItems: [(String, () -> Void)] = []) {
        self.label = label
        self.mainAction = mainAction
        self.menuItems = menuItems
    }
    
    public var body: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing25) {
            Button(action: mainAction) {
                Text(label)
                    .padding()
                    .background(KozmosColors.primitivesColorsTheme500)
                    .foregroundColor(KozmosColors.primitivesColorsBackground0)
            }
            .clipShape(UnevenRoundedRectangle(topLeadingRadius: KozmosDimensions.primitivesLayoutRadius100, bottomLeadingRadius: KozmosDimensions.primitivesLayoutRadius100, bottomTrailingRadius: KozmosDimensions.primitivesLayoutRadius0, topTrailingRadius: KozmosDimensions.primitivesLayoutRadius0))
            
            Menu {
                ForEach(menuItems.indices, id: \.self) { index in
                    Button(action: menuItems[index].1) {
                        Text(menuItems[index].0)
                    }
                }
            } label: {
                Image(systemName: "chevron.down")
                    .padding()
                    .background(KozmosColors.primitivesColorsTheme500)
                    .foregroundColor(KozmosColors.primitivesColorsBackground0)
            }
            .clipShape(UnevenRoundedRectangle(topLeadingRadius: KozmosDimensions.primitivesLayoutRadius0, bottomLeadingRadius: KozmosDimensions.primitivesLayoutRadius0, bottomTrailingRadius: KozmosDimensions.primitivesLayoutRadius100, topTrailingRadius: KozmosDimensions.primitivesLayoutRadius100))
        }
    }
}
