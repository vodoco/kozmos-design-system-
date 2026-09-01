package com.kozmos.components.routesummary

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8296")
class KozmosRouteSummaryConnect {
    @FigmaProperty(FigmaType.Text, "ETA Text")
    val etaText: String = "6 min"

    @FigmaProperty(FigmaType.Text, "Distance Text")
    val distanceText: String = "320 m"

    @FigmaProperty(FigmaType.Enum, "State")
    val state: KozmosRouteSummaryState = Figma.mapping(
        "Preview" to KozmosRouteSummaryState.Preview,
        "Active" to KozmosRouteSummaryState.Active
    )

    @Composable
    fun ComponentExample() {
        KozmosRouteSummary(
            etaText = etaText,
            distanceText = distanceText,
            onEndRoute = {},
            state = state,
            onStartNavigation = {}
        )
    }
}
