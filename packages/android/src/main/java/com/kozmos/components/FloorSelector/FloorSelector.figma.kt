package com.kozmos.components.floorselector

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6786")
class KozmosFloorSelectorConnect {
    @FigmaProperty(FigmaType.Text, "Selected Floor Text")
    val selectedFloor: String = "L1"

    // Named floorSelectorVariant because Code Connect reserves `variant`.
    @FigmaProperty(FigmaType.Enum, "Variant")
    val floorSelectorVariant: KozmosFloorSelectorVariant = Figma.mapping(
        "VerticalList" to KozmosFloorSelectorVariant.VerticalList,
        "HorizontalList" to KozmosFloorSelectorVariant.HorizontalList,
        "CompactStepper" to KozmosFloorSelectorVariant.CompactStepper
    )

    @Composable
    fun ComponentExample() {
        KozmosFloorSelector(
            floors = listOf("L2", "L1", "G"),
            selectedFloor = selectedFloor,
            onFloorSelect = {},
            variant = floorSelectorVariant
        )
    }
}
