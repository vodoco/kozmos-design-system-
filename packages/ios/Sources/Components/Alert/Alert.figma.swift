import SwiftUI
import Figma

struct KozmosAlertConnect: FigmaConnect {
    let component = KozmosAlert<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-308"

    @FigmaEnum(
        "Variant",
        mapping: [
            "Default": KozmosAlert<AnyView>.KozmosAlertVariant.`default`,
            "Destructive": KozmosAlert<AnyView>.KozmosAlertVariant.destructive,
            "Success": KozmosAlert<AnyView>.KozmosAlertVariant.success,
            "Warning": KozmosAlert<AnyView>.KozmosAlertVariant.warning,
            "Info": KozmosAlert<AnyView>.KozmosAlertVariant.info
        ]
    )
    var alertVariant: KozmosAlert<AnyView>.KozmosAlertVariant = .default

    @FigmaString("Title")
    var title: String = "Heads up"

    @FigmaString("Description")
    var description: String = "Use alert description for important status detail."

    var body: some View {
        KozmosAlert(variant: self.alertVariant) {
            AnyView(
                HStack(alignment: .top, spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                    KozmosAlertIcon(variant: self.alertVariant)
                    KozmosAlertContent {
                        KozmosAlertTitle(self.title, color: self.alertVariant.foregroundColor)
                        KozmosAlertDescription(self.description, color: self.alertVariant.foregroundColor)
                    }
                }
            )
        }
    }
}
