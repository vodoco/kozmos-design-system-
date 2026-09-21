import SwiftUI
import Figma

// The set is new on 2026-09-21: Build AISearchButton in the importer, then put
// the node id its log prints here and add this file and AISearchButton.swift
// to packages/ios/figma.linked.config.json. Until then the file is not
// published. The State axis (Default, Disabled) has no SwiftUI parameter: the
// view takes the environment's `isEnabled`, as every SwiftUI control does.
struct KozmosAISearchButtonConnect: FigmaConnect {
    let component = KozmosAISearchButton.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1933-9270"

    // The ring turns in the product (3.6 s a turn, still under Reduce Motion);
    // Figma holds it at rest. label is what VoiceOver hears.
    var body: some View {
        KozmosAISearchButton(action: {})
    }
}
