import SwiftUI

#if canImport(UIKit)
import UIKit

/// The sheet's drag, as UIKit sees it: a pan recogniser on the hosting view
/// that watches every touch over the sheet, begins only for a drag the rule
/// gives the sheet, and — because it begins — cancels the touches the
/// content under the finger had received, so a tile the drag started on
/// does not open when the finger lifts. A drag the rule leaves to the
/// content never begins, and the content's own scroll or tap runs
/// untouched. SwiftUI's own gestures cannot fail on a rule or cancel a
/// button's touch; this can.
struct KozmosSheetPanCatcher: UIViewRepresentable {
    /// Whether the sheet takes the drag: the start point in the sheet's
    /// space and the first translation.
    let shouldBegin: (CGPoint, CGSize) -> Bool
    let changed: (CGFloat) -> Void
    /// The final translation and the velocity, points per second.
    let ended: (CGFloat, CGFloat) -> Void

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> CatcherView {
        let view = CatcherView()
        view.isUserInteractionEnabled = false
        view.backgroundColor = .clear
        view.coordinator = context.coordinator
        return view
    }

    func updateUIView(_ view: CatcherView, context: Context) {
        context.coordinator.shouldBegin = shouldBegin
        context.coordinator.changed = changed
        context.coordinator.ended = ended
        view.installIfNeeded()
    }

    static func dismantleUIView(_ view: CatcherView, coordinator: Coordinator) {
        coordinator.uninstall()
    }

    final class Coordinator: NSObject, UIGestureRecognizerDelegate {
        var shouldBegin: (CGPoint, CGSize) -> Bool = { _, _ in false }
        var changed: (CGFloat) -> Void = { _ in }
        var ended: (CGFloat, CGFloat) -> Void = { _, _ in }
        weak var catcher: CatcherView?
        weak var host: UIView?
        var pan: UIPanGestureRecognizer?

        func uninstall() {
            if let pan, let host { host.removeGestureRecognizer(pan) }
            pan = nil
            host = nil
        }

        @objc func handle(_ pan: UIPanGestureRecognizer) {
            guard let catcher else { return }
            let translation = pan.translation(in: catcher)
            switch pan.state {
            case .changed:
                changed(translation.y)
            case .ended:
                ended(translation.y, pan.velocity(in: catcher).y)
            case .cancelled, .failed:
                ended(translation.y, 0)
            default:
                break
            }
        }

        func gestureRecognizerShouldBegin(_ recognizer: UIGestureRecognizer) -> Bool {
            guard let pan = recognizer as? UIPanGestureRecognizer, let catcher, let host else { return false }
            let start = pan.location(in: host)
            let inSheet = catcher.convert(start, from: host)
            guard catcher.bounds.contains(inSheet) else { return false }
            let translation = pan.translation(in: catcher)
            return shouldBegin(inSheet, CGSize(width: translation.x, height: translation.y))
        }

        // The content's scroll view and SwiftUI's own recognisers keep running
        // beside this one; the sheet disables the scroll it owns while it moves.
        func gestureRecognizer(
            _ gestureRecognizer: UIGestureRecognizer,
            shouldRecognizeSimultaneouslyWith other: UIGestureRecognizer
        ) -> Bool { true }
    }

    final class CatcherView: UIView {
        weak var coordinator: Coordinator?

        override func didMoveToWindow() {
            super.didMoveToWindow()
            installIfNeeded()
        }

        /// The recogniser lives on the hosting view — the one UIKit view that
        /// receives the touches SwiftUI's buttons and scroll views are drawn
        /// in — and this view, sized to the sheet, is only where it measures.
        func installIfNeeded() {
            guard let coordinator, coordinator.pan == nil, window != nil else { return }
            var candidate: UIView? = superview
            var host: UIView?
            while let view = candidate {
                if String(describing: type(of: view)).contains("HostingView") { host = view; break }
                candidate = view.superview
            }
            guard let host else { return }
            let pan = UIPanGestureRecognizer(target: coordinator, action: #selector(Coordinator.handle(_:)))
            pan.delegate = coordinator
            pan.maximumNumberOfTouches = 1
            pan.cancelsTouchesInView = true
            host.addGestureRecognizer(pan)
            coordinator.pan = pan
            coordinator.host = host
            coordinator.catcher = self
        }
    }
}
#endif
