package com.kozmos.components.rating

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=512-39747")
class KozmosRatingConnect {
    @FigmaProperty(FigmaType.Enum, "Value")
    val value: Int = Figma.mapping(
        "0" to 0,
        "1" to 1,
        "2" to 2,
        "3" to 3,
        "4" to 4,
        "5" to 5
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val readOnly: Boolean = Figma.mapping(
        "Default" to false,
        "Readonly" to true
    )

    @Composable
    fun ComponentExample() {
        KozmosRating(
            value = value,
            onValueChange = {},
            max = 5,
            readOnly = readOnly
        )
    }
}
