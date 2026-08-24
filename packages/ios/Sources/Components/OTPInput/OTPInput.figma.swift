import SwiftUI
import Figma

struct KozmosOTPInputConnect: FigmaConnect {
    let component = KozmosOTPInput.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=475-38745"

    @FigmaEnum(
        "Length",
        mapping: [
            "4": 4,
            "6": 6
        ]
    )
    var length: Int = 6

    @FigmaString("Label Text")
    var label: String = "Verification code"

    @FigmaString("Digit 1 Text")
    var digit1: String = "1"

    @FigmaString("Digit 2 Text")
    var digit2: String = "2"

    @FigmaString("Digit 3 Text")
    var digit3: String = "3"

    @FigmaString("Digit 4 Text")
    var digit4: String = "4"

    @FigmaString("Digit 5 Text")
    var digit5: String = "5"

    @FigmaString("Digit 6 Text")
    var digit6: String = "6"

    @FigmaString("Helper Text")
    var helperText: String = "Enter the code sent to your device."

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
        KozmosOTPInput(
            length: self.length,
            value: .constant(self.valueText),
            label: self.label,
            disabled: self.state == "disabled",
            readOnly: self.state == "readonly",
            status: self.status,
            helperText: self.showHelperText ? self.helperText : nil
        )
    }

    private var valueText: String {
        String([digit1, digit2, digit3, digit4, digit5, digit6].joined().prefix(length))
    }
}
