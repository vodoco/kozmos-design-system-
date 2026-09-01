import SwiftUI
import Figma

struct KozmosRoutingInputGroupConnect: FigmaConnect {
    let component = KozmosRoutingInputGroup.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8315"

    @FigmaString("Point Label Text")
    var pointLabel: String = "Start"

    // Content is the length of points — two for origin and destination, three
    // once a stop is added — rather than a parameter.
    var body: some View {
        KozmosRoutingInputGroup(
            points: [
                KozmosRoutePoint(id: "origin", value: "", placeholder: self.pointLabel),
                KozmosRoutePoint(id: "destination", value: "", placeholder: "Destination")
            ],
            onPointChange: { _, _ in },
            onSwap: {}
        )
    }
}
