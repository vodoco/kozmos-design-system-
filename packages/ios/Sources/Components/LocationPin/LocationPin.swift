import SwiftUI

public struct KozmosLocationPin: View {
    let color: Color
    
    public init(color: Color = KozmosColors.semanticsDataRed) {
        self.color = color
    }
    
    public var body: some View {
        Image(systemName: "mappin.circle.fill")
            .resizable()
            .frame(width: KozmosDimensions.primitivesLayoutSizing400, height: KozmosDimensions.primitivesLayoutSizing400)
            .foregroundColor(color)
            .background(Circle().fill(KozmosColors.primitivesColorsBackground0))
            .shadow(radius: 2)
    }
}
