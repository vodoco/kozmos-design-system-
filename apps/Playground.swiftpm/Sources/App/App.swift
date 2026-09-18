import SwiftUI
import Kozmos

@main
struct PlaygroundApp: App {
    var body: some Scene {
        WindowGroup {
            KozmosThemeProvider {
                TabView {
                    WayfindingScreen()
                        .tabItem { Label("Map", systemImage: "map") }
                    POIExamplesScreen()
                        .tabItem { Label("POI examples", systemImage: "rectangle.stack") }
                }
            }
        }
    }
}
