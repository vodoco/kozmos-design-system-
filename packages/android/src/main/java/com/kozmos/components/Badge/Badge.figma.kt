package com.kozmos.components.badge

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=78-246")
class KozmosBadgeConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Badge"

    @FigmaProperty(FigmaType.Enum, "Variant")
    val variant: BadgeVariant = Figma.mapping(
        "Default" to BadgeVariant.Default,
        "Destructive" to BadgeVariant.Destructive,
        "Outline" to BadgeVariant.Outline,
        "Secondary" to BadgeVariant.Secondary,
        "Ghost" to BadgeVariant.Ghost,
        "Link" to BadgeVariant.Link
    )

    @FigmaProperty(FigmaType.Enum, "Size")
    val size: BadgeSize = Figma.mapping(
        "Default" to BadgeSize.Default,
        "Small" to BadgeSize.Sm,
        "Large" to BadgeSize.Lg,
        "Icon" to BadgeSize.Icon
    )

    @FigmaProperty(FigmaType.Boolean, "Show Counter")
    val showCounter: Boolean = false

    @Composable
    fun ComponentExample() {
        KozmosBadge(
            text = label,
            variant = variant,
            size = size,
            counter = "12",
            showCounter = showCounter
        )
    }
}
