package com.kozmos.components.navigationitem

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=861-7297")
class KozmosNavigationItemConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Overview"

    @FigmaProperty(FigmaType.Enum, "Placement")
    val placement: KozmosNavigationItemPlacement = Figma.mapping(
        "Top" to KozmosNavigationItemPlacement.Top,
        "Side" to KozmosNavigationItemPlacement.Side,
        "Rail" to KozmosNavigationItemPlacement.Rail
    )

    @FigmaProperty(FigmaType.Enum, "Density")
    val density: KozmosNavigationItemDensity = Figma.mapping(
        "Default" to KozmosNavigationItemDensity.Default,
        "Compact" to KozmosNavigationItemDensity.Compact
    )

    @FigmaProperty(FigmaType.Enum, "Content")
    val content: KozmosNavigationItemContent = Figma.mapping(
        "Label" to KozmosNavigationItemContent.Label,
        "Icon Label" to KozmosNavigationItemContent.IconLabel,
        "Icon Only" to KozmosNavigationItemContent.IconOnly,
        "Badge" to KozmosNavigationItemContent.Badge,
        "Trailing" to KozmosNavigationItemContent.Trailing
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val state: KozmosNavigationItemState = Figma.mapping(
        "Default" to KozmosNavigationItemState.Default,
        "Hover" to KozmosNavigationItemState.Hover,
        "Selected" to KozmosNavigationItemState.Selected,
        "Focus" to KozmosNavigationItemState.Focus,
        "Disabled" to KozmosNavigationItemState.Disabled
    )

    @FigmaProperty(FigmaType.Boolean, "Focus Visible")
    val focusVisible: Boolean = false

    @Composable
    fun ComponentExample() {
        val iconSlot: (@Composable () -> Unit)? =
            if (content != KozmosNavigationItemContent.Label) {
                { Icon(Icons.Default.Home, contentDescription = null) }
            } else {
                null
            }
        val badgeSlot: (@Composable () -> Unit)? =
            if (content == KozmosNavigationItemContent.Badge) {
                { Text("3") }
            } else {
                null
            }
        val trailingSlot: (@Composable () -> Unit)? =
            if (content == KozmosNavigationItemContent.Trailing) {
                {
                    Icon(
                        Icons.AutoMirrored.Filled.KeyboardArrowRight,
                        contentDescription = null
                    )
                }
            } else {
                null
            }

        KozmosNavigationItem(
            label = if (content == KozmosNavigationItemContent.IconOnly) null else label,
            placement = placement,
            density = density,
            content = content,
            state = state,
            selected = state == KozmosNavigationItemState.Selected,
            enabled = state != KozmosNavigationItemState.Disabled,
            focusVisible = focusVisible,
            icon = iconSlot,
            badge = badgeSlot,
            trailing = trailingSlot
        )
    }
}
