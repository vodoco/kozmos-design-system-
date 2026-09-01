import SwiftUI
import Figma

struct KozmosTagConnect: FigmaConnect {
    let component = KozmosTag.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=728-6184"

    @FigmaString("Label Text")
    var label: String = "Live"

    @FigmaEnum(
        "Variant",
        mapping: [
            "Default": KozmosTag.KozmosTagVariant.default,
            "Secondary": KozmosTag.KozmosTagVariant.secondary,
            "Destructive": KozmosTag.KozmosTagVariant.destructive,
            "Outline": KozmosTag.KozmosTagVariant.outline
        ]
    )
    var tagVariant: KozmosTag.KozmosTagVariant = .default

    @FigmaEnum(
        "Removable",
        mapping: [
            "False": false,
            "True": true
        ]
    )
    var removable: Bool = false

    var body: some View {
        KozmosTag(
            self.label,
            variant: self.tagVariant,
            onRemove: self.removable ? {} : nil
        )
    }
}
