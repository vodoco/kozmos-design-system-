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
