package com.kozmos.components.savelocationcard

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8338")
class KozmosSaveLocationCardConnect {
    @FigmaProperty(FigmaType.Text, "Title Text")
    val title: String = "Save this location"

    @FigmaProperty(FigmaType.Text, "Description Text")
    val description: String = "Keep it in your saved places for quick routing later."

    @FigmaProperty(FigmaType.Enum, "State")
    val isSaved: Boolean = Figma.mapping(
        "Default" to false,
        "Saved" to true
    )

    @Composable
    fun ComponentExample() {
        KozmosSaveLocationCard(
            title = title,
            description = description,
            isSaved = isSaved,
            onSaveToggle = {},
            onRouteToLocation = {},
            onEditNote = {}
        )
    }
}
