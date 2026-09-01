import SwiftUI
import Figma

struct KozmosRadioConnect: FigmaConnect {
    let component = KozmosRadioGroupItem.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1436"

    @FigmaEnum(
        "Checked",
        mapping: [
            "Unchecked": false,
            "Checked": true
        ]
    )
    var checked: Bool = false

    @FigmaString("Label Text")
    var label: String = "Option"

    @FigmaEnum(
        "State",
        mapping: [
            "Default": "default",
            "Disabled": "disabled",
            "Error": "error"
        ]
    )
    var state: String = "default"

    var body: some View {
        KozmosRadioGroup {
            KozmosRadioGroupItem(
                value: "option",
                label: self.label,
                selection: .constant(self.checked ? "option" : ""),
                disabled: self.state == "disabled",
                error: self.state == "error"
            )
        }
    }
}
