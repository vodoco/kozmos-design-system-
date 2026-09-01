package com.kozmos.components.mapoverlay

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8429")
class KozmosMapOverlayConnect {
    @FigmaProperty(FigmaType.Text, "Overlay Title Text")
    val title: String = "Overlay"

    // Width is a web t-shirt scale; on Compose the host sizes the overlay with
    // modifiers, recorded as intentional in the variant analyzer.
    @Composable
    fun ComponentExample() {
        KozmosMapOverlay(position = OverlayPosition.TOP_LEFT) {}
    }
}
