import SwiftUI
import Figma

struct KozmosSeparatorConnect: FigmaConnect {
    let component = KozmosSeparator.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1393"

    @FigmaEnum(
        "Orientation",
        mapping: [
            "Horizontal": Axis.horizontal,
            "Vertical": Axis.vertical
        ]
    )
    var orientation: Axis = .horizontal

    var body: some View {
        KozmosSeparator(orientation: self.orientation)
    }
}
