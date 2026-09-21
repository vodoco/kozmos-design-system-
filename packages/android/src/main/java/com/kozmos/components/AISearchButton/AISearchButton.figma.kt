package com.kozmos.components.aisearchbutton

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

// The set is new on 2026-09-21: Build AISearchButton in the importer, then put
// the node id its log prints here and add this file and AISearchButton.kt to
// packages/android/figma.linked.config.json. Until then the file is not
// published.
@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=0-0")
class KozmosAISearchButtonConnect {
    @FigmaProperty(FigmaType.Enum, "State")
    val enabled: Boolean = Figma.mapping(
        "Default" to true,
        "Disabled" to false
    )

    // The ring turns in the product (3.6 s a turn, still with animations off);
    // Figma holds it at rest. label is what TalkBack hears.
    @Composable
    fun ComponentExample() {
        KozmosAISearchButton(
            onClick = {},
            enabled = enabled
        )
    }
}
