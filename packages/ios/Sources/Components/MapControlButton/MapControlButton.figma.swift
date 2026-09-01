import SwiftUI
import Figma

struct KozmosMapControlButtonConnect: FigmaConnect {
    let component = KozmosMapControlButton<Image>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8388"

    @FigmaString("Label Text")
    var label: String = "Zoom in"

    @FigmaEnum(
        "Presentation",
        mapping: [
            "IconOnly": KozmosMapControlButtonPresentation.iconOnly,
            "Labelled": KozmosMapControlButtonPresentation.labelled
        ]
    )
    var presentation: KozmosMapControlButtonPresentation = .iconOnly

    var body: some View {
        KozmosMapControlButton(
            label: self.label,
            presentation: self.presentation,
            action: {}
        ) {
            Image(systemName: "plus")
        }
    }
}
