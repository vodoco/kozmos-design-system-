import SwiftUI
import Figma

struct KozmosContainerConnect: FigmaConnect {
    let component = KozmosContainer<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1034"

    @FigmaEnum(
        "Centered",
        mapping: [
            "True": "true",
            "False": "false"
        ]
    )
    var centered: String = "true"

    var body: some View {
        KozmosContainer {
            AnyView(
                Text("Container content")
                    .frame(
                        maxWidth: self.centered == "true" ? 720 : .infinity,
                        alignment: .leading
                    )
            )
        }
    }
}
