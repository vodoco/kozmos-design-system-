import SwiftUI
import Figma

struct KozmosToggleButtonConnect: FigmaConnect {
    let component = KozmosToggleButton.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=383-2019"

    @FigmaString("Label Text")
    var label: String = "Toggle"

    @FigmaEnum(
        "Variant",
        mapping: [
            "Default": "default",
            "Outline": "outline"
        ]
    )
    var variantName: String = "default"

    @FigmaEnum(
        "Size",
        mapping: [
            "Small": "sm",
            "Default": "default",
            "Large": "lg"
        ]
    )
    var sizeName: String = "default"

    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Pressed": true,
            "Disabled": false,
            "Focus": false
        ]
    )
    var isOn: Bool = false

    var body: some View {
        KozmosToggleButton(
            isOn: .constant(self.isOn),
            label: self.label,
            variant: self.variantName == "outline" ? .outline : .default,
            size: self.sizeName == "sm" ? .sm : (self.sizeName == "lg" ? .lg : .default)
        )
    }
}
