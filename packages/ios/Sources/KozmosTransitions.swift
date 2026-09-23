import SwiftUI

/// How the system's parts enter and leave, on the motion tokens: the same few
/// moves everywhere, so a row changing form reads as one thing happening.
public enum KozmosTransitions {
    /// A control appearing beside another — Cancel beside the field, Filters
    /// beside the AI search: it fades in from the side it sits on.
    public static var reveal: AnyTransition {
        .move(edge: .trailing).combined(with: .opacity)
    }

    /// A chip or a field taking another's place — the prototype's chip: it
    /// grows from 90 % a little left of its place, fading in.
    public static var pop: AnyTransition {
        .asymmetric(
            insertion: .scale(scale: 0.9).combined(with: .opacity).combined(with: .offset(x: -22)),
            removal: .scale(scale: 0.9).combined(with: .opacity).combined(with: .offset(x: -22))
        )
    }

    /// Content replacing content — tiles for results, results for recents.
    public static var crossfade: AnyTransition { .opacity }
}
