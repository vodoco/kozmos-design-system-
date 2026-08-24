package com.kozmos.components.timepicker

import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import java.time.LocalTime

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=444-12011")
class KozmosTimePickerConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Time"

    @Composable
    fun ComponentExample() {
        KozmosTimePicker(
            time = LocalTime.of(9, 30),
            onTimeSelected = {},
            label = label
        )
    }
}
