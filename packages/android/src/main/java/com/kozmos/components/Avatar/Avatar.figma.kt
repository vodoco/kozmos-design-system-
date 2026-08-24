package com.kozmos.components.avatar

import androidx.compose.runtime.Composable
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-272")
class KozmosAvatarConnect {
    @FigmaProperty(FigmaType.Text, "Image URL")
    val imageUrl: String = ""

    @FigmaProperty(FigmaType.Text, "Fallback")
    val fallback: String = "KO"

    @Composable
    fun ComponentExample() {
        KozmosAvatar(
            imageUrl = if (imageUrl.isBlank()) null else imageUrl,
            fallbackText = fallback
        )
    }
}
