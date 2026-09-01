package com.kozmos.components.poimediagallery

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8119")
class KozmosPOIMediaGalleryConnect {
    @FigmaProperty(FigmaType.Text, "Position Text")
    val positionText: String = "1 of 4"

    // Content is how many items media holds: Single hides the paging controls
    // and Empty renders the no-media state. Neither is a parameter.
    @Composable
    fun ComponentExample() {
        KozmosPOIMediaGallery(
            media = emptyList(),
            label = "Venue photographs",
            positionLabel = { current, total -> "$current of $total" }
        )
    }
}
