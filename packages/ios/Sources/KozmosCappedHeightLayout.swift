import SwiftUI

/// Proposes at most `cap` to its one child and takes the child's size: the
/// child decides whether it fits, and the layout never takes room the child
/// does not fill. Where no height is proposed at all, the cap is.
struct KozmosCappedHeightLayout: Layout {
    let cap: CGFloat

    private func proposal(_ proposal: ProposedViewSize) -> ProposedViewSize {
        ProposedViewSize(width: proposal.width, height: min(proposal.height ?? cap, cap))
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        // A child that ignores the proposal — a fixed height taller than the
        // cap — still gets the cap: the layout is never taller than it, and
        // the child overflows to be clipped by whoever drew the surface.
        let size = subviews.first?.sizeThatFits(self.proposal(proposal)) ?? .zero
        return CGSize(width: size.width, height: min(size.height, cap))
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        subviews.first?.place(at: bounds.origin, anchor: .topLeading, proposal: self.proposal(proposal))
    }
}
