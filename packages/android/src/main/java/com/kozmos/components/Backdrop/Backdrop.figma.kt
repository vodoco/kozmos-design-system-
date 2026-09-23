package com.kozmos.components.backdrop

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=613-4791")
class KozmosBackdropConnect {
    @FigmaProperty(FigmaType.Enum, "Visibility")
    val visible: Boolean = Figma.mapping(
        "Visible" to true,
        "Hidden" to false
    )

    @Composable
    fun ComponentExample() {
        KozmosBackdrop(visible = visible)
    }
}
