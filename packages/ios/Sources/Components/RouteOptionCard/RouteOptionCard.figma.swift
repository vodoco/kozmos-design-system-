import SwiftUI
import Figma

struct KozmosRouteOptionCardConnect: FigmaConnect {
    let component = KozmosRouteOptionCard<Image>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8197"

    @FigmaString("Option Label Text")
    var label: String = "Step-free route"

    @FigmaEnum(
        "State",
        mapping: ["Default": false, "Selected": true, "Warning": false, "Unavailable": false]
    )
    var selected: Bool = false

    @FigmaEnum(
        "State",
        mapping: ["Default": true, "Selected": true, "Warning": true, "Unavailable": false]
    )
    var available: Bool = true

    var body: some View {
        KozmosRouteOptionCard(
            option: KozmosRouteOptionPresentation(
                id: "step-free",
                label: self.label,
                durationSeconds: 360,
                durationLabel: "6 min",
                distanceMetres: 320,
                distanceLabel: "320 m",
                preference: .stepFree,
                selected: self.selected,
                available: self.available
            ),
            onSelect: { _ in }
        ) {
            Image(systemName: "figure.roll")
        }
    }
}
