package com.kozmos.components.list

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=237-2482")
class KozmosListConnect {
    @FigmaProperty(FigmaType.Enum, "Density")
    val density: String = Figma.mapping(
        "Default" to "default",
        "Compact" to "compact"
    )

    @FigmaProperty(FigmaType.Text, "Item 1 Text")
    val item1: String = "First item"

    @FigmaProperty(FigmaType.Text, "Item 2 Text")
    val item2: String = "Second item"

    @FigmaProperty(FigmaType.Text, "Item 3 Text")
    val item3: String = "Third item"

    @Composable
    fun ComponentExample() {
        KozmosList {
            KozmosListItem(text = item1)
            KozmosListItem(text = item2)
            KozmosListItem(text = item3, showDivider = false)
        }
    }
}
