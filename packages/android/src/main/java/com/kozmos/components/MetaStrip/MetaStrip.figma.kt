package com.kozmos.components.metastrip

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1890-8911")
class KozmosMetaStripConnect {
    @FigmaProperty(FigmaType.Enum, "Label")
    val showLabel: Boolean = Figma.mapping(
        "Shown" to true,
        "Hidden" to false
    )

    @FigmaProperty(FigmaType.Text, "Value 1")
    val valueOne: String = "12 min"

    @FigmaProperty(FigmaType.Text, "Label 1")
    val labelOne: String = "Travel time"

    @FigmaProperty(FigmaType.Text, "Value 2")
    val valueTwo: String = "210 m"

    @FigmaProperty(FigmaType.Text, "Label 2")
    val labelTwo: String = "Distance"

    @FigmaProperty(FigmaType.Text, "Value 3")
    val valueThree: String = "4.5"

    @FigmaProperty(FigmaType.Text, "Label 3")
    val labelThree: String = "Rating"

    @Composable
    fun Example() {
        KozmosMetaStrip(
            items = listOf(
                KozmosMetaStripItem(label = labelOne, value = valueOne, showLabel = showLabel),
                KozmosMetaStripItem(label = labelTwo, value = valueTwo, showLabel = showLabel),
                KozmosMetaStripItem(label = labelThree, value = valueThree, showLabel = showLabel)
            )
        )
    }
}
