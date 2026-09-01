package com.kozmos.components.categorytile

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.contracts.KozmosCategoryPresentation

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8039")
class KozmosCategoryTileConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Food"

    @FigmaProperty(FigmaType.Enum, "State")
    val selected: Boolean = Figma.mapping(
        "Default" to false,
        "Selected" to true,
        "Disabled" to false
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val enabled: Boolean = Figma.mapping(
        "Default" to true,
        "Selected" to true,
        "Disabled" to false
    )

    @Composable
    fun ComponentExample() {
        KozmosCategoryTile(
            category = KozmosCategoryPresentation(
                id = "food",
                label = label,
                selected = selected
            ),
            onSelect = {},
            enabled = enabled
        )
    }
}
