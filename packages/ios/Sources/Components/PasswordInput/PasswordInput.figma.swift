import SwiftUI
import Figma

struct KozmosPasswordInputConnect: FigmaConnect {
    let component = KozmosPasswordInput.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=412-2642"

    @FigmaString("Label Text")
    var label: String = "Password"

    @FigmaString("Placeholder Text")
    var placeholder: String = "Password"

    @FigmaString("Helper Text")
    var helperText: String = "Use at least 8 characters."

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

    @FigmaEnum(
        "Visibility",
        mapping: [
            "Hidden": false,
            "Visible": true
        ]
    )
    var defaultVisible: Bool = false

    var body: some View {
        KozmosPasswordInput(
            text: .constant(""),
            label: self.label,
            placeholder: self.placeholder,
            disabled: self.state == "disabled",
            readOnly: self.state == "readonly",
            status: self.status,
            helperText: self.showHelperText ? self.helperText : nil,
            defaultVisible: self.defaultVisible
        )
    }
}
