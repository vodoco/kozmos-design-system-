import SwiftUI
import Figma

struct KozmosSkeletonConnect: FigmaConnect {
    let component = KozmosSkeleton.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1062"

    @FigmaEnum(
        "Shape",
        mapping: [
            "Line": "line",
            "Block": "block",
            "Circle": "circle"
        ]
    )
    var shape: String = "line"

    @ViewBuilder
    var body: some View {
        switch self.shape {
        case "block":
            KozmosSkeleton()
                .frame(width: 256, height: 80)
        case "circle":
            KozmosSkeleton()
                .frame(width: 40, height: 40)
                .clipShape(Circle())
        default:
            KozmosSkeleton()
                .frame(width: 160, height: 16)
        }
    }
}
