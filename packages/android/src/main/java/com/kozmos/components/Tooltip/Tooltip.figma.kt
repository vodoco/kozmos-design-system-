package com.kozmos.components.tooltip

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=91-4672")
class KozmosTooltipConnect {
    @FigmaProperty(FigmaType.Text, "Content Text")
    val contentText: String = "Tooltip content"

    @FigmaProperty(FigmaType.Enum, "Side")
    val side: KozmosTooltipSide = Figma.mapping(
        "Top" to KozmosTooltipSide.Top,
        "Right" to KozmosTooltipSide.Right,
        "Bottom" to KozmosTooltipSide.Bottom,
        "Left" to KozmosTooltipSide.Left
    )

    @Composable
    fun ComponentExample() {
        KozmosTooltip(
            tooltip = contentText,
            side = side,
            visible = true
        ) {
            Text("Hover me")
        }
    }
}
