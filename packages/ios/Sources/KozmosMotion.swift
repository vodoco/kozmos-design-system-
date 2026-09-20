// Do not edit directly, this file was auto-generated.
import CoreGraphics
import SwiftUI

/// The motion tokens, mirroring `Semantics.Motion` in `packages/tokens`: three
/// durations — quick for a state's small change, standard for a layout change,
/// deliberate for a large move — and two easings, standard (ease out and
/// settle) and emphasised (a small overshoot). `pnpm tokens:motion:check` holds
/// every number here to the token files.
public struct CubicBezierToken {
    public let x1: CGFloat
    public let y1: CGFloat
    public let x2: CGFloat
    public let y2: CGFloat

    public init(x1: CGFloat, y1: CGFloat, x2: CGFloat, y2: CGFloat) {
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
    }

    /// The curve as SwiftUI draws it, over a duration in seconds.
    public func animation(duration: TimeInterval) -> Animation {
        .timingCurve(x1, y1, x2, y2, duration: duration)
    }
}

public enum KozmosMotion {
    /// Seconds.
    public static let semanticsMotionDurationQuick: TimeInterval = 0.150
    public static let semanticsMotionDurationStandard: TimeInterval = 0.280
    public static let semanticsMotionDurationDeliberate: TimeInterval = 0.460
    public static let semanticsMotionEasingStandard = CubicBezierToken(x1: 0.4, y1: 0, x2: 0.2, y2: 1)
    public static let semanticsMotionEasingEmphasised = CubicBezierToken(x1: 0.34, y1: 1.56, x2: 0.64, y2: 1)

    /// The standard curve over the quick, standard and deliberate durations.
    public static var quick: Animation { semanticsMotionEasingStandard.animation(duration: semanticsMotionDurationQuick) }
    public static var standard: Animation { semanticsMotionEasingStandard.animation(duration: semanticsMotionDurationStandard) }
    public static var deliberate: Animation { semanticsMotionEasingStandard.animation(duration: semanticsMotionDurationDeliberate) }
    /// The emphasised curve over the standard duration: a small overshoot.
    public static var emphasised: Animation { semanticsMotionEasingEmphasised.animation(duration: semanticsMotionDurationStandard) }
}
