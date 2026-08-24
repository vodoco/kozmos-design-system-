package com.kozmos.components.otpinput

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.components.input.KozmosInputStatus

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=475-38745")
class KozmosOTPInputConnect {
    @FigmaProperty(FigmaType.Enum, "Length")
    val length: Int = Figma.mapping(
        "4" to 4,
        "6" to 6
    )

    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Verification code"

    @FigmaProperty(FigmaType.Text, "Digit 1 Text")
    val digit1: String = "1"

    @FigmaProperty(FigmaType.Text, "Digit 2 Text")
    val digit2: String = "2"

    @FigmaProperty(FigmaType.Text, "Digit 3 Text")
    val digit3: String = "3"

    @FigmaProperty(FigmaType.Text, "Digit 4 Text")
    val digit4: String = "4"

    @FigmaProperty(FigmaType.Text, "Digit 5 Text")
    val digit5: String = "5"

    @FigmaProperty(FigmaType.Text, "Digit 6 Text")
    val digit6: String = "6"

    @FigmaProperty(FigmaType.Text, "Helper Text")
    val helperText: String = "Enter the code sent to your device."

    @FigmaProperty(FigmaType.Boolean, "Show Helper Text")
    val showHelperText: Boolean = true

    @FigmaProperty(FigmaType.Enum, "State")
    val state: String = Figma.mapping(
        "Default" to "default",
        "Focus" to "focus",
        "Disabled" to "disabled",
        "Readonly" to "readonly"
    )

    @FigmaProperty(FigmaType.Enum, "Status")
    val status: KozmosInputStatus = Figma.mapping(
        "Default" to KozmosInputStatus.Default,
        "Error" to KozmosInputStatus.Error,
        "Warning" to KozmosInputStatus.Warning,
        "Success" to KozmosInputStatus.Success
    )

    @Composable
    fun ComponentExample() {
        KozmosOTPInput(
            value = listOf(digit1, digit2, digit3, digit4, digit5, digit6)
                .joinToString("")
                .take(length),
            onValueChange = {},
            length = length,
            label = label,
            enabled = state != "disabled",
            readOnly = state == "readonly",
            status = status,
            helperText = if (showHelperText) helperText else null
        )
    }
}
