package com.kozmos.components.fieldwrapper

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.components.input.KozmosInput
import com.kozmos.components.input.KozmosInputStatus

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=431-5810")
class KozmosFieldWrapperConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Label"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Use clear supporting guidance when the field needs it."

    @FigmaProperty(FigmaType.Text, "Optional Text")
    val optionalText: String = "Optional"

    @FigmaProperty(FigmaType.Text, "Helper Text")
    val helperText: String = "Helper text"

    @FigmaProperty(FigmaType.Enum, "Content")
    val content: String = Figma.mapping(
        "Basic" to "basic",
        "Description" to "description",
        "Helper" to "helper",
        "Full" to "full"
    )

    @FigmaProperty(FigmaType.Enum, "Status")
    val status: KozmosInputStatus = Figma.mapping(
        "Default" to KozmosInputStatus.Default,
        "Error" to KozmosInputStatus.Error,
        "Warning" to KozmosInputStatus.Warning,
        "Success" to KozmosInputStatus.Success
    )

    @FigmaProperty(FigmaType.Enum, "Required")
    val required: Boolean = Figma.mapping(
        "False" to false,
        "True" to true
    )

    @Composable
    fun ComponentExample() {
        KozmosFieldWrapper(
            label = label,
            description = if (content == "description" || content == "full") description else null,
            optionalText = if (required) null else optionalText,
            required = required,
            status = status,
            helperText = if (content == "helper" || content == "full") helperText else null
        ) {
            KozmosInput(
                value = "",
                onValueChange = {},
                placeholder = "Placeholder"
            )
        }
    }
}
