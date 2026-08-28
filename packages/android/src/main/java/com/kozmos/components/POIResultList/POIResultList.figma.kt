package com.kozmos.components.poiresultlist

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8171")
class KozmosPOIResultListConnect {
    @FigmaProperty(FigmaType.Text, "Result Count Text")
    val resultCountLabel: String = "12 results"

    @Composable
    fun ComponentExample() {
        KozmosPOIResultList(
            items = emptyList(),
            resultCountLabel = resultCountLabel,
            onSelect = {}
        )
    }
}
