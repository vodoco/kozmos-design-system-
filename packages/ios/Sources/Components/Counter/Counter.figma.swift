import SwiftUI
import Figma

struct KozmosCounterConnect: FigmaConnect {
    let component = KozmosCounter.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=149-13430"

    @FigmaString("Counter Text")
    var text: String = "12"

    @FigmaEnum(
        "Tone",
        mapping: [
            "Neutral": KozmosCounterTone.neutral,
            "Brand": KozmosCounterTone.brand,
            "Destructive": KozmosCounterTone.destructive,
            "Inverse": KozmosCounterTone.inverse
        ]
    )
    var tone: KozmosCounterTone = .neutral

    @FigmaEnum(
        "Size",
        mapping: [
            "Default": KozmosCounterSize.`default`,
            "Small": KozmosCounterSize.sm
        ]
    )
    var size: KozmosCounterSize = .default

    var body: some View {
        KozmosCounter(
            self.text,
            tone: self.tone,
            size: self.size
        )
    }
}
