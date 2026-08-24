package com.kozmos.components.scrollarea

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=655-4973")
class KozmosScrollAreaConnect {
    @FigmaProperty(FigmaType.Enum, "Orientation")
    val orientation: KozmosScrollAreaOrientation = Figma.mapping(
        "Vertical" to KozmosScrollAreaOrientation.Vertical,
        "Horizontal" to KozmosScrollAreaOrientation.Horizontal,
        "Both" to KozmosScrollAreaOrientation.Both
    )

    @Composable
    fun ComponentExample() {
        KozmosScrollArea(orientation = orientation) {
            Text("Scrollable content")
        }
    }
}
