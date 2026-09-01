import SwiftUI
import Figma

struct KozmosPOIMediaGalleryConnect: FigmaConnect {
    let component = KozmosPOIMediaGallery.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8119"

    @FigmaString("Position Text")
    var positionText: String = "1 of 4"

    // Content is how many items media holds: Single hides the paging controls
    // and Empty renders the no-media state. Neither is a parameter.
    var body: some View {
        KozmosPOIMediaGallery(
            media: [],
            label: "Venue photographs",
            positionLabel: { current, total in "\(current) of \(total)" }
        )
    }
}
