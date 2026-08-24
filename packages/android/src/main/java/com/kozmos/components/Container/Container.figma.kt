package com.kozmos.components.container

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1034")
class KozmosContainerConnect {
    @FigmaProperty(FigmaType.Enum, "Centered")
    val centered: String = Figma.mapping(
        "True" to "true",
        "False" to "false"
    )

    @Composable
    fun ComponentExample() {
        KozmosContainer(
            modifier = if (centered == "true") {
                Modifier.widthIn(max = 720.dp)
            } else {
                Modifier.fillMaxWidth()
            }
        ) {
            Text("Container content")
        }
    }
}
