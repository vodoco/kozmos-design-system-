import XCTest
import SwiftUI
@testable import Kozmos

/// The glass surface role, measured: translucent over what is behind it,
/// and the plain background colour when transparency is reduced.
final class KozmosGlassSurfaceTests: XCTestCase {
    func testTheRoleReadsTheGlassToken() {
        let glass = KozmosEffects.semanticsEffectGlass
        XCTAssertEqual(glass.opacity, 0.7, accuracy: 0.001)
        XCTAssertEqual(glass.blur, 20)
        XCTAssertEqual(glass.saturation, 1.8, accuracy: 0.001)
        XCTAssertEqual(glass.borderOpacity, 0.2, accuracy: 0.001)
    }

    #if os(iOS)
    @MainActor private func render(reduceTransparency: Bool) async throws -> RenderedPixels {
        let view = ZStack {
            Color.red
            Color.clear
                .frame(width: 120, height: 60)
                .modifier(KozmosGlassSurface(shape: RoundedRectangle(cornerRadius: 12), reduceTransparency: reduceTransparency))
        }
        return try await RenderedPixels.render(view, size: CGSize(width: 200, height: 120))
    }

    /// Over pure red, the surface's middle is neither red nor white: the
    /// tint at the token's opacity over what shows through.
    @MainActor func testTheSurfaceIsTranslucentOverWhatIsBehindIt() async throws {
        let pixels = try await render(reduceTransparency: false)
        let centre = pixels.color(at: CGPoint(x: 100, y: 60))
        XCTAssertGreaterThan(centre.r, 200, "the red behind the surface does not show through: \(centre)")
        XCTAssertGreaterThan(centre.g, 100, "the surface is not tinted at all: \(centre)")
        XCTAssertLessThan(centre.g, 250, "the surface is opaque: \(centre)")
        // The system's red is (255, 59, 48).
        let outside = pixels.color(at: CGPoint(x: 10, y: 10))
        XCTAssertLessThan(outside.g, 80, "the backdrop is not red: \(outside)")
        XCTAssertLessThan(outside.b, 80, "the backdrop is not red: \(outside)")
    }

    /// With Reduce Transparency, the surface is the background colour, whole.
    @MainActor func testReducedTransparencyMakesTheSurfaceOpaque() async throws {
        let pixels = try await render(reduceTransparency: true)
        let centre = pixels.color(at: CGPoint(x: 100, y: 60))
        XCTAssertGreaterThan(centre.g, 250, "the surface still lets the red through: \(centre)")
        XCTAssertGreaterThan(centre.b, 250, "the surface still lets the red through: \(centre)")
    }
    #endif
}
