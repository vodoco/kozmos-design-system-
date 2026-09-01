import SwiftUI
import Figma

struct KozmosFileUploadConnect: FigmaConnect {
    let component = KozmosFileUpload.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=444-12724"

    var body: some View {
        KozmosFileUpload(onFileSelected: { _ in })
    }
}
