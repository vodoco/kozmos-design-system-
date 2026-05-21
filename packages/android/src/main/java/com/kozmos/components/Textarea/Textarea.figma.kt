package com.kozmos.components.textarea

import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=80-328")
class KozmosTextareaConnect {
    @FigmaProperty(FigmaType.Text, "Placeholder Text")
    val placeholder: String = "Placeholder"

    @Composable
    fun ComponentExample() {
        KozmosTextarea(
            value = "",
            onValueChange = {},
            placeholder = placeholder
        )
    }
}
