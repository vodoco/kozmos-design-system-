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

    /// The prototype's fractions: a fifth, 54 % and 94 %.
    func testNamedDetentsAreProportionalToTheShell() {
        XCTAssertEqual(KozmosMapPanelDetent.medium.height(in: shellHeight), 432, accuracy: 0.001)
        XCTAssertEqual(KozmosMapPanelDetent.large.height(in: shellHeight), 752, accuracy: 0.001)
        XCTAssertEqual(KozmosMapPanelDetent.collapsed.height(in: shellHeight), 160, accuracy: 0.001)
    }

    /// A landscape or split-screen shell is short enough that 20 % would not fit
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
        let view = shell(detents: [.large, .collapsed, .medium, .fraction(0.54)])
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
        XCTAssertEqual(view.settledPanelHeight(in: shellHeight), 752, accuracy: 0.001)
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
        XCTAssertEqual(one.settledPanelHeight(in: shellHeight), 432, accuracy: 0.001)
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

/// The prototype's drag rule, decided once at a drag's first move
/// (docs/pointr-prototype-initial-sheet-2026-09-20.md §2).
final class KozmosPanelDragKindTests: XCTestCase {
    private func decide(
        handle: Bool = false, dx: CGFloat = 0, dy: CGFloat, largest: Bool, offset: CGFloat = 0
    ) -> KozmosPanelDragKind {
        KozmosPanelDragKind.decide(
            startsInHandle: handle, translation: CGSize(width: dx, height: dy),
            atLargestDetent: largest, scrollOffset: offset
        )
    }

    func testADragThatStartsOnTheHandleIsTheHandles() {
        XCTAssertEqual(decide(handle: true, dy: -40, largest: false), .handle)
        XCTAssertEqual(decide(handle: true, dy: 40, largest: true), .handle)
    }

    func testASidewaysMoveIsTheContents() {
        XCTAssertEqual(decide(dx: 12, dy: -8, largest: false), .content)
        XCTAssertEqual(decide(dx: -12, dy: 8, largest: true), .content)
    }

    func testBelowTheLargestDetentEitherDirectionMovesTheSheet() {
        XCTAssertEqual(decide(dy: -40, largest: false), .sheet)
        XCTAssertEqual(decide(dy: 40, largest: false), .sheet)
        XCTAssertEqual(decide(dy: 40, largest: false, offset: 100), .sheet, "below the largest detent the content cannot have scrolled")
    }

    func testAtTheLargestDetentAnUpwardDragIsTheContents() {
        XCTAssertEqual(decide(dy: -40, largest: true), .content)
    }

    func testAtTheLargestDetentADownwardDragScrollsBackFirstThenMovesTheSheet() {
        XCTAssertEqual(decide(dy: 40, largest: true, offset: 40), .content)
        XCTAssertEqual(decide(dy: 40, largest: true, offset: 0), .sheet)
    }
}

/// The sheet's content scrolls only at the largest detent, and the collapsed
/// detent rests on the row the content marks.
final class KozmosMapShellPeekAnchorTests: XCTestCase {
    private let shellHeight: CGFloat = 800

    private func shell(at detent: KozmosMapPanelDetent) -> KozmosAdaptiveMapShell<Color, EmptyView, EmptyView, Color, EmptyView> {
        KozmosAdaptiveMapShell(
            panelDetent: .constant(detent), panelDetents: [.collapsed, .medium, .large],
            map: { Color.red }, mapStatusContent: { EmptyView() }, controls: { EmptyView() },
            topBar: { EmptyView() }, panel: { Color.green }
        )
    }

    func testTheContentMayScrollOnlyAtTheLargestDetent() {
        XCTAssertTrue(shell(at: .large).panelScrollEnabled(in: shellHeight, docked: true))
        XCTAssertFalse(shell(at: .medium).panelScrollEnabled(in: shellHeight, docked: true))
        XCTAssertFalse(shell(at: .collapsed).panelScrollEnabled(in: shellHeight, docked: true))
        XCTAssertTrue(shell(at: .collapsed).panelScrollEnabled(in: shellHeight, docked: false), "beside the map the panel always scrolls")
    }

    func testTheAnchoredCollapsedHeightIsTheAnchorPlusAMarginWithinAQuarterAndThreeQuarters() {
        XCTAssertEqual(KozmosMapPanelDetent.anchoredCollapsedHeight(peekBottom: 250, in: shellHeight), 266)
        XCTAssertEqual(KozmosMapPanelDetent.anchoredCollapsedHeight(peekBottom: 40, in: shellHeight), 192)
        XCTAssertEqual(KozmosMapPanelDetent.anchoredCollapsedHeight(peekBottom: 700, in: shellHeight), 576)
    }

    #if os(iOS)
    @MainActor private func render(anchorHeight: CGFloat) async throws -> RenderedPixels {
        let view = KozmosAdaptiveMapShell(
            panelDetent: .constant(.collapsed), panelDetents: [.collapsed, .large],
            map: { Color.red }, mapStatusContent: { EmptyView() }, controls: { EmptyView() },
            topBar: { EmptyView() },
            panel: {
                VStack(spacing: 0) {
                    Color.green.frame(height: anchorHeight).kozmosPanelPeekAnchor()
                    Color.blue.frame(height: 900)
                }
            }
        )
        .environment(\.horizontalSizeClass, .compact)
        return try await RenderedPixels.render(view, size: CGSize(width: 390, height: shellHeight))
    }

    private var whole: CGRect { CGRect(x: 0, y: 0, width: 390, height: shellHeight) }
    private static func isGreen(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { g > 150 && r < 120 && b < 140 }
    // SwiftUI's blue is (0, 122, 255): the green channel is not low.
    private static func isBlue(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { b > 200 && r < 60 && g < 160 }

    /// A 250-point anchor row: the sheet is the handle's row, the row and a
    /// 16-point margin of what follows — 282 — not a fifth of the shell.
    @MainActor func testTheCollapsedSheetRestsOnThePeekAnchor() async throws {
        let pixels = try await render(anchorHeight: 250)
        let green = try XCTUnwrap(pixels.boundingBox(in: whole, where: Self.isGreen), "no anchor row drawn")
        XCTAssertEqual(green.height, 250, accuracy: 1.5, "the anchor row is cut")
        XCTAssertEqual(green.maxY, shellHeight - 16, accuracy: 1.5, "the margin under the anchor is not 16")
        let blue = try XCTUnwrap(pixels.boundingBox(in: whole, where: Self.isBlue), "nothing follows the anchor row")
        XCTAssertEqual(blue.height, 16, accuracy: 1.5, "more than the margin shows under the anchor")
        let map = pixels.color(at: CGPoint(x: 40, y: green.minY - 40))
        XCTAssertGreaterThan(map.r, 150, "the map is not just above the peeking sheet: \(map)")
        XCTAssertLessThan(map.g, 120, "the map is not just above the peeking sheet: \(map)")
    }

    /// A 40-point anchor: the sheet never peeks under a quarter of the shell.
    @MainActor func testTheAnchoredPeekNeverFallsUnderAQuarter() async throws {
        let pixels = try await render(anchorHeight: 40)
        let blue = try XCTUnwrap(pixels.boundingBox(in: whole, where: Self.isBlue))
        XCTAssertEqual(blue.height, 192 - 16 - 40, accuracy: 1.5, "the sheet is not a quarter of the shell")
    }

    /// A 700-point anchor: the sheet never peeks over three quarters.
    @MainActor func testTheAnchoredPeekNeverRisesOverThreeQuarters() async throws {
        let pixels = try await render(anchorHeight: 700)
        let green = try XCTUnwrap(pixels.boundingBox(in: whole, where: Self.isGreen))
        XCTAssertEqual(green.height, 576 - 16, accuracy: 1.5, "the sheet is not three quarters of the shell")
        XCTAssertEqual(green.maxY, shellHeight, accuracy: 1.5)
    }
    #endif
}

/// The shell runs edge to edge — the map under the status bar and the home
/// indicator, the sheet's surface to the bottom edge — while its chrome and
/// the sheet's content keep the safe areas, as the prototype's screen does.
final class KozmosMapShellEdgesTests: XCTestCase {
    private let shellHeight: CGFloat = 800

    func testTheReportedInsetsKeepTheSafeAreas() {
        let shell = KozmosAdaptiveMapShell(
            panelDetent: .constant(.collapsed), panelDetents: [.collapsed, .large],
            map: { Color.red }, mapStatusContent: { EmptyView() }, controls: { EmptyView() },
            topBar: { EmptyView() }, panel: { Color.green }
        )
        let safe = EdgeInsets(top: 59, leading: 0, bottom: 34, trailing: 0)
        let docked = shell.resolvedCollisionInsets(in: CGSize(width: 390, height: shellHeight), layoutDirection: .leftToRight, isRegularWidth: false, safeArea: safe)
        XCTAssertGreaterThanOrEqual(docked.top, 59, "the camera may put content under the status bar")
        let floating = shell.resolvedCollisionInsets(in: CGSize(width: 1024, height: shellHeight), layoutDirection: .leftToRight, isRegularWidth: true, safeArea: safe)
        XCTAssertGreaterThanOrEqual(floating.bottom, 34, "with no docked sheet the camera may put content under the home indicator")
    }

    #if os(iOS)
    /// The shell inside a "device" with a 59 status bar and a 34 home indicator.
    @MainActor private func render<Panel: View>(@ViewBuilder panel: () -> Panel) async throws -> RenderedPixels {
        let view = KozmosAdaptiveMapShell(
            panelDetent: .constant(.collapsed), panelDetents: [.collapsed, .large],
            map: { Color.red }, mapStatusContent: { EmptyView() }, controls: { EmptyView() },
            topBar: { EmptyView() }, panel: panel
        )
        .environment(\.horizontalSizeClass, .compact)
        .safeAreaInset(edge: .top, spacing: 0) { Color.clear.frame(height: 59) }
        .safeAreaInset(edge: .bottom, spacing: 0) { Color.clear.frame(height: 34) }
        return try await RenderedPixels.render(view, size: CGSize(width: 390, height: shellHeight))
    }

    private static func isGreen(_ r: UInt8, _ g: UInt8, _ b: UInt8) -> Bool { g > 150 && r < 120 && b < 140 }

    /// The map's red at the very top; the sheet a fifth of the whole height,
    /// its surface to the bottom edge, its plain content stopping 34 above it.
    @MainActor func testTheMapRunsUnderTheStatusBarAndTheSheetKeepsTheHomeIndicator() async throws {
        let pixels = try await render { Color.green }
        let top = pixels.color(at: CGPoint(x: 40, y: 5))
        XCTAssertGreaterThan(top.r, 150, "the map does not run under the status bar: \(top)")
        XCTAssertLessThan(top.g, 120, "the map does not run under the status bar: \(top)")
        let green = try XCTUnwrap(pixels.boundingBox(in: CGRect(x: 0, y: 0, width: 390, height: shellHeight), where: Self.isGreen), "no sheet content")
        XCTAssertEqual(green.maxY, shellHeight - 34, accuracy: 1.5, "the sheet's content does not stop above the home indicator")
        XCTAssertEqual(green.minY, shellHeight - 160 + 16, accuracy: 1.5, "the sheet is not a fifth of the whole height under its handle: \(green)")
        let edge = pixels.color(at: CGPoint(x: 40, y: shellHeight - 10))
        XCTAssertGreaterThan(edge.g, 240, "the sheet's surface does not reach the bottom edge: \(edge)")
        XCTAssertGreaterThan(edge.r, 240, "the sheet's surface does not reach the bottom edge: \(edge)")
    }

    /// Scrolling content runs under the home indicator, as a scroll view's does.
    @MainActor func testScrollingContentRunsUnderTheHomeIndicator() async throws {
        let pixels = try await render { KozmosPanelScrollView { Color.green.frame(height: 900) } }
        let edge = pixels.color(at: CGPoint(x: 40, y: shellHeight - 10))
        XCTAssertTrue(Self.isGreen(edge.r, edge.g, edge.b), "the scrolling content stops above the home indicator: \(edge)")
    }
    #endif
}
