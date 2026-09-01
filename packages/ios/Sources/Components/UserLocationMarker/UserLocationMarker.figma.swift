import SwiftUI
import Figma

struct KozmosUserLocationMarkerConnect: FigmaConnect {
    let component = KozmosUserLocationMarker.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8346"

    @FigmaEnum(
        "Heading",
        mapping: [
            "Hidden": false,
            "Visible": true
        ]
    )
    var showHeading: Bool = false

    // heading is a bearing in degrees from the location provider; it rotates
    // the cone rather than being a Figma property.
    var body: some View {
        KozmosUserLocationMarker(heading: 0, showHeading: self.showHeading)
    }
}
