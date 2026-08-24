import SwiftUI
import Figma

struct KozmosFloatingActionButtonConnect: FigmaConnect {
    let component = KozmosFloatingActionButton.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=383-2459"

    var body: some View {
        KozmosFloatingActionButton(iconName: "plus", action: {})
    }
}
