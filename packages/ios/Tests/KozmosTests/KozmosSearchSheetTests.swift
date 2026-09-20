import XCTest
import SwiftUI
@testable import Kozmos

/// The search sheet's parts on the prototype's geometry, measured: the
/// tile's icon square, the result row, the search field, the marker, the
/// AI search's ring.
final class KozmosSearchSheetTests: XCTestCase {
    #if os(iOS)
    private static func isBlue(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { b > 120 && Int(b) > Int(r) + 40 && Int(b) > Int(g) + 20 }
    /// A colour with a hue: far from white and from grey.
    private static func isSaturated(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { Int(max(r, g, b)) - Int(min(r, g, b)) > 70 }

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

    /// The AI search, the prototype's: a 48 circle whose gradient ring is a
    /// band two and a half wide around a 43 white disc — minimal, not a
    /// collar — with the 16 icon in the theme's colour at the centre.
    @MainActor func testTheAISearchIsAThinRingAroundAWhiteDisc() async throws {
        let size = CGSize(width: 80, height: 80)
        let view = KozmosAISearchButton(action: {}).frame(width: 80, height: 80).background(Color.white)
        let pixels = try await RenderedPixels.render(view, size: size)
        // The band is the rainbow: any saturated colour, not one hue.
        let ring = try XCTUnwrap(pixels.boundingBox(in: CGRect(origin: .zero, size: size), where: Self.isSaturated), "no ring")
        XCTAssertEqual(ring.width, 48, accuracy: 2, "the ring is not the button's 48: \(ring)")
        // Along a radius, past the icon at the centre: the white disc, then
        // the band, then the white background.
        let centre = CGPoint(x: 40, y: 40)
        var band = 0
        var firstBlue: CGFloat?
        for offset in stride(from: 12, through: 30, by: 0.5) {
            let colour = pixels.color(at: CGPoint(x: centre.x + CGFloat(offset), y: centre.y))
            if Self.isSaturated(colour.r, colour.g, colour.b) {
                if firstBlue == nil { firstBlue = CGFloat(offset) }
                band += 1
            }
        }
        let bandWidth = CGFloat(band) * 0.5
        XCTAssertEqual(bandWidth, 2.5, accuracy: 1.25, "the ring's band is not two and a half wide: \(bandWidth)")
        XCTAssertEqual(try XCTUnwrap(firstBlue), 21.5, accuracy: 1.5, "the band does not start at the 43 disc's edge: \(String(describing: firstBlue))")
        let disc = pixels.color(at: CGPoint(x: 40, y: 28))
        XCTAssertGreaterThan(disc.g, 240, "the disc is not white: \(disc)")
    }
    #endif
}

/// The category field: the search field's form with a category chosen, the
/// prototype's geometry in the category's colour.
final class KozmosCategoryFieldTests: XCTestCase {
    #if os(iOS)
    private static func isOrange(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { r > 200 && g > 60 && g < 140 && b < 60 }

    /// 48 tall; the pill and the border in the colour, the fill the colour's tint.
    @MainActor func testTheFieldIsFortyEightTallWithThePillAndBorderInTheColour() async throws {
        let view = KozmosCategoryField(label: "Dining", count: 19, tint: KozmosColors.semanticsDataOrange, onClear: {}) {
            Image(systemName: "fork.knife").font(.system(size: 20))
        }
        .frame(width: 254)
        .padding(16)
        .background(Color.white)
        let pixels = try await RenderedPixels.render(view, size: CGSize(width: 286, height: 80))
        let whole = CGRect(x: 0, y: 0, width: 286, height: 80)
        let coloured = try XCTUnwrap(pixels.boundingBox(in: whole, where: Self.isOrange), "nothing in the category's colour")
        XCTAssertEqual(coloured.height, 48, accuracy: 1.5, "the field is not 48 tall: \(coloured)")
        XCTAssertEqual(coloured.width, 254, accuracy: 1.5, "the border does not span the field: \(coloured)")
        // Inside the border the fill is the tint, not the colour: light, warm, not white.
        let fill = pixels.color(at: CGPoint(x: 200, y: 40))
        XCTAssertGreaterThan(fill.r, 235, "the fill is not a light tint: \(fill)")
        XCTAssertLessThan(fill.b, 240, "the fill is white, not the colour's tint: \(fill)")
        XCTAssertGreaterThan(Int(fill.r) - Int(fill.b), 8, "the fill carries no warmth of the colour: \(fill)")
        // The count pill: a solid run of the colour 22 tall, right of the label.
        let pill = try XCTUnwrap(pixels.boundingBox(in: CGRect(x: 100, y: 20, width: 80, height: 40), where: Self.isOrange), "no count pill")
        XCTAssertEqual(pill.height, 22, accuracy: 1.5, "the pill is not 22 tall: \(pill)")
    }
    #endif
}
