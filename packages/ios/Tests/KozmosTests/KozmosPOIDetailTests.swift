import XCTest
import SwiftUI
import SnapshotTesting
@testable import Kozmos

final class KozmosPOIDetailTests: XCTestCase {
    func testMetadataCapPreservesPriorityAndAdaptsToMissingItems() {
        let items = (0..<5).map { KozmosPOIDetailSummary(id: "\($0)", label: "Fact", value: "\($0)") }
        XCTAssertEqual(KozmosPOIDetailsPresentation(summary: items).visibleSummary.map(\.id), ["0", "1", "2"])
        for count in 0...2 {
            XCTAssertEqual(KozmosPOIDetailsPresentation(summary: Array(items.prefix(count))).visibleSummary.count, count)
        }
    }

    func testTagArtworkIsOptionalAndNeverInferredFromText() {
        let text = KozmosPOIDetailTag(id: "italian", label: "Italian")
        XCTAssertNil(text.systemImage)
        XCTAssertNil(text.iconUrl)
        let icon = KozmosPOIDetailTag(id: "wifi", label: "WiFi", iconUrl: "https://example.com/wifi.png", iconMonochrome: true)
        XCTAssertEqual(icon.iconMonochrome, true)
        XCTAssertEqual(icon.label, "WiFi")
    }

    func testRemoteIconsRejectUnsafeAndCredentialledURLs() {
        XCTAssertNotNil(POIDetailIcon.remoteURL("https://example.com/icon.png"))
        for url in ["http://example.com/icon.png", "file:///tmp/icon.png", "data:image/png;base64,abc", "https://user:pass@example.com/icon.png", "javascript:alert(1)", "not a URL"] {
            XCTAssertNil(POIDetailIcon.remoteURL(url), url)
        }
    }

    func testDetailsRoundTripWithoutLosingZeroWaitOrIconOwnership() throws {
        let details = KozmosPOIDetailsPresentation(
            summary: [.init(id: "wait", label: "Wait", value: "Empty", detail: "0 min wait")],
            groups: [.init(id: "cuisine", heading: "Cuisines", items: [.init(id: "it", label: "Italian")])],
            supplementaryActions: [.init(action: "book", label: "Book", systemImage: "calendar")]
        )
        XCTAssertEqual(try JSONDecoder().decode(KozmosPOIDetailsPresentation.self, from: JSONEncoder().encode(details)), details)
    }

    func testGeneratedStorybookFixturesDecodeUsingNativeContracts() throws {
        // This test deliberately reads the checked-in generated fixture, so
        // accidental model drift is caught rather than swallowed by demo UI.
        let root = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
            .deletingLastPathComponent().deletingLastPathComponent()
            .deletingLastPathComponent().deletingLastPathComponent()
        let source = try String(contentsOf: root.appendingPathComponent("apps/Playground.swiftpm/Sources/App/Model/POIExampleData.swift"))
        let json = try XCTUnwrap(source.components(separatedBy: "#\"\"\"\n").last?.components(separatedBy: "\n\"\"\"#").first)
        struct Example: Decodable { let id: String; let poi: KozmosPOIPresentation; let details: KozmosPOIDetailsPresentation }
        let examples = try JSONDecoder().decode([Example].self, from: Data(json.utf8))
        XCTAssertEqual(examples.count, 6)
        for example in examples {
            XCTAssertFalse(example.poi.name.isEmpty)
            XCTAssertLessThanOrEqual(example.details.visibleSummary.count, 3)
        }
        let restaurant = try XCTUnwrap(examples.first { $0.id == "restaurant" })
        XCTAssertEqual(restaurant.details.summary.first?.value, "4.7 / 5")
        XCTAssertNil(restaurant.details.groups.first?.items.first?.iconUrl)
        XCTAssertNotNil(restaurant.details.groups.first { $0.heading == "Amenities" }?.items.first?.iconUrl)
    }

    #if os(iOS)
    @MainActor func testMetadataRendersAcrossWidthsCountsAndLargeType() throws {
        let items: [KozmosPOIDetailSummary] = [
            .init(id: "rating", label: "Rating", value: "4.7 / 5", detail: "32 reviews", systemImage: "star"),
            .init(id: "price", label: "Price range", value: "3 of 4", priceLevel: 3),
            .init(id: "access", label: "Accessibility", value: "Wheelchair Friendly", systemImage: "figure.roll")
        ]
        for width in [320.0, 375, 430, 768] {
            for count in 1...3 {
                let content = POIDetailSummary(items: Array(items.prefix(count)))
                    .frame(width: width).background(Color.white)
                let renderer = ImageRenderer(content: content)
                let image = try XCTUnwrap(renderer.uiImage)
                XCTAssertEqual(image.size.width, width, accuracy: 1)
                XCTAssertGreaterThanOrEqual(image.size.height, 64)
                XCTAssertLessThan(image.size.height, 200)
                let attachment = XCTAttachment(image: image)
                attachment.name = "metadata-\(Int(width))-\(count)-items"
                attachment.lifetime = .keepAlways
                add(attachment)
            }
        }
        let large = ImageRenderer(content: POIDetailSummary(items: items)
            .environment(\.dynamicTypeSize, .accessibility5)
            .environment(\.layoutDirection, .rightToLeft)
            .frame(width: 320))
        let largeImage = try XCTUnwrap(large.uiImage)
        let largeAttachment = XCTAttachment(image: largeImage)
        largeAttachment.name = "metadata-320-accessibility5-rtl"
        largeAttachment.lifetime = .keepAlways
        add(largeAttachment)
    }

    @MainActor func testCardRenderMatrix() async throws {
        let poi = KozmosPOIPresentation(id: "native-review", name: "Peak Performance", floorId: "1",
            floorLabel: "Current floor", buildingLabel: "Building A", availability: .open,
            availabilityLabel: "Open", description: "A high-intensity fitness studio offering group classes and open gym access.",
            actions: [.navigate, .share, .favourite, .bookmark])
        let details = KozmosPOIDetailsPresentation(
            summary: [
                .init(id: "rating", label: "Rating", value: "4.7 / 5", detail: "32 reviews", systemImage: "star"),
                .init(id: "price", label: "Price", value: "3 of 4", priceLevel: 3),
                .init(id: "access", label: "Accessibility", value: "Wheelchair Friendly", systemImage: "figure.roll")
            ],
            groups: [.init(id: "sports", heading: "Sport types", items: [.init(id: "a", label: "Aerobics"), .init(id: "b", label: "Athletics")]),
                     .init(id: "amenities", heading: "Amenities", items: [.init(id: "wifi", label: "WiFi", systemImage: "wifi"), .init(id: "long", label: "Assistance available for visitors with accessibility requirements")])],
            tags: [.init(id: "fitness", label: "#fitness")],
            supplementaryActions: [.init(action: "book", label: "Book", systemImage: "calendar")],
            travelEstimate: .init(durationSeconds: 120, durationLabel: "2 min", distanceLabel: "120 m")
        )
        for (name, width, type, direction, scheme) in [
            ("phone", 375.0, DynamicTypeSize.large, LayoutDirection.leftToRight, ColorScheme.light),
            ("small", 320.0, .large, .leftToRight, .light),
            ("dark", 430.0, .large, .leftToRight, .dark),
            ("large-text-rtl", 320.0, .accessibility5, .rightToLeft, .light),
            ("tablet", 768.0, .large, .leftToRight, .light)
        ] {
            let controller = UIHostingController(rootView: KozmosPOIDetailPanel(
                poi: poi, actionLabels: [.navigate: "Go", .share: "Share", .favourite: "Favourite", .bookmark: "Bookmark"],
                onAction: { _, _ in }, actionStates: [.favourite: .init(pressed: true)], onClose: {},
                details: details, onSupplementaryAction: { _, _ in }
            ).environment(\.dynamicTypeSize, type).environment(\.layoutDirection, direction)
                .environment(\.colorScheme, scheme).frame(width: width, height: 812))
            // ImageRenderer cannot capture ScrollView's UIKit-backed content;
            // use a hosted view snapshot, not a passing but blank bitmap.
            let strategy = Snapshotting<UIViewController, UIImage>.image(size: CGSize(width: width, height: 812))
            let image = await withCheckedContinuation { continuation in
                strategy.snapshot(controller).run { continuation.resume(returning: $0) }
            }
            let attachment = XCTAttachment(image: image)
            attachment.name = "poi-card-\(name)"
            attachment.lifetime = .keepAlways
            add(attachment)
        }
    }
    #endif
}
