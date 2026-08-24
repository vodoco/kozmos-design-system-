package com.kozmos.components.stepper

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=512-39614")
class KozmosStepperConnect {
    @FigmaProperty(FigmaType.Enum, "Count")
    val count: Int = Figma.mapping(
        "2" to 2,
        "3" to 3,
        "4" to 4
    )

    @FigmaProperty(FigmaType.Enum, "Current")
    val currentStep: Int = Figma.mapping(
        "1" to 0,
        "2" to 1,
        "3" to 2,
        "4" to 3
    )

    @FigmaProperty(FigmaType.Text, "Step 1 Text")
    val step1Text: String = "Start"

    @FigmaProperty(FigmaType.Text, "Step 2 Text")
    val step2Text: String = "Review"

    @FigmaProperty(FigmaType.Text, "Step 3 Text")
    val step3Text: String = "Confirm"

    @FigmaProperty(FigmaType.Text, "Step 4 Text")
    val step4Text: String = "Done"

    @Composable
    fun ComponentExample() {
        KozmosStepper(
            steps = listOf(step1Text, step2Text, step3Text, step4Text).take(count),
            currentStep = currentStep.coerceAtMost(count - 1)
        )
    }
}
