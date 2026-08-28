package com.kozmos.components.poicard

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6879")
class KozmosPOICardConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Kozmos Cafe"

    @FigmaProperty(FigmaType.Text, "Subtitle Text")
    val category: String = "Cafe"

    @Composable
    fun ComponentExample() {
        KozmosPOICard(title = title, category = category, onClose = {})
    }
}
