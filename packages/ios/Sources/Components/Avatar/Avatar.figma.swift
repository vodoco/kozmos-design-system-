import SwiftUI
import Figma

struct KozmosAvatarConnect: FigmaConnect {
    let component = KozmosAvatar.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-272"

    @FigmaString("Image URL")
    var imageURL: String = ""

    @FigmaString("Fallback")
    var fallback: String = "KO"

    var body: some View {
        KozmosAvatar(
            imageURL: URL(string: self.imageURL),
            fallbackText: self.fallback
        )
    }
}
