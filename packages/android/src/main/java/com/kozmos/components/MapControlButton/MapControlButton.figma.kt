package com.kozmos.components.mapcontrolbutton

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8388")
class KozmosMapControlButtonConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Zoom in"

    @FigmaProperty(FigmaType.Enum, "Presentation")
    val presentation: KozmosMapControlButtonPresentation = Figma.mapping(
        "IconOnly" to KozmosMapControlButtonPresentation.IconOnly,
        "Labelled" to KozmosMapControlButtonPresentation.Labelled
    )

    @Composable
    fun ComponentExample() {
        KozmosMapControlButton(
            label = label,
            onClick = {},
            presentation = presentation
        )
    }
}
