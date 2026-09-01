package com.kozmos.components.tag

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=728-6184")
class KozmosTagConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Live"

    @FigmaProperty(FigmaType.Enum, "Variant")
    val variant: KozmosTagVariant = Figma.mapping(
        "Default" to KozmosTagVariant.Default,
        "Secondary" to KozmosTagVariant.Secondary,
        "Destructive" to KozmosTagVariant.Destructive,
        "Outline" to KozmosTagVariant.Outline
    )

    @FigmaProperty(FigmaType.Enum, "Removable")
    val removable: Boolean = Figma.mapping(
        "False" to false,
        "True" to true
    )

    @Composable
    fun ComponentExample() {
        KozmosTag(
            text = label,
            variant = variant,
            onRemove = if (removable) ({}) else null
        )
    }
}
