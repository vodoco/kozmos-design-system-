import XCTest
import Kozmos
@testable import KozmosPointrQA

/// The web adapter's tests, `POITaxonomy.test.ts`, case for case, plus the
/// shapes Design-QA's feature attributes actually arrive in.
final class TaxonomyPresenterTests: XCTestCase {
    func testTheProjectionIsThePinnedVersion() {
        XCTAssertEqual(TaxonomyDictionary.pinned.version, "10.12.0")
        XCTAssertEqual(TaxonomyProjection.version, "10.12.0")
        XCTAssertEqual(TaxonomyDictionary.pinned.properties.count, 60)
    }

    func testCapsHighlightsAfterPrioritySortingAndMergingCrowdAndWait() {
        let result = TaxonomyPresenter.present([
            "accessRestrictions": ["booking-required"], "occupancyStatus": "occupied",
            "dietaryOptions": ["Vegan"], "crowdLevel": "packed", "waitTime": 0,
            "isWheelchairAccessible": true, "priceRange": 3,
        ])
        XCTAssertEqual(result.summary.map(\.id), ["priceRange", "isWheelchairAccessible", "crowdLevel"])
        XCTAssertEqual(result.summary[2].detail, "0 min wait")
    }

    func testUsesValueIconsWithoutBorrowingThePropertyIconForTextOnlyEnumValues() {
        let result = TaxonomyPresenter.present([
            "cuisines": ["Italian"], "dietaryOptions": ["Vegan"], "hasWifi": true,
            "paymentMethods": ["Apple Pay"], "serviceOptions": "Takeout",
        ])
        let items = result.groups.flatMap(\.items)
        func icon(_ label: String) -> String? { items.first { $0.label == label }?.iconUrl }
        XCTAssertNil(icon("Italian"))
        XCTAssertNil(icon("Vegan"))
        XCTAssertTrue(icon("WiFi")?.contains("/properties/has-wifi.png") == true)
        XCTAssertTrue(icon("Apple Pay")?.contains("/values/payment-methods/apple-pay.png") == true)
        XCTAssertTrue(icon("Takeout")?.contains("/values/service-options/takeout.png") == true)
        XCTAssertEqual(result.issues, [])
    }

    func testPreservesMeaningfulFalseAndZeroAndOmitsUnsupportedFalseAndEmptyData() {
        let result = TaxonomyPresenter.present([
            "isWheelchairAccessible": false, "hasWifi": false, "waitTime": 0,
            "dietaryOptions": [String](), "crowdLevel": NSNull(),
        ])
        XCTAssertEqual(result.summary.map(\.value), ["Not Wheelchair Accessible", "0 min wait"])
        XCTAssertEqual(result.groups.flatMap(\.items).map(\.label), ["Not Wheelchair Accessible"])
    }

    func testSortsHighlightsIndependentlyCombinesCrowdAndWaitAndDoesNotDuplicateHighlightOnlyFields() {
        let result = TaxonomyPresenter.present([
            "occupancyStatus": "occupied", "waitTime": 0, "crowdLevel": "busy", "priceRange": 3, "hasWifi": true,
        ])
        XCTAssertEqual(result.summary.map(\.id), ["priceRange", "crowdLevel", "occupancyStatus"])
        XCTAssertEqual(result.summary[0].priceLevel, 3)
        XCTAssertEqual(result.summary[0].value, "3 of 4")
        XCTAssertEqual(result.summary[1].value, "Busy")
        XCTAssertEqual(result.summary[1].detail, "0 min wait")
        XCTAssertEqual(result.summary[1].tone, .warning)
        XCTAssertEqual(result.summary[2].value, "Occupied")
        XCTAssertEqual(result.summary[2].tone, .danger)
        XCTAssertEqual(result.groups.map(\.heading), ["Amenities"])
    }

    func testDoesNotInventColorsAbsentFromTheDictionary() {
        XCTAssertEqual(TaxonomyPresenter.present(["occupancyStatus": "closed"]).summary.first?.tone, .neutral)
    }

    func testRejectsMalformedDataUndocumentedObjectShapesAndUnsafeNumericValues() throws {
        let json = #"{"constructor":true,"hasWifi":"true","serviceOptions":["Takeout"],"rating":{"score":4.7},"waitTime":-1,"priceRange":5,"cuisines":["constructor"]}"#
        let values = try XCTUnwrap(JSONSerialization.jsonObject(with: Data(json.utf8)) as? [String: Any])
        let result = TaxonomyPresenter.present(values)
        XCTAssertEqual(result.summary, [])
        XCTAssertEqual(result.groups, [])
        XCTAssertEqual(result.issues.count, 7, result.issues.joined(separator: "; "))
        XCTAssertEqual(TaxonomyPresenter.present(["waitTime": Double.infinity, "capacity": 1.5]).groups, [])
    }

    func testDoesNotExposeContactURLsOrInternalIdentifiersAsTags() {
        let result = TaxonomyPresenter.present(["bookingUrl": "javascript:alert(1)", "eid": "internal", "name": "Name"])
        XCTAssertEqual(result.groups, [])
        XCTAssertEqual(result.summary, [])
    }

    func testDeduplicatesValuesAndUsesStablePropertyAndValueIds() {
        let result = TaxonomyPresenter.present(["cuisines": ["Italian", "Italian", "Pizza"]])
        XCTAssertEqual(result.groups.first?.items.map(\.id), ["cuisines:Italian", "cuisines:Pizza"])
    }

    /// A custom highlight takes the dictionary's priority for its key, but
    /// only when the place has a value for it.
    func testCustomHighlightsRideOnTheDictionarysPriority() {
        let rating = KozmosPOIDetailSummary(id: "custom", label: "Rating", value: "4.7 / 5", systemImage: "star")
        let with = TaxonomyPresenter.present(["rating": 4.7, "priceRange": 2], customHighlights: ["rating": rating])
        XCTAssertEqual(with.summary.map(\.id), ["rating", "priceRange"])
        XCTAssertEqual(with.summary[0].value, "4.7 / 5")
        let without = TaxonomyPresenter.present(["priceRange": 2], customHighlights: ["rating": rating])
        XCTAssertEqual(without.summary.map(\.id), ["priceRange"])
    }

    // MARK: - Design-QA's shapes

    /// Feature attributes arrive through Objective-C: a boolean and a number
    /// are both `NSNumber`. `hasAssistance: true` must not read as the integer 1.
    func testObjectiveCBooleansAndNumbersAreToldApart() {
        XCTAssertEqual(TaxonomyPresenter.Scalar(NSNumber(value: true)), .bool(true))
        XCTAssertEqual(TaxonomyPresenter.Scalar(NSNumber(value: 1)), .integer(1))
        XCTAssertEqual(TaxonomyPresenter.Scalar(NSNumber(value: 1.5)), .number(1.5))
        XCTAssertEqual(TaxonomyPresenter.Scalar(true), .bool(true))
        XCTAssertEqual(TaxonomyPresenter.Scalar(3), .integer(3))
        XCTAssertNil(TaxonomyPresenter.Scalar([1]))
        let result = TaxonomyPresenter.present(["hasAssistance": NSNumber(value: true), "isWheelchairAccessible": NSNumber(value: true)])
        XCTAssertEqual(result.groups.flatMap(\.items).map(\.label), ["Wheelchair Friendly", "Assistance Available"])
        XCTAssertEqual(result.issues, [])
    }

    /// The attributes of a Design-QA lounge, bank desk and store, as logged
    /// from the SDK: taxonomy properties beside the CMS's own keys.
    func testDesignQAAttributesPresentAsTheWebWould() {
        let result = TaxonomyPresenter.present([
            "accessRestrictions": ["membership-required"],
            "genderDesignation": "female",
            "serviceTypes": ["Banking and Credit Union", "Currency Exchange"],
            "productTypes": ["Books and Media"],
            "isWheelchairAccessible": NSNumber(value: true),
            "mapPersonas": ["visitor", "customer"],
            "Payment Options": "<p>Cash or credit card</p>",
            "unitNumber": "101",
            "Apple Primary Category": "food.coffee",
        ])
        XCTAssertEqual(result.summary.map(\.id), ["isWheelchairAccessible", "accessRestrictions"])
        XCTAssertEqual(result.summary[0].value, "Wheelchair Friendly")
        XCTAssertEqual(result.summary[1].tone, .brand)
        XCTAssertTrue(result.summary[1].iconUrl?.contains("/properties/access-restrictions.png") == true)
        XCTAssertEqual(result.groups.map(\.heading),
                       ["Product Types", "Service Types", "Accessibility", "Gender Designation", "Access Restrictions"])
        XCTAssertEqual(result.groups[1].items.map(\.label), ["Banking and Credit Union", "Currency Exchange"])
        XCTAssertNil(result.groups[1].items[0].iconUrl, "service types have a property icon, not value icons; chips stay text-only")
        XCTAssertEqual(result.groups[3].items.map(\.label), ["Female"])
        XCTAssertEqual(result.groups[4].items.map(\.label), ["Membership Required"])
        XCTAssertEqual(result.issues, ["Unknown properties: Apple Primary Category, Payment Options, mapPersonas, unitNumber"])
    }
}
