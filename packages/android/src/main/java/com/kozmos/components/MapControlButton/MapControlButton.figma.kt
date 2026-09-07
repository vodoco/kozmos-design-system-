package com.kozmos.components.mapcontrolbutton

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1785-8821")
class KozmosMapControlButtonConnect {
    // The label and the icon live on the nested Button instance, because a
    // component property cannot drive a node inside a nested instance. Compose
    // Code Connect has no nested-property form, so the example carries a
    // literal and the designer edits the Button on the instance.

    @FigmaProperty(FigmaType.Enum, "Presentation")
    val presentation: KozmosMapControlButtonPresentation = Figma.mapping(
        "IconOnly" to KozmosMapControlButtonPresentation.IconOnly,
        "Labelled" to KozmosMapControlButtonPresentation.Labelled
    )

    // One Figma axis, two Compose concerns: a mode that stays on, and whether
    // the control accepts input at all.
    @FigmaProperty(FigmaType.Enum, "State")
    val pressed: Boolean = Figma.mapping(
        "Default" to false,
        "Pressed" to true,
        "Disabled" to false
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val enabled: Boolean = Figma.mapping(
        "Default" to true,
        "Pressed" to true,
        "Disabled" to false
    )

    @Composable
    fun ComponentExample() {
        KozmosMapControlButton(
            label = "Zoom in",
            onClick = {},
            presentation = presentation,
            pressed = pressed,
            enabled = enabled
        )
    }
}
