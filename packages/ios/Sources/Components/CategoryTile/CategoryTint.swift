import SwiftUI

/// A category's colours, as its tile, its chip and its pin wear them: the
/// accent draws the icon, the strokes and the label; the inked fill fills a
/// count pill or counter with an ink that reads on it. The taxonomy's eight
/// quick-access colours are `KozmosColors.semanticsCategoryAccent*`, `…Fill*`
/// and `…OnFill*`.
public struct KozmosCategoryTint: Equatable {
    public let accent: Color
    public let fill: KozmosInkedFill

    public init(accent: Color, fill: KozmosInkedFill) {
        self.accent = accent
        self.fill = fill
    }
}
