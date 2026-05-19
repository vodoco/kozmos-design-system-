package com.kozmos.components.popover

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8118")
class KozmosPopoverConnect {
    @FigmaProperty(FigmaType.Enum, "Side")
    val side: KozmosPopoverSide = Figma.mapping(
        "Top" to KozmosPopoverSide.Top,
        "Right" to KozmosPopoverSide.Right,
        "Bottom" to KozmosPopoverSide.Bottom,
        "Left" to KozmosPopoverSide.Left
    )

    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Transit filters"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Choose which route details are visible."

    @Composable
    fun ComponentExample() {
        KozmosPopover(
            isExpanded = true,
            onDismissRequest = {},
            title = title,
            description = description,
            side = side
        )
    }
}
