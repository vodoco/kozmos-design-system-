import Figma
import SwiftUI

struct KozmosBackdropConnect: FigmaConnect {
    let component = KozmosBackdrop.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=613-4791"

    @FigmaEnum(
        "Visibility",
        mapping: [
            "Visible": true,
            "Hidden": false
        ]
    )
    var visible: Bool = true

    var body: some View {
        KozmosBackdrop(visible: self.visible)
    }
}
