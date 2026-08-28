import SwiftUI
import Figma

struct KozmosRoutePreviewPanelConnect: FigmaConnect {
    let component = KozmosRoutePreviewPanel<EmptyView, EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8277"

    @FigmaString("Destination Text")
    var destinationName: String = "Kozmos Cafe"

    @FigmaEnum(
        "Status",
        mapping: [
            "Idle": KozmosRouteReadiness.idle,
            "Calculating": KozmosRouteReadiness.calculating,
            "Ready": KozmosRouteReadiness.ready,
            "NoRoute": KozmosRouteReadiness.noRoute,
            "Error": KozmosRouteReadiness.error
        ]
    )
    var status: KozmosRouteReadiness = .ready

    var body: some View {
        KozmosRoutePreviewPanel(
            destinationName: self.destinationName,
            options: [],
            status: self.status,
            backLabel: "Back",
            continueLabel: "Continue",
            onOptionSelect: { _ in },
            onBack: {},
            onContinue: { _ in },
            statusContent: { EmptyView() },
            alert: { EmptyView() }
        )
    }
}
