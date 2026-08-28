package com.kozmos.components.mapcontrolsgroup

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.components.mapcontrolbutton.KozmosMapControlButtonPresentation

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8408")
class KozmosMapControlsGroupConnect {
    @FigmaProperty(FigmaType.Text, "Location Label Text")
    val locationLabel: String = "My location"

    @FigmaProperty(FigmaType.Enum, "LocationPresentation")
    val locationPresentation: KozmosMapControlButtonPresentation = Figma.mapping(
        "IconOnly" to KozmosMapControlButtonPresentation.IconOnly,
        "Labelled" to KozmosMapControlButtonPresentation.Labelled
    )

    @Composable
    fun ComponentExample() {
        KozmosMapControlsGroup(
            compassBearing = 0f,
            onZoomIn = {},
            onZoomOut = {},
            onCompassReset = {},
            onMyLocation = {},
            locationPresentation = locationPresentation,
            locationLabel = locationLabel
        )
    }
}
