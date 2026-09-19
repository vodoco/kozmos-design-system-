import XCTest
import PointrKit
import Kozmos
@testable import KozmosPointrQA

final class SDKIntegrationTests: XCTestCase {
    private func configuration(_ baseUrl: String = "https://design-qa-v10.pointr.cloud", license: String = "test-only") throws -> Data {
        try JSONSerialization.data(withJSONObject: [
            "baseUrl": baseUrl, "clientIdentifier": "test-client", "licenseKey": license,
            "siteId": "00000000-0000-0000-0000-000000000001",
            "buildingId": "00000000-0000-0000-0000-000000000002"
        ])
    }
    func testApprovedConfigurationDecodes() throws {
        XCTAssertEqual(try QAConfiguration.decode(configuration()).clientIdentifier, "test-client")
    }
    func testRejectsOtherOriginsAndEmbeddedSecretsInURL() throws {
        for url in ["http://design-qa-v10.pointr.cloud", "https://example.com", "https://user:password@design-qa-v10.pointr.cloud", "https://design-qa-v10.pointr.cloud?token=test", "https://design-qa-v10.pointr.cloud/other"] {
            XCTAssertThrowsError(try QAConfiguration.decode(configuration(url)))
        }
    }
    func testRejectsMissingAndBlankConfiguration() throws {
        XCTAssertThrowsError(try QAConfiguration.decode(Data("{}".utf8)))
        XCTAssertThrowsError(try QAConfiguration.decode(configuration(license: "  ")))
    }
    func testRemoteArtworkRequiresHTTPS() {
        XCTAssertNil(SDKPOIAdapter.https(nil))
        XCTAssertNil(SDKPOIAdapter.https("http://example.com/icon.png"))
        XCTAssertNil(SDKPOIAdapter.https("file:///tmp/icon.png"))
        XCTAssertEqual(SDKPOIAdapter.https("https://example.com/icon.png"), "https://example.com/icon.png")
    }

    /// The same rule as the card's own artwork helper: no credentials, no
    /// other schemes, no relative paths. Values are not echoed in messages.
    func testRemoteArtworkRejectsCredentialsAndOtherSchemes() {
        for url in ["https://user:password@example.com/icon.png", "https://user@example.com/icon.png",
                    "javascript:alert(1)", "data:image/png;base64,abc", "icon.png", "https:///no-host.png", ""] {
            XCTAssertNil(SDKPOIAdapter.https(url), "a refused address was accepted")
        }
        XCTAssertNotNil(SDKPOIAdapter.https("HTTPS://example.com/upper-case-scheme.png"))
    }

    /// Filtered before numbering: a dropped address does not leave a gap in
    /// "image N of M", and the identifiers stay unique.
    func testGalleryMediaIsNumberedAfterFiltering() {
        let media = SDKPOIAdapter.media(poiId: "poi-1", name: "Dunkin'", urls: [
            "https://example.com/logo.png", "http://example.com/dropped.jpg", "https://example.com/counter.jpg"
        ])
        XCTAssertEqual(media.map(\.src), ["https://example.com/logo.png", "https://example.com/counter.jpg"])
        XCTAssertEqual(media.map(\.alt), ["Dunkin', image 1", "Dunkin', image 2"])
        XCTAssertEqual(Set(media.map(\.id)).count, 2)
        XCTAssertEqual(SDKPOIAdapter.media(poiId: "poi-1", name: "Empty", urls: []), [])
    }
    // MARK: The card's details from the SDK's fields

    private func details(
        name: String = "Dunkin'", attributes: [String: Any] = [:],
        rating: Double = -999_999, ratingMax: Double = -999_999, ratingCount: Int = -999_999,
        priceRange: Int = -999_999, priceMax: Int = 4, structuredHourSlots: Int = 0,
        buttons: [SDKPOIButton] = [], tags: [String] = [], longDescription: String? = nil
    ) -> SDKPOIDetails {
        SDKPOIAdapter.details(
            name: name, attributes: attributes, rating: rating, ratingMax: ratingMax, ratingCount: ratingCount,
            priceRange: priceRange, priceMax: priceMax, structuredHourSlots: structuredHourSlots,
            buttons: buttons, tags: tags, longDescription: longDescription)
    }

    /// Design-QA's every place: the SDK's sentinel for rating and price, seven
    /// empty day schedules, no buttons. The card gets nothing, and no issue
    /// says otherwise.
    func testTheSDKSentinelsAreAbsentNotZero() {
        let result = details()
        XCTAssertEqual(result.presentation, .init())
        XCTAssertEqual(result.issues, [])
        XCTAssertEqual(result.contacts, [:])
    }

    func testARatingIsFormattedFromTheSDKsNumbers() {
        let rated = details(rating: 4.7, ratingMax: 5, ratingCount: 32, priceRange: 3)
        XCTAssertEqual(rated.presentation.summary.map(\.id), ["rating", "priceRange"])
        XCTAssertEqual(rated.presentation.summary[0].value, "4.7 / 5")
        XCTAssertEqual(rated.presentation.summary[0].detail, "32 reviews")
        XCTAssertEqual(rated.presentation.summary[1].priceLevel, 3)
        XCTAssertEqual(details(rating: 4, ratingMax: 5, ratingCount: 1).presentation.summary[0].detail, "1 review")
        XCTAssertEqual(details(rating: 4, ratingMax: 5, ratingCount: 0).presentation.summary[0].detail, nil)
        // Off the scale, or a scale of zero, is absent.
        XCTAssertEqual(details(rating: 6, ratingMax: 5).presentation.summary, [])
        XCTAssertEqual(details(rating: 3, ratingMax: 0).presentation.summary, [])
        // The card's price scale is 1 to 4; another scale is reported, not stretched.
        let other = details(priceRange: 2, priceMax: 5)
        XCTAssertEqual(other.presentation.summary, [])
        XCTAssertEqual(other.issues, ["Price scale is 5, not the card's 4"])
    }

    func testButtonsBecomeContactActionsOnlyWithAddressesTheHostCanOpen() {
        let result = details(buttons: [
            .init(name: "Website", kind: .href, intent: "http://www.dunkindonuts.com/dunkindonuts/en.html"),
            .init(name: "Call", kind: .tel, intent: "(978) 317-6611"),
            .init(name: "", kind: .mailto, intent: "hello@example.com"),
            .init(name: "Website", kind: .href, intent: "Https://www.example.com/"),
            .init(name: "Website", kind: .href, intent: "www.example.com"),
            .init(name: "Call", kind: .tel, intent: "n/a"),
            .init(name: "Email", kind: .mailto, intent: "not an address"),
            .init(name: "Order", kind: .custom, intent: "order://x"),
        ])
        XCTAssertEqual(result.presentation.supplementaryActions.map(\.action), ["website", "call", "email", "website-4"])
        XCTAssertEqual(result.presentation.supplementaryActions.map(\.label), ["Website", "Call", "Email", "Website"])
        XCTAssertEqual(result.presentation.supplementaryActions.map(\.systemImage), ["globe", "phone", "envelope", "globe"])
        XCTAssertEqual(result.contacts["call"], .call(URL(string: "tel:9783176611")!))
        XCTAssertEqual(result.contacts["email"], .email(URL(string: "mailto:hello@example.com")!))
        XCTAssertEqual(result.contacts["website-4"]?.url.absoluteString, "Https://www.example.com/")
        XCTAssertEqual(result.issues, ["Invalid Website address", "Invalid Call address", "Invalid Email address", "Unsupported button action: Order"])
    }

    /// Design-QA keeps hours in two CMS text keys; the plain one wins, the
    /// escaped-HTML one is scrubbed, and neither is an open-or-closed claim.
    func testOpeningHoursComeFromTheVenuesTextNotAStatusCalculation() {
        let plain = details(attributes: [
            "hours of operation text": "Sun - Fri: 4:30a - 9:30p / Sat: 4:30a - 6:30p",
            "Hours of Operation / Schedule": "&lt;p&gt;Sun - Fri: 4:30a - 9:30p / Sat: 4:30a - 6:30p&lt;/p&gt;",
        ])
        XCTAssertEqual(plain.presentation.openingHours?.summary, "Sun - Fri: 4:30a - 9:30p / Sat: 4:30a - 6:30p")
        XCTAssertEqual(plain.presentation.openingHours?.rows, [])
        XCTAssertEqual(plain.presentation.openingHours?.note, "As listed by the venue. Not a live opening status.")
        let escaped = details(attributes: [
            "Hours of Operation / Schedule": "&lt;span style=&quot;font-family: &amp;quot;Open Sans&amp;quot;&quot;&gt;60 minutes prior to first departure - 30 minutes prior to last departure&lt;/span&gt;&lt;p&gt;&lt;/p&gt;",
        ])
        XCTAssertEqual(escaped.presentation.openingHours?.summary, "60 minutes prior to first departure - 30 minutes prior to last departure")
        XCTAssertNil(details(attributes: ["Hours of Operation / Schedule": "&lt;p&gt;&lt;br&gt;&lt;/p&gt;"]).presentation.openingHours)
        // A structured schedule with slots is reported, never rendered in a guessed day order.
        let structured = details(attributes: ["hours of operation text": "9-5"], structuredHourSlots: 14)
        XCTAssertEqual(structured.presentation.openingHours?.summary, "9-5")
        XCTAssertEqual(structured.issues, ["Structured opening hours present (14 slots) but not rendered: day order is undocumented"])
    }

    func testADescriptionThatIsOnlyTheNameIsDropped() {
        XCTAssertNil(details(name: "Alamo", longDescription: "Alamo ").presentation.description)
        XCTAssertNil(details(name: "Alamo", longDescription: "  ").presentation.description)
        let real = details(name: "Airport Shuttle", longDescription: "Serves Terminals A &amp; B to the subway station.")
        XCTAssertEqual(real.presentation.description?.full, "Serves Terminals A & B to the subway station.")
        let long = details(name: "X", longDescription: String(repeating: "word ", count: 60))
        XCTAssertEqual(long.presentation.description?.preview.count, 201)
    }

    /// Taxonomy properties in the attributes reach the card through the same
    /// presenter the web uses; the SDK's typed fields replace their raw twins.
    func testAttributesReachTheCardThroughTheTaxonomyPresenter() {
        let result = details(attributes: [
            "serviceTypes": ["Banking and Credit Union"], "isWheelchairAccessible": NSNumber(value: true),
            "rating": ["score": 4.7], "priceRange": 3, "description": "raw twin", "name": "raw twin",
        ], tags: ["#coffee", "#coffee", "#airside"])
        XCTAssertEqual(result.presentation.summary.map(\.id), ["isWheelchairAccessible"])
        XCTAssertEqual(result.presentation.groups.map(\.heading), ["Service Types", "Accessibility"])
        XCTAssertEqual(result.presentation.tags.map(\.label), ["#airside", "#coffee"])
        XCTAssertEqual(result.issues, [])
    }

    // MARK: Camera padding

    /// The shell's report at the medium detent on an iPhone 17 Pro, as logged
    /// from the running app: a 778pt map under a 72pt top bar, a 373.44pt
    /// sheet and a 173pt controls band.
    private let measuredChrome = KozmosMapCollisionInsets(top: 72, right: 0, bottom: 546.44, left: 0)
    private let measuredMapHeight: CGFloat = 778

    /// Where `focusPoi` puts a place's anchor: the centre of the inset viewport.
    private func anchorY(_ inset: UIEdgeInsets, mapHeight: CGFloat) -> CGFloat {
        (inset.top + mapHeight - inset.bottom) / 2
    }

    func testWithoutASelectionTheCameraIsPaddedByTheChromeAlone() {
        let inset = SDKCameraPadding.contentInset(chrome: measuredChrome, mapHeight: measuredMapHeight, hasSelection: false)
        XCTAssertEqual(inset, UIEdgeInsets(top: 72, left: 0, bottom: 546.44, right: 0))
    }

    /// The defect as measured: centring the anchor left 79.8pt above it, and
    /// the pin is taller than that.
    func testCentringTheAnchorAloneLeavesThePinUnderTheTopBar() {
        let inset = SDKCameraPadding.contentInset(chrome: measuredChrome, mapHeight: measuredMapHeight, hasSelection: false)
        let pinTop = anchorY(inset, mapHeight: measuredMapHeight) - SDKCameraPadding.selectedPinHeight
        XCTAssertLessThan(pinTop, CGFloat(measuredChrome.top))
    }

    /// With a selection the pin, not its anchor, is centred in the free band.
    func testASelectedPinIsCentredInTheFreeBand() {
        let inset = SDKCameraPadding.contentInset(chrome: measuredChrome, mapHeight: measuredMapHeight, hasSelection: true)
        let anchor = anchorY(inset, mapHeight: measuredMapHeight)
        let pinTop = anchor - SDKCameraPadding.selectedPinHeight
        let bandTop = CGFloat(measuredChrome.top)
        let bandBottom = measuredMapHeight - CGFloat(measuredChrome.bottom)

        XCTAssertGreaterThanOrEqual(pinTop, bandTop)
        XCTAssertLessThanOrEqual(anchor, bandBottom)
        XCTAssertEqual(pinTop - bandTop, bandBottom - anchor, accuracy: 0.001)
        XCTAssertEqual(inset.bottom, CGFloat(measuredChrome.bottom))
    }

    /// A band shorter than the pin cannot show all of it; the anchor rests on
    /// the band's lower edge instead of being pushed under the sheet.
    func testAPinTallerThanTheFreeBandRestsOnItsLowerEdge() {
        let chrome = KozmosMapCollisionInsets(top: 72, right: 0, bottom: 650, left: 0)
        let inset = SDKCameraPadding.contentInset(chrome: chrome, mapHeight: measuredMapHeight, hasSelection: true)
        XCTAssertEqual(anchorY(inset, mapHeight: measuredMapHeight), measuredMapHeight - 650, accuracy: 0.001)
    }

    /// The shell saturates its insets, so a fully covered map reports a band
    /// of zero; the selection must not turn that negative.
    func testAFullyCoveredMapStaysAtZeroBand() {
        let chrome = KozmosMapCollisionInsets(top: 72, right: 0, bottom: 706, left: 0)
        let inset = SDKCameraPadding.contentInset(chrome: chrome, mapHeight: measuredMapHeight, hasSelection: true)
        XCTAssertEqual(inset.top + inset.bottom, measuredMapHeight, accuracy: 0.001)
        XCTAssertEqual(inset.top, 72, accuracy: 0.001)
    }

    func testAnUnmeasuredMapIsPaddedWithoutClamping() {
        let inset = SDKCameraPadding.contentInset(chrome: measuredChrome, mapHeight: 0, hasSelection: true)
        XCTAssertEqual(inset.top, 72 + SDKCameraPadding.selectedPinHeight, accuracy: 0.001)
    }

    func testNoDefaultPointrChromeIsEnabled() {
        let policy = SDKMapPolicy.make()
        let controls = [policy.isSearchEnabled, policy.isPoiDetailViewEnabled,
            policy.isRouteSummaryEnabled, policy.isWayfindingHeaderViewEnabled,
            policy.isWayfindingFooterViewEnabled, policy.isLevelSelectorEnabled,
            policy.isMapTrackingModeButtonEnabled, policy.isExitButtonEnabled,
            policy.isSplashScreenEnabled, policy.isOnboardingEnabled,
            policy.isJoystickEnabled, policy.isToastMessagesEnabled,
            policy.isInfoButtonEnabled, policy.isLocationIndicatorEnabled,
            policy.isQuickAccessEnabled, policy.isAppBannerEnabled,
            policy.isMarkMyCarEnabled, policy.isLoadingViewEnabled,
            policy.shouldFocusOnFirstUserPosition]
        XCTAssertTrue(controls.allSatisfy { !$0 })
    }
}
