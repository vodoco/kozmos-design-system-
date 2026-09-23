package com.kozmos.components.categorytile

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.components.counter.KozmosInkedFill
import com.kozmos.contracts.KozmosCategoryPresentation
import com.kozmos.tokens.KozmosColors

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8039")
class KozmosCategoryTileConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Transport"

    @FigmaProperty(FigmaType.Enum, "State")
    val selected: Boolean = Figma.mapping(
        "Default" to false,
        "Selected" to true,
        "Disabled" to false
    )

    @FigmaProperty(FigmaType.Enum, "State")
    val enabled: Boolean = Figma.mapping(
        "Default" to true,
        "Selected" to true,
        "Disabled" to false
    )

    // The Tint axis: Theme is a tile with no tint; the eight are the
    // taxonomy's quick-access colours as the Semantics.Category tokens — the
    // accent, and the fill with the ink that reads on it.
    @FigmaProperty(FigmaType.Enum, "Tint")
    val tint: KozmosCategoryTint? = Figma.mapping(
        "Theme" to null,
        "Yellow" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentYellow, KozmosInkedFill(KozmosColors.semanticsCategoryFillYellow, KozmosColors.semanticsCategoryOnfillYellow)),
        "Orange" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentOrange, KozmosInkedFill(KozmosColors.semanticsCategoryFillOrange, KozmosColors.semanticsCategoryOnfillOrange)),
        "Turquoise" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentTurquoise, KozmosInkedFill(KozmosColors.semanticsCategoryFillTurquoise, KozmosColors.semanticsCategoryOnfillTurquoise)),
        "Red" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentRed, KozmosInkedFill(KozmosColors.semanticsCategoryFillRed, KozmosColors.semanticsCategoryOnfillRed)),
        "Blue" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentBlue, KozmosInkedFill(KozmosColors.semanticsCategoryFillBlue, KozmosColors.semanticsCategoryOnfillBlue)),
        "Navy" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentNavy, KozmosInkedFill(KozmosColors.semanticsCategoryFillNavy, KozmosColors.semanticsCategoryOnfillNavy)),
        "Green" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentGreen, KozmosInkedFill(KozmosColors.semanticsCategoryFillGreen, KozmosColors.semanticsCategoryOnfillGreen)),
        "Pink" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentPink, KozmosInkedFill(KozmosColors.semanticsCategoryFillPink, KozmosColors.semanticsCategoryOnfillPink))
    )

    // Show Count is resultCount being set; the number itself is the nested
    // Counter's text, which is product data.
    @FigmaProperty(FigmaType.Boolean, "Show Count")
    val showCount: Boolean = true

    @Composable
    fun ComponentExample() {
        KozmosCategoryTile(
            category = KozmosCategoryPresentation(
                id = "transport",
                label = label,
                selected = selected,
                resultCount = if (showCount) 12 else null
            ),
            onSelect = {},
            enabled = enabled,
            tint = tint
        )
    }
}
