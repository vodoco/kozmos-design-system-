import SwiftUI

/// The three elevation roles, mirroring `Semantics.Elevation` in
/// `packages/tokens` — which aliases `shadow.sm` / `md` / `lg`, and which
/// `pnpm tokens:elevation:check` holds to these values.
///
/// These existed in `packages/tokens/dist/ios/KozmosShadows.swift` from the day
/// the roles were added, but nothing ever copied them into this package. Every
/// component therefore hand-wrote its own `.shadow(...)`, and by 2026-09-08
/// there were twenty-three of them spread across fifteen distinct values — the
/// exact situation the roles were introduced to end, surviving on the one
/// platform that could not see them.
public struct ShadowToken {
    public let color: Color
    public let radius: CGFloat
    public let x: CGFloat
    public let y: CGFloat

    public init(color: Color, radius: CGFloat, x: CGFloat, y: CGFloat) {
        self.color = color
        self.radius = radius
        self.x = x
        self.y = y
    }
}

public struct KozmosShadows {
    /// Flush: casts nothing. Not a step on the scale — it is what a surface
    /// meeting an edge needs, and having it here keeps a conditional at a call
    /// site reading as a role rather than reverting to a literal.
    public static let none = ShadowToken(color: .clear, radius: 0, x: 0, y: 0)

    /// A surface lifted just off the page: cards, list rows. Barely there on
    /// purpose — the surface and its border do the work.
    public static let semanticsElevationRaised = ShadowToken(
        color: Color(red: 0, green: 0, blue: 0, opacity: 0.05),
        radius: 4,
        x: 0,
        y: 2
    )

    /// A control floating over content it does not belong to: map chrome, a
    /// search bar over a map, a card presented on top of the map, a status
    /// message.
    public static let semanticsElevationFloating = ShadowToken(
        color: Color(red: 0, green: 0, blue: 0, opacity: 0.1),
        radius: 8,
        x: 0,
        y: 4
    )

    /// Above everything, with what is behind it dimmed or ignored: dialogs,
    /// drawers, tooltips, popovers, detail panels.
    public static let semanticsElevationOverlay = ShadowToken(
        color: Color(red: 0, green: 0, blue: 0, opacity: 0.1),
        radius: 16,
        x: 0,
        y: 8
    )
}

extension View {
    /// Apply an elevation role. Prefer this over a bare `.shadow(...)`: a
    /// literal is how the platform drifted to fifteen different shadows in the
    /// first place, and `pnpm tokens:elevation:check` counts what is left.
    public func kozmosElevation(_ token: ShadowToken) -> some View {
        shadow(color: token.color, radius: token.radius, x: token.x, y: token.y)
    }
}
