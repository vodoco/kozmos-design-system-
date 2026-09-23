import SwiftUI
import Figma

struct KozmosCategoryTileConnect: FigmaConnect {
    let component = KozmosCategoryTile<Image>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8039"

    @FigmaString("Label Text")
    var label: String = "Transport"

    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Selected": true,
            "Disabled": false
        ]
    )
    var isSelected: Bool = false

    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Selected": false,
            "Disabled": true
        ]
    )
    var isDisabled: Bool = false

    // The Tint axis: Theme is a tile with no tint; the eight are the
    // taxonomy's quick-access colours as the Semantics.Category tokens — the
    // accent, and the fill with the ink that reads on it.
    @FigmaEnum(
        "Tint",
        mapping: [
            "Theme": nil,
            "Yellow": KozmosCategoryTint(accent: KozmosColors.semanticsCategoryAccentYellow, fill: KozmosInkedFill(fill: KozmosColors.semanticsCategoryFillYellow, ink: KozmosColors.semanticsCategoryOnfillYellow)),
            "Orange": KozmosCategoryTint(accent: KozmosColors.semanticsCategoryAccentOrange, fill: KozmosInkedFill(fill: KozmosColors.semanticsCategoryFillOrange, ink: KozmosColors.semanticsCategoryOnfillOrange)),
            "Turquoise": KozmosCategoryTint(accent: KozmosColors.semanticsCategoryAccentTurquoise, fill: KozmosInkedFill(fill: KozmosColors.semanticsCategoryFillTurquoise, ink: KozmosColors.semanticsCategoryOnfillTurquoise)),
            "Red": KozmosCategoryTint(accent: KozmosColors.semanticsCategoryAccentRed, fill: KozmosInkedFill(fill: KozmosColors.semanticsCategoryFillRed, ink: KozmosColors.semanticsCategoryOnfillRed)),
            "Blue": KozmosCategoryTint(accent: KozmosColors.semanticsCategoryAccentBlue, fill: KozmosInkedFill(fill: KozmosColors.semanticsCategoryFillBlue, ink: KozmosColors.semanticsCategoryOnfillBlue)),
            "Navy": KozmosCategoryTint(accent: KozmosColors.semanticsCategoryAccentNavy, fill: KozmosInkedFill(fill: KozmosColors.semanticsCategoryFillNavy, ink: KozmosColors.semanticsCategoryOnfillNavy)),
            "Green": KozmosCategoryTint(accent: KozmosColors.semanticsCategoryAccentGreen, fill: KozmosInkedFill(fill: KozmosColors.semanticsCategoryFillGreen, ink: KozmosColors.semanticsCategoryOnfillGreen)),
            "Pink": KozmosCategoryTint(accent: KozmosColors.semanticsCategoryAccentPink, fill: KozmosInkedFill(fill: KozmosColors.semanticsCategoryFillPink, ink: KozmosColors.semanticsCategoryOnfillPink))
        ]
    )
    var tint: KozmosCategoryTint? = nil

    // Show Count is resultCount being set; the number itself is the nested
    // Counter's text, which is product data.
    @FigmaBoolean("Show Count")
    var showCount: Bool = true

    // selected, disabled and the count are fields of the
    // KozmosCategoryPresentation, so the State axis and Show Count feed the
    // object rather than separate parameters.
    var body: some View {
        KozmosCategoryTile(
            category: KozmosCategoryPresentation(
                id: "transport",
                label: self.label,
                selected: self.isSelected,
                disabled: self.isDisabled,
                resultCount: self.showCount ? 12 : nil
            ),
            tint: self.tint,
            isDisabled: self.isDisabled,
            onSelect: { _ in }
        ) {
            Image(systemName: "bus")
        }
    }
}
