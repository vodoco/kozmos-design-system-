import SwiftUI
import Figma

struct KozmosPOICardConnect: FigmaConnect {
    let component = KozmosPOICard<EmptyView, Text, EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6879"

    @FigmaString("Title Text")
    var title: String = "Kozmos Cafe"

    @FigmaString("Subtitle Text")
    var category: String = "Cafe"

    @FigmaString("Description Text")
    var descriptionText: String = "Speciality coffee beside the north atrium."

    var body: some View {
        KozmosPOICard(
            title: self.title,
            category: self.category,
            imageContent: { EmptyView() },
            descriptionContent: { Text(self.descriptionText) },
            actionsContent: { EmptyView() },
            onClose: {}
        )
    }
}
