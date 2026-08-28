package com.kozmos.components.adaptivemapshell

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-7985")
class KozmosAdaptiveMapShellConnect {
    @FigmaProperty(FigmaType.Text, "Panel Label Text")
    val panelLabel: String = "Panel slot"

    @FigmaProperty(FigmaType.Enum, "PanelPlacement")
    val panelPlacement: KozmosMapPanelPlacement = Figma.mapping(
        "Start" to KozmosMapPanelPlacement.Start,
        "End" to KozmosMapPanelPlacement.End
    )

    @Composable
    fun ComponentExample() {
        KozmosAdaptiveMapShell(
            map = {},
            mapLabel = "Venue map",
            panelLabel = panelLabel,
            panelPlacement = panelPlacement
        )
    }
}
