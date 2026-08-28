package com.kozmos.components.mapview

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6854")
class KozmosMapViewConnect {
    // Content=Overlay is the presence of children; the canvas is renderer
    // output and attribution comes from the map adapter.
    @Composable
    fun ComponentExample() {
        KozmosMapView {}
    }
}
