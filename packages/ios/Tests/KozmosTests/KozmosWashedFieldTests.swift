import XCTest
import SwiftUI
@testable import Kozmos

/// The feedback card's comment box is washed, as React's is and as the route
/// points are: black at 5 % on the card, no edge, 80 high at least. Until
/// 2026-09-22 it was the outlined text area, white with the Input role's edge.
final class KozmosWashedFieldTests: XCTestCase {
    #if os(iOS)
    @MainActor func testTheCommentBoxIsWashedNotOutlined() async throws {
        let size = CGSize(width: 380, height: 460)
        let view = ZStack(alignment: .topLeading) {
            Color.white
            KozmosFeedbackCard().frame(width: 340).padding(20)
        }
        .environment(\.colorScheme, .light)
        let pixels = try await RenderedPixels.render(view, size: size)
        let near = { (r: UInt8, g: UInt8, b: UInt8, to: (Int, Int, Int), by: Int) -> Bool in
            abs(Int(r) - to.0) <= by && abs(Int(g) - to.1) <= by && abs(Int(b) - to.2) <= by
        }
        // The box's interior is one flat wash: the longest run of it down any
        // column is the box's height there. Anti-aliased text makes the same
        // grey in ones and twos, never in a run.
        let step = 1 / pixels.scale
        var best: (x: CGFloat, top: CGFloat, length: CGFloat) = (0, 0, 0)
        var x: CGFloat = 20
        while x < 360 {
            var y: CGFloat = 20, top: CGFloat = 0, run: CGFloat = 0
            while y < 440 {
                let c = pixels.color(at: CGPoint(x: x, y: y))
                if near(c.r, c.g, c.b, (242, 242, 242), 1) {
                    if run == 0 { top = y }
                    run += step
                    if run > best.length { best = (x, top, run) }
                } else {
                    run = 0
                }
                y += step
            }
            x += 4
        }
        XCTAssertGreaterThanOrEqual(best.length, 79, "the longest wash down a column is \(best.length) at x \(best.x)")
        // Just outside the wash, above and below: the card, not an edge.
        for probe in [best.top - 1.5, best.top + best.length + 1] {
            let c = pixels.color(at: CGPoint(x: best.x, y: probe))
            XCTAssertTrue(c.r > 245 && c.g > 245 && c.b > 245, "at y \(probe) the box meets \(c), not the card")
        }
    }
    #endif
}
