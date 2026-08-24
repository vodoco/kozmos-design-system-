import SwiftUI
import Figma

struct KozmosProgressConnect: FigmaConnect {
    let component = KozmosProgress.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-252"

    @FigmaEnum(
        "Value",
        mapping: [
            "0": "0",
            "25": "25",
            "50": "50",
            "75": "75",
            "100": "100"
        ]
    )
    var value: String = "0"

    var body: some View {
        KozmosProgress(value: self.progressValue)
    }

    private var progressValue: Double {
        (Double(self.value) ?? 0) / 100
    }
}
