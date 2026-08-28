import SwiftUI
import Figma

struct KozmosDirectionStepConnect: FigmaConnect {
    let component = KozmosDirectionStep.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6763"

    @FigmaString("Instruction Text")
    var instruction: String = "Continue past the escalators"

    @FigmaString("Distance Text")
    var distance: String = "40 m"

    @FigmaString("Duration Text")
    var duration: String = "1 min"

    @FigmaEnum(
        "Type",
        mapping: [
            "Straight": DirectionType.straight,
            "Left": DirectionType.left,
            "Right": DirectionType.right,
            "Destination": DirectionType.destination
        ]
    )
    var type: DirectionType = .straight

    var body: some View {
        KozmosDirectionStep(
            type: self.type,
            instruction: self.instruction,
            distance: self.distance,
            duration: self.duration
        )
    }
}
