import SwiftUI
import Figma

struct KozmosScrollAreaConnect: FigmaConnect {
    let component = KozmosScrollArea<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=655-4973"

    @FigmaEnum(
        "Orientation",
        mapping: [
            "Vertical": KozmosScrollAreaOrientation.vertical,
            "Horizontal": KozmosScrollAreaOrientation.horizontal,
            "Both": KozmosScrollAreaOrientation.both
        ]
    )
    var orientation: KozmosScrollAreaOrientation = .vertical

    @FigmaEnum(
        "Scrollbar",
        mapping: [
            "Hidden": false,
            "Visible": true
        ]
    )
    var showsIndicators: Bool = false

    var body: some View {
        KozmosScrollArea(orientation: self.orientation, showsIndicators: self.showsIndicators) {
            AnyView(
                VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing200) {
                    Text("Scrollable content")
                    Text("Content continues")
                }
            )
        }
    }
}
