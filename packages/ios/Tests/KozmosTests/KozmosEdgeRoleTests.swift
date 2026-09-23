import XCTest
import SwiftUI
@testable import Kozmos

/// Edges in the Semantics.Border roles, as drawn. Until 2026-09-22 a field's
/// edge was foreground/300 (70, 74, 83), a text colour, and a separator the
/// system's own neutral grey; the roles are Input (116, 123, 139) and Subtle
/// (199, 202, 209), a cool grey, in light.
final class KozmosEdgeRoleTests: XCTestCase {
    #if os(iOS)
    /// The darkest pixel in `region`, which is the edge where nothing else is drawn.
    private func darkest(_ pixels: RenderedPixels, in region: CGRect) -> (r: UInt8, g: UInt8, b: UInt8) {
        var best: (r: UInt8, g: UInt8, b: UInt8) = (255, 255, 255)
        var y = region.minY
        while y < region.maxY {
            var x = region.minX
            while x < region.maxX {
                let colour = pixels.color(at: CGPoint(x: x, y: y))
                if Int(colour.r) + Int(colour.g) + Int(colour.b) < Int(best.r) + Int(best.g) + Int(best.b) { best = colour }
                x += 1 / pixels.scale
            }
            y += 1 / pixels.scale
        }
        return best
    }

    /// The search field's edge is the control boundary's role. Read along its
    /// left side, below the corner and away from the glass and the text.
    @MainActor func testTheSearchFieldsEdgeIsTheInputRole() async throws {
        let size = CGSize(width: 320, height: 100)
        let view = KozmosSearch(text: .constant(""), placeholder: "")
            .padding(16)
            .background(Color.white)
            .environment(\.colorScheme, .light)
        let pixels = try await RenderedPixels.render(view, size: size)
        let edge = darkest(pixels, in: CGRect(x: 10, y: 45, width: 12, height: 10))
        XCTAssertEqual(Double(edge.r), 116, accuracy: 14, "the field's edge is not Border/Input: \(edge)")
        XCTAssertGreaterThan(edge.r, 95, "the field's edge is a text colour: \(edge)")
    }

    /// A separator is the container edge's role, a cool grey, not the
    /// system's neutral one.
    @MainActor func testTheSeparatorIsTheBorderRole() async throws {
        let size = CGSize(width: 200, height: 40)
        let view = VStack { KozmosSeparator() }
            .frame(width: 200, height: 40)
            .background(Color.white)
            .environment(\.colorScheme, .light)
        let pixels = try await RenderedPixels.render(view, size: size)
        let rule = darkest(pixels, in: CGRect(x: 60, y: 0, width: 80, height: 40))
        XCTAssertLessThan(rule.r, 240, "no separator drawn")
        XCTAssertEqual(Double(rule.r), 199, accuracy: 12, "the separator is not Border/Subtle: \(rule)")
        XCTAssertGreaterThanOrEqual(Int(rule.b) - Int(rule.r), 6, "the separator is not the role's cool grey: \(rule)")
    }
    #endif
}
