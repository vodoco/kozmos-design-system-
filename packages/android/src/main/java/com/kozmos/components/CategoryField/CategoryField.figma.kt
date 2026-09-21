package com.kozmos.components.categoryfield

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType
import com.kozmos.components.categorytile.KozmosCategoryTint
import com.kozmos.components.counter.KozmosInkedFill
import com.kozmos.tokens.KozmosColors

// The set is new on 2026-09-21: Build CategoryField in the importer, then put
// the node id its log prints here and add this file and CategoryField.kt to
// packages/android/figma.linked.config.json. Until then the file is not
// published.
@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1933-9257")
class KozmosCategoryFieldConnect {
    @FigmaProperty(FigmaType.Text, "Label Text")
    val label: String = "Gates"

    // The Tint axis: Theme is the field with no category, the component's own
    // default; the eight are the taxonomy's quick-access colours as the
    // Semantics.Category tokens.
    @FigmaProperty(FigmaType.Enum, "Tint")
    val tint: KozmosCategoryTint = Figma.mapping(
        "Theme" to KozmosCategoryTint(KozmosColors.primitivesColorsTheme500, KozmosInkedFill(KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle, KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle)),
        "Yellow" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentYellow, KozmosInkedFill(KozmosColors.semanticsCategoryFillYellow, KozmosColors.semanticsCategoryOnfillYellow)),
        "Orange" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentOrange, KozmosInkedFill(KozmosColors.semanticsCategoryFillOrange, KozmosColors.semanticsCategoryOnfillOrange)),
        "Turquoise" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentTurquoise, KozmosInkedFill(KozmosColors.semanticsCategoryFillTurquoise, KozmosColors.semanticsCategoryOnfillTurquoise)),
        "Red" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentRed, KozmosInkedFill(KozmosColors.semanticsCategoryFillRed, KozmosColors.semanticsCategoryOnfillRed)),
        "Blue" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentBlue, KozmosInkedFill(KozmosColors.semanticsCategoryFillBlue, KozmosColors.semanticsCategoryOnfillBlue)),
        "Navy" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentNavy, KozmosInkedFill(KozmosColors.semanticsCategoryFillNavy, KozmosColors.semanticsCategoryOnfillNavy)),
        "Green" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentGreen, KozmosInkedFill(KozmosColors.semanticsCategoryFillGreen, KozmosColors.semanticsCategoryOnfillGreen)),
        "Pink" to KozmosCategoryTint(KozmosColors.semanticsCategoryAccentPink, KozmosInkedFill(KozmosColors.semanticsCategoryFillPink, KozmosColors.semanticsCategoryOnfillPink))
    )

    // Show Count is count being set; Count Text carries the number.
    @FigmaProperty(FigmaType.Boolean, "Show Count")
    val showCount: Boolean = true

    @Composable
    fun ComponentExample() {
        KozmosCategoryField(
            label = label,
            onClear = {},
            count = if (showCount) 12 else null,
            tint = tint
        )
    }
}
