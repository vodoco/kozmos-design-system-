import SwiftUI
import Figma

struct KozmosMapControlButtonConnect: FigmaConnect {
    let component = KozmosMapControlButton<Image>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1785-8821"

    // The label and the icon live on the nested Button instance, because a
    // component property cannot drive a node inside a nested instance. Swift
    // Code Connect has no nested-property form, so the example carries a
    // literal and the designer edits the Button on the instance.

    @FigmaEnum(
        "Presentation",
        mapping: [
            "IconOnly": KozmosMapControlButtonPresentation.iconOnly,
            "Labelled": KozmosMapControlButtonPresentation.labelled
        ]
    )
    var presentation: KozmosMapControlButtonPresentation = .iconOnly

    // One Figma axis, two Swift concerns: a mode that stays on, and the
    // disabled attribute.
    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Pressed": true,
            "Disabled": false
        ]
    )
    var pressed: Bool = false

    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Pressed": false,
            "Disabled": true
        ]
    )
    var isDisabled: Bool = false

    var body: some View {
        KozmosMapControlButton(
            label: "Zoom in",
            presentation: self.presentation,
            pressed: self.pressed,
            isDisabled: self.isDisabled,
            action: {}
        ) {
            Image(systemName: "plus")
        }
    }
}
