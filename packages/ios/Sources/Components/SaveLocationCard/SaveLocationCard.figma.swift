import SwiftUI
import Figma

struct KozmosSaveLocationCardConnect: FigmaConnect {
    let component = KozmosSaveLocationCard.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8338"

    @FigmaString("Title Text")
    var title: String = "Save this location"

    @FigmaString("Description Text")
    var description: String = "Keep it in your saved places for quick routing later."

    @FigmaEnum(
        "State",
        mapping: [
            "Default": false,
            "Saved": true
        ]
    )
    var isSaved: Bool = false

    var body: some View {
        KozmosSaveLocationCard(
            title: self.title,
            description: self.description,
            isSaved: self.isSaved,
            onSaveToggle: {},
            onRouteToLocation: {},
            onEditNote: {}
        )
    }
}
