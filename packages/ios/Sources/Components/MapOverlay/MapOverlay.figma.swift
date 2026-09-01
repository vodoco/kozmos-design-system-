import SwiftUI
import Figma

struct KozmosMapOverlayConnect: FigmaConnect {
    let component = KozmosMapOverlay<Text>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8429"

    @FigmaString("Overlay Title Text")
    var title: String = "Overlay"

    // Width is a web t-shirt scale; on native the host sizes the overlay with
    // frame modifiers, which is recorded as intentional in the variant
    // analyzer. position is renderer placement.
    var body: some View {
        KozmosMapOverlay(position: .topLeft) {
            Text(self.title)
        }
    }
}
