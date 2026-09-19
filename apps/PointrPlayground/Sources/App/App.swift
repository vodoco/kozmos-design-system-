import SwiftUI
import Kozmos

@main
struct PointrQAApp: App {
    var body: some Scene {
        WindowGroup { KozmosThemeProvider { SDKMapScreen() } }
    }
}
