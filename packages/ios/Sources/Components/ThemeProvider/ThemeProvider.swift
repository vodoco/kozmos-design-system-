import SwiftUI

public class ThemeManager: ObservableObject {
    @AppStorage("selectedTheme") public var selectedTheme: String = "system"
    
    public init() {}
}

public struct KozmosThemeProvider<Content: View>: View {
    @StateObject private var themeManager = ThemeManager()
    let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        content
            .environmentObject(themeManager)
            .preferredColorScheme(scheme)
    }
    
    var scheme: ColorScheme? {
        switch themeManager.selectedTheme {
        case "light": return .light
        case "dark": return .dark
        default: return nil
        }
    }
}
