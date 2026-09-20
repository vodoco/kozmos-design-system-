import XCTest
import SwiftUI
import SnapshotTesting
@testable import Kozmos

/// Detent geometry and the collision insets the shell reports back.
///
/// These are the parts a map renderer depends on, and the parts a caller cannot
/// see from the outside, so they are asserted directly rather than through a
/// snapshot.
final class KozmosMapPanelDetentTests: XCTestCase {
    private let shellHeight: CGFloat = 800

    func testNamedDetentsAreProportionalToTheShell() {
        XCTAssertEqual(KozmosMapPanelDetent.medium.height(in: shellHeight), 384, accuracy: 0.001)
        XCTAssertEqual(KozmosMapPanelDetent.large.height(in: shellHeight), 704, accuracy: 0.001)
        XCTAssertEqual(KozmosMapPanelDetent.collapsed.height(in: shellHeight), 144, accuracy: 0.001)
    }

    /// A landscape or split-screen shell is short enough that 18% would not fit
    /// the grab handle and a header row.
    func testCollapsedNeverFallsBelowTheHandleAndHeader() {
        let short: CGFloat = 400
        XCTAssertEqual(
            KozmosMapPanelDetent.collapsed.height(in: short),
            KozmosMapPanelDetent.minimumCollapsedHeight,
            accuracy: 0.001
        )
    }

    /// ...and on a very short shell the floor still cannot swallow the map.
    func testCollapsedNeverTakesMoreThanFortyPercent() {
        let tiny: CGFloat = 260
        XCTAssertEqual(KozmosMapPanelDetent.collapsed.height(in: tiny), 104, accuracy: 0.001)
    }

    func testFractionIsClampedToAUsableRange() {
        XCTAssertEqual(
            KozmosMapPanelDetent.fraction(2).height(in: shellHeight),
            shellHeight * CGFloat(KozmosMapPanelDetent.usableFractions.upperBound),
            accuracy: 0.001
        )
        XCTAssertEqual(
            KozmosMapPanelDetent.fraction(-1).height(in: shellHeight),
            shellHeight * CGFloat(KozmosMapPanelDetent.usableFractions.lowerBound),
            accuracy: 0.001
        )
    }

    func testExplicitHeightIsCappedToTheShell() {
        XCTAssertEqual(KozmosMapPanelDetent.height(320).height(in: shellHeight), 320, accuracy: 0.001)
        XCTAssertEqual(
            KozmosMapPanelDetent.height(5_000).height(in: shellHeight),
            shellHeight * CGFloat(KozmosMapPanelDetent.usableFractions.upperBound),
            accuracy: 0.001
        )
    }
}

final class KozmosAdaptiveMapShellTests: XCTestCase {
    private let shellHeight: CGFloat = 800

    private func shell(
        detents: [KozmosMapPanelDetent] = [.collapsed, .medium, .large],
        controlsPlacement: KozmosAdaptiveMapShell<Color, Color, EmptyView, Color, EmptyView>.ControlsPlacement = .top,
        collisionInsets: KozmosMapCollisionInsets = .zero
    ) -> KozmosAdaptiveMapShell<Color, Color, EmptyView, Color, EmptyView> {
        KozmosAdaptiveMapShell(
            controlsPlacement: controlsPlacement,
            panelDetents: detents,
            collisionInsets: collisionInsets,
            map: { Color.clear },
            mapStatusContent: { EmptyView() },
            controls: { Color.clear },
            panel: { Color.clear }
        )
    }

    func testDetentsAreOrderedByHeightAndDeduplicated() {
        let view = shell(detents: [.large, .collapsed, .medium, .fraction(0.48)])
        let ordered = view.orderedDetents(in: shellHeight)

        XCTAssertEqual(ordered.count, 3)
        XCTAssertEqual(
            ordered.map { $0.height(in: shellHeight) },
            ordered.map { $0.height(in: shellHeight) }.sorted()
        )
        XCTAssertEqual(ordered.first, .collapsed)
        XCTAssertEqual(ordered.last, .large)
    }

    func testUncontrolledPanelRestsAtMediumWhenOffered() {
        XCTAssertEqual(shell().activeDetent(in: shellHeight), .medium)
    }

    /// With no medium to fall back on, the shell opens at the middle of the set
    /// rather than at an extreme.
    func testUncontrolledPanelRestsInTheMiddleOfTheSet() {
        let view = shell(detents: [.collapsed, .fraction(0.6), .large])
        XCTAssertEqual(view.activeDetent(in: shellHeight), .fraction(0.6))
    }

    func testControlledPanelFollowsTheBinding() {
        var detent = KozmosMapPanelDetent.large
        let binding = Binding(get: { detent }, set: { detent = $0 })
        let view = KozmosAdaptiveMapShell(
            panelDetent: binding,
            map: { Color.clear },
            panel: { Color.clear }
        )
        XCTAssertEqual(view.activeDetent(in: shellHeight), .large)
        XCTAssertEqual(view.settledPanelHeight(in: shellHeight), 704, accuracy: 0.001)
    }

    func testSettledHeightIsClampedToTheOfferedDetents() {
        var detent = KozmosMapPanelDetent.large
        let binding = Binding(get: { detent }, set: { detent = $0 })
        let view = KozmosAdaptiveMapShell(
            panelDetent: binding,
            panelDetents: [.collapsed, .medium],
            map: { Color.clear },
            panel: { Color.clear }
        )
        // `.large` is not on offer, so the panel rests at the tallest that is.
        XCTAssertEqual(
            view.settledPanelHeight(in: shellHeight),
            KozmosMapPanelDetent.medium.height(in: shellHeight),
            accuracy: 0.001
        )
    }

    func testDragSnapsToTheNearestDetent() {
        let view = shell()
        XCTAssertEqual(view.nearestDetent(to: 150, in: shellHeight), .collapsed)
        XCTAssertEqual(view.nearestDetent(to: 400, in: shellHeight), .medium)
        XCTAssertEqual(view.nearestDetent(to: 690, in: shellHeight), .large)
        // Exactly between collapsed (144) and medium (384).
        XCTAssertEqual(view.nearestDetent(to: 264, in: shellHeight), .collapsed)
    }

    func testReportedInsetsCoverTheDockedPanel() {
        let view = shell()
        let insets = view.resolvedCollisionInsets(
            in: CGSize(width: 400, height: shellHeight),
            layoutDirection: .leftToRight,
            isRegularWidth: false
        )

        XCTAssertEqual(insets.bottom, Double(KozmosMapPanelDetent.medium.height(in: shellHeight)), accuracy: 0.001)
        // The controls sit opposite the panel, so with the panel at the end of
        // a left-to-right layout they are on the physical left, carrying the
        // shell's own padding either side.
        XCTAssertEqual(insets.left, Double(KozmosDimensions.primitivesLayoutSpacing200 * 2), accuracy: 0.001)
        XCTAssertEqual(insets.right, 0, accuracy: 0.001)
        // Nothing was passed for the top bar slot, so it reserves nothing.
        XCTAssertEqual(insets.top, 0, accuracy: 0.001)
    }

    /// A map camera pads physical edges, so `.end` has to become a side only
    /// after the reading direction is known. Mirrored, the controls are on the
    /// right and the inset has to move with them.
    func testReportedInsetsMirrorInARightToLeftLayout() {
        let view = shell()
        let size = CGSize(width: 400, height: shellHeight)
        let ltr = view.resolvedCollisionInsets(in: size, layoutDirection: .leftToRight, isRegularWidth: false)
        let rtl = view.resolvedCollisionInsets(in: size, layoutDirection: .rightToLeft, isRegularWidth: false)

        XCTAssertEqual(rtl.right, ltr.left, accuracy: 0.001)
        XCTAssertEqual(rtl.left, ltr.right, accuracy: 0.001)
        XCTAssertEqual(rtl.bottom, ltr.bottom, accuracy: 0.001)
        XCTAssertEqual(rtl.top, ltr.top, accuracy: 0.001)
        XCTAssertEqual(rtl.right, Double(KozmosDimensions.primitivesLayoutSpacing200 * 2), accuracy: 0.001)
        XCTAssertEqual(rtl.left, 0, accuracy: 0.001)
    }

    func testCallerInsetsWinWhenTheyAreLarger() {
        let view = shell(collisionInsets: KozmosMapCollisionInsets(top: 90, right: 12, bottom: 10, left: 4))
        let insets = view.resolvedCollisionInsets(
            in: CGSize(width: 400, height: shellHeight),
            layoutDirection: .leftToRight,
            isRegularWidth: false
        )

        XCTAssertEqual(insets.top, 90, accuracy: 0.001)
        XCTAssertEqual(insets.right, 12, accuracy: 0.001)
        // The panel is taller than the caller's 10pt, so the shell's value wins.
        XCTAssertEqual(insets.bottom, Double(KozmosMapPanelDetent.medium.height(in: shellHeight)), accuracy: 0.001)
        XCTAssertEqual(insets.left, Double(KozmosDimensions.primitivesLayoutSpacing200 * 2), accuracy: 0.001)
    }

    /// A caller can bind a detent the shell was never offered. The panel has to
    /// rest at the closest one it does have rather than freezing.
    func testABoundDetentThatIsNotOnOfferFallsBackToTheClosest() {
        var detent = KozmosMapPanelDetent.fraction(0.5)
        let binding = Binding(get: { detent }, set: { detent = $0 })
        let view = KozmosAdaptiveMapShell(
            panelDetent: binding,
            panelDetents: [.collapsed, .medium, .large],
            map: { Color.clear },
            panel: { Color.clear }
        )
        // 0.5 of 800 is 400, nearest to medium's 384 rather than large's 704.
        XCTAssertEqual(view.nearestDetent(to: 400, in: shellHeight), .medium)
        XCTAssertEqual(view.settledPanelHeight(in: shellHeight), 400, accuracy: 0.001)
    }

    /// Controls along the bottom are above the panel, not beside the map, so
    /// they extend the bottom inset rather than claiming a side.
    func testBottomControlsExtendTheBottomInsetRatherThanASide() {
        let view = shell(controlsPlacement: .bottom)
        let insets = view.resolvedCollisionInsets(
            in: CGSize(width: 400, height: shellHeight),
            layoutDirection: .leftToRight,
            isRegularWidth: false
        )
        let panel = Double(KozmosMapPanelDetent.medium.height(in: shellHeight))
        let padding = Double(KozmosDimensions.primitivesLayoutSpacing200 * 2)

        XCTAssertEqual(insets.bottom, panel + padding, accuracy: 0.001)
        XCTAssertEqual(insets.left, 0, accuracy: 0.001)
        XCTAssertEqual(insets.right, 0, accuracy: 0.001)
    }

    /// Mirrors React's `resolveMapInsets`: the top and left edges keep their
    /// value, and the edge opposite each is cut to what remains. A camera
    /// padded by more than the map's height has nowhere to put its centre.
    func testOpposingInsetsSaturateAtTheMapSize() {
        var detent = KozmosMapPanelDetent.large
        let binding = Binding(get: { detent }, set: { detent = $0 })
        let view = KozmosAdaptiveMapShell(
            controlsPlacement: .bottom,
            panelDetent: binding,
            collisionInsets: KozmosMapCollisionInsets(top: 300, right: 300, bottom: 0, left: 300),
            map: { Color.clear },
            mapStatusContent: { EmptyView() },
            controls: { Color.clear },
            panel: { Color.clear }
        )
        let size = CGSize(width: 400, height: shellHeight)
        let insets = view.resolvedCollisionInsets(in: size, layoutDirection: .leftToRight, isRegularWidth: false)

        // Unclamped, the large panel and the controls band alone would be
        // 704 + 32 against an 800pt map, on top of the caller's 300.
        XCTAssertEqual(insets.top, 300, accuracy: 0.001)
        XCTAssertEqual(insets.bottom, 500, accuracy: 0.001)
        XCTAssertEqual(insets.left, 300, accuracy: 0.001)
        XCTAssertEqual(insets.right, 100, accuracy: 0.001)
        XCTAssertEqual(insets.top + insets.bottom, Double(shellHeight), accuracy: 0.001)
    }

    /// Before the shell has been measured it is zero by zero, and every edge
    /// saturates to nothing rather than going negative.
    func testAnUnmeasuredShellReportsNoInsets() {
        let insets = shell(collisionInsets: KozmosMapCollisionInsets(top: 72, right: 0, bottom: 0, left: 0))
            .resolvedCollisionInsets(in: .zero, layoutDirection: .leftToRight, isRegularWidth: false)
        XCTAssertEqual(insets, .zero)
    }

    /// The top bar and the controls are laid out in the map beside a floating
    /// panel. Docked, the panel takes no width, and they get the whole shell.
    func testChromeIsLaidOutBesideAFloatingPanel() {
        let view = shell(controlsPlacement: .bottom)
        let wide = CGSize(width: 1024, height: 700)
        let padding = KozmosDimensions.primitivesLayoutSpacing200

        XCTAssertEqual(view.floatingPanelOccupancy(in: wide, isRegularWidth: false), 0)
        XCTAssertEqual(view.chromeWidth(in: wide, isRegularWidth: false), 1024, accuracy: 0.001)
        // The panel is min(416, 42%) plus a gutter either side: 448 of 1024.
        XCTAssertEqual(view.floatingPanelOccupancy(in: wide, isRegularWidth: true), 416 + padding * 2, accuracy: 0.001)
        XCTAssertEqual(view.chromeWidth(in: wide, isRegularWidth: true), 1024 - 416 - padding * 2, accuracy: 0.001)
        // Narrower than 416 / 0.42, the panel is 42% of the width.
        let narrow = CGSize(width: 400, height: shellHeight)
        XCTAssertEqual(view.chromeWidth(in: narrow, isRegularWidth: true), 400 - 168 - padding * 2, accuracy: 0.001)
    }

    #if os(iOS)
    /// Rendered, not reasoned about: with the panel floating, a trailing
    /// control cluster and a full-width top bar were drawn under it. Both must
    /// stop at the panel's gutter, on whichever side the panel is.
    @MainActor func testChromeIsNotDrawnUnderAFloatingPanel() async throws {
        let size = CGSize(width: 1024, height: 600)
        // The panel: 416 wide, 16 in from the trailing edge.
        let panelNearEdge: CGFloat = 1024 - 16 - 416
        for direction in [LayoutDirection.leftToRight, .rightToLeft] {
            let view = KozmosAdaptiveMapShell(
                controlsPlacement: .bottom,
                map: { Color.white },
                mapStatusContent: { EmptyView() },
                controls: {
                    // A caller's trailing-anchored cluster.
                    HStack(spacing: 0) { Spacer(minLength: 0); Color.red.frame(width: 44, height: 44) }
                },
                topBar: { Color.green.frame(height: 44) },
                panel: { Color.blue }
            )
            .environment(\.horizontalSizeClass, .regular)
            .environment(\.layoutDirection, direction)
            .frame(width: size.width, height: size.height)
            let controller = UIHostingController(rootView: view)
            let strategy = Snapshotting<UIViewController, UIImage>.image(size: size)
            let image = await withCheckedContinuation { continuation in
                strategy.snapshot(controller).run { continuation.resume(returning: $0) }
            }
            let cgImage = try XCTUnwrap(image.cgImage)
            let scale = CGFloat(cgImage.width) / size.width
            func span(of matches: (UInt8, UInt8, UInt8) -> Bool, atY y: CGFloat) throws -> ClosedRange<CGFloat>? {
                let row = try XCTUnwrap(cgImage.cropping(to: CGRect(x: 0, y: y * scale, width: CGFloat(cgImage.width), height: 1)))
                var rgba = [UInt8](repeating: 0, count: cgImage.width * 4)
                let context = try XCTUnwrap(CGContext(
                    data: &rgba, width: cgImage.width, height: 1, bitsPerComponent: 8, bytesPerRow: cgImage.width * 4,
                    space: CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue | CGBitmapInfo.byteOrder32Big.rawValue))
                context.draw(row, in: CGRect(x: 0, y: 0, width: cgImage.width, height: 1))
                let xs = (0..<cgImage.width).filter { matches(rgba[$0 * 4], rgba[$0 * 4 + 1], rgba[$0 * 4 + 2]) }
                guard let first = xs.first, let last = xs.last else { return nil }
                return CGFloat(first) / scale...CGFloat(last + 1) / scale
            }
            // The cluster's row: 16 above the bottom edge, 44 tall.
            let red = try XCTUnwrap(try span(of: { r, g, b in r > 180 && g < 90 && b < 90 }, atY: size.height - 16 - 22),
                                    "\(direction): the controls are not visible at all — they are under the panel")
            // The bar's row: 16 below the top edge.
            let green = try XCTUnwrap(try span(of: { r, g, b in g > 120 && r < 110 && b < 110 }, atY: 16 + 22))
            switch direction {
            case .leftToRight:
                XCTAssertLessThanOrEqual(red.upperBound, panelNearEdge - 16, "the cluster stops at the panel's gutter")
                XCTAssertLessThanOrEqual(green.upperBound, panelNearEdge - 16 + 0.5, "the bar stops at the panel's gutter")
                XCTAssertLessThan(green.lowerBound, 1, "the bar starts at the map's edge, not centred on the shell")
            default:
                let panelFarEdge: CGFloat = 16 + 416
                XCTAssertGreaterThanOrEqual(red.lowerBound, panelFarEdge + 16)
                XCTAssertGreaterThanOrEqual(green.lowerBound, panelFarEdge + 16 - 0.5)
                XCTAssertGreaterThan(green.upperBound, size.width - 1)
            }
        }
    }
    #endif

    func testAPanelWithASingleDetentDoesNotOfferAGrabHandle() {
        let one = shell(detents: [.medium])
        XCTAssertEqual(one.orderedDetents(in: shellHeight).count, 1)
        XCTAssertEqual(one.settledPanelHeight(in: shellHeight), 384, accuracy: 0.001)
    }

    /// On a regular width the panel floats beside the map instead of docking,
    /// so the inset moves from the bottom edge to the panel's own side, and the
    /// controls opposite it keep their column. This is the layout every test
    /// used to see by accident: `swift test` runs on macOS, where the
    /// environment reports no size class, which is why the width class is an
    /// argument here rather than read from the environment.
    func testAWidePanelFloatsBesideTheMapAndReportsItsSide() {
        let view = shell()
        let size = CGSize(width: 400, height: shellHeight)
        let insets = view.resolvedCollisionInsets(in: size, layoutDirection: .leftToRight, isRegularWidth: true)
        let padding = Double(KozmosDimensions.primitivesLayoutSpacing200)

        // The panel is min(416, 42% of the width) plus the shell's padding either side.
        XCTAssertEqual(insets.right, Double(min(416, size.width * 0.42)) + padding * 2, accuracy: 0.001)
        XCTAssertEqual(insets.bottom, 0, accuracy: 0.001)
        XCTAssertEqual(insets.left, padding * 2, accuracy: 0.001)
    }
}

/// The content-fitted detent and the panel's surface, measured: the sheet is
/// as tall as what it holds, no taller than large, and glass when asked.
final class KozmosMapShellContentDetentTests: XCTestCase {
    private let shellHeight: CGFloat = 800

    /// Unmeasured, the content detent reads as medium and folds into it.
    func testAnUnmeasuredContentDetentReadsAsMedium() {
        XCTAssertEqual(KozmosMapPanelDetent.content.height(in: shellHeight), KozmosMapPanelDetent.medium.height(in: shellHeight))
        let shell = KozmosAdaptiveMapShell(
            panelDetents: [.collapsed, .content, .medium, .large],
            map: { Color.red }, mapStatusContent: { EmptyView() }, controls: { EmptyView() },
            topBar: { EmptyView() }, panel: { Color.green }
        )
        XCTAssertEqual(shell.orderedDetents(in: shellHeight).count, 3, "content and medium should fold into one until measured")
    }

    #if os(iOS)
    @MainActor private func render(panelHeight: CGFloat, surface: KozmosSurfaceStyle = .solid) async throws -> RenderedPixels {
        let size = CGSize(width: 390, height: shellHeight)
        let view = KozmosAdaptiveMapShell(
            panelDetent: .constant(.content),
            panelDetents: [.collapsed, .content, .large],
            panelSurface: surface,
            map: { Color.red },
            mapStatusContent: { EmptyView() },
            controls: { EmptyView() },
            topBar: { EmptyView() },
            panel: { Color.green.frame(height: panelHeight) }
        )
        .environment(\.horizontalSizeClass, .compact)
        return try await RenderedPixels.render(view, size: size)
    }

    private static func isGreen(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { g > 150 && r < 120 && b < 140 }
    private static func isRed(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { r > 200 && g < 80 && b < 80 }

    /// A 120-point panel: the sheet is the grab handle's row and the panel,
    /// and the map keeps everything above it.
    @MainActor func testTheSheetIsAsTallAsItsContent() async throws {
        let pixels = try await render(panelHeight: 120)
        let whole = CGRect(x: 0, y: 0, width: 390, height: shellHeight)
        let content = try XCTUnwrap(pixels.boundingBox(in: whole, where: Self.isGreen), "no panel content drawn")
        XCTAssertEqual(content.height, 120, accuracy: 1.5)
        XCTAssertEqual(content.maxY, shellHeight, accuracy: 1.5, "the panel does not sit on the shell's bottom edge")
        // Above the content there is the handle's row and then the map: the
        // sheet's own colour 8 points up, the map's red 40 points up. (The
        // sheet's shadow darkens the red just above it, so the map is found
        // by a point, not a bounding box.)
        let sheet = pixels.color(at: CGPoint(x: 40, y: content.minY - 8))
        XCTAssertGreaterThan(sheet.g, 250, "the handle's row is not the sheet's colour: \(sheet)")
        let map = pixels.color(at: CGPoint(x: 40, y: content.minY - 40))
        XCTAssertGreaterThan(map.r, 150, "the map is not just above the fitted sheet: \(map)")
        XCTAssertLessThan(map.g, 120, "the map is not just above the fitted sheet: \(map)")
    }

    /// Content taller than the shell: the sheet stops at the large detent.
    @MainActor func testTheFittedSheetStopsAtLarge() async throws {
        let pixels = try await render(panelHeight: 2000)
        let whole = CGRect(x: 0, y: 0, width: 390, height: shellHeight)
        let content = try XCTUnwrap(pixels.boundingBox(in: whole, where: Self.isGreen))
        let large = KozmosMapPanelDetent.large.height(in: shellHeight)
        // The content overflows the sheet and is clipped to it; what shows is
        // the large height less the handle's row.
        XCTAssertEqual(content.height + 16, large, accuracy: 2, "the fitted sheet is not capped at large")
        XCTAssertEqual(content.maxY, shellHeight, accuracy: 1.5)
    }

    /// The sheet on glass: the handle's row is the map's red seen through
    /// the tint, not the plain background colour.
    @MainActor func testTheSheetCanBeGlass() async throws {
        let solid = try await render(panelHeight: 120)
        let glass = try await render(panelHeight: 120, surface: .glass)
        let probe = CGPoint(x: 40, y: shellHeight - 120 - 8)
        let onSolid = solid.color(at: probe)
        let onGlass = glass.color(at: probe)
        XCTAssertGreaterThan(onSolid.g, 250, "the solid sheet lets the red through: \(onSolid)")
        XCTAssertGreaterThan(onGlass.r, 200, "the glass sheet hides the map: \(onGlass)")
        XCTAssertLessThan(onGlass.g, 250, "the glass sheet is opaque: \(onGlass)")
        XCTAssertGreaterThan(onGlass.g, 100, "the glass sheet is not tinted: \(onGlass)")
    }
    #endif
}
