import SwiftUI
import Figma

struct KozmosMetaStripConnect: FigmaConnect {
    let component = KozmosMetaStrip.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1890-8911"

    @FigmaBoolean("Label")
    var showLabel: Bool = false

    @FigmaString("Value 1")
    var valueOne: String = "12 min"

    @FigmaString("Label 1")
    var labelOne: String = "Travel time"

    @FigmaString("Value 2")
    var valueTwo: String = "210 m"

    @FigmaString("Label 2")
    var labelTwo: String = "Distance"

    @FigmaString("Value 3")
    var valueThree: String = "4.5"

    @FigmaString("Label 3")
    var labelThree: String = "Rating"

    var body: some View {
        KozmosMetaStrip(
            "About this place",
            items: [
                KozmosMetaStripItem(label: labelOne, value: valueOne, showLabel: showLabel),
                KozmosMetaStripItem(label: labelTwo, value: valueTwo, showLabel: showLabel),
                KozmosMetaStripItem(label: labelThree, value: valueThree, showLabel: showLabel)
            ]
        )
    }
}
