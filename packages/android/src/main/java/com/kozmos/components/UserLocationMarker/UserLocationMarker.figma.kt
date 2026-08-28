package com.kozmos.components.userlocationmarker

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8346")
class KozmosUserLocationMarkerConnect {
    @FigmaProperty(FigmaType.Enum, "Heading")
    val showHeading: Boolean = Figma.mapping(
        "Hidden" to false,
        "Visible" to true
    )

    // heading is a bearing in degrees from the location provider; it rotates
    // the cone rather than being a Figma property.
    @Composable
    fun ComponentExample() {
        KozmosUserLocationMarker(heading = 0f, showHeading = showHeading)
    }
}
