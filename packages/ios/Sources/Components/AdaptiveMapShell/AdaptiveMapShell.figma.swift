import SwiftUI
import Figma

struct KozmosAdaptiveMapShellConnect: FigmaConnect {
    let component = KozmosAdaptiveMapShell<EmptyView, EmptyView, EmptyView, EmptyView, EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-7985"

    @FigmaString("Panel Label Text")
    var panelLabel: String = "Panel slot"

    @FigmaEnum(
        "PanelPlacement",
        mapping: [
            "Start": KozmosAdaptiveMapShell<EmptyView, EmptyView, EmptyView, EmptyView, EmptyView>.PanelPlacement.start,
            "End": KozmosAdaptiveMapShell<EmptyView, EmptyView, EmptyView, EmptyView, EmptyView>.PanelPlacement.end
        ]
    )
    var panelPlacement: KozmosAdaptiveMapShell<EmptyView, EmptyView, EmptyView, EmptyView, EmptyView>.PanelPlacement = .end

    var body: some View {
        KozmosAdaptiveMapShell(
            mapLabel: "Venue map",
            panelLabel: self.panelLabel,
            panelPlacement: self.panelPlacement,
            map: { EmptyView() },
            mapStatusContent: { EmptyView() },
            controls: { EmptyView() },
            topBar: { EmptyView() },
            panel: { EmptyView() }
        )
    }
}
