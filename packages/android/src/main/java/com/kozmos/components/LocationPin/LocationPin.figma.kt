package com.kozmos.components.locationpin

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6847")
class KozmosLocationPinConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Cafe"

    @FigmaProperty(FigmaType.Enum, "Size")
    val size: KozmosLocationPinSize = Figma.mapping(
        "Sm" to KozmosLocationPinSize.Sm,
        "Md" to KozmosLocationPinSize.Md,
        "Lg" to KozmosLocationPinSize.Lg
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val selected: Boolean = Figma.mapping(
        "Default" to false, "Selected" to true, "Featured" to false,
        "OffFloor" to false, "Disabled" to false
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val featured: Boolean = Figma.mapping(
        "Default" to false, "Selected" to false, "Featured" to true,
        "OffFloor" to false, "Disabled" to false
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val offFloor: Boolean = Figma.mapping(
        "Default" to false, "Selected" to false, "Featured" to false,
        "OffFloor" to true, "Disabled" to false
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val enabled: Boolean = Figma.mapping(
        "Default" to true, "Selected" to true, "Featured" to true,
        "OffFloor" to true, "Disabled" to false
    )

    // variant is a per-venue colour role and labelPlacement belongs to the map
    // renderer, so neither is a Figma variant axis.
    @Composable
    fun ComponentExample() {
        KozmosLocationPin(
            size = size,
            label = label,
            selected = selected,
            featured = featured,
            offFloor = offFloor,
            enabled = enabled
        )
    }
}
