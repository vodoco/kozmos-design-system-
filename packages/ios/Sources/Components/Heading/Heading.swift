import SwiftUI

/// Heading rank, mirroring the React `Heading.level` prop.
///
/// Rank drives both the type scale and the accessibility heading level, so
/// VoiceOver's rotor reflects the same document outline the web renders.
public enum KozmosHeadingLevel: Int, CaseIterable, Sendable {
    case h1 = 1
    case h2 = 2
    case h3 = 3
    case h4 = 4
    case h5 = 5
    case h6 = 6

    /// Matches the React type scale (text-4xl … text-base).
    var fontSize: CGFloat {
        switch self {
        case .h1: return 36
        case .h2: return 30
        case .h3: return 24
        case .h4: return 20
        case .h5: return 18
        case .h6: return 16
        }
    }

    var accessibilityHeadingLevel: AccessibilityHeadingLevel {
        switch self {
        case .h1: return .h1
        case .h2: return .h2
        case .h3: return .h3
        case .h4: return .h4
        case .h5: return .h5
        case .h6: return .h6
        }
    }
}

/// A ranked heading.
///
/// Mirrors the React `Heading` API. Unlike `Text`, rank is not styling — it is
/// document structure, so it is expressed as a variant rather than left to the
/// platform type system.
public struct KozmosHeading: View {
    private let text: String
    private let level: KozmosHeadingLevel

    public init(_ text: String, level: KozmosHeadingLevel = .h1) {
        self.text = text
        self.level = level
    }

    public var body: some View {
        Text(text)
            .font(.system(size: level.fontSize, weight: .bold))
            .foregroundColor(KozmosColors.primitivesColorsForeground100)
            .accessibilityAddTraits(.isHeader)
            .accessibilityHeading(level.accessibilityHeadingLevel)
    }
}

@available(*, deprecated, renamed: "KozmosHeading")
public typealias Heading = KozmosHeading
