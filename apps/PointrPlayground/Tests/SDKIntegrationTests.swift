import XCTest
import PointrKit
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
