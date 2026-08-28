package com.kozmos.components.browsecategoriespanel

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8026")
class KozmosBrowseCategoriesPanelConnect {
    @FigmaProperty(FigmaType.Text, "Panel Label Text")
    val label: String = "Browse categories"

    @Composable
    fun ComponentExample() {
        KozmosBrowseCategoriesPanel(
            categories = emptyList(),
            onSelect = {},
            label = label
        )
    }
}
