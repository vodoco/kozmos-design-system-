package com.kozmos.components.progress

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-252")
class KozmosProgressConnect {
    @FigmaProperty(FigmaType.Enum, "Value")
    val value: String = Figma.mapping(
        "0" to "0",
        "25" to "25",
        "50" to "50",
        "75" to "75",
        "100" to "100"
    )

    @Composable
    fun ComponentExample() {
        KozmosProgress(progress = (value.toFloatOrNull() ?: 0f) / 100f)
    }
}
