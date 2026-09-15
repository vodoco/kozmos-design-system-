import SwiftUI

public enum KozmosMapControlButtonPresentation {
    case iconOnly
    case labelled
}

/// How an active map control reads.
///
/// `tinted` keeps the map surface and colours the icon and the edge, which is
/// what the SDK draws — a control over a map has to stay legible against the
/// tiles behind it, and a solid fill hides the very thing it sits on.
/// `filled` is the inverted treatment this component shipped before
/// 2026-09-15, kept for callers that want the heavier emphasis.
public enum KozmosMapControlButtonEmphasis {
    case tinted
    case filled
}

/// Where a control's state sits relative to its label.
///
/// `inline` runs them along one line. `stacked` sets the state under the
/// label, which is how a map pill fits a two-word state into a control that
/// has to stay thumb-sized.
public enum KozmosMapControlButtonLabelPlacement {
    case inline
    case stacked
}

/// A single floating map control.
///
/// Mirrors the React `MapControlButton`. `label` is the localized action name
/// and always becomes the accessible name; `stateLabel` is appended so screen
/// reader users hear the current state without relying on visual styling.
public struct KozmosMapControlButton<Icon: View>: View {
    private let icon: Icon
    private let label: String
    private let stateLabel: String?
    private let presentation: KozmosMapControlButtonPresentation
    private let emphasis: KozmosMapControlButtonEmphasis
    private let labelPlacement: KozmosMapControlButtonLabelPlacement
    private let pressed: Bool
    private let isDisabled: Bool
    private let action: () -> Void

    public init(
        label: String,
        stateLabel: String? = nil,
        presentation: KozmosMapControlButtonPresentation = .iconOnly,
        emphasis: KozmosMapControlButtonEmphasis = .tinted,
        labelPlacement: KozmosMapControlButtonLabelPlacement = .inline,
        pressed: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void,
        @ViewBuilder icon: () -> Icon
    ) {
        self.label = label
        self.stateLabel = stateLabel
        self.presentation = presentation
        self.emphasis = emphasis
        self.labelPlacement = labelPlacement
        self.pressed = pressed
        self.isDisabled = isDisabled
        self.action = action
        self.icon = icon()
    }

    private var accessibleLabel: String {
        guard let stateLabel else { return label }
        return "\(label), \(stateLabel)"
    }

    /// A tinted control keeps the map chrome in both states; only a filled one
    /// inverts its surface.
    private var isFilled: Bool {
        pressed && emphasis == .filled
    }

    private var foregroundColor: Color {
        isFilled
            ? KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
            : KozmosColors.primitivesColorsForeground100
    }

    /// Only the glyph carries the tint, so the label keeps its contrast
    /// against the surface behind it.
    private var iconColor: Color {
        if isFilled {
            return KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle
        }
        return pressed
            ? KozmosColors.primitivesColorsTheme600
            : KozmosColors.primitivesColorsForeground100
    }

    private var backgroundColor: Color {
        isFilled
            ? KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle
            : KozmosColors.primitivesColorsBackground0.opacity(0.9)
    }

    private var borderColor: Color {
        pressed && !isFilled
            ? KozmosColors.primitivesColorsTheme600
            : KozmosColors.primitivesColorsForeground300
    }

    @ViewBuilder
    private var labelContent: some View {
        if presentation == .labelled {
            if labelPlacement == .stacked {
                VStack(alignment: .leading, spacing: 0) {
                    // The SDK sets these at 11pt over 13pt semibold. The type
                    // scale has no role at either size yet, so this reaches for
                    // the nearest roles and the deviation is recorded in the
                    // gap list rather than hard-coded here.
                    Text(label)
                        .font(KozmosTypography.caption)
                        .foregroundColor(KozmosColors.primitivesColorsForeground400)
                        .lineLimit(1)
                        .truncationMode(.tail)

                    if let stateLabel {
                        Text(stateLabel)
                            .font(KozmosTypography.footnote)
                            .fontWeight(.semibold)
                            .lineLimit(1)
                    }
                }
            } else {
                Text(label)
                    .font(KozmosTypography.subheadline)
                    .fontWeight(.medium)
                    .lineLimit(1)
                    .truncationMode(.tail)

                if let stateLabel {
                    Text(stateLabel)
                        .font(KozmosTypography.subheadline)
                        .fontWeight(.semibold)
                        .lineLimit(1)
                }
            }
        }
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                icon
                    .foregroundColor(iconColor)
                    .accessibilityHidden(true)

                labelContent
            }
            .foregroundColor(foregroundColor)
            .frame(
                width: presentation == .iconOnly ? 44 : nil,
                height: 44
            )
            .frame(maxWidth: presentation == .labelled ? 256 : nil)
            .padding(.horizontal, presentation == .labelled ? KozmosDimensions.primitivesLayoutSpacing150 : 0)
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
                    .stroke(borderColor, lineWidth: 1)
            )
            .kozmosElevation(
                pressed
                    ? KozmosShadows.semanticsElevationRaised
                    : KozmosShadows.semanticsElevationFloating
            )
        }
        .buttonStyle(.plain)
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.5 : 1)
        .animation(.easeInOut(duration: 0.3), value: presentation == .labelled)
        .accessibilityLabel(accessibleLabel)
        .accessibilityAddTraits(pressed ? [.isButton, .isSelected] : .isButton)
    }
}

public extension KozmosMapControlButton where Icon == Image {
    /// Convenience initializer for SF Symbol artwork.
    init(
        label: String,
        systemImage: String,
        stateLabel: String? = nil,
        presentation: KozmosMapControlButtonPresentation = .iconOnly,
        emphasis: KozmosMapControlButtonEmphasis = .tinted,
        labelPlacement: KozmosMapControlButtonLabelPlacement = .inline,
        pressed: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.init(
            label: label,
            stateLabel: stateLabel,
            presentation: presentation,
            emphasis: emphasis,
            labelPlacement: labelPlacement,
            pressed: pressed,
            isDisabled: isDisabled,
            action: action
        ) {
            Image(systemName: systemImage)
        }
    }
}
