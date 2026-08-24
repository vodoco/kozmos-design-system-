package com.kozmos.components.separator

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1393")
class KozmosSeparatorConnect {
    @FigmaProperty(FigmaType.Enum, "Orientation")
    val orientation: SeparatorOrientation = Figma.mapping(
        "Horizontal" to SeparatorOrientation.Horizontal,
        "Vertical" to SeparatorOrientation.Vertical
    )

    @Composable
    fun ComponentExample() {
        KozmosSeparator(orientation = orientation)
    }
}
