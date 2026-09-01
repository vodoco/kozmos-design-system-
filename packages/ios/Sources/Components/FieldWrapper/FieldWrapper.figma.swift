import SwiftUI
import Figma

struct KozmosFieldWrapperConnect: FigmaConnect {
    let component = KozmosFieldWrapper<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=431-5810"

    @FigmaString("Label Text")
    var label: String = "Label"

    @FigmaString("Description Text")
    var description: String = "Use clear supporting guidance when the field needs it."

    @FigmaString("Optional Text")
    var optionalText: String = "Optional"

    @FigmaString("Helper Text")
    var helperText: String = "Helper text"

    @FigmaEnum(
        "Content",
        mapping: [
            "Basic": "basic",
            "Description": "description",
            "Helper": "helper",
            "Full": "full"
        ]
    )
    var content: String = "basic"

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
        "Required",
        mapping: [
            "False": false,
            "True": true
        ]
    )
    var required: Bool = false

    var body: some View {
        KozmosFieldWrapper(
            label: self.label,
            description: self.showsDescription ? self.description : nil,
            optionalText: self.required ? nil : self.optionalText,
            required: self.required,
            status: self.status,
            helperText: self.showsHelper ? self.helperText : nil
        ) {
            AnyView(
                KozmosInput(
                    text: .constant(""),
                    placeholder: "Placeholder"
                )
            )
        }
    }

    private var showsDescription: Bool {
        self.content == "description" || self.content == "full"
    }

    private var showsHelper: Bool {
        self.content == "helper" || self.content == "full"
    }
}
