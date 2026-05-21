package com.kozmos.components.tabs

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=90-3387")
class KozmosTabsConnect {
    @FigmaProperty(FigmaType.Enum, "Active")
    val activeValue: String = Figma.mapping(
        "One" to "one",
        "Two" to "two",
        "Three" to "three",
        "Four" to "four"
    )

    @FigmaProperty(FigmaType.Text, "Tab 1 Text")
    val tab1Text: String = "Overview"

    @FigmaProperty(FigmaType.Text, "Tab 2 Text")
    val tab2Text: String = "Details"

    @FigmaProperty(FigmaType.Text, "Tab 3 Text")
    val tab3Text: String = "Usage"

    @FigmaProperty(FigmaType.Text, "Tab 4 Text")
    val tab4Text: String = "Settings"

    @Composable
    fun ComponentExample() {
        KozmosTabs {
            KozmosTabsList {
                KozmosTabsTrigger(
                    value = "one",
                    title = tab1Text,
                    selectedValue = activeValue,
                    onValueChange = {}
                )
                KozmosTabsTrigger(
                    value = "two",
                    title = tab2Text,
                    selectedValue = activeValue,
                    onValueChange = {}
                )
                KozmosTabsTrigger(
                    value = "three",
                    title = tab3Text,
                    selectedValue = activeValue,
                    onValueChange = {}
                )
                KozmosTabsTrigger(
                    value = "four",
                    title = tab4Text,
                    selectedValue = activeValue,
                    onValueChange = {}
                )
            }
            KozmosTabsContent(
                value = activeValue,
                selectedValue = activeValue
            ) {
                Text("${activeLabel()} content")
            }
        }
    }

    private fun activeLabel(): String = when (activeValue) {
        "two" -> tab2Text
        "three" -> tab3Text
        "four" -> tab4Text
        else -> tab1Text
    }
}
