import XCTest
import SwiftUI
@testable import Kozmos

/// The island as React and Compose draw it: a 240 × 44 capsule, a 360 × 160
/// card, and a 56 circle. Until 2026-09-22 SwiftUI drew the capsule 36 high
/// and as wide as its container, and the circle at 48.
final class KozmosDynamicIslandTests: XCTestCase {
    #if os(iOS)
    private static func isIsland(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { r < 40 && g < 40 && b < 40 }

    /// The black the island draws, on white, in points.
    @MainActor private func islandBox(
        _ state: KozmosDynamicIsland<Color, Color, Color, Color>.IslandState
    ) async throws -> CGRect {
        let island = KozmosDynamicIsland(
            state: state,
            expandedContent: { Color.clear },
            compactLeading: { Color.clear },
            compactTrailing: { Color.clear },
            minimalContent: { Color.clear }
        )
        let size = CGSize(width: 440, height: 240)
        let pixels = try await RenderedPixels.render(ZStack { Color.white; island }, size: size)
        return try XCTUnwrap(
            pixels.boundingBox(in: CGRect(origin: .zero, size: size), where: Self.isIsland),
            "no island drawn in \(state)"
        )
    }

    @MainActor func testTheCompactIslandIsA240By44Capsule() async throws {
        let box = try await islandBox(.compact)
        XCTAssertEqual(box.width, 240, accuracy: 2, "the compact island is not 240 wide: \(box)")
        XCTAssertEqual(box.height, 44, accuracy: 1, "the compact island is not 44 high: \(box)")
    }

    @MainActor func testTheExpandedIslandIsA360By160Card() async throws {
        let box = try await islandBox(.expanded)
        XCTAssertEqual(box.width, 360, accuracy: 1, "the expanded island is not 360 wide: \(box)")
        XCTAssertEqual(box.height, 160, accuracy: 1, "the expanded island is not 160 high: \(box)")
    }

    @MainActor func testTheMinimalIslandIsA56Circle() async throws {
        let box = try await islandBox(.minimal)
        XCTAssertEqual(box.width, 56, accuracy: 2, "the minimal island is not 56 wide: \(box)")
        XCTAssertEqual(box.height, 56, accuracy: 2, "the minimal island is not 56 high: \(box)")
    }
    #endif
}
