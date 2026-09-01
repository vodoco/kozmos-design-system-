import SwiftUI
import Figma

struct KozmosMapViewConnect: FigmaConnect {
    let component = KozmosMapView<EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6854"

    // Content=Overlay is the presence of children; the canvas itself is
    // renderer output and attribution comes from the map adapter.
    var body: some View {
        KozmosMapView {
            EmptyView()
        }
    }
}
