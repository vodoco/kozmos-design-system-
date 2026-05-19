import SwiftUI
import Figma

struct KozmosPopoverConnect: FigmaConnect {
    let component = KozmosPopover<EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8118"

    @FigmaEnum(
        "Side",
        mapping: [
            "Top": KozmosPopoverSide.top,
            "Right": KozmosPopoverSide.right,
            "Bottom": KozmosPopoverSide.bottom,
            "Left": KozmosPopoverSide.left
        ]
    )
    var side: KozmosPopoverSide = .top

    @FigmaString("Title Text")
    var title: String = "Transit filters"

    @FigmaString("Description Text")
    var description: String = "Choose which route details are visible."

    var body: some View {
        Button("Open popover") {}
            .kozmosPopover(
                isPresented: .constant(true),
                side: self.side,
                title: self.title,
                description: self.description
            )
    }
}
