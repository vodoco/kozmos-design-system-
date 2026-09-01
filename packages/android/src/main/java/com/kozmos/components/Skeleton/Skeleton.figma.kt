package com.kozmos.components.skeleton

import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1062")
class KozmosSkeletonConnect {
    @FigmaProperty(FigmaType.Enum, "Shape")
    val shape: String = Figma.mapping(
        "Line" to "line",
        "Block" to "block",
        "Circle" to "circle"
    )

    @Composable
    fun ComponentExample() {
        KozmosSkeleton(modifier = shapeModifier())
    }

    private fun shapeModifier(): Modifier = when (shape) {
        "block" -> Modifier.width(256.dp).height(80.dp)
        "circle" -> Modifier.size(40.dp).clip(CircleShape)
        else -> Modifier.width(160.dp).height(16.dp)
    }
}
