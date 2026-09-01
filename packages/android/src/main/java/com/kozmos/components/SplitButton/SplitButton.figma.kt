package com.kozmos.components.splitbutton

import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=383-2332")
class KozmosSplitButtonConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Action"

    @Composable
    fun ComponentExample() {
        KozmosSplitButton(
            label = label,
            onMainClick = {},
            menuItems = listOf(
                SplitContextMenuItem("Action 1") {},
                SplitContextMenuItem("Action 2") {}
            )
        )
    }
}
