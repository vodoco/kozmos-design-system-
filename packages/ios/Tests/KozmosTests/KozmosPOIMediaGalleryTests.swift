import XCTest
import SwiftUI
import SnapshotTesting
@testable import Kozmos

/// The index the gallery shows is derived from where its tiles sit, so the
/// geometry is asserted directly: a wrong nearest tile is a counter that
/// disagrees with the picture.
final class KozmosPOIMediaGalleryTests: XCTestCase {
    /// An iPhone 17 Pro sheet: a 370pt strip, so 314.5pt tiles 12pt apart.
    private let strip: CGFloat = 370
    private var tile: CGFloat { strip * POIMediaGalleryGeometry.tileWidthFraction }
    private var step: CGFloat { tile + POIMediaGalleryGeometry.spacing }

    /// Tile frames, in physical coordinates, after scrolling `offset` points
    /// towards the end of the strip.
    private func frames(count: Int, offset: CGFloat, direction: LayoutDirection) -> [Int: CGRect] {
        Dictionary(uniqueKeysWithValues: (0..<count).map { index in
            let leading = CGFloat(index) * step - offset
            let minX = direction == .leftToRight ? leading : strip - leading - tile
            return (index, CGRect(x: minX, y: 0, width: tile, height: tile * 0.75))
        })
    }

    private func maximumOffset(count: Int) -> CGFloat {
        max(CGFloat(count) * step - POIMediaGalleryGeometry.spacing - strip, 0)
    }

    func testTheIndexIsBoundedToTheMedia() {
        XCTAssertEqual(POIMediaGalleryGeometry.boundedIndex(-3, count: 4), 0)
        XCTAssertEqual(POIMediaGalleryGeometry.boundedIndex(9, count: 4), 3)
        XCTAssertEqual(POIMediaGalleryGeometry.boundedIndex(2, count: 4), 2)
        XCTAssertEqual(POIMediaGalleryGeometry.boundedIndex(2, count: 0), 0)
    }

    /// The strip is exactly as tall as a 4:3 tile at 85% of its width.
    func testTheStripIsAsTallAsATile() {
        XCTAssertEqual(strip / POIMediaGalleryGeometry.stripAspectRatio, tile * 3 / 4, accuracy: 0.001)
    }

    func testAtRestTheFirstTileIsCurrentInBothDirections() {
        for direction in [LayoutDirection.leftToRight, .rightToLeft] {
            XCTAssertEqual(
                POIMediaGalleryGeometry.nearestIndex(
                    tileFrames: frames(count: 3, offset: 0, direction: direction),
                    stripWidth: strip, layoutDirection: direction),
                0, "\(direction)")
        }
    }

    /// Scrolled past half a tile, the next tile's leading edge is nearer.
    func testScrollingPastHalfATileMovesTheIndex() {
        for direction in [LayoutDirection.leftToRight, .rightToLeft] {
            let before = frames(count: 3, offset: step * 0.45, direction: direction)
            let after = frames(count: 3, offset: step * 0.55, direction: direction)
            XCTAssertEqual(POIMediaGalleryGeometry.nearestIndex(tileFrames: before, stripWidth: strip, layoutDirection: direction), 0)
            XCTAssertEqual(POIMediaGalleryGeometry.nearestIndex(tileFrames: after, stripWidth: strip, layoutDirection: direction), 1)
        }
    }

    /// With two photos the strip can only scroll 271pt: the second tile stops
    /// 55.5pt short of the leading edge and the first still shows. "First
    /// visible" would say 1 of 2 with the second photo in full view.
    func testTheLastTileIsCurrentAtTheEndOfTheStrip() {
        for direction in [LayoutDirection.leftToRight, .rightToLeft] {
            let end = frames(count: 2, offset: maximumOffset(count: 2), direction: direction)
            XCTAssertEqual(maximumOffset(count: 2), 271, accuracy: 0.001)
            XCTAssertEqual(POIMediaGalleryGeometry.nearestIndex(tileFrames: end, stripWidth: strip, layoutDirection: direction), 1, "\(direction)")
        }
    }

    /// Part-way through a right-to-left scroll, measuring from the physical
    /// left edge picks the wrong tile: 45% of the way to the second photo, the
    /// second's right edge is 179.6pt from the strip's right, the first's
    /// 146.9pt — but the second's left edge is nearer x = 0.
    func testRightToLeftIsMeasuredFromTheRightEdge() {
        let partWay = frames(count: 3, offset: step * 0.45, direction: .rightToLeft)
        XCTAssertEqual(POIMediaGalleryGeometry.nearestIndex(tileFrames: partWay, stripWidth: strip, layoutDirection: .rightToLeft), 0)
        XCTAssertEqual(POIMediaGalleryGeometry.nearestIndex(tileFrames: partWay, stripWidth: strip, layoutDirection: .leftToRight), 1)
    }

    func testNoMeasuredTilesMeansNoIndex() {
        XCTAssertNil(POIMediaGalleryGeometry.nearestIndex(tileFrames: [:], stripWidth: strip, layoutDirection: .leftToRight))
    }

    /// Media addresses follow the property-icon rule. Anything refused is
    /// "Image unavailable" at once, not a grey box that never resolves.
    func testOnlySafeRemoteMediaIsAttempted() {
        XCTAssertEqual(
            POIMediaTile.source(for: "https://example.com/photo.jpg"),
            .remote(URL(string: "https://example.com/photo.jpg")!)
        )
        for src in ["http://example.com/photo.jpg", "https://user:pass@example.com/photo.jpg",
                    "file:///tmp/photo.jpg", "data:image/png;base64,abc", "photo.jpg", ""] {
            XCTAssertEqual(POIMediaTile.source(for: src), .refused, src)
        }
    }

    #if os(iOS)
    /// `nearestIndex` assumes a right-to-left strip still reports physical,
    /// left-to-right x, with the first tile at the right. At rest and at the
    /// end of the strip either reading picks the same tile, so the live app
    /// cannot tell them apart; this checks the assumption itself.
    @MainActor func testTileFramesArePhysicalInARightToLeftStrip() throws {
        var frames: [Int: CGRect] = [:]
        let strip = ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
                ForEach(0..<2, id: \.self) { index in
                    Color.red.frame(width: 100, height: 10).background(
                        GeometryReader { tile in
                            Color.clear.preference(key: POIMediaTileFramesKey.self,
                                                   value: [index: tile.frame(in: .named("strip"))])
                        }
                    )
                }
            }
        }
        .coordinateSpace(name: "strip")
        .frame(width: 150, height: 10)
        .onPreferenceChange(POIMediaTileFramesKey.self) { frames = $0 }
        .environment(\.layoutDirection, .rightToLeft)

        let window = UIWindow(frame: CGRect(x: 0, y: 0, width: 150, height: 10))
        window.rootViewController = UIHostingController(rootView: strip)
        window.makeKeyAndVisible()
        window.layoutIfNeeded()
        RunLoop.main.run(until: Date().addingTimeInterval(0.3))

        let first = try XCTUnwrap(frames[0])
        XCTAssertEqual(first.maxX, 150, accuracy: 0.5, "the first tile sits against the physical right edge")
        XCTAssertEqual(POIMediaGalleryGeometry.nearestIndex(tileFrames: frames, stripWidth: 150, layoutDirection: .rightToLeft), 0)
    }

    /// Refused media renders the unavailable state in both directions, with
    /// the strip, the counter and the mirrored arrows. For review: the
    /// attachments are the evidence, as in the card render matrix. Hosted, not
    /// ImageRenderer: a ScrollView renders blank there.
    @MainActor func testUnavailableMediaRenders() async throws {
        let media = [
            KozmosPOIMediaPresentation(id: "insecure", src: "http://example.com/photo.jpg", alt: "Shopfront"),
            KozmosPOIMediaPresentation(id: "credentialled", src: "https://user:pass@example.com/photo.jpg", alt: "Counter")
        ]
        for direction in [LayoutDirection.leftToRight, .rightToLeft] {
            let controller = UIHostingController(rootView: KozmosPOIMediaGallery(
                media: media, label: "Photos", positionLabel: { "Image \($0) of \($1)" }
            ).environment(\.layoutDirection, direction).padding(16).frame(width: 402).background(Color.white))
            let strategy = Snapshotting<UIViewController, UIImage>.image(size: CGSize(width: 402, height: 340))
            let image = await withCheckedContinuation { continuation in
                strategy.snapshot(controller).run { continuation.resume(returning: $0) }
            }
            let attachment = XCTAttachment(image: image)
            attachment.name = "gallery-unavailable-\(direction == .leftToRight ? "ltr" : "rtl")"
            attachment.lifetime = .keepAlways
            add(attachment)
        }
    }
    #endif
}
