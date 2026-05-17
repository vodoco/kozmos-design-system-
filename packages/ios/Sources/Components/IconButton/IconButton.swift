import SwiftUI

public struct KozmosIconButton: View {
    let iconName: String
    let action: () -> Void
    
    public init(iconName: String, action: @escaping () -> Void) {
        self.iconName = iconName
        self.action = action
    }
    
    public var body: some View {
        Button(action: action) {
            Image(systemName: iconName)
                .font(.title3)
                .foregroundColor(KozmosColors.primitivesColorsForeground100)
                .padding(KozmosDimensions.primitivesLayoutSpacing100)
                .background(KozmosColors.primitivesColorsBackground500.opacity(0.1))
                .clipShape(Circle())
        }
    }
}
