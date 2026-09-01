package com.kozmos.components.passwordinput

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.components.input.KozmosInputStatus

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=412-2642")
class KozmosPasswordInputConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Password"

    @FigmaProperty(FigmaType.Text, "Placeholder Text")
    val placeholder: String = "Password"

    @FigmaProperty(FigmaType.Text, "Helper Text")
    val helperText: String = "Use at least 8 characters."

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

    @FigmaProperty(FigmaType.Enum, "Visibility")
    val defaultVisible: Boolean = Figma.mapping(
        "Hidden" to false,
        "Visible" to true
    )

    @Composable
    fun ComponentExample() {
        KozmosPasswordInput(
            value = "",
            onValueChange = {},
            label = label,
            placeholder = placeholder,
            enabled = state != "disabled",
            readOnly = state == "readonly",
            status = status,
            helperText = if (showHelperText) helperText else null,
            defaultVisible = defaultVisible
        )
    }
}
