package com.kozmos.components.dynamicisland

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8358")
class KozmosDynamicIslandConnect {
    @FigmaProperty(FigmaType.Enum, "State")
    val state: KozmosDynamicIslandState = Figma.mapping(
        "Compact" to KozmosDynamicIslandState.Compact,
        "Expanded" to KozmosDynamicIslandState.Expanded,
        "Minimal" to KozmosDynamicIslandState.Minimal
    )

    @Composable
    fun ComponentExample() {
        KozmosDynamicIsland(state = state)
    }
}
