import SwiftUI

/// A fill and the ink that reads on it: a pair, because no one ink reads on
/// every colour a host may fill with — white fails on the taxonomy's yellow,
/// the dark ink on its navy. `KozmosColors.semanticsCategoryFill*` and
/// `…OnFill*` carry such pairs for the taxonomy's eight colours, and
/// `pnpm tokens:contrast:check` holds each to 4.5:1.
public struct KozmosInkedFill: Equatable {
    public let fill: Color
    public let ink: Color

    public init(fill: Color, ink: Color) {
        self.fill = fill
        self.ink = ink
    }
}
