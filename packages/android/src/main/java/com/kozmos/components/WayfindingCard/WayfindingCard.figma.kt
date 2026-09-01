package com.kozmos.components.wayfindingcard

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6893")
class KozmosWayfindingCardConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Navigation"

    @Composable
    fun ComponentExample() {
        KozmosWayfindingCard(title = title, onClose = {}) {}
    }
}
