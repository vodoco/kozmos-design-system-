package com.kozmos.components.routepreviewpanel

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.contracts.KozmosRouteReadiness

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8277")
class KozmosRoutePreviewPanelConnect {
    @FigmaProperty(FigmaType.Text, "Destination Text")
    val destinationName: String = "Kozmos Cafe"

    @FigmaProperty(FigmaType.Enum, "Status")
    val status: KozmosRouteReadiness = Figma.mapping(
        "Idle" to KozmosRouteReadiness.Idle,
        "Calculating" to KozmosRouteReadiness.Calculating,
        "Ready" to KozmosRouteReadiness.Ready,
        "NoRoute" to KozmosRouteReadiness.NoRoute,
        "Error" to KozmosRouteReadiness.Error
    )

    @Composable
    fun ComponentExample() {
        KozmosRoutePreviewPanel(
            destinationName = destinationName,
            options = emptyList(),
            status = status,
            backLabel = "Back",
            continueLabel = "Continue",
            onOptionSelect = {},
            onBack = {},
            onContinue = {}
        )
    }
}
