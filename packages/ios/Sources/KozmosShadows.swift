import SwiftUI
#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

/// The three elevation roles, mirroring `Semantics.Elevation` in
/// `packages/tokens` — which aliases `shadow.sm` / `md` / `lg` — in both
/// themes. `pnpm tokens:elevation:check` holds every number in this file to
/// `tokens-light.json` and `tokens-dark.json`.
///
/// These existed in `packages/tokens/dist/ios/KozmosShadows.swift` from the day
/// the roles were added, but nothing ever copied them into this package. Every
/// component therefore hand-wrote its own `.shadow(...)`, and by 2026-09-08
/// there were twenty-three of them spread across fifteen distinct values — the
/// exact situation the roles were introduced to end, surviving on the one
/// platform that could not see them.
///
/// Dark mode deepens the alpha — 0.05 / 0.1 / 0.1 becomes 0.3 / 0.4 / 0.5 — so
/// a surface still reads as lifted against a dark page. The first copy of this
/// file carried the light values only, which left every native shadow close to
/// invisible in dark mode while the web's followed the theme.
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

/// A shadow colour that follows the appearance. Resolved at draw time, so a
/// `static let` built from it still changes when the appearance does.
func kozmosShadowColor(
    light: (Double, Double, Double, Double),
    dark: (Double, Double, Double, Double)
) -> Color {
    #if canImport(UIKit)
    return Color(UIColor { traits in
        let c = traits.userInterfaceStyle == .dark ? dark : light
        return UIColor(red: c.0, green: c.1, blue: c.2, alpha: c.3)
    })
    #elseif canImport(AppKit)
    return Color(NSColor(name: nil, dynamicProvider: { appearance in
        let c = appearance.bestMatch(from: [.aqua, .darkAqua]) == .darkAqua ? dark : light
        return NSColor(red: c.0, green: c.1, blue: c.2, alpha: c.3)
    }))
    #else
    return Color(red: light.0, green: light.1, blue: light.2, opacity: light.3)
    #endif
}

public struct KozmosShadows {
    /// Flush: casts nothing. Not a step on the scale — it is what a surface
    /// meeting an edge needs, and having it here keeps a conditional at a call
    /// site reading as a role rather than reverting to a literal.
    public static let none = ShadowToken(color: .clear, radius: 0, x: 0, y: 0)

    /// A surface lifted just off the page: cards, list rows. Barely there on
    /// purpose — the surface and its border do the work.
    public static let semanticsElevationRaised = ShadowToken(color: kozmosShadowColor(light: (0, 0, 0, 0.05), dark: (0, 0, 0, 0.3)), radius: 4, x: 0, y: 2)

    /// A control floating over content it does not belong to: map chrome, a
    /// search bar over a map, a content card presented on top of the map, a
    /// status message.
    public static let semanticsElevationFloating = ShadowToken(color: kozmosShadowColor(light: (0, 0, 0, 0.1), dark: (0, 0, 0, 0.4)), radius: 8, x: 0, y: 4)

    /// Above everything, with what is behind it dimmed or ignored: dialogs,
    /// drawers, tooltips, popovers, detail panels, and the map panels that take
    /// focus.
    public static let semanticsElevationOverlay = ShadowToken(color: kozmosShadowColor(light: (0, 0, 0, 0.1), dark: (0, 0, 0, 0.5)), radius: 16, x: 0, y: 8)
}

extension View {
    /// Apply an elevation role. Prefer this over a bare `.shadow(...)`: a
    /// literal is how the platform drifted to fifteen different shadows in the
    /// first place, and `pnpm tokens:elevation:check` counts what is left.
    public func kozmosElevation(_ token: ShadowToken) -> some View {
        shadow(color: token.color, radius: token.radius, x: token.x, y: token.y)
    }
}
