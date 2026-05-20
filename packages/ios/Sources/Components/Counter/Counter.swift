import SwiftUI

public enum KozmosCounterTone {
    case neutral
    case brand
    case destructive
    case inverse
}

public enum KozmosCounterSize {
    case `default`
    case sm
}

public struct KozmosCounter: View {
    let text: String
    let tone: KozmosCounterTone
    let size: KozmosCounterSize

    public init(
        _ text: String,
        tone: KozmosCounterTone = .neutral,
        size: KozmosCounterSize = .default
    ) {
        self.text = text
        self.tone = tone
        self.size = size
    }

    public var body: some View {
        Text(normalizedText)
            .font(.system(size: fontSize, weight: .semibold))
            .monospacedDigit()
            .lineLimit(1)
            .padding(.horizontal, horizontalPadding)
            .frame(minWidth: minWidth, minHeight: height)
            .background(backgroundColor)
            .foregroundColor(foregroundColor)
            .clipShape(Capsule())
    }

    private var normalizedText: String {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.hasPrefix("("), trimmed.hasSuffix(")") {
            return String(trimmed.dropFirst().dropLast()).trimmingCharacters(in: .whitespacesAndNewlines)
        }

        return trimmed
    }

    private var height: CGFloat {
        size == .sm ? 18 : 20
    }

    private var minWidth: CGFloat {
        size == .sm ? 18 : 20
    }

    private var horizontalPadding: CGFloat {
        size == .sm ? 5 : KozmosDimensions.primitivesLayoutSpacing75
    }

    private var fontSize: CGFloat {
        size == .sm ? 11 : 12
    }

    private var backgroundColor: Color {
        switch tone {
        case .neutral:
            return KozmosColors.componentsPrimaryButtonsNeutralButtonBackgroundIdle
        case .brand:
            return KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle
        case .destructive:
            return KozmosColors.componentsPrimaryButtonsDangerButtonBackgroundIdle
        case .inverse:
            return KozmosColors.primitivesColorsBackground0
        }
    }

    private var foregroundColor: Color {
        switch tone {
        case .neutral:
            return KozmosColors.componentsPrimaryButtonsNeutralButtonForegroundContentIdle
        case .brand:
            return KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
        case .destructive:
            return KozmosColors.componentsPrimaryButtonsDangerButtonForegroundContentIdle
        case .inverse:
            return KozmosColors.primitivesColorsForeground100
        }
    }
}
