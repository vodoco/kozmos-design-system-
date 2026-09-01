import SwiftUI
import Figma

struct KozmosListConnect: FigmaConnect {
    let component = KozmosList<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=237-2482"

    @FigmaEnum(
        "Density",
        mapping: [
            "Default": "default",
            "Compact": "compact"
        ]
    )
    var density: String = "default"

    @FigmaString("Item 1 Text")
    var item1: String = "First item"

    @FigmaString("Item 2 Text")
    var item2: String = "Second item"

    @FigmaString("Item 3 Text")
    var item3: String = "Third item"

    var body: some View {
        KozmosList {
            AnyView(
                Group {
                    KozmosListItem(self.item1)
                    KozmosListItem(self.item2)
                    KozmosListItem(self.item3)
                }
            )
        }
    }
}
