import SwiftUI
import Figma

struct KozmosTooltipConnect: FigmaConnect {
    let component = KozmosTooltip.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=91-4672"

    @FigmaString("Content Text")
    var content: String = "Tooltip content"

    @FigmaEnum(
        "Side",
        mapping: [
            "Top": KozmosTooltipSide.top,
            "Right": KozmosTooltipSide.right,
            "Bottom": KozmosTooltipSide.bottom,
            "Left": KozmosTooltipSide.left
        ]
    )
    var side: KozmosTooltipSide = .top

    var body: some View {
        Text("Hover me")
            .kozmosTooltip(self.content, side: self.side)
    }
}
