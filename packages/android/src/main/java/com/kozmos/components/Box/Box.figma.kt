package com.kozmos.components.box

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.tokens.KozmosColors
import com.kozmos.tokens.KozmosDimensions

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1002")
class KozmosBoxConnect {
    @FigmaProperty(FigmaType.Enum, "Surface")
    val surface: String = Figma.mapping(
        "Transparent" to "transparent",
        "Surface" to "surface",
        "Outlined" to "outlined"
    )

    @Composable
    fun ComponentExample() {
        KozmosBox(modifier = surfaceModifier()) {
            Text("Content")
        }
    }

    private fun surfaceModifier(): Modifier {
        val shape = RoundedCornerShape(KozmosDimensions.semanticsRadiusControl)
        return when (surface) {
            "surface" -> Modifier
                .background(KozmosColors.primitivesColorsBackground0, shape)
                .padding(KozmosDimensions.primitivesLayoutSpacing200)
            "outlined" -> Modifier
                .background(KozmosColors.primitivesColorsBackground0, shape)
                .border(1.dp, KozmosColors.primitivesColorsBackground300, shape)
                .padding(KozmosDimensions.primitivesLayoutSpacing200)
            else -> Modifier
        }
    }
}
