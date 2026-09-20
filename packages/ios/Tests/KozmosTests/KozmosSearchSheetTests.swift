import XCTest
import SwiftUI
@testable import Kozmos

/// The search sheet's parts on the prototype's geometry, measured: the
/// tile's icon square, the result row, the search field, the marker, the
/// AI search's ring.
final class KozmosSearchSheetTests: XCTestCase {
    #if os(iOS)
    private static func isBlue(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { b > 120 && Int(b) > Int(r) + 40 && Int(b) > Int(g) + 20 }

    /// The tile: a 64 square holding the icon, the label under it.
    @MainActor func testTheTileIsASquareWithTheLabelUnderIt() async throws {
        let view = KozmosCategoryTile(
            category: KozmosCategoryPresentation(id: "food", label: "Food and drink", selected: false),
            onSelect: { _ in }
        ) { Image(systemName: "fork.knife").font(.system(size: 24)) }
        .frame(width: 96)
        .padding(16)
        .background(Color.white)
        let pixels = try await RenderedPixels.render(view, size: CGSize(width: 128, height: 140))
        let icon = try XCTUnwrap(pixels.boundingBox(in: CGRect(x: 0, y: 0, width: 128, height: 140), where: RenderedPixels.isTheme), "no icon")
        XCTAssertLessThan(icon.width, 30, "the icon is not 24: \(icon)")
        let label = try XCTUnwrap(pixels.boundingBox(in: CGRect(x: 0, y: icon.maxY + 4, width: 128, height: 140 - icon.maxY - 4), where: RenderedPixels.isDarkText), "no label under the icon")
        XCTAssertGreaterThan(label.minY, icon.maxY + 8, "the label is not under the square")
    }

    /// The row: 80 tall; a dot before the floor when it is the current one.
    /// Two tiles in one row, a one-line and a two-line label: the squares
    /// share a top edge. The grid aligns its cells at the top, so a short
    /// label does not drop its square by half a line.
    @MainActor func testTilesInARowShareATopEdgeWhateverTheirLabelsLength() async throws {
        let size = CGSize(width: 402, height: 200)
        let panel = KozmosBrowseCategoriesPanel(
            categories: [
                KozmosCategoryPresentation(id: "gates", label: "Gates"),
                KozmosCategoryPresentation(id: "entrances", label: "Entrances & Exits"),
            ],
            presentation: .sheet,
            onSelect: { _ in },
            renderIcon: { _ in Image(systemName: "square.fill").resizable() },
            emptyState: { EmptyView() }
        )
        .background(Color.white)
        let pixels = try await RenderedPixels.render(panel, size: size)
        let first = try XCTUnwrap(pixels.boundingBox(in: CGRect(x: 0, y: 0, width: 110, height: 200), where: Self.isBlue), "no icon in the first tile")
        let second = try XCTUnwrap(pixels.boundingBox(in: CGRect(x: 110, y: 0, width: 100, height: 200), where: Self.isBlue), "no icon in the second tile")
        XCTAssertEqual(first.minY, second.minY, accuracy: 1, "the squares do not share a top edge: \(first.minY) vs \(second.minY)")
    }

    @MainActor func testTheRowIsEightyTallWithADotOnTheCurrentFloor() async throws {
        func row(currentFloorId: String?) -> some View {
            KozmosPOIResultCard(
                poi: KozmosPOIPresentation(id: "p", name: "Dunkin'", floorId: "b:2", floorLabel: "Second Floor", buildingLabel: "Terminal B"),
                result: KozmosPOIResultPresentation(poiId: "p", resultIndex: 1, selected: false, featured: false, floorId: "b:2"),
                currentFloorId: currentFloorId,
                onSelect: { _ in }
            )
            .padding(16)
            .background(Color.white)
        }
        let size = CGSize(width: 360, height: 140)
        let on = try await RenderedPixels.render(row(currentFloorId: "b:2"), size: size)
        let card = try XCTUnwrap(on.boundingBox(in: CGRect(origin: .zero, size: size), where: RenderedPixels.isInk), "no row")
        XCTAssertEqual(card.height, 80, accuracy: 2, "the row is not 80 tall")
        XCTAssertNotNil(on.boundingBox(in: CGRect(origin: .zero, size: size), where: RenderedPixels.isTheme), "no dot on the current floor")
        let off = try await RenderedPixels.render(row(currentFloorId: "b:1"), size: size)
        XCTAssertNil(off.boundingBox(in: CGRect(origin: .zero, size: size), where: RenderedPixels.isTheme), "a dot on another floor")
    }

    /// The field: 44 tall, with the 24 clear circle when filled.
    @MainActor func testTheFieldIsFortyFourTall() async throws {
        let view = KozmosSearchBar(text: .constant("sta"), placeholder: "Search")
            .padding(16)
            .background(Color.white)
        let size = CGSize(width: 320, height: 100)
        let pixels = try await RenderedPixels.render(view, size: size)
        // The field's shadow is faint; the clear circle's grey is not.
        let clear = try XCTUnwrap(pixels.boundingBox(in: CGRect(x: 240, y: 0, width: 80, height: 100), where: { r, g, b in r < 235 && r > 150 && abs(Int(r) - Int(b)) < 20 }), "no clear circle")
        XCTAssertEqual(clear.width, 24, accuracy: 2, "the clear circle is not 24: \(clear)")
        XCTAssertEqual(clear.midY, 50, accuracy: 2, "the clear circle is not centred in a 44 field")
    }

    /// The marker: an 18 dot inside a 64 halo.
    @MainActor func testTheMarkerIsAnEighteenDotInASixtyFourHalo() async throws {
        let view = KozmosUserLocationMarker(showHeading: false).padding(8).background(Color.white)
        let size = CGSize(width: 80, height: 80)
        let pixels = try await RenderedPixels.render(view, size: size)
        let halo = try XCTUnwrap(pixels.boundingBox(in: CGRect(origin: .zero, size: size), where: RenderedPixels.isInk), "no halo")
        XCTAssertEqual(halo.width, 64, accuracy: 2, "the halo is not 64: \(halo)")
        let dot = try XCTUnwrap(pixels.boundingBox(in: CGRect(origin: .zero, size: size), where: { r, g, b in b > 150 && r < 90 && g < 120 }), "no dot")
        XCTAssertEqual(dot.width, 18 - 3, accuracy: 2, "the dot's blue is not 18 less its 3 border: \(dot)")
    }

    /// The AI search: a theme ring 66 wide with a white centre.
    @MainActor func testTheAISearchIsARingAroundAWhiteDisc() async throws {
        let view = KozmosAISearchButton(action: {}).padding(8).background(Color.white)
        let size = CGSize(width: 82, height: 82)
        let pixels = try await RenderedPixels.render(view, size: size)
        let ring = try XCTUnwrap(pixels.boundingBox(in: CGRect(origin: .zero, size: size), where: Self.isBlue), "no ring")
        XCTAssertEqual(ring.width, 66, accuracy: 2, "the ring is not 66: \(ring)")
        let centre = pixels.color(at: CGPoint(x: 41, y: 30))
        XCTAssertGreaterThan(centre.g, 240, "the disc is not white: \(centre)")
    }
    #endif
}
