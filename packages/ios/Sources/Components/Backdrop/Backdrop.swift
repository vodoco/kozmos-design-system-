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
            // The scrim role, as React, Figma, the dialog and the drawer draw
            // it: black at half, in both themes. It was background/900 at 40 %
            // until 2026-09-22, which turns light in dark mode and lifted the
            // page instead of dimming it.
            KozmosColors.semanticsOverlayScrim
                .edgesIgnoringSafeArea(.all)
                .onTapGesture {
                    onTap()
                }
        }
    }
}
