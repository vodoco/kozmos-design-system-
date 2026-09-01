import SwiftUI
import Figma

struct KozmosRatingConnect: FigmaConnect {
    let component = KozmosRating.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=512-39747"

    @FigmaEnum(
        "Value",
        mapping: [
            "0": 0,
            "1": 1,
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5
        ]
    )
    var value: Int = 3

    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Readonly": true
        ]
    )
    var readOnly: Bool = false

    var body: some View {
        KozmosRating(
            value: .constant(self.value),
            max: 5,
            readOnly: self.readOnly
        )
    }
}
