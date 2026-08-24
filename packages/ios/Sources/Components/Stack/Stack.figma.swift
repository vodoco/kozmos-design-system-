import SwiftUI
import Figma

struct KozmosStackConnect: FigmaConnect {
    let component = Stack<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1027"

    @FigmaEnum(
        "Direction",
        mapping: [
            "Column": StackDirection.vertical,
            "Row": StackDirection.horizontal
        ]
    )
    var direction: StackDirection = .vertical

    @FigmaEnum(
        "Gap",
        mapping: [
            "2": "2",
            "4": "4",
            "6": "6"
        ]
    )
    var gap: String = "2"

    var body: some View {
        Stack(direction: self.direction, spacing: self.spacing) {
            AnyView(Text("Stack item"))
        }
    }

    private var spacing: CGFloat {
        switch self.gap {
        case "4": return 16
        case "6": return 24
        default: return 8
        }
    }
}
