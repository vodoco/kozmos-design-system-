import XCTest
@testable import KozmosPointrQA

/// The vendored quick-access bar and the stand-in matching a tile searches with.
final class QuickAccessTests: XCTestCase {
    func testTheVendoredFileCarriesTheSixteenAviationCategoriesInTheTaxonomysOrder() {
        let categories = QuickAccess.categories
        XCTAssertEqual(categories.count, 16, "the aviation quick-access bar has sixteen categories")
        XCTAssertEqual(categories.first?.name, "Entrances & Exits")
        XCTAssertEqual(categories.map(\.name)[3], "Gates")
        XCTAssertEqual(categories.last?.name, "Pet-Friendly")
        XCTAssertEqual(categories.first?.icon, .bundled("quick-access-entrances-exits"))
    }

    func testThePersonalTilesComeFirstAsInThePrototype() {
        XCTAssertEqual(QuickAccess.tiles.prefix(2).map(\.id), [QuickAccess.favouritesId, QuickAccess.bookmarksId])
        XCTAssertEqual(QuickAccess.tiles.count, 18)
    }

    func testEveryBundledIconExists() {
        for category in QuickAccess.categories {
            guard case .bundled(let name) = category.icon else { continue }
            XCTAssertNotNil(UIImage(named: name), "no icon bundled for \(category.name): \(name)")
        }
    }

    func testTheWordsAreTheTaxonomysOwnForEachMatchedType() throws {
        let gates = try XCTUnwrap(QuickAccess.category(id: "gates"))
        // Boarding Gate's name and aliases, and the office matcher's service — not every office.
        for phrase in ["boarding gate", "gate", "gates", "flight gate", "travel and tourism"] {
            XCTAssertTrue(gates.terms.contains(phrase), "Gates lacks \(phrase): \(gates.terms)")
        }
        XCTAssertFalse(gates.terms.contains("office"), "an office matcher with a service type is the service, not the office")
        XCTAssertFalse(gates.terms.contains("law firm"))
        let restrooms = try XCTUnwrap(QuickAccess.category(id: "restrooms"))
        for phrase in ["restroom", "toilet", "washroom"] {
            XCTAssertTrue(restrooms.terms.contains(phrase), "Restrooms lacks \(phrase)")
        }
        XCTAssertEqual(gates.tint, .yellow, "the taxonomy's icon for gates is the yellow one")
        XCTAssertEqual(try XCTUnwrap(QuickAccess.category(id: "dining")).tint, .orange)
        XCTAssertEqual(try XCTUnwrap(QuickAccess.category(id: QuickAccess.favouritesId)).tint, .theme)
    }

    func testAPlaceMatchesWhenAPhraseRunsWholeThroughItsNameTagsOrKeywords() {
        let gates = QuickAccessCategory(id: "gates", name: "Gates", icon: .symbol("x"), terms: ["gate", "gates", "flight gate"], tint: .yellow)
        let dining = QuickAccessCategory(id: "dining", name: "Dining", icon: .symbol("x"), terms: ["cafes, coffee & tea houses", "coffee shop", "bar"], tint: .orange)
        XCTAssertTrue(QuickAccess.matches(gates, name: "Gate B4", freeText: []))
        XCTAssertTrue(QuickAccess.matches(gates, name: "Flight Gate 12", freeText: []))
        XCTAssertFalse(QuickAccess.matches(gates, name: "Gateway Lounge", freeText: []), "a whole word, not a prefix")
        XCTAssertTrue(QuickAccess.matches(dining, name: "Starbucks", freeText: ["coffee shop"]), "a phrase in a tag")
        XCTAssertFalse(QuickAccess.matches(dining, name: "Coffee Table Store", freeText: []), "'coffee shop' does not run through 'coffee table'")
        XCTAssertFalse(QuickAccess.matches(dining, name: "Barber", freeText: []), "'bar' is not a word of 'Barber'")
        XCTAssertFalse(QuickAccess.matches(QuickAccessCategory(id: "f", name: "Favourites", icon: .symbol("heart"), terms: [], tint: .theme), name: "Gate B4", freeText: []), "a personal tile matches nothing by words")
    }

    func testTheRealGatesAndRestroomsCategoriesTellAGateFromARestroom() throws {
        let gates = try XCTUnwrap(QuickAccess.category(id: "gates"))
        let restrooms = try XCTUnwrap(QuickAccess.category(id: "restrooms"))
        XCTAssertTrue(QuickAccess.matches(gates, name: "Gate 122", freeText: []))
        XCTAssertFalse(QuickAccess.matches(restrooms, name: "Gate 122", freeText: []))
        XCTAssertTrue(QuickAccess.matches(restrooms, name: "Restroom", freeText: []))
        XCTAssertFalse(QuickAccess.matches(gates, name: "Restroom", freeText: []))
    }
}
