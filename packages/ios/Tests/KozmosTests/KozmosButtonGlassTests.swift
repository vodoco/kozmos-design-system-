import XCTest
import SwiftUI
@testable import Kozmos

/// The glass variant of the button and the icon button is the glass surface:
/// over pure red its middle is the tint over what shows through, not the
/// dark chip of white at 16 % it used to be.
final class KozmosButtonGlassTests: XCTestCase {
    #if os(iOS)
    @MainActor private func render<V: View>(_ control: V) async throws -> RenderedPixels {
        let view = ZStack {
            Color.red
            control
        }
        return try await RenderedPixels.render(view, size: CGSize(width: 200, height: 120))
    }

    private func assertGlass(_ pixels: RenderedPixels, at point: CGPoint, _ what: String) {
        let centre = pixels.color(at: point)
        XCTAssertGreaterThan(centre.r, 200, "\(what): the red does not show through: \(centre)")
        XCTAssertGreaterThan(centre.g, 100, "\(what): a dark chip, not the glass tint: \(centre)")
        XCTAssertLessThan(centre.g, 250, "\(what): opaque: \(centre)")
    }

    @MainActor func testTheGlassButtonIsTheGlassSurface() async throws {
        let pixels = try await render(KozmosButton("Go", variant: .glass, action: {}))
        // Away from the label: 12 points in from the button's leading edge.
        let label = try XCTUnwrap(pixels.boundingBox(in: CGRect(x: 0, y: 0, width: 200, height: 120), where: RenderedPixels.isDarkText), "no label drawn")
        assertGlass(pixels, at: CGPoint(x: label.minX - 8, y: 60), "the button")
    }

    @MainActor func testTheGlassIconButtonIsTheGlassSurface() async throws {
        let pixels = try await render(KozmosIconButton(iconName: "plus", variant: .glass, action: {}))
        // Inside the circle, off the glyph: 8 points in from its top.
        assertGlass(pixels, at: CGPoint(x: 100, y: 60 - 22 + 8), "the icon button")
    }
    #endif
}
