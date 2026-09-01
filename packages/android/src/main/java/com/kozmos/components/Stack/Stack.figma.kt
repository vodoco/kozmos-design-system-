package com.kozmos.components.stack

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1027")
class KozmosStackConnect {
    @FigmaProperty(FigmaType.Enum, "Direction")
    val direction: StackDirection = Figma.mapping(
        "Column" to StackDirection.Vertical,
        "Row" to StackDirection.Horizontal
    )

    @FigmaProperty(FigmaType.Enum, "Gap")
    val gap: String = Figma.mapping(
        "2" to "2",
        "4" to "4",
        "6" to "6"
    )

    @Composable
    fun ComponentExample() {
        KozmosStack(
            direction = direction,
            spacing = gapSpacing()
        ) {
            Text("Stack item")
            Text("Stack item")
        }
    }

    private fun gapSpacing(): Dp = when (gap) {
        "4" -> 16.dp
        "6" -> 24.dp
        else -> 8.dp
    }
}
