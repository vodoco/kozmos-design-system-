package com.kozmos.components.spinner

import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-261")
class KozmosSpinnerConnect {
    @FigmaProperty(FigmaType.Enum, "Size")
    val size: String = Figma.mapping(
        "Small" to "small",
        "Medium" to "medium",
        "Large" to "large",
        "XLarge" to "xlarge"
    )

    @Composable
    fun ComponentExample() {
        KozmosSpinner(modifier = Modifier.size(dimension()))
    }

    private fun dimension(): Dp = when (size) {
        "small" -> 16.dp
        "large" -> 32.dp
        "xlarge" -> 48.dp
        else -> 24.dp
    }
}
