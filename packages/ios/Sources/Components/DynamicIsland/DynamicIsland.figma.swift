import SwiftUI
import Figma

struct KozmosDynamicIslandConnect: FigmaConnect {
    let component = KozmosDynamicIsland<EmptyView, EmptyView, EmptyView, EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8358"

    @FigmaEnum(
        "State",
        mapping: [
            "Compact": KozmosDynamicIsland<EmptyView, EmptyView, EmptyView, EmptyView>.IslandState.compact,
            "Expanded": KozmosDynamicIsland<EmptyView, EmptyView, EmptyView, EmptyView>.IslandState.expanded,
            "Minimal": KozmosDynamicIsland<EmptyView, EmptyView, EmptyView, EmptyView>.IslandState.minimal
        ]
    )
    var state: KozmosDynamicIsland<EmptyView, EmptyView, EmptyView, EmptyView>.IslandState = .compact

    var body: some View {
        KozmosDynamicIsland(
            state: self.state,
            expandedContent: { EmptyView() },
            compactLeading: { EmptyView() },
            compactTrailing: { EmptyView() },
            minimalContent: { EmptyView() }
        )
    }
}
