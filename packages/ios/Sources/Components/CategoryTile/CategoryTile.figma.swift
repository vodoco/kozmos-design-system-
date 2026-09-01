import SwiftUI
import Figma

struct KozmosCategoryTileConnect: FigmaConnect {
    let component = KozmosCategoryTile<Image>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8039"

    @FigmaString("Label Text")
    var label: String = "Food"

    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Selected": true,
            "Disabled": false
        ]
    )
    var isSelected: Bool = false

    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Selected": false,
            "Disabled": true
        ]
    )
    var isDisabled: Bool = false

    // selected and disabled are fields of the KozmosCategoryPresentation, so
    // the State axis feeds the object rather than separate parameters.
    var body: some View {
        KozmosCategoryTile(
            category: KozmosCategoryPresentation(
                id: "food",
                label: self.label,
                selected: self.isSelected,
                disabled: self.isDisabled
            ),
            isDisabled: self.isDisabled,
            onSelect: { _ in }
        ) {
            Image(systemName: "fork.knife")
        }
    }
}
