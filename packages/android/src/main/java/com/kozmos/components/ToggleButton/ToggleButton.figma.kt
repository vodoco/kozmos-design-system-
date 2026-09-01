package com.kozmos.components.togglebutton

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=383-2019")
class KozmosToggleButtonConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Toggle"

    @FigmaProperty(FigmaType.Enum, "Variant")
    val variant: KozmosToggleButtonVariant = Figma.mapping(
        "Default" to KozmosToggleButtonVariant.Default,
        "Outline" to KozmosToggleButtonVariant.Outline
    )

    @FigmaProperty(FigmaType.Enum, "Size")
    val size: KozmosToggleButtonSize = Figma.mapping(
        "Small" to KozmosToggleButtonSize.Small,
        "Default" to KozmosToggleButtonSize.Default,
        "Large" to KozmosToggleButtonSize.Large
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val checked: Boolean = Figma.mapping(
        "Default" to false,
        "Pressed" to true,
        "Disabled" to false,
        "Focus" to false
    )

    @Composable
    fun ComponentExample() {
        KozmosToggleButton(
            checked = checked,
            onCheckedChange = {},
            label = label,
            variant = variant,
            size = size
        )
    }
}
