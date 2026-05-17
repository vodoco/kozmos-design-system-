import SwiftUI

public struct KozmosTooltip: ViewModifier {
    let text: String
    
    public func body(content: Content) -> some View {
        content
            .overlay(
                GeometryReader { geometry in
                    ZStack {
                        // This is a simplified tooltip simulation for iOS
                        // Real tooltips on iOS are complex, often involving overlays or .help() on macOS
                        // SwiftUI doesn't have a native "Touch and Hold" tooltip for generic views easily without interaction hacking
                        // For parity, we use .help which works on iPad/Mac and Accessibility
                    }
                }
            )
            .help(text)
    }
}

public extension View {
    func kozmosTooltip(_ text: String) -> some View {
        self.modifier(KozmosTooltip(text: text))
    }
}
