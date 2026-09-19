import XCTest
import SwiftUI
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
