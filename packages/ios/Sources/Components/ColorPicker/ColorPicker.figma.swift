import SwiftUI
import Figma

struct KozmosColorPickerConnect: FigmaConnect {
    let component = KozmosColorPicker.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=451-13566"

    @FigmaString("Label Text")
    var label: String = "Brand color"

    @FigmaString("Value Text")
    var value: String = "#135BEC"

    @FigmaString("Helper Text")
    var helperText: String = "Choose a color."

    @FigmaBoolean("Show Helper Text")
    var showHelperText: Bool = false

    @FigmaEnum(
        "State",
        mapping: [
            "Default": "default",
            "Focus": "focus",
            "Disabled": "disabled",
            "Readonly": "readonly"
        ]
    )
    var state: String = "default"

    @FigmaEnum(
        "Status",
        mapping: [
            "Default": KozmosInputStatus.`default`,
            "Error": KozmosInputStatus.error,
            "Warning": KozmosInputStatus.warning,
            "Success": KozmosInputStatus.success
        ]
    )
    var status: KozmosInputStatus = .default

    @FigmaEnum(
        "Content",
        mapping: [
            "Closed": false,
            "Open": true
        ]
    )
    var defaultOpen: Bool = false

    @FigmaEnum(
        "Format",
        mapping: [
            "HEX": KozmosColorPickerFormat.hex,
            "RGB": KozmosColorPickerFormat.rgb,
            "HSL": KozmosColorPickerFormat.hsl
        ]
    )
    var format: KozmosColorPickerFormat = .hsl

    var body: some View {
        KozmosColorPicker(
            value: .constant(self.value),
            alpha: .constant(100),
            label: self.label,
            helperText: self.showHelperText ? self.helperText : nil,
            // Figma no longer carries this. The palette name is rendered by
            // the nested Select instance's own hint text, and a component
            // property cannot drive text inside a nested instance.
            paletteLabel: "Kozmos Design System 2.0",
            format: self.format,
            defaultOpen: self.defaultOpen,
            disabled: self.state == "disabled",
            readOnly: self.state == "readonly",
            status: self.status
        )
    }
}
