package com.kozmos.components.counter

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=149-13430")
class KozmosCounterConnect {
    @FigmaProperty(FigmaType.Text, "Counter Text")
    val text: String = "12"

    @FigmaProperty(FigmaType.Enum, "Tone")
    val tone: CounterTone = Figma.mapping(
        "Neutral" to CounterTone.Neutral,
        "Brand" to CounterTone.Brand,
        "Destructive" to CounterTone.Destructive,
        "Inverse" to CounterTone.Inverse
    )

    @FigmaProperty(FigmaType.Enum, "Size")
    val size: CounterSize = Figma.mapping(
        "Default" to CounterSize.Default,
        "Small" to CounterSize.Sm
    )

    @Composable
    fun ComponentExample() {
        KozmosCounter(
            text = text,
            tone = tone,
            size = size
        )
    }
}
