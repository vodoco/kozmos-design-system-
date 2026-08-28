package com.kozmos.components.routeoptioncard

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.contracts.KozmosRouteOptionPresentation
import com.kozmos.contracts.KozmosRoutePreference

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8197")
class KozmosRouteOptionCardConnect {
    @FigmaProperty(FigmaType.Text, "Option Label Text")
    val label: String = "Step-free route"

    @FigmaProperty(FigmaType.Enum, "State")
    val selected: Boolean = Figma.mapping(
        "Default" to false, "Selected" to true, "Warning" to false, "Unavailable" to false
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val enabled: Boolean = Figma.mapping(
        "Default" to true, "Selected" to true, "Warning" to true, "Unavailable" to false
    )

    @Composable
    fun ComponentExample() {
        KozmosRouteOptionCard(
            option = KozmosRouteOptionPresentation(
                id = "step-free", label = label, durationSeconds = 360.0,
                durationLabel = "6 min", distanceMetres = 320.0, distanceLabel = "320 m",
                preference = KozmosRoutePreference.StepFree, selected = selected
            ),
            onSelect = {},
            enabled = enabled
        )
    }
}
