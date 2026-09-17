import XCTest
import SwiftUI
@testable import Kozmos

/// The state → appearance decision for a map control, tested without rendering.
///
/// These mirror the React assertions in MapControlButton.test.tsx, so the two
/// platforms are held to the same ruling: tinted keeps the map's surface and
/// colours only the glyph and the edge; filled inverts the surface.
final class KozmosMapControlButtonAppearanceTests: XCTestCase {
    typealias Appearance = KozmosMapControlButtonAppearance

    func testARestingControlKeepsTheMapSurfaceWhateverItsEmphasis() {
        let tinted = Appearance(pressed: false, emphasis: .tinted)
        XCTAssertEqual(tinted.surface, .chrome)
        XCTAssertEqual(tinted.icon, .ink)
        XCTAssertEqual(tinted.edge, .subtle)
        XCTAssertEqual(tinted, Appearance(pressed: false, emphasis: .filled))
    }

    func testTintedPressedColoursOnlyTheGlyphAndTheEdge() {
        let appearance = Appearance(pressed: true, emphasis: .tinted)
        XCTAssertEqual(appearance.surface, .chrome)
        XCTAssertEqual(appearance.icon, .theme)
        XCTAssertEqual(appearance.edge, .theme)
        XCTAssertEqual(appearance.label, .ink)
        XCTAssertEqual(appearance.caption, .muted)
    }

    func testFilledPressedInvertsTheSurfaceAndEveryLineOnIt() {
        let appearance = Appearance(pressed: true, emphasis: .filled)
        XCTAssertEqual(appearance.surface, .filled)
        XCTAssertEqual(appearance.icon, .onFill)
        XCTAssertEqual(appearance.label, .onFill)
        // A muted caption would sit at about 1.9:1 on the theme fill.
        XCTAssertEqual(appearance.caption, .onFill)
    }

    func testTintedIsTheDefaultEmphasis() {
        let view = KozmosMapControlButton(
            label: "Focus",
            systemImage: "location",
            pressed: true,
            action: {}
        )
        XCTAssertEqual(view.appearance, Appearance(pressed: true, emphasis: .tinted))
    }
}
