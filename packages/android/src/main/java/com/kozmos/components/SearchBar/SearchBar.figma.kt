package com.kozmos.components.searchbar

import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=682-15111")
class KozmosSearchBarConnect {
    @FigmaProperty(FigmaType.Text, "Placeholder Text")
    val placeholder: String = "Search..."

    @FigmaProperty(FigmaType.Text, "Value Text")
    val value: String = ""

    @Composable
    fun ComponentExample() {
        KozmosSearchBar(
            value = value,
            onValueChange = {},
            placeholder = placeholder
        )
    }
}
