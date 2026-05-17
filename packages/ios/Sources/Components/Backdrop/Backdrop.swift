import SwiftUI

public struct KozmosBackdrop: View {
    public var visible: Bool
    public var onTap: () -> Void
    
    public init(visible: Bool = true, onTap: @escaping () -> Void = {}) {
        self.visible = visible
        self.onTap = onTap
    }
    
    public var body: some View {
        if visible {
            KozmosColors.primitivesColorsBackground900.opacity(0.4)
                .edgesIgnoringSafeArea(.all)
                .onTapGesture {
                    onTap()
                }
        }
    }
}
