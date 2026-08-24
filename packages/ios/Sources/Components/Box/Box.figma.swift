import SwiftUI
import Figma

struct KozmosBoxConnect: FigmaConnect {
    let component = Box<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1002"

    @FigmaEnum(
        "Surface",
        mapping: [
            "Transparent": "transparent",
            "Surface": "surface",
            "Outlined": "outlined"
        ]
    )
    var surface: String = "transparent"

    var body: some View {
        Box {
            self.content
        }
    }

    private var content: AnyView {
        switch self.surface {
        case "surface":
            return AnyView(
                Text("Content")
                    .padding()
                    .background(KozmosColors.primitivesColorsBackground0)
                    .cornerRadius(KozmosDimensions.primitivesLayoutRadius100)
            )
        case "outlined":
            return AnyView(
                Text("Content")
                    .padding()
                    .background(KozmosColors.primitivesColorsBackground0)
                    .overlay(
                        RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100)
                            .stroke(KozmosColors.primitivesColorsBackground300, lineWidth: 1)
                    )
            )
        default:
            return AnyView(Text("Content"))
        }
    }
}
