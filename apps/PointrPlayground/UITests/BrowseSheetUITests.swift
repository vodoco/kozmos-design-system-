import XCTest

/// The initial sheet, driven the way a visitor drives it: it rests on the
/// search row and the first tile row; a drag on a tile grows it; the field
/// opens it to large; a query lists places and a place opens as a card at
/// half height with the sheet's place remembered; a tile becomes a chip.
/// Live Design-QA data, like the routing flow: not in CI.
///
/// The query is the first word of `TEST_RUNNER_KOZMOS_QA_DESTINATION`, or
/// the first tile's places when unset.
final class BrowseSheetUITests: XCTestCase {
    private var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
    }

    private func any(_ identifier: String) -> XCUIElement {
        app.descendants(matching: .any).matching(identifier: identifier).firstMatch
    }

    private func attach(_ name: String) {
        let shot = XCTAttachment(screenshot: app.screenshot())
        shot.name = name
        shot.lifetime = .keepAlways
        add(shot)
    }

    private func tile(_ name: String) -> XCUIElement {
        app.buttons.matching(NSPredicate(format: "label BEGINSWITH[c] %@", name)).firstMatch
    }

    /// The search field: the sheet's first row, wherever the sheet rests.
    private var field: XCUIElement { app.textFields.firstMatch }


    func testTheSheetRestsOnTheSearchRowGrowsUnderAFingerAndOpensForTheField() throws {
        app.launch()
        let height = app.frame.height
        XCTAssertTrue(tile("Favourites").waitForExistence(timeout: 120), "the quick-access tiles did not appear")
        XCTAssertTrue(field.exists, "no search field in the sheet")
        attach("1-rest")

        // Collapsed: the field sits in the lower fifth of the screen, with the map above it.
        let restingTop = field.frame.minY
        XCTAssertGreaterThan(restingTop, height * 0.6, "the sheet does not rest collapsed: the field is at \(restingTop) of \(height)")

        // A drag up from a tile's square — not from the handle — grows the
        // sheet, and does not open the tile it started on. From the square,
        // not the tile's centre: a resting tile's lower half lies in the home
        // indicator's band, where an upward swipe is the system's, not the app's.
        let square = tile("Favourites").coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.28))
        square.press(forDuration: 0.05, thenDragTo: square.withOffset(CGVector(dx: 0, dy: -300)), withVelocity: .slow, thenHoldForDuration: 0.15)
        let grownTop = field.frame.minY
        XCTAssertLessThan(grownTop, restingTop - 150, "a swipe on a tile did not grow the sheet: \(restingTop) → \(grownTop)")
        XCTAssertFalse(any("category-chip").exists, "the swipe opened the tile it started on")
        attach("2-dragged")

        // Tapping the field opens the sheet to large, and offers Cancel.
        field.tap()
        XCTAssertTrue(any("search-cancel").waitForExistence(timeout: 5), "no Cancel beside the focused, empty field")
        let openTop = field.frame.minY
        XCTAssertLessThan(openTop, height * 0.2, "the field's focus did not open the sheet to large: the field is at \(openTop)")
        attach("3-focused")

        // A query lists places; Filters replaces Cancel.
        // The named place's first word; the building the map opened on varies
        // between launches (handoff item G) and may not have it, so a vowel
        // stands in until some place matches.
        let destination = ProcessInfo.processInfo.environment["KOZMOS_QA_DESTINATION"] ?? ""
        var query = destination.split(separator: " ").first.map(String.init) ?? "a"
        field.typeText(query)
        // By identifier, as the routing flow finds it: the subscript also
        // matches labels, and the list's own name is a label too.
        let list = any("Points of interest")
        XCTAssertTrue(list.waitForExistence(timeout: 10), "no results for \(query)")
        var firstRow = list.buttons.firstMatch
        for standIn in ["a", "e", "o"] where !firstRow.waitForExistence(timeout: 5) {
            print("QA-SHEET no place matching \(query) in this building; trying \(standIn)")
            field.typeText(String(repeating: XCUIKeyboardKey.delete.rawValue, count: query.count) + standIn)
            query = standIn
            firstRow = list.buttons.firstMatch
        }
        XCTAssertTrue(firstRow.waitForExistence(timeout: 10), "no result rows for \(query)")
        XCTAssertTrue(app.buttons["Filters"].exists, "no Filters button with a query")
        XCTAssertFalse(any("search-cancel").exists, "Cancel still shown with a query")
        attach("4-results")

        // A row opens the card at half height; the search row is not in it.
        let rowName = firstRow.label
        firstRow.tap()
        XCTAssertTrue(any("poi-close").waitForExistence(timeout: 10), "the card did not open for \(rowName)")
        XCTAssertFalse(field.exists, "the search field is still shown over the card")
        let cardTop = any("poi-close").frame.minY
        XCTAssertGreaterThan(cardTop, height * 0.3, "the card did not open at half height: its close button is at \(cardTop)")
        XCTAssertLessThan(cardTop, height * 0.6, "the card did not open at half height: its close button is at \(cardTop)")
        attach("5-card")

        // Closing the card returns the search sheet where it was, query intact.
        any("poi-close").tap()
        XCTAssertTrue(field.waitForExistence(timeout: 5), "the search sheet did not return")
        XCTAssertEqual(field.value as? String, query, "the query was lost")
        XCTAssertLessThan(field.frame.minY, height * 0.2, "the sheet did not return to large")
        XCTAssertTrue(firstRow.waitForExistence(timeout: 5), "the results were lost")
        attach("6-returned")

        // Clearing the field brings the tiles back; the sheet stays.
        app.buttons["Clear search"].tap()
        XCTAssertTrue(tile("Favourites").waitForExistence(timeout: 5), "the tiles did not return after Clear")
        XCTAssertLessThan(field.frame.minY, height * 0.2, "Clear moved the sheet")

        // A tile becomes the chip in the field's place; its × brings the field back.
        tile("Gates").tap()
        XCTAssertTrue(any("category-chip").waitForExistence(timeout: 5), "no chip for the chosen tile")
        XCTAssertFalse(field.exists, "the field is still shown beside the chip")
        XCTAssertTrue(app.buttons["Filters"].exists, "no Filters button with a tile chosen")
        attach("7-chip")
        let remove = any("category-chip").buttons.firstMatch
        XCTAssertTrue(remove.exists, "the chip has no remove button")
        remove.tap()
        XCTAssertTrue(field.waitForExistence(timeout: 5), "the field did not return after the chip was removed")
        XCTAssertTrue(tile("Favourites").exists, "the tiles did not return after the chip was removed")
        attach("8-back-to-tiles")
    }
}
