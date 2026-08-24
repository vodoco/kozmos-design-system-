package com.kozmos.components.listbox

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=401-9475")
class KozmosListboxConnect {
    @FigmaProperty(FigmaType.Enum, "Selection")
    val multiple: Boolean = Figma.mapping(
        "Single" to false,
        "Multiple" to true
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val disabled: Boolean = Figma.mapping(
        "Default" to false,
        "Focus" to false,
        "Disabled" to true
    )

    @FigmaProperty(FigmaType.Text, "Option 1 Text")
    val option1: String = "Metro Station"

    @FigmaProperty(FigmaType.Text, "Option 1 Description")
    val option1Description: String = "Fast transit connection"

    @FigmaProperty(FigmaType.Text, "Option 2 Text")
    val option2: String = "Bus Stop"

    @FigmaProperty(FigmaType.Text, "Option 2 Description")
    val option2Description: String = "Frequent local service"

    @FigmaProperty(FigmaType.Text, "Option 3 Text")
    val option3: String = "Bike Parking"

    @FigmaProperty(FigmaType.Text, "Option 3 Description")
    val option3Description: String = "Secure racks nearby"

    @Composable
    fun ComponentExample() {
        KozmosListbox(
            options = listOf(
                KozmosListboxOption("metro-station", option1, option1Description),
                KozmosListboxOption("bus-stop", option2, option2Description),
                KozmosListboxOption("bike-parking", option3, option3Description)
            ),
            selectedValues = if (multiple) listOf("metro-station", "bus-stop") else listOf("metro-station"),
            multiple = multiple,
            enabled = !disabled
        )
    }
}
