import SwiftUI
import Figma

struct KozmosInputConnect: FigmaConnect {
    let component = KozmosInput.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1558"

    @FigmaString("Label Text")
    var label: String = "Email"

    @FigmaString("Placeholder Text")
    var placeholder: String = "Placeholder"

    @FigmaString("Helper Text")
    var helperText: String = "Use a work email address."

    @FigmaBoolean("Show Helper Text")
    var showHelperText: Bool = true

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

    var body: some View {
        KozmosInput(
            text: .constant(""),
            label: self.label,
            placeholder: self.placeholder,
            disabled: self.state == "disabled",
            readOnly: self.state == "readonly",
            status: self.status,
            helperText: self.showHelperText ? self.helperText : nil
        )
    }
}
