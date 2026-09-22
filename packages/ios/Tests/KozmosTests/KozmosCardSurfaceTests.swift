import XCTest
import SwiftUI
@testable import Kozmos

/// The three cards React puts on its Surface take React's `surface` prop:
/// solid by default, glass for a card over the map. On red, a solid card reads
/// white where nothing is drawn in it; a glass one lets the red through. Until
/// 2026-09-22 SwiftUI drew all three solid only.
final class KozmosCardSurfaceTests: XCTestCase {
    #if os(iOS)
    @MainActor private func cardPixel<V: View>(_ card: V) async throws -> (r: UInt8, g: UInt8, b: UInt8) {
        let size = CGSize(width: 380, height: 420)
        let view = ZStack(alignment: .topLeading) {
            Color(red: 1, green: 0, blue: 0)
            card.frame(width: 340).padding(20)
        }
        .environment(\.colorScheme, .light)
        let pixels = try await RenderedPixels.render(view, size: size)
        // Inside the card, in its padding, clear of the corner: nothing drawn but the surface.
        return pixels.color(at: CGPoint(x: 20 + 10, y: 20 + 40))
    }

    @MainActor func testTheCardsTakeReactsSurface() async throws {
        let cards: [(String, (KozmosSurfaceStyle) -> AnyView)] = [
            ("FeedbackCard", { AnyView(KozmosFeedbackCard(surface: $0)) }),
            ("SaveLocationCard", { AnyView(KozmosSaveLocationCard(surface: $0)) }),
            ("RoutingInputGroup", { AnyView(KozmosRoutingInputGroup(
                points: [KozmosRoutePoint(id: "a", value: ""), KozmosRoutePoint(id: "b", value: "")],
                surface: $0,
                onPointChange: { _, _ in }
            )) }),
        ]
        for (name, make) in cards {
            let solid = try await cardPixel(make(.solid))
            let glass = try await cardPixel(make(.glass))
            XCTAssertTrue(solid.r > 248 && solid.g > 248 && solid.b > 248, "\(name) solid is \(solid), not the background")
            XCTAssertTrue(glass.r > 200 && glass.g < 235 && glass.b < 235, "\(name) glass is \(glass): the red does not show through")
        }
    }
    #endif
}
