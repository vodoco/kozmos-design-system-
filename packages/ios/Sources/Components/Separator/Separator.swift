import SwiftUI

public struct KozmosSeparator: View {
    let orientation: Axis
    
    public init(orientation: Axis = .horizontal) {
        self.orientation = orientation
    }
    
    public var body: some View {
        if orientation == .horizontal {
            Divider().overlay(KozmosColors.semanticsBorderSubtle)
        } else {
            Divider().overlay(KozmosColors.semanticsBorderSubtle)
                .frame(width: 1)
                .frame(maxHeight: .infinity)
        }
    }
}
