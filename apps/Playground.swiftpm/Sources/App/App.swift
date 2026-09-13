import SwiftUI
import Kozmos

@main
struct PlaygroundApp: App {
    var body: some Scene {
        WindowGroup {
            KozmosThemeProvider {
                WayfindingScreen()
            }
        }
    }
}
