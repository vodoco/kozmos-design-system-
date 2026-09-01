package com.kozmos.components.datepicker

import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import java.time.LocalDate

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=438-4292")
class KozmosDatePickerConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Date"

    @Composable
    fun ComponentExample() {
        KozmosDatePicker(
            date = LocalDate.of(2026, 5, 25),
            onDateSelected = {},
            label = label
        )
    }
}
