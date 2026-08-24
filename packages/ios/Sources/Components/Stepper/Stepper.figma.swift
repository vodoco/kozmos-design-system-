import SwiftUI
import Figma

struct KozmosStepperConnect: FigmaConnect {
    let component = KozmosStepper.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=512-39614"

    @FigmaEnum(
        "Count",
        mapping: [
            "2": 2,
            "3": 3,
            "4": 4
        ]
    )
    var count: Int = 4

    @FigmaEnum(
        "Current",
        mapping: [
            "1": 0,
            "2": 1,
            "3": 2,
            "4": 3
        ]
    )
    var currentStep: Int = 0

    @FigmaString("Step 1 Text")
    var step1Text: String = "Start"

    @FigmaString("Step 2 Text")
    var step2Text: String = "Review"

    @FigmaString("Step 3 Text")
    var step3Text: String = "Confirm"

    @FigmaString("Step 4 Text")
    var step4Text: String = "Done"

    private var stepLabels: [String] {
        Array([self.step1Text, self.step2Text, self.step3Text, self.step4Text].prefix(self.count))
    }

    var body: some View {
        KozmosStepper(
            steps: self.stepLabels,
            currentStep: min(self.currentStep, self.count - 1)
        )
    }
}
