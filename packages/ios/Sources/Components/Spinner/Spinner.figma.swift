import SwiftUI
import Figma

struct KozmosSpinnerConnect: FigmaConnect {
    let component = KozmosSpinner.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-261"

    @FigmaEnum(
        "Size",
        mapping: [
            "Small": "small",
            "Medium": "medium",
            "Large": "large",
            "XLarge": "xlarge"
        ]
    )
    var size: String = "medium"

    var body: some View {
        KozmosSpinner()
            .frame(width: self.dimension, height: self.dimension)
    }

    private var dimension: CGFloat {
        switch self.size {
        case "small": return 16
        case "large": return 32
        case "xlarge": return 48
        default: return 24
        }
    }
}
