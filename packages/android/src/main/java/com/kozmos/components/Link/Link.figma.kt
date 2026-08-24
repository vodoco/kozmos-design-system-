package com.kozmos.components.link

import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1385")
class KozmosLinkConnect {
    @FigmaProperty(FigmaType.Text, "Link Text")
    val label: String = "Docs"

    @Composable
    fun ComponentExample() {
        KozmosLink(
            text = label,
            onClick = {}
        )
    }
}
