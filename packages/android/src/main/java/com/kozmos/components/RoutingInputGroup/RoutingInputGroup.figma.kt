package com.kozmos.components.routinginputgroup

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8315")
class KozmosRoutingInputGroupConnect {
    @FigmaProperty(FigmaType.Text, "Point Label Text")
    val pointLabel: String = "Start"

    @Composable
    fun ComponentExample() {
        KozmosRoutingInputGroup(
            points = listOf(
                KozmosRoutePoint(id = "origin", value = "", placeholder = pointLabel),
                KozmosRoutePoint(id = "destination", value = "", placeholder = "Destination")
            ),
            onPointChange = { _, _ -> },
            onSwap = {}
        )
    }
}
