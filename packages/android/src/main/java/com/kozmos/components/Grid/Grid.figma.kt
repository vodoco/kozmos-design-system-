package com.kozmos.components.grid

import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=359-1574")
class KozmosGridConnect {
    @FigmaProperty(FigmaType.Enum, "Columns")
    val columns: Int = Figma.mapping(
        "1" to 1,
        "2" to 2,
        "3" to 3,
        "4" to 4
    )

    @FigmaProperty(FigmaType.Enum, "Gap")
    val gap: Int = Figma.mapping(
        "2" to 8,
        "4" to 16,
        "6" to 24
    )

    @Composable
    fun ComponentExample() {
        KozmosGrid(
            cols = columns,
            spacing = gap.dp
        ) {
            items(listOf("One", "Two", "Three", "Four")) { label ->
                Text(label)
            }
        }
    }
}
