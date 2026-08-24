import SwiftUI
import Figma

struct KozmosChipConnect: FigmaConnect {
    let component = KozmosChip<EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=227-1329"

    @FigmaString("Label Text")
    var label: String = "Chip"

    @FigmaEnum(
        "Variant",
        mapping: [
            "Neutral": KozmosChipVariant.neutral,
            "Brand": KozmosChipVariant.brand,
            "Destructive": KozmosChipVariant.destructive
        ]
    )
    var chipVariant: KozmosChipVariant = .neutral

    @FigmaEnum(
        "Size",
        mapping: [
            "Small": KozmosChipSize.sm,
            "Default": KozmosChipSize.`default`,
            "Large": KozmosChipSize.lg
        ]
    )
    var size: KozmosChipSize = .default

    @FigmaEnum(
        "State",
        mapping: [
            "Default": "default",
            "Selected": "selected",
            "Disabled": "disabled"
        ]
    )
    var state: String = "default"

    @FigmaEnum(
        "Removable",
        mapping: [
            "False": false,
            "True": true
        ]
    )
    var removable: Bool = false

    var body: some View {
        KozmosChip(
            text: self.label,
            variant: self.chipVariant,
            size: self.size,
            selected: self.state == "selected",
            disabled: self.state == "disabled",
            onRemove: self.removable ? {} : nil
        )
    }
}
