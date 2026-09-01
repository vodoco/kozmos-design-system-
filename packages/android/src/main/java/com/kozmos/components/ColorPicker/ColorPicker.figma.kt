package com.kozmos.components.colorpicker

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.components.input.KozmosInputStatus

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=451-13566")
class KozmosColorPickerConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Brand color"

    @FigmaProperty(FigmaType.Text, "Value Text")
    val value: String = "#135BEC"

    @FigmaProperty(FigmaType.Text, "Helper Text")
    val helperText: String = "Choose a color."

    @FigmaProperty(FigmaType.Boolean, "Show Helper Text")
    val showHelperText: Boolean = false

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

    @FigmaProperty(FigmaType.Enum, "Content")
    val defaultExpanded: Boolean = Figma.mapping(
        "Closed" to false,
        "Open" to true
    )

    @FigmaProperty(FigmaType.Enum, "Format")
    val format: KozmosColorPickerFormat = Figma.mapping(
        "HEX" to KozmosColorPickerFormat.Hex,
        "RGB" to KozmosColorPickerFormat.Rgb,
        "HSL" to KozmosColorPickerFormat.Hsl
    )

    @Composable
    fun ComponentExample() {
        KozmosColorPicker(
            value = value,
            onValueChange = {},
            label = label,
            helperText = if (showHelperText) helperText else null,
            // Figma no longer carries this. The palette name is rendered by
            // the nested Select instance's own hint text, and a component
            // property cannot drive text inside a nested instance.
            paletteLabel = "Kozmos Design System 2.0",
            format = format,
            defaultExpanded = defaultExpanded,
            enabled = state != "disabled",
            readOnly = state == "readonly",
            status = status
        )
    }
}
