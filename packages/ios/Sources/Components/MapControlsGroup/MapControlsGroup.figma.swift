import SwiftUI
import Figma

struct KozmosMapControlsGroupConnect: FigmaConnect {
    let component = KozmosMapControlsGroup.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8408"

    @FigmaString("Location Label Text")
    var locationLabel: String = "My location"

    @FigmaEnum(
        "LocationPresentation",
        mapping: [
            "IconOnly": KozmosMapControlButtonPresentation.iconOnly,
            "Labelled": KozmosMapControlButtonPresentation.labelled
        ]
    )
    var locationPresentation: KozmosMapControlButtonPresentation = .iconOnly

    var body: some View {
        KozmosMapControlsGroup(
            compassBearing: 0,
            onZoomIn: {},
            onZoomOut: {},
            onCompassReset: {},
            onMyLocation: {},
            locationPresentation: self.locationPresentation,
            locationLabel: self.locationLabel
        )
    }
}
