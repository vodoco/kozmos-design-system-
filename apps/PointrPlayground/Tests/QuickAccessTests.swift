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

    func testTermsAreTheWordsOfTheNameAndTheMatchersWithoutTheStopWords() {
        let gates = QuickAccess.terms(
            name: "Gates",
            matchers: [
                ["mainType": "transportation-space", "subType": "boarding-gate"],
                ["mainType": "service-space", "subType": "office", "serviceTypes": ["Travel and Tourism"]]
            ]
        )
        XCTAssertEqual(gates, ["gates", "transportation", "boarding", "gate", "service", "office", "travel", "tourism"])
        XCTAssertFalse(gates.contains("space"), "every matcher carries 'space'")
        XCTAssertFalse(gates.contains("and"))
    }

    func testAPlaceMatchesOnWholeWordsOfItsNameTagsOrKeywords() {
        let gates = QuickAccessCategory(id: "gates", name: "Gates", icon: .symbol("x"), terms: ["gates", "boarding", "gate"])
        let dining = QuickAccessCategory(id: "dining", name: "Dining", icon: .symbol("x"), terms: ["dining", "food", "restaurant", "cafes", "coffee", "bar"])
        XCTAssertTrue(QuickAccess.matches(gates, name: "Gate B4", freeText: []))
        XCTAssertFalse(QuickAccess.matches(gates, name: "Gateway Lounge", freeText: []), "a whole word, not a prefix")
        XCTAssertTrue(QuickAccess.matches(dining, name: "Starbucks", freeText: ["coffee", "cafe"]))
        XCTAssertFalse(QuickAccess.matches(dining, name: "Barber", freeText: []), "'bar' is not a word of 'Barber'")
        XCTAssertFalse(QuickAccess.matches(QuickAccessCategory(id: "f", name: "Favourites", icon: .symbol("heart"), terms: []), name: "Gate B4", freeText: []), "a personal tile matches nothing by words")
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
